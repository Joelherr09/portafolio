import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type CSSProperties, type ReactNode } from 'react';
import { DndContext, PointerSensor, KeyboardSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ArrowLeft, ArrowUpRight, ChevronDown, ChevronRight, Copy, Download, Eye, EyeOff, FilePlus2, GripVertical, ImagePlus, Layers3, LayoutTemplate, Monitor, Palette, Plus, Redo2, RotateCcw, Smartphone, Trash2, Undo2, Upload, X, ZoomIn, ZoomOut } from 'lucide-react';
import { BuilderCanvas } from './BuilderCanvas';
import { EditorProvider, useEditor } from './core/EditorProvider';
import { createBlock, getSectionElements, type AnyBlock, type BlockElement, type ButtonBlockConfig, type ImageBlockConfig, type SectionBlockConfig, type TextBlockConfig } from './core/blocks';
import { newId } from './core/ids';
import type { MediaItem, PageMeta } from './core/editor-types';
import { LOCAL_TEMPLATES, loadLocalDocument, makeElement, makeTemplateSection, saveLocalDocument, sanitizeDocument, starterDocument, type LocalDocument, type LocalElementType, type LocalTemplateId } from './local-document';

const EMPTY_DATA = { matches: {}, standings: {}, rosters: {}, tournaments: {}, tournamentTeams: {}, news: {}, coachpro: {}, coachproCobro: {} };
const ELEMENT_TYPES: Array<{ type: LocalElementType; name: string; description: string }> = [
  { type: 'text', name: 'Texto', description: 'Título o párrafo editable' },
  { type: 'image', name: 'Imagen', description: 'Foto o ilustración' },
  { type: 'button', name: 'Botón', description: 'Enlace destacado' },
  { type: 'box', name: 'Forma', description: 'Fondo, color y composición' },
  { type: 'list', name: 'Lista', description: 'Ideas, servicios o pasos' },
  { type: 'icon', name: 'Ícono', description: 'Detalle visual' },
];

function saveSnapshot(source: LocalDocument, editor: ReturnType<typeof useEditor>): LocalDocument {
  return { ...source, pages: editor.pages, activePageId: editor.activePageId || source.activePageId, blocksByPage: { ...source.blocksByPage, ...(editor.activePageId ? { [editor.activePageId]: editor.blocks } : {}) }, tokens: editor.designTokens, media: editor.media, updatedAt: new Date().toISOString() };
}

export default function LocalBuilder() {
  const [document, setDocument] = useState<LocalDocument>(() => loadLocalDocument());
  const [version, setVersion] = useState(0);
  const documentRef = useRef(document);
  const [storageError, setStorageError] = useState<string | null>(null);
  const persist = useCallback((next: LocalDocument) => {
    documentRef.current = next;
    try { saveLocalDocument(next); setStorageError(null); }
    catch { setStorageError('El almacenamiento local está lleno o bloqueado. Descarga el JSON para conservar tu sitio.'); }
  }, []);
  const callbacks = useMemo(() => ({
    onSaveBlocks: async (pageId: string, blocks: AnyBlock[]) => { persist({ ...documentRef.current, blocksByPage: { ...documentRef.current.blocksByPage, [pageId]: blocks } }); return { success: true, lastSaved: new Date().toISOString() }; },
    onSaveTokens: async (tokens: LocalDocument['tokens']) => { persist({ ...documentRef.current, tokens }); return { success: true }; },
    onLoadPageData: async () => EMPTY_DATA,
  }), [persist]);
  const replace = (next: LocalDocument) => { documentRef.current = next; persist(next); setDocument(next); setVersion((value) => value + 1); };
  return <EditorProvider key={version} siteId="local-portfolio-builder" siteSlug="local" plan="pro" teams={[]} initialPages={document.pages} initialActivePageId={document.activePageId} initialBlocksByPage={document.blocksByPage} initialTokens={document.tokens} initialData={EMPTY_DATA} callbacks={callbacks}><EditorUI documentRef={documentRef} persist={persist} replace={replace} storageError={storageError} /></EditorProvider>;
}

function EditorUI({ documentRef, persist, replace, storageError }: { documentRef: React.RefObject<LocalDocument>; persist: (value: LocalDocument) => void; replace: (value: LocalDocument) => void; storageError: string | null }) {
  const editor = useEditor();
  const fileInput = useRef<HTMLInputElement>(null);
  const [rightTab, setRightTab] = useState<'add' | 'edit'>('add');
  const [notice, setNotice] = useState<string | null>(null);
  const activePage = editor.pages.find((page) => page.id === editor.activePageId);
  const selectedBlock = editor.blocks.find((block) => block.id === editor.selectedBlockId);
  const selectedElement = selectedBlock ? getSectionElements(selectedBlock)?.find((element) => element.id === editor.selectedElementId) : undefined;
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  useEffect(() => {
    const next = { ...documentRef.current, pages: editor.pages, activePageId: editor.activePageId || documentRef.current.activePageId, media: editor.media };
    persist(next);
  }, [editor.pages, editor.activePageId, editor.media, documentRef, persist]);

  useEffect(() => { if (!notice) return; const timer = window.setTimeout(() => setNotice(null), 3000); return () => window.clearTimeout(timer); }, [notice]);

  const selectBlock = (id: string) => { editor.selectBlock(id); editor.selectElement(null); setRightTab('edit'); editor.setRightSidebar(true); };
  const selectElement = (blockId: string, elementId: string) => { editor.selectBlock(blockId); editor.selectElement(elementId); setRightTab('edit'); editor.setRightSidebar(true); };
  const moveElement = (blockId: string, elementId: string, patch: { x?: number; y?: number; width?: number; height?: number }) => {
    const block = editor.blocks.find((item) => item.id === blockId);
    const element = block && getSectionElements(block)?.find((item) => item.id === elementId);
    if (!element) return;
    editor.updateSectionElement(blockId, elementId, editor.device === 'mobile' ? { mobile: { ...element.mobile, ...patch } } : patch);
  };
  const addTemplate = (id: LocalTemplateId) => { const section = makeTemplateSection(id); editor.dispatch({ type: 'ADD_BLOCK', block: section }); setRightTab('edit'); editor.setRightSidebar(true); };
  const addBlock = (type: 'navbar' | 'footer' | 'contact') => { if (editor.blocks.some((block) => block.type === type)) { setNotice('Ese bloque ya existe en la página.'); return; } editor.addBlock(type); setRightTab('edit'); };
  const addElement = (type: LocalElementType) => {
    const block = selectedBlock?.type === 'section' ? selectedBlock : editor.blocks.find((item) => item.type === 'section');
    if (!block) { setNotice('Agrega una sección antes de insertar elementos.'); return; }
    const element = makeElement(type);
    editor.addSectionElement(block.id, element);
    editor.selectBlock(block.id);
    editor.selectElement(element.id);
    setRightTab('edit');
  };
  const addPage = () => {
    const id = newId('page');
    const page: PageMeta = { id, slug: `pagina-${editor.pages.length + 1}`, name: `Página ${editor.pages.length + 1}`, order: editor.pages.length };
    const navbar = createBlock('navbar')!;
    const footer = createBlock('footer')!;
    const blocks = [navbar, makeTemplateSection('hero'), footer];
    documentRef.current.blocksByPage[id] = blocks;
    editor.seedPageBlocks(id, blocks);
    editor.dispatch({ type: 'ADD_PAGE', page });
    editor.setActivePage(id);
  };
  const duplicatePage = (page: PageMeta) => {
    const id = newId('page');
    const copy: PageMeta = { id, name: `${page.name} copia`, slug: `${page.slug}-copia`, order: editor.pages.length };
    const source = page.id === editor.activePageId ? editor.blocks : documentRef.current.blocksByPage[page.id] || [];
    const blocks = structuredClone(source).map((block) => ({ ...block, id: newId(block.type) })) as AnyBlock[];
    documentRef.current.blocksByPage[id] = blocks;
    editor.seedPageBlocks(id, blocks);
    editor.dispatch({ type: 'ADD_PAGE', page: copy });
    editor.setActivePage(id);
  };
  const removePage = (page: PageMeta) => {
    if (page.slug === 'home' || editor.pages.length === 1) return;
    if (!window.confirm(`¿Eliminar la página “${page.name}”?`)) return;
    const blocksByPage = { ...documentRef.current.blocksByPage };
    delete blocksByPage[page.id];
    persist({ ...documentRef.current, blocksByPage });
    editor.dispatch({ type: 'REMOVE_PAGE', pageId: page.id });
  };
  const renamePage = (page: PageMeta, field: 'name' | 'slug', value: string) => {
    const next = { ...page, [field]: field === 'slug' ? value.toLowerCase().replace(/[^a-z0-9-]/g, '-') : value };
    editor.dispatch({ type: 'UPDATE_PAGE', page: next });
  };
  const uploadMedia = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 2_500_000) { setNotice('Usa una imagen de hasta 2,5 MB.'); event.target.value = ''; return; }
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result || '');
      const media: MediaItem = { id: newId('media'), name: file.name, url, type: file.type, size: String(file.size), format: file.type, width: null, height: null, createdAt: new Date() };
      editor.addMediaItem(media);
      if (selectedElement?.type === 'image' && selectedBlock) editor.updateSectionElement(selectedBlock.id, selectedElement.id, { config: { ...selectedElement.config, src: url, alt: file.name } as ImageBlockConfig });
      setNotice('Imagen guardada en este navegador.');
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };
  const exportJson = () => {
    const snapshot = saveSnapshot(documentRef.current, editor);
    persist(snapshot);
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `${snapshot.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'mi-sitio'}.json`; anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice('Sitio exportado como JSON.');
  };
  const importJson = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try { if (file.size > 12_000_000) throw new Error('Archivo demasiado grande'); const parsed = sanitizeDocument(JSON.parse(await file.text())); replace(parsed); setNotice('Sitio cargado.'); }
    catch (error) { setNotice(error instanceof Error ? error.message : 'No pude leer ese archivo.'); }
    event.target.value = '';
  };
  const reset = () => { if (window.confirm('¿Reemplazar el sitio local por el ejemplo inicial? Exporta antes si quieres conservarlo.')) replace(starterDocument()); };
  const onLayerDragEnd = (event: DragEndEvent) => { if (!event.over || event.active.id === event.over.id) return; const from = editor.blocks.findIndex((block) => block.id === event.active.id); const to = editor.blocks.findIndex((block) => block.id === event.over!.id); if (from >= 0 && to >= 0) editor.reorderBlocks(from, to); };

  return <div className="local-builder">
    <header className="lb-topbar">
      <div className="lb-identity"><a href="/" aria-label="Volver al portafolio"><ArrowLeft size={18} /></a><span className="lb-divider" /><div><strong>Constructor local</strong><small>{documentRef.current.name} · sin servidor</small></div></div>
      <div className="lb-top-center"><select aria-label="Página activa" value={editor.activePageId || ''} onChange={(event) => editor.setActivePage(event.target.value)}>{editor.pages.map((page) => <option key={page.id} value={page.id}>{page.name}</option>)}</select><span className={`lb-save lb-save-${editor.saveStatus}`}>{storageError || (editor.saveStatus === 'saving' ? 'Guardando…' : editor.saveStatus === 'error' ? 'Error al guardar' : 'Guardado local')}</span></div>
      <div className="lb-top-actions"><button type="button" title="Deshacer" onClick={editor.undo} disabled={!editor.history.past.length}><Undo2 size={17} /></button><button type="button" title="Rehacer" onClick={editor.redo} disabled={!editor.history.future.length}><Redo2 size={17} /></button><span className="lb-divider" /><button type="button" title="Vista de escritorio" className={editor.device === 'desktop' ? 'active' : ''} onClick={() => editor.setDevice('desktop')}><Monitor size={17} /></button><button type="button" title="Vista móvil" className={editor.device === 'mobile' ? 'active' : ''} onClick={() => editor.setDevice('mobile')}><Smartphone size={17} /></button><span className="lb-divider" /><button type="button" title="Alejar" onClick={() => editor.setZoom(Math.max(.5, editor.zoom - .1))}><ZoomOut size={17} /></button><span className="lb-zoom">{Math.round(editor.zoom * 100)}%</span><button type="button" title="Acercar" onClick={() => editor.setZoom(Math.min(1.5, editor.zoom + .1))}><ZoomIn size={17} /></button><span className="lb-divider" /><a className="lb-preview-link" href={`/constructor/vista/?page=${encodeURIComponent(activePage?.slug || 'home')}`} target="_blank" rel="noreferrer" onClick={() => persist(saveSnapshot(documentRef.current, editor))}>Ver sitio <ArrowUpRight size={15} /></a><button type="button" className="lb-text-button" onClick={() => fileInput.current?.click()}><Upload size={15} /> Cargar JSON</button><button type="button" className="lb-export" onClick={exportJson}><Download size={15} /> Guardar JSON</button><input ref={fileInput} type="file" accept=".json,application/json" hidden onChange={importJson} /></div>
    </header>

    <div className="lb-layout">
      <aside className="lb-sidebar lb-left">
        <div className="lb-tabs">{([['pages', FilePlus2, 'Páginas'], ['blocks', Layers3, 'Capas'], ['assets', ImagePlus, 'Media'], ['design', Palette, 'Diseño']] as const).map(([tab, Icon, label]) => <button key={tab} type="button" title={label} className={editor.activeTab === tab ? 'active' : ''} onClick={() => editor.setTab(tab)}><Icon size={17} /><span>{label}</span></button>)}</div>
        {editor.activeTab === 'pages' && <div className="lb-panel"><div className="lb-panel-head"><div><small>ESTRUCTURA</small><h2>Páginas</h2></div><button type="button" title="Agregar página" onClick={addPage}><Plus size={18} /></button></div><div className="lb-page-list">{editor.pages.map((page) => <div key={page.id} className={`lb-page ${page.id === editor.activePageId ? 'active' : ''}`}><button type="button" onClick={() => editor.setActivePage(page.id)}><span>{page.name}</span><small>/{page.slug === 'home' ? '' : page.slug}</small></button><button type="button" title="Duplicar página" onClick={() => duplicatePage(page)}><Copy size={14} /></button>{page.slug !== 'home' && <button type="button" title="Eliminar página" onClick={() => removePage(page)}><Trash2 size={14} /></button>}</div>)}</div>{activePage && <div className="lb-panel-group"><h3>Configurar página</h3><Field label="Nombre"><input value={activePage.name} onChange={(event) => renamePage(activePage, 'name', event.target.value)} /></Field>{activePage.slug !== 'home' && <Field label="Ruta"><input value={activePage.slug} onChange={(event) => renamePage(activePage, 'slug', event.target.value)} /></Field>}</div>}</div>}
        {editor.activeTab === 'blocks' && <div className="lb-panel"><div className="lb-panel-head"><div><small>ORGANIZACIÓN</small><h2>Capas</h2></div><button type="button" title="Agregar bloque" onClick={() => { setRightTab('add'); editor.setRightSidebar(true); }}><Plus size={18} /></button></div><DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onLayerDragEnd}><SortableContext items={editor.blocks.map((block) => block.id)} strategy={verticalListSortingStrategy}><div className="lb-layer-list">{editor.blocks.map((block) => <SortableLayer key={block.id} block={block} selected={block.id === editor.selectedBlockId} selectedElementId={editor.selectedElementId} onSelect={() => selectBlock(block.id)} onSelectElement={(id) => selectElement(block.id, id)} onToggle={() => editor.toggleBlock(block.id)} />)}</div></SortableContext></DndContext></div>}
        {editor.activeTab === 'assets' && <div className="lb-panel"><div className="lb-panel-head"><div><small>ARCHIVOS LOCALES</small><h2>Media</h2></div></div><label className="lb-upload"><ImagePlus size={21} /><span>Agregar imagen</span><small>Se incluirá en el JSON exportado</small><input type="file" accept="image/*" hidden onChange={uploadMedia} /></label><div className="lb-media-grid">{editor.media.map((item) => <button key={item.id} type="button" title={item.name || 'Imagen'} onClick={() => { if (selectedElement?.type === 'image' && selectedBlock) editor.updateSectionElement(selectedBlock.id, selectedElement.id, { config: { ...selectedElement.config, src: item.url, alt: item.name || '' } as ImageBlockConfig }); else setNotice('Selecciona un elemento de imagen para usar este archivo.'); }}><img src={item.url} alt={item.name || ''} /></button>)}</div>{editor.media.length === 0 && <p className="lb-empty">Todavía no hay imágenes. Puedes subir una para usarla en tu página.</p>}</div>}
        {editor.activeTab === 'design' && <div className="lb-panel"><div className="lb-panel-head"><div><small>IDENTIDAD VISUAL</small><h2>Diseño</h2></div></div><div className="lb-panel-group"><h3>Nombre del sitio</h3><Field label="Nombre"><input value={documentRef.current.name} onChange={(event) => { persist({ ...documentRef.current, name: event.target.value }); editor.dispatch({ type: 'SET_PAGES', pages: [...editor.pages] }); }} /></Field><h3>Colores</h3>{([['primary', 'Principal'], ['secondary', 'Secundario'], ['background', 'Fondo'], ['text', 'Texto'], ['accent', 'Acento']] as const).map(([key, label]) => <Field key={key} label={label}><div className="lb-color-field"><input type="color" value={/^#[0-9a-f]{6}$/i.test(editor.designTokens.colors[key]) ? editor.designTokens.colors[key] : '#111111'} onChange={(event) => editor.updateTokens({ ...editor.designTokens, colors: { ...editor.designTokens.colors, [key]: event.target.value } })} /><span>{editor.designTokens.colors[key]}</span></div></Field>)}<h3>Tipografía</h3><Field label="Fuente de títulos"><select value={editor.designTokens.typography.headingFont} onChange={(event) => editor.updateTokens({ ...editor.designTokens, typography: { ...editor.designTokens.typography, headingFont: event.target.value } })}>{['Arial, sans-serif', 'Georgia, serif', 'Inter, system-ui, sans-serif', 'Impact, sans-serif'].map((font) => <option key={font} value={font}>{font.split(',')[0]}</option>)}</select></Field><Field label="Fuente de texto"><select value={editor.designTokens.typography.fontFamily} onChange={(event) => editor.updateTokens({ ...editor.designTokens, typography: { ...editor.designTokens.typography, fontFamily: event.target.value } })}>{['Arial, sans-serif', 'Georgia, serif', 'Inter, system-ui, sans-serif', 'Impact, sans-serif'].map((font) => <option key={font} value={font}>{font.split(',')[0]}</option>)}</select></Field></div><button type="button" className="lb-reset" onClick={reset}><RotateCcw size={15} /> Restaurar ejemplo</button></div>}
      </aside>

      <main className="lb-workspace"><div className="lb-workspace-head"><span><span className="lb-live-dot" /> Vista {editor.device === 'mobile' ? 'móvil' : 'de escritorio'}</span><span>Arrastra los elementos para componer tu página</span></div><div className="lb-canvas-stage"><div className={`lb-canvas-frame ${editor.device}`} style={{ zoom: editor.zoom }}><div className="lb-browser-bar"><span /><span /><span /><small>vista local · {activePage?.name || 'Inicio'}</small></div><BuilderCanvas blocks={editor.blocks} tokens={editor.designTokens} device={editor.device} siteName={documentRef.current.name} selectedBlockId={editor.selectedBlockId} selectedElementId={editor.selectedElementId} onSelectBlock={selectBlock} onSelectElement={selectElement} onMoveElement={moveElement} pages={editor.pages} /></div></div></main>

      <aside className={`lb-sidebar lb-right ${editor.rightSidebarOpen ? '' : 'collapsed'}`}><div className="lb-right-tabs"><button type="button" className={rightTab === 'add' ? 'active' : ''} onClick={() => setRightTab('add')}><Plus size={16} /> Añadir</button><button type="button" className={rightTab === 'edit' ? 'active' : ''} onClick={() => setRightTab('edit')}><Palette size={16} /> Editar</button></div>{rightTab === 'add' ? <div className="lb-panel"><div className="lb-panel-head"><div><small>CATÁLOGO</small><h2>Añadir bloques</h2></div></div><div className="lb-panel-group"><h3>Secciones</h3><div className="lb-catalog">{LOCAL_TEMPLATES.map((template) => <button key={template.id} type="button" onClick={() => addTemplate(template.id)}><LayoutTemplate size={18} /><span><strong>{template.name}</strong><small>{template.description}</small></span><Plus size={15} /></button>)}</div><h3>Elementos</h3><p className="lb-hint">Elige una sección y añade elementos dentro.</p><div className="lb-catalog">{ELEMENT_TYPES.map((item) => <button key={item.type} type="button" onClick={() => addElement(item.type)}><Plus size={18} /><span><strong>{item.name}</strong><small>{item.description}</small></span><ChevronRight size={15} /></button>)}</div><h3>Estructura</h3><div className="lb-catalog">{(['navbar', 'contact', 'footer'] as const).map((type) => <button key={type} type="button" onClick={() => addBlock(type)}><Layers3 size={18} /><span><strong>{type === 'navbar' ? 'Navegación' : type === 'contact' ? 'Contacto' : 'Pie de página'}</strong><small>Bloque de página</small></span><Plus size={15} /></button>)}</div></div></div> : <Inspector selectedBlock={selectedBlock} selectedElement={selectedElement} editor={editor} onSelectAdd={() => setRightTab('add')} />}</aside>
    </div>
    {notice && <div className="lb-toast" role="status">{notice}</div>}
    {storageError && <div className="lb-storage-error" role="alert">{storageError}</div>}
  </div>;
}

function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="lb-field"><span>{label}</span>{children}</label>; }

function SortableLayer({ block, selected, selectedElementId, onSelect, onSelectElement, onToggle }: { block: AnyBlock; selected: boolean; selectedElementId: string | null; onSelect: () => void; onSelectElement: (id: string) => void; onToggle: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: block.id });
  const style = { transform: CSS.Transform.toString(transform), transition } as CSSProperties;
  const elements = getSectionElements(block) || [];
  const label = block.type === 'section' ? (block.config as SectionBlockConfig).name || 'Sección' : block.type === 'navbar' ? 'Navegación' : block.type === 'footer' ? 'Pie de página' : 'Contacto';
  return <div ref={setNodeRef} style={style} className={`lb-layer ${selected ? 'active' : ''}`}><div className="lb-layer-row"><button type="button" className="lb-grip" title="Arrastrar bloque" {...attributes} {...listeners}><GripVertical size={15} /></button><button type="button" className="lb-layer-name" onClick={onSelect}><Layers3 size={15} /><span>{label}</span></button><button type="button" title={block.enabled ? 'Ocultar' : 'Mostrar'} onClick={onToggle}>{block.enabled ? <Eye size={14} /> : <EyeOff size={14} />}</button></div>{selected && elements.length > 0 && <div className="lb-child-layers">{elements.map((element) => <button key={element.id} type="button" className={selectedElementId === element.id ? 'active' : ''} onClick={() => onSelectElement(element.id)}><span>{element.type}</span><strong>{element.type === 'text' ? (element.config as TextBlockConfig).text.slice(0, 20) : element.type === 'button' ? (element.config as ButtonBlockConfig).text : element.type === 'image' ? 'Imagen' : 'Elemento'}</strong></button>)}</div>}</div>;
}

function Inspector({ selectedBlock, selectedElement, editor, onSelectAdd }: { selectedBlock?: AnyBlock; selectedElement?: BlockElement; editor: ReturnType<typeof useEditor>; onSelectAdd: () => void }) {
  if (!selectedBlock) return <div className="lb-panel"><div className="lb-panel-head"><div><small>PROPIEDADES</small><h2>Nada seleccionado</h2></div></div><p className="lb-empty">Selecciona una capa o un elemento en el lienzo para editarlo.</p><button type="button" className="lb-panel-cta" onClick={onSelectAdd}><Plus size={16} /> Añadir bloque</button></div>;
  const updateBlock = (patch: Record<string, unknown>) => editor.updateBlock(selectedBlock.id, { ...selectedBlock.config, ...patch });
  const updateElement = (patch: Record<string, unknown>) => selectedElement && editor.updateSectionElement(selectedBlock.id, selectedElement.id, { config: { ...selectedElement.config, ...patch } as BlockElement['config'] });
  const position = selectedElement && (editor.device === 'mobile' ? { x: selectedElement.mobile?.x ?? selectedElement.x, y: selectedElement.mobile?.y ?? selectedElement.y, width: selectedElement.mobile?.width ?? selectedElement.width, height: selectedElement.mobile?.height ?? selectedElement.height } : selectedElement);
  const positionField = (label: string, key: 'x' | 'y' | 'width' | 'height') => <Field label={label}><input type="number" min="0" max="100" value={Math.round(position?.[key] || 0)} onChange={(event) => { const value = Number(event.target.value); if (!selectedElement) return; editor.updateSectionElement(selectedBlock.id, selectedElement.id, editor.device === 'mobile' ? { mobile: { ...selectedElement.mobile, [key]: value } } : { [key]: value }); }} /></Field>;
  return <div className="lb-panel"><div className="lb-panel-head"><div><small>{selectedElement ? 'ELEMENTO' : 'BLOQUE'}</small><h2>{selectedElement ? selectedElement.type : selectedBlock.type === 'section' ? (selectedBlock.config as SectionBlockConfig).name || 'Sección' : selectedBlock.type}</h2></div></div><div className="lb-panel-group">
    {selectedElement ? <><h3>Contenido</h3>{selectedElement.type === 'text' && <><Field label="Texto"><textarea rows={5} value={(selectedElement.config as TextBlockConfig).text} onChange={(event) => updateElement({ text: event.target.value })} /></Field><div className="lb-two-fields"><Field label="Tamaño"><input type="number" min="10" max="180" value={editor.device === 'mobile' ? selectedElement.mobile?.fontSize ?? (selectedElement.config as TextBlockConfig).fontSize ?? 22 : (selectedElement.config as TextBlockConfig).fontSize ?? 22} onChange={(event) => editor.device === 'mobile' ? editor.updateSectionElement(selectedBlock.id, selectedElement.id, { mobile: { ...selectedElement.mobile, fontSize: Number(event.target.value) } }) : updateElement({ fontSize: Number(event.target.value) })} /></Field><Field label="Color"><input type="color" value={(selectedElement.config as TextBlockConfig).customColor || '#111111'} onChange={(event) => updateElement({ color: 'custom', customColor: event.target.value })} /></Field></div><Field label="Alineación"><select value={(selectedElement.config as TextBlockConfig).align} onChange={(event) => updateElement({ align: event.target.value })}><option value="left">Izquierda</option><option value="center">Centro</option><option value="right">Derecha</option></select></Field></>}
    {selectedElement.type === 'image' && <><Field label="URL o imagen local"><input value={(selectedElement.config as ImageBlockConfig).src} onChange={(event) => updateElement({ src: event.target.value })} placeholder="https://..." /></Field><Field label="Descripción"><input value={(selectedElement.config as ImageBlockConfig).alt} onChange={(event) => updateElement({ alt: event.target.value })} /></Field><p className="lb-hint">También puedes seleccionar una imagen desde la pestaña Media.</p></>}
    {selectedElement.type === 'button' && <><Field label="Texto"><input value={(selectedElement.config as ButtonBlockConfig).text} onChange={(event) => updateElement({ text: event.target.value })} /></Field><Field label="Enlace"><input value={(selectedElement.config as ButtonBlockConfig).url} onChange={(event) => updateElement({ url: event.target.value })} /></Field><Field label="Fondo"><input type="color" value={(selectedElement.config as ButtonBlockConfig).backgroundColor || '#e12118'} onChange={(event) => updateElement({ backgroundColor: event.target.value })} /></Field></>}
    {selectedElement.type === 'box' && <Field label="Color de la forma"><input type="color" value={(selectedElement.config as { backgroundColor: string }).backgroundColor || '#e12118'} onChange={(event) => updateElement({ backgroundColor: event.target.value })} /></Field>}
    {selectedElement.type === 'list' && <Field label="Elementos (uno por línea)"><textarea rows={6} value={(selectedElement.config as { items: string[] }).items.join('\n')} onChange={(event) => updateElement({ items: event.target.value.split('\n') })} /></Field>}
    {selectedElement.type === 'icon' && <><Field label="Etiqueta"><input value={(selectedElement.config as { label?: string }).label || ''} onChange={(event) => updateElement({ label: event.target.value })} /></Field><Field label="Color"><input type="color" value={(selectedElement.config as { color: string }).color || '#e12118'} onChange={(event) => updateElement({ color: event.target.value })} /></Field></>}
    <h3>Posición · {editor.device === 'mobile' ? 'móvil' : 'escritorio'}</h3><div className="lb-two-fields">{positionField('X %', 'x')}{positionField('Y %', 'y')}{positionField('Ancho %', 'width')}{positionField('Alto %', 'height')}</div><button type="button" className="lb-delete" onClick={() => editor.removeSectionElement(selectedBlock.id, selectedElement.id)}><Trash2 size={15} /> Eliminar elemento</button></> : <>{selectedBlock.type === 'section' && <><Field label="Nombre de sección"><input value={(selectedBlock.config as SectionBlockConfig).name || ''} onChange={(event) => updateBlock({ name: event.target.value })} /></Field><Field label="Fondo"><input type="color" value={(selectedBlock.config as SectionBlockConfig).solidBackgroundColor || '#ffffff'} onChange={(event) => updateBlock({ background: 'custom', solidBackgroundColor: event.target.value })} /></Field><Field label="Altura (vh)"><input type="range" min="35" max="130" value={(selectedBlock.config as SectionBlockConfig).height || 75} onChange={(event) => updateBlock({ height: Number(event.target.value) })} /><output>{(selectedBlock.config as SectionBlockConfig).height || 75} vh</output></Field><button type="button" className="lb-panel-cta" onClick={onSelectAdd}><Plus size={15} /> Añadir elemento</button></>}{selectedBlock.type === 'navbar' && <><Field label="Nombre"><input value={selectedBlock.config.siteName} onChange={(event) => updateBlock({ siteName: event.target.value })} /></Field><Field label="Fondo"><input type="color" value={selectedBlock.config.backgroundColor} onChange={(event) => updateBlock({ backgroundColor: event.target.value })} /></Field></>}{selectedBlock.type === 'footer' && <><Field label="Nombre"><input value={selectedBlock.config.siteName} onChange={(event) => updateBlock({ siteName: event.target.value })} /></Field><Field label="Descripción"><textarea value={selectedBlock.config.description} onChange={(event) => updateBlock({ description: event.target.value })} /></Field></>}{selectedBlock.type === 'contact' && <Field label="Título"><input value={selectedBlock.config.title} onChange={(event) => updateBlock({ title: event.target.value })} /></Field>}<h3>Acciones</h3><button type="button" className="lb-soft-button" onClick={() => editor.duplicateBlock(selectedBlock.id)}><Copy size={15} /> Duplicar bloque</button><button type="button" className="lb-delete" onClick={() => editor.removeBlock(selectedBlock.id)}><Trash2 size={15} /> Eliminar bloque</button></>}
  </div></div>;
}
