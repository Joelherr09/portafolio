'use client';

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import type {
  AnyBlock,
  DesignTokens,
  BlockType,
  SectionElement,
  BlockElement,
} from './blocks';
import { createBlock, BLOCK_CATALOG, DEFAULT_DESIGN_TOKENS, getSectionElements, getElementChildren, flattenElements } from './blocks';
import type { BlockMobileOverride } from './blocks';
import { newId } from './ids';
import { applyChromeToBlocks, chromeSignature, getSyncableChrome } from './global-chrome';
import type {
  EditorAction,
  EditorHistory,
  EditorSnapshot,
  EditorState,
  PageMeta,
  SaveStatus,
  SidebarTab,
} from './editor-types';
import type { PlanTier, SiteTeamOption, BlockDataMap } from './local-types';

const HISTORY_MAX = 50;
const HISTORY_COALESCE_MS = 300;

/**
 * Límites del zoom del canvas. El reducer clampeaba a [0.25, 2] mientras los
 * botones de la barra pedían hasta 4 ("Tamaño real") y hasta 0.1 ("Ajustar al
 * alto"): en pantallas angostas o páginas largas esos dos botones no llegaban
 * nunca a su objetivo y quedaban mudos. Ahora manda un solo rango.
 */
export const MIN_ZOOM = 0.1;
export const MAX_ZOOM = 4;

const initialState: Omit<EditorState, 'siteId' | 'siteSlug' | 'plan' | 'teams'> = {
  data: { matches: {}, standings: {}, rosters: {}, tournaments: {}, tournamentTeams: {}, news: {}, coachpro: {}, coachproCobro: {} },
  pages: [],
  activePageId: null,
  blocks: [],
  selectedBlockId: null,
  selectedElementId: null,
  selectedGroupId: null,
  multiSelectIds: [],
  designTokens: DEFAULT_DESIGN_TOKENS,
  saveStatus: 'idle',
  lastSavedAt: null,
  saveError: null,
  sidebarOpen: true,
  rightSidebarOpen: true,
  activeTab: 'pages',
  device: 'desktop',
  zoom: 1,
  scrollLocked: false,
  media: [],
  history: { past: [], future: [], lastPushAt: 0 },
};

function snapshotOf(state: EditorState): EditorSnapshot {
  return { blocks: state.blocks, designTokens: state.designTokens };
}

function pushToHistory(state: EditorState, next: Partial<EditorState>): EditorState {
  const now = Date.now();
  const within = now - state.history.lastPushAt < HISTORY_COALESCE_MS;
  if (within) {
    // Sin tocar `lastPushAt`: refrescarlo en cada acción coalescida extendía la
    // ventana sola, así que editando sin pausas de 300 ms se acumulaban minutos
    // de trabajo en una única entrada de historial. La ventana se mide desde el
    // último push real, no desde la última edición.
    return {
      ...state,
      ...next,
      history: { ...state.history, future: [] },
    };
  }
  const past = [...state.history.past, snapshotOf(state)].slice(-HISTORY_MAX);
  return {
    ...state,
    ...next,
    history: { past, future: [], lastPushAt: now },
  };
}

/**
 * Regenera recursivamente los IDs de una lista de elementos (incluyendo los
 * hijos de grids). Se usa al duplicar un bloque para que el duplicado no
 * comparta IDs de elementos con el original (claves React duplicadas y
 * ediciones que afectan a ambos).
 */
function reassignElementIds(elements: BlockElement[]): BlockElement[] {
  return elements.map((el) => {
    const next: BlockElement = { ...el, id: newId() };
    const children = getElementChildren(el);
    if (children) {
      next.config = { ...next.config, children: reassignElementIds(children) } as typeof next.config;
    }
    return next;
  });
}

/**
 * Coloca un elemento nuevo sin que quede tapado por lo que ya está.
 *
 * Todos los `default*Child()` nacen centrados en 50/50 con `zIndex: 1`, así que
 * agregar dos textos seguidos desde el catálogo los apilaba en el mismo punto y
 * con la misma capa: el segundo era invisible y parecía que el clic no había
 * hecho nada. Se desplaza en cascada (+3/+3, el mismo paso que usa duplicar)
 * hasta encontrar un centro libre, y si viene con la capa por defecto se manda
 * al frente para que no nazca detrás de una caja o una imagen.
 */
function placeNewElement(element: BlockElement, existing: BlockElement[]): BlockElement {
  if (existing.length === 0) return element;
  const key = (x: number, y: number) => `${Math.round(x)}:${Math.round(y)}`;
  const taken = new Set(existing.map((e) => key(e.x, e.y)));

  let x = element.x;
  let y = element.y;
  for (let i = 0; i < 12 && taken.has(key(x, y)); i++) {
    const nextX = Math.min(100 - element.width / 2, x + 3);
    const nextY = Math.min(100 - element.height / 2, y + 3);
    if (nextX === x && nextY === y) break; // tocó el borde: no hay más cascada
    x = nextX;
    y = nextY;
  }

  const isDefaultLayer = element.zIndex == null || element.zIndex === 1;
  const maxZ = existing.reduce(
    (m, e) => (typeof e.zIndex === 'number' && e.zIndex > m ? e.zIndex : m),
    0
  );
  return { ...element, x, y, ...(isDefaultLayer ? { zIndex: maxZ + 1 } : {}) };
}

type Selection = Pick<
  EditorState,
  'selectedBlockId' | 'selectedElementId' | 'selectedGroupId' | 'multiSelectIds'
>;

/**
 * Deja la selección apuntando solo a cosas que siguen existiendo.
 *
 * Un undo, un borrado de bloque o un cambio de página dejaban
 * `selectedElementId`/`selectedGroupId` apuntando a algo que ya no está. Como
 * `ElementInspector` y `GroupInspector` devuelven `null` cuando no encuentran lo
 * seleccionado — y RightSidebar los prioriza sobre el catálogo — el panel
 * derecho quedaba EN BLANCO hasta que el usuario volvía a hacer click en algo.
 */
function reconcileSelection(blocks: AnyBlock[], sel: Selection): Selection {
  const blockIds = new Set<string>();
  const elementIds = new Set<string>();
  const groupIds = new Set<string>();
  for (const b of blocks) {
    blockIds.add(b.id);
    // flatten: un hijo de grid también puede quedar seleccionado.
    for (const e of flattenElements(getSectionElements(b) || [])) {
      elementIds.add(e.id);
      if (e.groupId) groupIds.add(e.groupId);
    }
  }
  return {
    selectedBlockId:
      sel.selectedBlockId && blockIds.has(sel.selectedBlockId) ? sel.selectedBlockId : null,
    selectedElementId:
      sel.selectedElementId && elementIds.has(sel.selectedElementId) ? sel.selectedElementId : null,
    selectedGroupId:
      sel.selectedGroupId && groupIds.has(sel.selectedGroupId) ? sel.selectedGroupId : null,
    multiSelectIds: sel.multiSelectIds.filter((id) => elementIds.has(id)),
  };
}

function reducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'SELECT_BLOCK':
      return { ...state, selectedBlockId: action.blockId, selectedElementId: null, selectedGroupId: null, multiSelectIds: [] };

    case 'SELECT_ELEMENT':
      return { ...state, selectedElementId: action.elementId, selectedGroupId: null, multiSelectIds: [] };

    case 'SELECT_ELEMENT_GROUP': {
      // Derive selectedGroupId from the element's groupId
      let derivedGroupId: string | null = null;
      for (const block of state.blocks) {
        const elements = getSectionElements(block);
        if (!elements) continue;
        const el = elements.find((e) => e.id === action.elementId);
        if (el?.groupId) {
          derivedGroupId = el.groupId;
          break;
        }
      }
      return {
        ...state,
        selectedElementId: action.elementId,
        selectedGroupId: derivedGroupId,
        multiSelectIds: action.groupIds,
      };
    }

    case 'SELECT_GROUP': {
      // Populate multiSelectIds with all elements sharing this groupId
      let groupIds: string[] = [];
      if (action.groupId && action.blockId) {
        const block = state.blocks.find((b) => b.id === action.blockId);
        if (block) {
          const elements = getSectionElements(block);
          if (elements) {
            groupIds = elements
              .filter((e) => e.groupId === action.groupId)
              .map((e) => e.id);
          }
        }
      }
      return {
        ...state,
        selectedBlockId: action.blockId,
        selectedGroupId: action.groupId,
        selectedElementId: groupIds[0] ?? null,
        multiSelectIds: groupIds,
      };
    }

    case 'TOGGLE_MULTI_SELECT': {
      const exists = state.multiSelectIds.includes(action.elementId);
      return {
        ...state,
        multiSelectIds: exists
          ? state.multiSelectIds.filter((id) => id !== action.elementId)
          : [...state.multiSelectIds, action.elementId],
        selectedElementId: action.elementId,
        selectedGroupId: null,
      };
    }

    case 'CLEAR_MULTI_SELECT':
      return { ...state, multiSelectIds: [] };

    case 'UPDATE_BLOCK': {
      const blocks = state.blocks.map((b) =>
        b.id === action.blockId ? ({ ...b, config: action.config } as AnyBlock) : b
      );
      return pushToHistory(state, { blocks });
    }

    case 'ADD_BLOCK': {
      const blocks = [...state.blocks, action.block];
      return pushToHistory(state, { blocks, selectedBlockId: action.block.id });
    }

    case 'REMOVE_BLOCK': {
      const blocks = state.blocks.filter((b) => b.id !== action.blockId);
      return pushToHistory(state, { blocks, ...reconcileSelection(blocks, state) });
    }

    case 'TOGGLE_BLOCK': {
      const blocks = state.blocks.map((b) =>
        b.id === action.blockId ? { ...b, enabled: !b.enabled } : b
      );
      return pushToHistory(state, { blocks });
    }

    case 'SET_BLOCK_VISIBILITY': {
      const blocks = state.blocks.map((b) =>
        b.id === action.blockId
          ? {
              ...b,
              ...(action.desktopVisible !== undefined && { desktopVisible: action.desktopVisible }),
              ...(action.mobileVisible !== undefined && { mobileVisible: action.mobileVisible }),
            }
          : b
      );
      return pushToHistory(state, { blocks });
    }

    case 'SET_BLOCK_MOBILE': {
      const blocks = state.blocks.map((b) =>
        b.id === action.blockId
          ? { ...b, mobile: { ...(b.mobile || {}), ...action.mobile } }
          : b
      );
      return pushToHistory(state, { blocks });
    }

    case 'SET_BLOCK_DETACHED': {
      const blocks = state.blocks.map((b) =>
        b.id === action.blockId ? { ...b, detached: action.detached } : b
      );
      return pushToHistory(state, { blocks });
    }

    case 'SET_MEDIA':
      return { ...state, media: action.media };

    case 'ADD_MEDIA_ITEM':
      return { ...state, media: [action.item, ...state.media] };

    case 'REMOVE_MEDIA_ITEM':
      return { ...state, media: state.media.filter((m) => m.id !== action.assetId) };

    case 'REORDER_BLOCKS': {
      const blocks = arrayMove(state.blocks, action.fromIndex, action.toIndex);
      return pushToHistory(state, { blocks });
    }

    case 'SET_BLOCKS':
      return pushToHistory(state, { blocks: action.blocks });

    case 'LOAD_PAGE_BLOCKS':
      // El historial se resetea: un undo tras cambiar de página restauraría
      // los bloques de la página anterior sobre la nueva (y el autosave los
      // persistiría, destruyendo la página).
      {
        const blocks = ensureElements(action.blocks, state.pages);
        return {
          ...state,
          blocks,
          ...reconcileSelection(blocks, state),
          history: { past: [], future: [], lastPushAt: 0 },
        };
      }

    case 'SET_PAGE_DATA':
      return { ...state, data: action.data };

    case 'UPDATE_TOKENS':
      return pushToHistory(state, { designTokens: action.tokens });

    case 'UNDO': {
      if (state.history.past.length === 0) return state;
      const previous = state.history.past[state.history.past.length - 1];
      const past = state.history.past.slice(0, -1);
      const future = [...state.history.future, snapshotOf(state)];
      return {
        ...state,
        blocks: previous.blocks,
        designTokens: previous.designTokens,
        ...reconcileSelection(previous.blocks, state),
        history: { past, future, lastPushAt: state.history.lastPushAt },
      };
    }

    case 'REDO': {
      if (state.history.future.length === 0) return state;
      const next = state.history.future[state.history.future.length - 1];
      const future = state.history.future.slice(0, -1);
      const past = [...state.history.past, snapshotOf(state)].slice(-HISTORY_MAX);
      return {
        ...state,
        blocks: next.blocks,
        designTokens: next.designTokens,
        ...reconcileSelection(next.blocks, state),
        history: { past, future, lastPushAt: state.history.lastPushAt },
      };
    }

    case 'SET_SAVE_STATUS':
      return {
        ...state,
        saveStatus: action.status,
        saveError: action.error ?? null,
      };

    case 'SET_LAST_SAVED':
      return { ...state, lastSavedAt: action.at, saveStatus: 'saved' as SaveStatus };

    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };

    case 'SET_SIDEBAR':
      return { ...state, sidebarOpen: action.open };

    case 'TOGGLE_RIGHT_SIDEBAR':
      return { ...state, rightSidebarOpen: !state.rightSidebarOpen };

    case 'SET_RIGHT_SIDEBAR':
      return { ...state, rightSidebarOpen: action.open };

    case 'SET_TAB':
      return { ...state, activeTab: action.tab };

    case 'SET_DEVICE':
      return { ...state, device: action.device };

    case 'SET_ZOOM': {
      const clamped = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, action.zoom));
      return { ...state, zoom: clamped };
    }

    case 'TOGGLE_SCROLL_LOCKED':
      return { ...state, scrollLocked: !state.scrollLocked };

    case 'SET_PAGES':
      return { ...state, pages: action.pages };

    case 'SET_ACTIVE_PAGE':
      // `selectedGroupId` también: si quedaba apuntando a un grupo de la página
      // anterior, GroupInspector se renderizaba vacío y tapaba el catálogo.
      return { ...state, activePageId: action.pageId, selectedBlockId: null, selectedElementId: null, selectedGroupId: null, multiSelectIds: [] };

    case 'ADD_PAGE':
      return { ...state, pages: [...state.pages, action.page] };

    case 'REMOVE_PAGE': {
      const pages = state.pages.filter((p) => p.id !== action.pageId);
      const activePageId =
        state.activePageId === action.pageId ? (pages[0]?.id ?? null) : state.activePageId;
      return { ...state, pages, activePageId };
    }

    case 'RENAME_PAGE': {
      const pages = state.pages.map((p) =>
        p.id === action.pageId ? { ...p, name: action.name, slug: action.slug } : p
      );
      return { ...state, pages };
    }

    case 'REORDER_PAGES': {
      const pages = arrayMove(state.pages, action.fromIndex, action.toIndex);
      return { ...state, pages };
    }

    case 'UPDATE_PAGE': {
      const pages = state.pages.map((p) => (p.id === action.page.id ? action.page : p));
      return { ...state, pages };
    }

    case 'ADD_SECTION_ELEMENT': {
      const blocks = state.blocks.map((b) => {
        if (b.id !== action.blockId) return b;
        const elements = getSectionElements(b);
        if (!elements) return b;
        const next = [...elements, placeNewElement(action.element, elements)];
        return applyElementsUpdate(b, next);
      });
      return pushToHistory(state, { blocks });
    }

    case 'ADD_SECTION_ELEMENTS': {
      const blocks = state.blocks.map((b) => {
        if (b.id !== action.blockId) return b;
        const elements = getSectionElements(b);
        if (!elements) return b;
        const next = [...elements, ...action.elements];
        return applyElementsUpdate(b, next);
      });
      return pushToHistory(state, { blocks });
    }

    case 'REMOVE_SECTION_ELEMENT': {
      const blocks = state.blocks.map((b) => {
        if (b.id !== action.blockId) return b;
        const elements = getSectionElements(b);
        if (!elements) return b;
        const next = elements.filter((e) => e.id !== action.elementId);
        return applyElementsUpdate(b, next);
      });
      return pushToHistory(state, { blocks, ...reconcileSelection(blocks, state) });
    }

    case 'UPDATE_SECTION_ELEMENT': {
      const blocks = state.blocks.map((b) => {
        if (b.id !== action.blockId) return b;
        const elements = getSectionElements(b);
        if (!elements) return b;
        const next = elements.map((e) =>
          e.id === action.elementId ? ({ ...e, ...action.partial } as BlockElement) : e
        );
        return applyElementsUpdate(b, next);
      });
      return pushToHistory(state, { blocks });
    }

    case 'UPDATE_SECTION_ELEMENTS': {
      const blocks = state.blocks.map((b) => {
        if (b.id !== action.blockId) return b;
        const elements = getSectionElements(b);
        if (!elements) return b;
        const updateMap = new Map(action.updates.map((u) => [u.elementId, u.partial]));
        const next = elements.map((e) => {
          const partial = updateMap.get(e.id);
          return partial ? ({ ...e, ...partial } as BlockElement) : e;
        });
        return applyElementsUpdate(b, next);
      });
      return pushToHistory(state, { blocks });
    }

    case 'UPDATE_SECTION_GROUP_NAME': {
      const blocks = state.blocks.map((b) => {
        if (b.id !== action.blockId) return b;
        const elements = getSectionElements(b);
        if (!elements) return b;
        const next = elements.map((e) =>
          e.groupId === action.groupId ? { ...e, groupName: action.groupName } : e
        );
        return applyElementsUpdate(b, next);
      });
      return pushToHistory(state, { blocks });
    }

        case 'REORDER_ELEMENT_GROUP': {
          const blocks = state.blocks.map((b) => {
            if (b.id !== action.blockId) return b;
            const elements = getSectionElements(b);
            if (!elements || elements.length < 2) return b;
            const groupElements = elements.filter((e) => e.groupId === action.groupId);
            if (groupElements.length === 0) return b;
            const otherElements = elements.filter((e) => e.groupId !== action.groupId);
            const clamped = Math.max(0, Math.min(action.toIndex, otherElements.length));
            const next = [
              ...otherElements.slice(0, clamped),
              ...groupElements,
              ...otherElements.slice(clamped),
            ];
            return applyElementsUpdate(b, next);
          });
          return pushToHistory(state, { blocks });
        }
        case 'REORDER_SECTION_ELEMENTS': {
      const blocks = state.blocks.map((b) => {
        if (b.id !== action.blockId) return b;
        const elements = getSectionElements(b);
        if (!elements || elements.length < 2) return b;
        const next = [...elements];
        const [moved] = next.splice(action.fromIndex, 1);
        next.splice(action.toIndex, 0, moved);
        return applyElementsUpdate(b, next);
      });
      return pushToHistory(state, { blocks });
    }

    default:
      return state;
  }
}

function applyElementsUpdate(block: AnyBlock, elements: BlockElement[]): AnyBlock {
  if (block.type === 'container') {
    return { ...block, config: { ...block.config, children: elements } } as AnyBlock;
  }
  return { ...block, config: { ...block.config, elements } } as AnyBlock;
}

function ensureElements(blocks: AnyBlock[], pages: PageMeta[]): AnyBlock[] {
  return blocks.map((b) => {
    if (b.type === 'navbar') {
      const cfg = b.config as { links?: Array<{ id: string; label: string; url: string; openInNewTab: boolean }>; pages?: boolean; elements?: BlockElement[] };
      if (cfg.elements && cfg.elements.length > 0) return b;
      const source = (cfg.links && cfg.links.length > 0) ? cfg.links : (cfg.pages && pages.length > 0 ? pages.map((p) => ({ id: `page-${p.id}`, label: p.name, url: `/${p.slug}`, openInNewTab: false })) : []);
      if (source.length === 0) return b;
      const grpId = `grp-nav-${source.length}`;
      return {
        ...b,
        config: {
          ...b.config,
          elements: source.map((l) => ({
            id: l.id,
            type: 'text',
            x: 0, y: 0, width: 1, height: 1,
            visible: true, zIndex: 1,
            groupId: grpId, groupName: 'Links',
            config: { text: l.label, tag: 'span', size: 'base', align: 'left', color: 'foreground', linkUrl: l.url, linkOpenInNewTab: l.openInNewTab },
          } as unknown as BlockElement)),
        },
      };
    }
    if (b.type === 'footer') {
      const cfg = b.config as { columns?: Array<{ id: string; title?: string; links: Array<{ id: string; label: string; url: string; openInNewTab: boolean }> }>; elements?: BlockElement[] };
      if (cfg.elements && cfg.elements.length > 0) return b;
      if (!cfg.columns || cfg.columns.length === 0) return b;
      const result: BlockElement[] = [];
      let yOffset = 5;
      cfg.columns.forEach((col) => {
        const grpId = `grp-footer-${col.id}`;
        // Column title element
        if (col.title) {
          result.push({
            id: `${col.id}-title`,
            type: 'text',
            x: 50, y: yOffset, width: 80, height: 6,
            visible: true, zIndex: 1,
            groupId: grpId, groupName: col.title,
            config: { text: col.title, tag: 'h4', size: 'sm', weight: 'bold', align: 'left', color: 'foreground' },
          } as unknown as BlockElement);
          yOffset += 6;
        }
        // Column link elements
        col.links.forEach((l) => {
          result.push({
            id: l.id,
            type: 'text',
            x: 50, y: yOffset, width: 80, height: 4,
            visible: true, zIndex: 1,
            groupId: grpId, groupName: col.title || 'Links',
            config: { text: l.label, tag: 'span', size: 'base', align: 'left', color: 'foreground', linkUrl: l.url, linkOpenInNewTab: l.openInNewTab },
          } as unknown as BlockElement);
          yOffset += 4;
        });
        yOffset += 4; // gap between columns
      });
      return { ...b, config: { ...b.config, elements: result } };
    }
    return b;
  });
}

export interface EditorContextValue extends EditorState {
  dispatch: React.Dispatch<EditorAction>;
  selectBlock: (id: string | null) => void;
  selectElement: (id: string | null) => void;
  selectElementOnly: (id: string | null) => void;
  selectGroup: (groupId: string | null, blockId: string) => void;
  toggleMultiSelect: (id: string) => void;
  clearMultiSelect: () => void;
  groupSelectedElements: (blockId: string, elementIds: string[]) => void;
  ungroupElements: (blockId: string, elementIds: string[]) => void;
  updateGroupName: (blockId: string, groupId: string, groupName: string | undefined) => void;
  addElementToGroup: (blockId: string, elementId: string, targetGroupId: string) => void;
  removeElementFromGroup: (blockId: string, elementId: string) => void;
  updateBlock: (id: string, config: unknown) => void;
  addBlock: (type: BlockType) => void;
  removeBlock: (id: string) => void;
  duplicateBlock: (id: string) => void;
  toggleBlock: (id: string) => void;
  setBlockVisibility: (id: string, desktopVisible?: boolean, mobileVisible?: boolean) => void;
  updateBlockMobile: (id: string, mobile: BlockMobileOverride) => void;
  setBlockDetached: (id: string, detached: boolean) => void;
  setMedia: (items: import('./editor-types').MediaItem[]) => void;
  addMediaItem: (item: import('./editor-types').MediaItem) => void;
  removeMediaItem: (assetId: string) => void;
  reorderBlocks: (from: number, to: number) => void;
  updateTokens: (tokens: DesignTokens) => void;
  canvasFitInfoRef: { current: { fitScale: number; naturalH: number; availH: number } };
  /**
   * Escala de ajuste al ancho, reactiva. El ref de arriba sirve para los
   * handlers (valor siempre fresco, sin re-render), pero la barra superior
   * PINTA el porcentaje de zoom: leyéndolo del ref se quedaba con el valor del
   * primer render y no se actualizaba al redimensionar la ventana o los paneles.
   */
  canvasFitScale: number;
  /** Lo llama el canvas cuando recalcula el ajuste. */
  reportCanvasFit: (info: { fitScale: number; naturalH: number; availH: number }) => void;
  setTab: (tab: SidebarTab) => void;
  setDevice: (device: 'desktop' | 'mobile') => void;
  setZoom: (zoom: number) => void;
  scrollLocked: boolean;
  toggleScrollLocked: () => void;
  toggleSidebar: () => void;
  toggleRightSidebar: () => void;
  setRightSidebar: (open: boolean) => void;
  setSaveStatus: (status: SaveStatus, error?: string | null) => void;
  setActivePage: (pageId: string | null) => void;
  /**
   * Corta el autoguardado para siempre (hasta recargar). Para operaciones que
   * reescriben el sitio del lado del servidor y terminan en un reload.
   */
  suspendAutosave: () => void;
  /** Deshace `suspendAutosave` (p. ej. si la operación que lo pidió falló). */
  resumeAutosave: () => void;
  /**
   * Adopta el token de concurrencia de páginas que el SERVIDOR reescribió por
   * su cuenta (p. ej. el reapuntado de links al renombrar una página). Sin esto
   * el cliente conserva el token viejo y su próximo guardado de esas páginas se
   * rechaza como conflicto.
   */
  markPagesSaved: (pageIds: string[], lastSaved: string) => void;
  /** Ícono de pestaña del sitio publicado. Se persiste aparte de los bloques. */
  faviconUrl: string | null;
  setFaviconUrl: (url: string | null) => void;
  seedPageBlocks: (pageId: string, blocks: AnyBlock[]) => void;
  addSectionElement: (blockId: string, element: BlockElement) => void;
  addSectionElements: (blockId: string, elements: BlockElement[]) => void;
  duplicateSectionElement: (blockId: string, elementId: string) => void;
  removeSectionElement: (blockId: string, elementId: string) => void;
  updateSectionElement: (blockId: string, elementId: string, partial: Partial<BlockElement>) => void;
  updateSectionElements: (blockId: string, updates: Array<{ elementId: string; partial: Partial<BlockElement> }>) => void;
  reorderSectionElements: (blockId: string, fromIndex: number, toIndex: number) => void;
  reorderElementGroup: (blockId: string, groupId: string, toIndex: number) => void;
  /** Copia la selección actual (multi o simple) al portapapeles interno. Devuelve cuántos copió. */
  copyElements: () => number;
  /** Pega el portapapeles en el bloque seleccionado (o el primero que soporte elementos). Devuelve cuántos pegó. */
  pasteElements: () => number;
  undo: () => void;
  redo: () => void;
}

const EditorContext = createContext<EditorContextValue | null>(null);

export interface EditorSaveCallbacks {
  onSaveBlocks: (
    pageId: string,
    blocks: AnyBlock[],
    expectedLastSaved?: string | null
  ) => Promise<{
    success?: boolean;
    error?: string;
    /** true = otra persona guardó la página; no tiene sentido reintentar. */
    conflict?: boolean;
    lastSaved?: string;
    syncedPageIds?: string[];
  }>;
  onSaveTokens: (tokens: DesignTokens) => Promise<{ success?: boolean; error?: string }>;
  onLoadPageData: (pageId: string, blocks: AnyBlock[]) => Promise<BlockDataMap>;
}

interface EditorProviderProps {
  siteId: string;
  siteSlug: string;
  plan: PlanTier;
  teams: SiteTeamOption[];
  initialPages: PageMeta[];
  initialActivePageId: string | null;
  initialBlocksByPage: Record<string, AnyBlock[]>;
  initialTokens: DesignTokens;
  initialData: BlockDataMap;
  /** `websites.favicon_url` actual. Vive fuera del reducer: no es parte del
   *  árbol de bloques ni entra en el historial de undo. */
  initialFaviconUrl?: string | null;
  children: ReactNode;
  callbacks: EditorSaveCallbacks;
}

const AUTOSAVE_DELAY = 1500;
/** Reintentos del autoguardado ante fallos transitorios (no ante conflicto). */
const MAX_SAVE_RETRIES = 3;
const SAVE_RETRY_BASE_MS = 2000;

export function EditorProvider({
  siteId,
  siteSlug,
  plan,
  teams,
  initialPages,
  initialActivePageId,
  initialBlocksByPage,
  initialTokens,
  initialData,
  initialFaviconUrl,
  children,
  callbacks,
}: EditorProviderProps) {
  const [faviconUrl, setFaviconUrl] = useState<string | null>(initialFaviconUrl ?? null);
  const initialActiveBlocks = ensureElements(
    initialActivePageId
      ? initialBlocksByPage[initialActivePageId] || []
      : [],
    initialPages
  );

  const [state, dispatch] = useReducer(reducer, {
    siteId,
    siteSlug,
    plan,
    teams,
    ...initialState,
    pages: initialPages,
    activePageId: initialActivePageId,
    blocks: initialActiveBlocks,
    designTokens: initialTokens,
    data: initialData,
  });

  const blocksByPageRef = useRef<Record<string, AnyBlock[]>>(
    Object.fromEntries(
      Object.entries(initialBlocksByPage).map(([pid, b]) => [pid, JSON.parse(JSON.stringify(b))])
    )
  );
  const currentPageIdRef = useRef<string | null>(initialActivePageId);
  // Cache de datos de data-blocks ya cargados por página, para no volver a
  // pedirlos al servidor cada vez que se re-visita una página en la misma sesión.
  const dataByPageRef = useRef<Record<string, BlockDataMap>>(
    initialActivePageId ? { [initialActivePageId]: initialData } : {}
  );

  // Global navbar/footer sync — baseline signature of the active page's chrome.
  // Updated (without propagating) on page switch; a change vs this baseline from
  // an edit triggers propagation to the other pages.
  const lastChromeSigRef = useRef<string>(
    chromeSignature(
      initialActivePageId ? initialBlocksByPage[initialActivePageId] || [] : []
    )
  );

  const lastSavedTokensRef = useRef<string>(JSON.stringify(initialTokens));
  const tokensTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialMountRef = useRef(true);
  const canvasFitInfoRef = useRef<{ fitScale: number; naturalH: number; availH: number }>({ fitScale: 1, naturalH: 800, availH: 800 });
  const [canvasFitScale, setCanvasFitScale] = useState(1);
  const reportCanvasFit = useCallback(
    (info: { fitScale: number; naturalH: number; availH: number }) => {
      canvasFitInfoRef.current = info;
      // Solo re-renderiza cuando cambia el porcentaje visible, para no disparar
      // un render por cada tick del ResizeObserver.
      setCanvasFitScale((prev) =>
        Math.round(prev * 100) === Math.round(info.fitScale * 100) ? prev : info.fitScale
      );
    },
    []
  );
  const blocksTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Guardado de bloques pendiente (durante el debounce). Permite flushear el
  // guardado de la página saliente antes de cambiar de página, evitando perder
  // las últimas ediciones (<1.5s) que de otro modo el cleanup cancelaría.
  const pendingBlocksSaveRef = useRef<{ pageId: string; blocks: AnyBlock[]; gen: number } | null>(null);
  // Generación del último guardado programado por página, y la cola de
  // guardados de cada página. Sin la generación, el reintento de un guardado
  // viejo que falló escribía sus bloques encima de uno más nuevo que ya había
  // salido bien; sin la cola, dos guardados de la misma página viajaban a la
  // vez con el mismo token y el segundo volvía como conflicto falso.
  const saveGenByPageRef = useRef<Record<string, number>>({});
  const saveQueueByPageRef = useRef<Record<string, Promise<void>>>({});
  const cancelRetryWaitRef = useRef<(() => void) | null>(null);
  // Suprime el marcado de dirty para el próximo cambio de state.blocks cuando
  // proviene de un swap de página (LOAD_PAGE_BLOCKS), no de una edición.
  const skipDirtyRef = useRef(false);
  // Corta el autoguardado de raíz. Lo usa el cambio de plantilla del sitio: la
  // acción reescribe app_pages en el servidor y después se recarga la página,
  // pero el editor sigue teniendo los bloques VIEJOS en memoria — un autosave
  // que llegue en esa ventana pisaría la plantilla recién aplicada.
  const autosaveSuspendedRef = useRef(false);
  // Bloques vigentes, para que los selectores (`selectElement`,
  // `selectElementOnly`) no dependan de `state.blocks`: con esa dependencia
  // cambiaban de identidad en CADA edición, lo que rompía el `memo` del
  // renderer de bloques del canvas — se re-renderizaban todos los bloques por
  // cada tecla escrita en cualquiera.
  const liveBlocksRef = useRef<AnyBlock[]>(initialActiveBlocks);
  // Token de concurrencia por página: el `lastSaved` que este cliente conoce.
  // Se manda en cada guardado y el servidor rechaza si no coincide.
  const lastSavedByPageRef = useRef<Record<string, string | null>>(
    Object.fromEntries(initialPages.map((p) => [p.id, p.lastSaved ?? null]))
  );
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Si el usuario cierra la pestaña con un guardado pendiente (dentro de la
  // ventana de debounce de 1.5s o con el save en vuelo), el navegador pide
  // confirmación en vez de perder la última edición en silencio.
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!pendingBlocksSaveRef.current) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, []);

  /**
   * Guardado de bloques con token de concurrencia y reintento.
   *
   * - Manda el `lastSaved` conocido; si el servidor responde `conflict`, NO
   *   reintenta: volvería a fallar y el usuario tiene que recargar.
   * - Cualquier otro fallo (red caída, 500) se reintenta con backoff. Antes el
   *   estado quedaba en 'error' y ahí moría: con una conexión inestable se
   *   perdía el trabajo sin más aviso que un ícono.
   */
  const runSaveBlocks = useCallback(
    (pageId: string, blocks: AnyBlock[], gen: number) => {
      const superado = () => (saveGenByPageRef.current[pageId] ?? 0) !== gen;
      const clearPending = () => {
        const pending = pendingBlocksSaveRef.current;
        if (pending && pending.pageId === pageId && pending.gen === gen) {
          pendingBlocksSaveRef.current = null;
        }
      };

      const guardar = async () => {
        for (let attempt = 0; attempt <= MAX_SAVE_RETRIES; attempt++) {
          if (autosaveSuspendedRef.current || superado()) return;

          if (attempt > 0) {
            // `suspendAutosave` corta la espera resolviéndola: si solo limpiara
            // el timer, la promesa quedaría colgada y con ella la cola de la
            // página, que no volvería a guardar aunque se reanude el autosave.
            await new Promise<void>((resolve) => {
              const timer = setTimeout(resolve, SAVE_RETRY_BASE_MS * 2 ** (attempt - 1));
              retryTimerRef.current = timer;
              cancelRetryWaitRef.current = () => {
                clearTimeout(timer);
                resolve();
              };
            });
            cancelRetryWaitRef.current = null;
            if (autosaveSuspendedRef.current || superado()) return;
          }

          dispatch({ type: 'SET_SAVE_STATUS', status: 'saving' });
          const expected = lastSavedByPageRef.current[pageId] ?? null;
          let result: Awaited<ReturnType<EditorSaveCallbacks['onSaveBlocks']>>;
          try {
            result = await callbacks.onSaveBlocks(pageId, blocks, expected);
          } catch {
            // Una caída de red rechaza la llamada a la action en vez de devolver
            // `{ error }`: sin esto el reintento nunca corría y el indicador
            // quedaba en "Guardando…" para siempre.
            result = { error: 'No hay conexión con el servidor.' };
          }

          if (!result.error) {
            clearPending();
            if (result.lastSaved) {
              lastSavedByPageRef.current[pageId] = result.lastSaved;
              for (const id of result.syncedPageIds ?? []) {
                lastSavedByPageRef.current[id] = result.lastSaved;
              }
            }
            dispatch({ type: 'SET_LAST_SAVED', at: new Date() });
            return;
          }

          if (superado()) return;
          dispatch({ type: 'SET_SAVE_STATUS', status: 'error', error: result.error });
          if (result.conflict) {
            clearPending();
            return;
          }
          // Sigue pendiente, para que el aviso de cierre de pestaña siga apareciendo
          // mientras haya trabajo sin persistir.
          pendingBlocksSaveRef.current = { pageId, blocks, gen };
        }
      };

      const anterior = saveQueueByPageRef.current[pageId] ?? Promise.resolve();
      const turno = anterior.then(guardar, guardar);
      saveQueueByPageRef.current[pageId] = turno.catch(() => undefined);
      return turno;
    },
    [callbacks]
  );

  useEffect(() => () => {
    if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
  }, []);

  // When active page changes, swap in that page's blocks
  const loadBlocksForPage = useCallback((pageId: string) => {
    const blocks = blocksByPageRef.current[pageId] || [];
    // Cargar los bloques de otra página no es una edición: sin este flag el
    // efecto de dirty los marcaría y el autosave re-escribiría la página
    // recién cargada (más el chrome-sync) en cada navegación.
    skipDirtyRef.current = true;
    dispatch({ type: 'LOAD_PAGE_BLOCKS', blocks });
    currentPageIdRef.current = pageId;
    // Re-baseline chrome so switching pages never counts as an edit.
    lastChromeSigRef.current = chromeSignature(blocks);

    // Los data-blocks (partidos, posiciones, plantel, torneos) solo se cargan
    // del servidor para la página activa al abrir el editor — al cambiar de
    // página hay que pedirlos aparte (y cachearlos, para no repetir el viaje
    // al servidor si se vuelve a esta página en la misma sesión).
    const cachedData = dataByPageRef.current[pageId];
    if (cachedData) {
      dispatch({ type: 'SET_PAGE_DATA', data: cachedData });
    } else {
      callbacks
        .onLoadPageData(pageId, blocks)
        .then((data) => {
          dataByPageRef.current[pageId] = data;
          // Si el usuario ya cambió a otra página mientras esto cargaba, ignorar.
          if (currentPageIdRef.current === pageId) {
            dispatch({ type: 'SET_PAGE_DATA', data });
          }
        })
        .catch((err) => console.error('[editor] datos de la página', err));
    }
  }, [callbacks]);

  useEffect(() => {
    if (!state.activePageId) return;
    if (currentPageIdRef.current === state.activePageId) return;
    // Flush de un guardado pendiente de la página saliente antes de swappear los
    // bloques, para no perder ediciones recientes. Usa los datos capturados en
    // el ref (página + bloques de origen), no el estado actual.
    const pending = pendingBlocksSaveRef.current;
    if (pending) {
      if (blocksTimerRef.current) {
        clearTimeout(blocksTimerRef.current);
        blocksTimerRef.current = null;
      }
      pendingBlocksSaveRef.current = null;
      runSaveBlocks(pending.pageId, pending.blocks, pending.gen);
    }
    loadBlocksForPage(state.activePageId);
  }, [state.activePageId, loadBlocksForPage, callbacks]);

  // Keep a ref of latest blocks for the current page
  useEffect(() => {
    liveBlocksRef.current = state.blocks;
    if (state.activePageId) {
      blocksByPageRef.current[state.activePageId] = state.blocks;
    }
  }, [state.blocks, state.activePageId]);

  // Restore editor UI state from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(`editor-ui-${siteId}`);
      if (!raw) return;
      const saved = JSON.parse(raw) as { activeTab?: SidebarTab; selectedBlockId?: string | null; selectedElementId?: string | null };
      // Se valida contra los valores vigentes: un valor viejo o basura en
      // localStorage dejaría el panel izquierdo sin ninguna pestaña activa, o
      // sea vacío.
      const TABS: SidebarTab[] = ['pages', 'blocks', 'assets', 'design'];
      if (saved.activeTab && TABS.includes(saved.activeTab)) {
        dispatch({ type: 'SET_TAB', tab: saved.activeTab });
      }

      // Validate that the saved block/element still exist in the initial blocks
      const initialBlocks = initialActivePageId ? initialBlocksByPage[initialActivePageId] || [] : [];
      const blockExists = saved.selectedBlockId
        ? initialBlocks.some((b) => b.id === saved.selectedBlockId)
        : false;

      if (blockExists && saved.selectedBlockId) {
        dispatch({ type: 'SELECT_BLOCK', blockId: saved.selectedBlockId });
        dispatch({ type: 'SET_RIGHT_SIDEBAR', open: true });

        if (saved.selectedElementId) {
          const block = initialBlocks.find((b) => b.id === saved.selectedBlockId);
          const elements = block ? getSectionElements(block) : null;
          const elementExists = elements?.some((e) => e.id === saved.selectedElementId) ?? false;
          if (elementExists) {
            dispatch({ type: 'SELECT_ELEMENT', elementId: saved.selectedElementId });
          }
        }
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist editor UI state to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(`editor-ui-${siteId}`, JSON.stringify({
        activeTab: state.activeTab,
        selectedBlockId: state.selectedBlockId,
        selectedElementId: state.selectedElementId,
      }));
    } catch {}
  }, [siteId, state.activeTab, state.selectedBlockId, state.selectedElementId]);

  // Global navbar/footer sync: when the active page's (non-detached) chrome is
  // edited, propagate it to every other page's cached blocks so the editor
  // reflects a single shared navbar/footer. DB persistence for the other pages
  // is handled server-side in `saveBlocks` when the active page autosaves.
  useEffect(() => {
    const pageId = state.activePageId;
    if (!pageId) return;
    if (currentPageIdRef.current !== pageId) return; // mid page-switch
    const sig = chromeSignature(state.blocks);
    if (sig === lastChromeSigRef.current) return; // no chrome change
    lastChromeSigRef.current = sig;
    const canonical = getSyncableChrome(state.blocks);
    if (!canonical.navbar && !canonical.footer) return;
    for (const p of state.pages) {
      if (p.id === pageId) continue;
      const targetBlocks = blocksByPageRef.current[p.id];
      if (!targetBlocks) continue;
      const next = applyChromeToBlocks(targetBlocks, canonical);
      if (next) blocksByPageRef.current[p.id] = next;
    }
  }, [state.blocks, state.activePageId, state.pages]);

  // Sync active page slug to URL (no re-render, just updates address bar)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const activePage = state.pages.find((p) => p.id === state.activePageId);
    if (!activePage) return;
    const url = new URL(window.location.href);
    if (activePage.slug === 'home') {
      url.searchParams.delete('page');
    } else {
      url.searchParams.set('page', activePage.slug);
    }
    const newSearch = url.searchParams.toString();
    const newUrl = `${url.pathname}${newSearch ? '?' + newSearch : ''}${url.hash}`;
    if (newUrl !== window.location.pathname + window.location.search + window.location.hash) {
      window.history.replaceState(null, '', newUrl);
    }
  }, [state.activePageId, state.pages]);

  // Autosave blocks (per active page) — uses refs to avoid re-serializing on every render
  const blocksDirtyRef = useRef(false);

  useEffect(() => {
    if (skipDirtyRef.current) {
      skipDirtyRef.current = false;
      return;
    }
    blocksDirtyRef.current = true;
  }, [state.blocks]);

  useEffect(() => {
    if (autosaveSuspendedRef.current) return;
    if (!blocksDirtyRef.current) return;
    blocksDirtyRef.current = false;
    if (initialMountRef.current) {
      initialMountRef.current = false;
      return;
    }
    if (blocksTimerRef.current) clearTimeout(blocksTimerRef.current);

    // Capturamos la página + bloques de este guardado para poder flushearlo en
    // un cambio de página antes de que el cleanup cancele el timer.
    const pageId = state.activePageId!;
    const blocks = state.blocks;
    const gen = (saveGenByPageRef.current[pageId] ?? 0) + 1;
    saveGenByPageRef.current[pageId] = gen;
    pendingBlocksSaveRef.current = { pageId, blocks, gen };

    blocksTimerRef.current = setTimeout(() => {
      runSaveBlocks(pageId, blocks, gen);
    }, AUTOSAVE_DELAY);

    return () => {
      if (blocksTimerRef.current) clearTimeout(blocksTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.activePageId, state.blocks]);

  // Autosave tokens — uses ref to avoid re-serializing on every render
  const tokensDirtyRef = useRef(false);

  useEffect(() => {
    tokensDirtyRef.current = true;
  }, [state.designTokens]);

  useEffect(() => {
    if (autosaveSuspendedRef.current) return;
    if (!tokensDirtyRef.current) return;
    tokensDirtyRef.current = false;
    const tokensKey = JSON.stringify(state.designTokens);
    if (tokensKey === lastSavedTokensRef.current) return;
    if (tokensTimerRef.current) clearTimeout(tokensTimerRef.current);

    tokensTimerRef.current = setTimeout(async () => {
      dispatch({ type: 'SET_SAVE_STATUS', status: 'saving' });
      const result = await callbacks
        .onSaveTokens(state.designTokens)
        .catch(() => ({ error: 'No hay conexión con el servidor.' }));
      if (result.error) {
        dispatch({ type: 'SET_SAVE_STATUS', status: 'error', error: result.error });
      } else {
        lastSavedTokensRef.current = tokensKey;
        dispatch({ type: 'SET_LAST_SAVED', at: new Date() });
      }
    }, AUTOSAVE_DELAY);

    return () => {
      if (tokensTimerRef.current) clearTimeout(tokensTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.designTokens]);

  // Wrapped dispatch helpers
  const selectBlock = useCallback(
    (id: string | null) => dispatch({ type: 'SELECT_BLOCK', blockId: id }),
    []
  );
  const selectElement = useCallback(
    (id: string | null) => {
      if (!id) {
        dispatch({ type: 'SELECT_ELEMENT', elementId: null });
        return;
      }
      for (const block of liveBlocksRef.current) {
        const elements = getSectionElements(block);
        if (!elements) continue;
        const element = elements.find((e) => e.id === id);
        if (!element) continue;
        if (element.groupId) {
          const groupIds = elements
            .filter((e) => e.groupId === element.groupId)
            .map((e) => e.id);
          dispatch({ type: 'SELECT_BLOCK', blockId: block.id });
          dispatch({ type: 'SELECT_ELEMENT_GROUP', elementId: id, groupIds });
          return;
        }
        dispatch({ type: 'SELECT_BLOCK', blockId: block.id });
        dispatch({ type: 'SELECT_ELEMENT', elementId: id });
        return;
      }
      dispatch({ type: 'SELECT_ELEMENT', elementId: id });
    },
    []
  );
  const selectElementOnly = useCallback(
    (id: string | null) => {
      if (!id) { dispatch({ type: 'SELECT_ELEMENT', elementId: null }); return; }
      for (const block of liveBlocksRef.current) {
        const elements = getSectionElements(block);
        if (!elements) continue;
        const element = elements.find((e) => e.id === id);
        if (!element) continue;
        dispatch({ type: 'SELECT_BLOCK', blockId: block.id });
        dispatch({ type: 'SELECT_ELEMENT', elementId: id });
        return;
      }
    },
    []
  );
  const selectGroup = useCallback(
    (groupId: string | null, blockId: string) => {
      dispatch({ type: 'SELECT_GROUP', groupId, blockId });
    },
    []
  );
  const toggleMultiSelect = useCallback(
    (id: string) => dispatch({ type: 'TOGGLE_MULTI_SELECT', elementId: id }),
    []
  );
  const clearMultiSelect = useCallback(
    () => dispatch({ type: 'CLEAR_MULTI_SELECT' }),
    []
  );
  const groupSelectedElements = useCallback((blockId: string, elementIds: string[]) => {
    const uniqueIds = Array.from(new Set(elementIds));
    if (uniqueIds.length < 2) return;
    const groupId = `grp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const groupName = `Grupo ${groupId.slice(-5)}`;
    dispatch({
      type: 'UPDATE_SECTION_ELEMENTS',
      blockId,
      updates: uniqueIds.map((elementId) => ({ elementId, partial: { groupId, groupName } })),
    });
  }, []);
  const ungroupElements = useCallback((blockId: string, elementIds: string[]) => {
    const uniqueIds = Array.from(new Set(elementIds));
    if (uniqueIds.length === 0) return;
    dispatch({
      type: 'UPDATE_SECTION_ELEMENTS',
      blockId,
      updates: uniqueIds.map((elementId) => ({ elementId, partial: { groupId: undefined, groupName: undefined } })),
    });
    dispatch({ type: 'CLEAR_MULTI_SELECT' });
  }, []);
  const updateGroupName = useCallback(
    (blockId: string, groupId: string, groupName: string | undefined) => {
      dispatch({ type: 'UPDATE_SECTION_GROUP_NAME', blockId, groupId, groupName });
    },
    []
  );
  const addElementToGroup = useCallback(
    (blockId: string, elementId: string, targetGroupId: string) => {
      // Find an existing element in the target group to get the groupName
      const block = state.blocks.find((b) => b.id === blockId);
      if (!block) return;
      const elements = getSectionElements(block);
      if (!elements) return;
      const existing = elements.find((e) => e.groupId === targetGroupId);
      if (!existing) return;
      dispatch({
        type: 'UPDATE_SECTION_ELEMENTS',
        blockId,
        updates: [{ elementId, partial: { groupId: targetGroupId, groupName: existing.groupName } }],
      });
    },
    [state.blocks]
  );
  const removeElementFromGroup = useCallback(
    (blockId: string, elementId: string) => {
      dispatch({
        type: 'UPDATE_SECTION_ELEMENTS',
        blockId,
        updates: [{ elementId, partial: { groupId: undefined, groupName: undefined } }],
      });
    },
    []
  );
  const updateBlock = useCallback(
    (id: string, config: unknown) =>
      dispatch({ type: 'UPDATE_BLOCK', blockId: id, config }),
    []
  );
  const addBlock = useCallback((type: BlockType) => {
    const block = createBlock(type);
    if (!block) return;
    dispatch({ type: 'ADD_BLOCK', block });
  }, []);
  const removeBlock = useCallback(
    (id: string) => dispatch({ type: 'REMOVE_BLOCK', blockId: id }),
    []
  );
  const duplicateBlock = useCallback((id: string) => {
    const pageId = currentPageIdRef.current;
    if (!pageId) return;
    const blocks = blocksByPageRef.current[pageId] || [];
    const block = blocks.find((b: AnyBlock) => b.id === id);
    if (!block) return;
    // Los bloques únicos (navbar/footer/contact) no se duplican: el catálogo
    // impide agregar un segundo, pero duplicar lo saltaba.
    if (BLOCK_CATALOG.find((c) => c.type === block.type)?.unique) return;
    let duplicate = { ...structuredClone(block), id: newId(block.type) } as AnyBlock;
    const elements = getSectionElements(duplicate);
    if (elements) {
      duplicate = applyElementsUpdate(duplicate, reassignElementIds(elements));
    }
    dispatch({ type: 'ADD_BLOCK', block: duplicate });
  }, []);
  const toggleBlock = useCallback(
    (id: string) => dispatch({ type: 'TOGGLE_BLOCK', blockId: id }),
    []
  );
  const setBlockVisibility = useCallback(
    (id: string, desktopVisible?: boolean, mobileVisible?: boolean) =>
      dispatch({ type: 'SET_BLOCK_VISIBILITY', blockId: id, desktopVisible, mobileVisible }),
    []
  );
  const updateBlockMobile = useCallback(
    (id: string, mobile: BlockMobileOverride) =>
      dispatch({ type: 'SET_BLOCK_MOBILE', blockId: id, mobile }),
    []
  );
  const setBlockDetached = useCallback(
    (id: string, detached: boolean) =>
      dispatch({ type: 'SET_BLOCK_DETACHED', blockId: id, detached }),
    []
  );
  const setMedia = useCallback(
    (items: import('./editor-types').MediaItem[]) =>
      dispatch({ type: 'SET_MEDIA', media: items }),
    []
  );
  const addMediaItem = useCallback(
    (item: import('./editor-types').MediaItem) =>
      dispatch({ type: 'ADD_MEDIA_ITEM', item }),
    []
  );
  const removeMediaItem = useCallback(
    (assetId: string) => dispatch({ type: 'REMOVE_MEDIA_ITEM', assetId }),
    []
  );
  const reorderBlocks = useCallback(
    (from: number, to: number) =>
      dispatch({ type: 'REORDER_BLOCKS', fromIndex: from, toIndex: to }),
    []
  );
  const updateTokens = useCallback(
    (tokens: DesignTokens) => dispatch({ type: 'UPDATE_TOKENS', tokens }),
    []
  );
  const setTab = useCallback(
    (tab: SidebarTab) => dispatch({ type: 'SET_TAB', tab }),
    []
  );
  const setDevice = useCallback(
    (device: 'desktop' | 'mobile') => dispatch({ type: 'SET_DEVICE', device }),
    []
  );
  const setZoom = useCallback(
    (zoom: number) => dispatch({ type: 'SET_ZOOM', zoom }),
    []
  );
  const toggleScrollLocked = useCallback(
    () => dispatch({ type: 'TOGGLE_SCROLL_LOCKED' }),
    []
  );
  const toggleSidebar = useCallback(
    () => dispatch({ type: 'TOGGLE_SIDEBAR' }),
    []
  );
  const toggleRightSidebar = useCallback(
    () => dispatch({ type: 'TOGGLE_RIGHT_SIDEBAR' }),
    []
  );
  const setRightSidebar = useCallback(
    (open: boolean) => dispatch({ type: 'SET_RIGHT_SIDEBAR', open }),
    []
  );
  const setSaveStatus = useCallback(
    (status: SaveStatus, error?: string | null) =>
      dispatch({ type: 'SET_SAVE_STATUS', status, error }),
    []
  );
  const setActivePage = useCallback(
    (pageId: string | null) => dispatch({ type: 'SET_ACTIVE_PAGE', pageId }),
    []
  );
  /**
   * Reactiva el autoguardado. Es imprescindible cuando la operación que lo
   * suspendió FALLA: sin esto el editor quedaba mudo el resto de la sesión —
   * el usuario seguía editando y nada se guardaba, sin ningún aviso.
   */
  const resumeAutosave = useCallback(() => {
    autosaveSuspendedRef.current = false;
  }, []);
  const markPagesSaved = useCallback((pageIds: string[], lastSaved: string) => {
    for (const id of pageIds) lastSavedByPageRef.current[id] = lastSaved;
  }, []);
  const suspendAutosave = useCallback(() => {
    autosaveSuspendedRef.current = true;
    if (blocksTimerRef.current) {
      clearTimeout(blocksTimerRef.current);
      blocksTimerRef.current = null;
    }
    if (tokensTimerRef.current) {
      clearTimeout(tokensTimerRef.current);
      tokensTimerRef.current = null;
    }
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    cancelRetryWaitRef.current?.();
    // También limpia el pendiente, para que el `beforeunload` no pida confirmar
    // al recargar tras un cambio que YA se persistió del lado del servidor.
    pendingBlocksSaveRef.current = null;
  }, []);
  // Seed a page's cached blocks (e.g. a freshly created page) so switching to it
  // loads its real blocks instead of an empty array — which the autosave would
  // otherwise persist, wiping the server-created defaults/chrome.
  const seedPageBlocks = useCallback((pageId: string, blocks: AnyBlock[]) => {
    blocksByPageRef.current[pageId] = blocks;
  }, []);
  const addSectionElement = useCallback(
    (blockId: string, element: BlockElement) =>
      dispatch({ type: 'ADD_SECTION_ELEMENT', blockId, element }),
    []
  );
  const duplicateSectionElement = useCallback((blockId: string, elementId: string) => {
    const pageId = currentPageIdRef.current;
    if (!pageId) return;
    const blocks = blocksByPageRef.current[pageId] || [];
    const block = blocks.find((b: AnyBlock) => b.id === blockId);
    if (!block) return;
    const elements = getSectionElements(block);
    if (!elements) return;
    const element = elements.find((e) => e.id === elementId);
    if (!element) return;
    const clone = structuredClone(element) as BlockElement;
    clone.id = newId(element.type);
    // Si el elemento duplicado es un contenedor (grid), regenerar también los
    // IDs de sus hijos para no compartirlos con el original.
    const cloneChildren = getElementChildren(clone);
    if (cloneChildren) {
      (clone.config as { children?: BlockElement[] }).children = reassignElementIds(cloneChildren);
    }
    clone.x = Math.min(100 - clone.width / 2, clone.x + 3);
    clone.y = Math.min(100 - clone.height / 2, clone.y + 3);
    if (clone.mobile) {
      if (typeof clone.mobile.x === 'number') {
        clone.mobile.x = Math.min(100 - (clone.mobile.width ?? clone.width) / 2, clone.mobile.x + 3);
      }
      if (typeof clone.mobile.y === 'number') {
        clone.mobile.y = Math.min(100 - (clone.mobile.height ?? clone.height) / 2, clone.mobile.y + 3);
      }
    }
    delete (clone as Partial<BlockElement>).groupId;
    delete (clone as Partial<BlockElement>).groupName;
    dispatch({ type: 'ADD_SECTION_ELEMENT', blockId, element: clone });
    // SELECT_BLOCK primero: resetea selectedElementId a null, así que debe ir
    // antes de seleccionar el elemento duplicado.
    dispatch({ type: 'SELECT_BLOCK', blockId });
    dispatch({ type: 'SELECT_ELEMENT', elementId: clone.id });
  }, []);
  const addSectionElements = useCallback(
    (blockId: string, elements: BlockElement[]) =>
      dispatch({ type: 'ADD_SECTION_ELEMENTS', blockId, elements }),
    []
  );
  const removeSectionElement = useCallback(
    (blockId: string, elementId: string) =>
      dispatch({ type: 'REMOVE_SECTION_ELEMENT', blockId, elementId }),
    []
  );
  const updateSectionElement = useCallback(
    (blockId: string, elementId: string, partial: Partial<BlockElement>) =>
      dispatch({ type: 'UPDATE_SECTION_ELEMENT', blockId, elementId, partial }),
    []
  );
  const updateSectionElements = useCallback(
    (blockId: string, updates: Array<{ elementId: string; partial: Partial<BlockElement> }>) =>
      dispatch({ type: 'UPDATE_SECTION_ELEMENTS', blockId, updates }),
    []
  );
  const reorderSectionElements = useCallback(
    (blockId: string, fromIndex: number, toIndex: number) =>
      dispatch({ type: 'REORDER_SECTION_ELEMENTS', blockId, fromIndex, toIndex }),
    []
  );
  const reorderElementGroup = useCallback(
    (blockId: string, groupId: string, toIndex: number) =>
      dispatch({ type: 'REORDER_ELEMENT_GROUP', blockId, groupId, toIndex }),
    []
  );
  // Portapapeles interno de elementos: sobrevive al cambio de página (el ref
  // vive en el provider), así se puede copiar en una página y pegar en otra.
  const clipboardRef = useRef<BlockElement[]>([]);

  const copyElements = useCallback((): number => {
    const ids =
      state.multiSelectIds.length > 0
        ? state.multiSelectIds
        : state.selectedElementId
          ? [state.selectedElementId]
          : [];
    if (ids.length === 0) return 0;
    for (const b of state.blocks) {
      const els = getSectionElements(b);
      if (!els) continue;
      const found = els.filter((e) => ids.includes(e.id));
      if (found.length > 0) {
        clipboardRef.current = structuredClone(found);
        return found.length;
      }
    }
    return 0;
  }, [state.blocks, state.multiSelectIds, state.selectedElementId]);

  const pasteElements = useCallback((): number => {
    const copied = clipboardRef.current;
    if (copied.length === 0) return 0;
    let target = state.blocks.find(
      (b) => b.id === state.selectedBlockId && getSectionElements(b) !== null
    );
    if (!target) target = state.blocks.find((b) => getSectionElements(b) !== null);
    if (!target) return 0;
    // IDs nuevos (incl. hijos de grids) + offset para no quedar exactamente
    // encima + groupIds regenerados (manteniendo la agrupación ENTRE los pegados).
    const groupMap = new Map<string, string>();
    const clones = reassignElementIds(structuredClone(copied)).map((el) => {
      const next: BlockElement = { ...el };
      next.x = Math.min(100 - next.width / 2, next.x + 3);
      next.y = Math.min(100 - next.height / 2, next.y + 3);
      if (next.mobile && typeof next.mobile.x === 'number') {
        next.mobile = {
          ...next.mobile,
          x: Math.min(100 - (next.mobile.width ?? next.width) / 2, next.mobile.x + 3),
        };
      }
      if (next.mobile && typeof next.mobile.y === 'number') {
        next.mobile = {
          ...next.mobile,
          y: Math.min(100 - (next.mobile.height ?? next.height) / 2, next.mobile.y + 3),
        };
      }
      if (next.groupId) {
        if (!groupMap.has(next.groupId)) {
          groupMap.set(next.groupId, `grp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`);
        }
        next.groupId = groupMap.get(next.groupId);
      }
      return next;
    });
    dispatch({ type: 'ADD_SECTION_ELEMENTS', blockId: target.id, elements: clones });
    dispatch({ type: 'SELECT_BLOCK', blockId: target.id });
    dispatch({ type: 'SELECT_ELEMENT', elementId: clones[0].id });
    return clones.length;
  }, [state.blocks, state.selectedBlockId]);

  const undo = useCallback(() => dispatch({ type: 'UNDO' }), []);
  const redo = useCallback(() => dispatch({ type: 'REDO' }), []);

  const value: EditorContextValue = {
    ...state,
    dispatch,
    selectBlock,
    selectElement,
    selectElementOnly,
    selectGroup,
    toggleMultiSelect,
    clearMultiSelect,
    groupSelectedElements,
    ungroupElements,
    updateGroupName,
    addElementToGroup,
    removeElementFromGroup,
    updateBlock,
    addBlock,
    removeBlock,
    duplicateBlock,
    toggleBlock,
    setBlockVisibility,
    updateBlockMobile,
    setBlockDetached,
    setMedia,
    addMediaItem,
    removeMediaItem,
    reorderBlocks,
    updateTokens,
    canvasFitInfoRef,
    canvasFitScale,
    reportCanvasFit,
    setTab,
    setDevice,
    setZoom,
    scrollLocked: state.scrollLocked,
    toggleScrollLocked,
    toggleSidebar,
    toggleRightSidebar,
    setRightSidebar,
    setSaveStatus,
    setActivePage,
    suspendAutosave,
    resumeAutosave,
    markPagesSaved,
    faviconUrl,
    setFaviconUrl,
    seedPageBlocks,
    addSectionElement,
    addSectionElements,
    duplicateSectionElement,
    removeSectionElement,
    updateSectionElement,
    updateSectionElements,
    reorderSectionElements,
    reorderElementGroup,
    copyElements,
    pasteElements,
    undo,
    redo,
  };

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}

export function useEditor(): EditorContextValue {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error('useEditor must be used inside EditorProvider');
  return ctx;
}

export function useOptionalEditor(): EditorContextValue | null {
  return useContext(EditorContext);
}
