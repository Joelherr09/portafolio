import type { AnyBlock, DesignTokens, BlockType, BlockElement, BlockMobileOverride } from './blocks';
import type { PlanTier, SiteTeamOption, BlockDataMap } from './local-types';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

// 'blocks' es la pestaña de Capas (nombre heredado). 'assets' = Media y
// 'design' = tipografía/scrollbar del sitio: eran el mismo valor y el panel de
// diseño quedó sin pestaña donde vivir.
export type SidebarTab = 'pages' | 'blocks' | 'assets' | 'design';

export interface MediaItem {
  id: string;
  name: string | null;
  url: string;
  type: string | null;
  size: string | null;
  format: string | null;
  width: string | null;
  height: string | null;
  createdAt: Date | null;
  /** True when the asset is shared/public (app === null) — read-only for users. */
  isPublic?: boolean;
}

export interface PageMeta {
  id: string;
  slug: string;
  name: string;
  order: number;
  /**
   * Marca de la última escritura conocida por el cliente. Viaja de vuelta en
   * cada guardado para detectar que otra persona editó la página en el medio.
   */
  lastSaved?: string | null;
}

export interface EditorSnapshot {
  blocks: AnyBlock[];
  designTokens: DesignTokens;
}

export interface EditorHistory {
  past: EditorSnapshot[];
  future: EditorSnapshot[];
  lastPushAt: number;
}

export interface EditorState {
  siteId: string;
  siteSlug: string;
  plan: PlanTier;
  teams: SiteTeamOption[];
  pages: PageMeta[];
  activePageId: string | null;
  blocks: AnyBlock[];
  selectedBlockId: string | null;
  selectedElementId: string | null;
  selectedGroupId: string | null;
  multiSelectIds: string[];
  designTokens: DesignTokens;
  saveStatus: SaveStatus;
  lastSavedAt: Date | null;
  saveError: string | null;
  sidebarOpen: boolean;
  rightSidebarOpen: boolean;
  activeTab: SidebarTab;
  device: 'desktop' | 'mobile';
  zoom: number;
  scrollLocked: boolean;
  history: EditorHistory;
  media: MediaItem[];
  /** Datos de data-blocks (partidos, posiciones, plantel, torneos) de la página activa. */
  data: BlockDataMap;
}

export type EditorAction =
  | { type: 'SELECT_BLOCK'; blockId: string | null }
  | { type: 'SELECT_ELEMENT'; elementId: string | null }
  | { type: 'TOGGLE_MULTI_SELECT'; elementId: string }
  | { type: 'CLEAR_MULTI_SELECT' }
  | { type: 'SELECT_ELEMENT_GROUP'; elementId: string; groupIds: string[] }
  | { type: 'SELECT_GROUP'; groupId: string | null; blockId: string }
  | { type: 'UPDATE_BLOCK'; blockId: string; config: unknown }
  | { type: 'ADD_BLOCK'; block: AnyBlock }
  | { type: 'REMOVE_BLOCK'; blockId: string }
  | { type: 'TOGGLE_BLOCK'; blockId: string }
  | { type: 'REORDER_BLOCKS'; fromIndex: number; toIndex: number }
  | { type: 'SET_BLOCKS'; blocks: AnyBlock[] }
  | { type: 'LOAD_PAGE_BLOCKS'; blocks: AnyBlock[] }
  | { type: 'SET_PAGE_DATA'; data: BlockDataMap }
  | { type: 'UPDATE_TOKENS'; tokens: DesignTokens }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET_SAVE_STATUS'; status: SaveStatus; error?: string | null }
  | { type: 'SET_LAST_SAVED'; at: Date }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR'; open: boolean }
  | { type: 'TOGGLE_RIGHT_SIDEBAR' }
  | { type: 'SET_RIGHT_SIDEBAR'; open: boolean }
  | { type: 'SET_TAB'; tab: SidebarTab }
  | { type: 'SET_DEVICE'; device: 'desktop' | 'mobile' }
  | { type: 'SET_ZOOM'; zoom: number }
  | { type: 'TOGGLE_SCROLL_LOCKED' }
  | { type: 'SET_PAGES'; pages: PageMeta[] }
  | { type: 'SET_ACTIVE_PAGE'; pageId: string | null }
  | { type: 'ADD_PAGE'; page: PageMeta }
  | { type: 'REMOVE_PAGE'; pageId: string }
  | { type: 'RENAME_PAGE'; pageId: string; name: string; slug: string }
  | { type: 'REORDER_PAGES'; fromIndex: number; toIndex: number }
  | { type: 'UPDATE_PAGE'; page: PageMeta }
  // Generic section element actions (work for any section's elements array)
  | { type: 'ADD_SECTION_ELEMENT'; blockId: string; element: BlockElement }
  | { type: 'ADD_SECTION_ELEMENTS'; blockId: string; elements: BlockElement[] }
  | { type: 'REMOVE_SECTION_ELEMENT'; blockId: string; elementId: string }
  | { type: 'UPDATE_SECTION_ELEMENT'; blockId: string; elementId: string; partial: Partial<BlockElement> }
  | { type: 'UPDATE_SECTION_ELEMENTS'; blockId: string; updates: Array<{ elementId: string; partial: Partial<BlockElement> }> }
  | { type: 'UPDATE_SECTION_GROUP_NAME'; blockId: string; groupId: string; groupName: string | undefined }
  | { type: 'REORDER_SECTION_ELEMENTS'; blockId: string; fromIndex: number; toIndex: number }
  | { type: 'REORDER_ELEMENT_GROUP'; blockId: string; groupId: string; toIndex: number }
  | { type: 'SET_BLOCK_VISIBILITY'; blockId: string; desktopVisible?: boolean; mobileVisible?: boolean }
  | { type: 'SET_BLOCK_DETACHED'; blockId: string; detached: boolean }
  | { type: 'SET_BLOCK_MOBILE'; blockId: string; mobile: BlockMobileOverride }
  // Media library actions
  | { type: 'SET_MEDIA'; media: MediaItem[] }
  | { type: 'ADD_MEDIA_ITEM'; item: MediaItem }
  | { type: 'REMOVE_MEDIA_ITEM'; assetId: string };

export type BlockOption = {
  type: BlockType;
  label: string;
  description: string;
};
