import { createBlock, DEFAULT_DESIGN_TOKENS, type AnyBlock, type BlockElement, type DesignTokens, type SectionBlock, type SectionElementType, type TextBlockConfig } from './core/blocks';
import { newId } from './core/ids';
import type { MediaItem, PageMeta } from './core/editor-types';

export const STORAGE_KEY = 'joel-portfolio-site-builder-v2';
const OLD_STORAGE_KEY = 'joel-portfolio-local-site-v1';

export type LocalDocument = {
  format: 'joel-local-site';
  version: 2;
  name: string;
  pages: PageMeta[];
  activePageId: string;
  blocksByPage: Record<string, AnyBlock[]>;
  tokens: DesignTokens;
  media: MediaItem[];
  updatedAt: string;
};

export type LocalElementType = Extract<SectionElementType, 'text' | 'image' | 'button' | 'box' | 'list' | 'icon'>;

export function makeElement(type: LocalElementType, x = 50, y = 50): BlockElement {
  const common = { id: newId('el'), type, x, y, width: 36, height: 12, visible: true, zIndex: 2 };
  switch (type) {
    case 'text': return { ...common, type, width: 64, height: 16, config: { text: 'Escribe tu mensaje', tag: 'h2', size: 'xl', align: 'center', color: 'custom', customColor: '#111111', weight: 'bold', fontSize: 48 } };
    case 'image': return { ...common, type, height: 34, config: { src: '', alt: 'Imagen', aspectRatio: 'original', objectFit: 'cover', rounded: 'none', maxWidth: 'full' } };
    case 'button': return { ...common, type, width: 24, height: 9, config: { text: 'Conoce más', url: '#', variant: 'primary', size: 'md', align: 'center', openInNewTab: false, fill: true, backgroundColor: '#e12118', textColor: '#ffffff', borderRadius: 4 } };
    case 'box': return { ...common, type, width: 42, height: 30, zIndex: 1, config: { backgroundColor: '#e12118', backgroundOpacity: 1, borderRadius: 0, borderColor: '', borderWidth: 0, borderOpacity: 1, shadow: 'none' } };
    case 'list': return { ...common, type, width: 46, height: 28, config: { type: 'ul', items: ['Primera idea', 'Segunda idea', 'Tercera idea'], marker: 'disc', markerColor: '#e12118', textColor: '#111111', markerSize: 18, itemSize: 22, itemWeight: 'medium', lineHeight: 1.3, itemSpacing: 12, showDivider: false, dividerColor: '#dddddd', align: 'left' } };
    case 'icon': return { ...common, type, width: 22, height: 20, config: { name: 'Sparkles', size: 42, color: '#e12118', label: '', align: 'center', layout: 'stacked' } };
  }
}

export function makeSection(name: string, background: string, height = 75, elements: BlockElement[] = []): SectionBlock {
  const section = createBlock('section') as SectionBlock;
  section.config = { ...section.config, name, height, background: 'custom', solidBackgroundColor: background, elements };
  return section;
}

export const LOCAL_TEMPLATES = [
  { id: 'blank', name: 'En blanco', description: 'Lienzo libre para empezar desde cero' },
  { id: 'hero', name: 'Presentación', description: 'Título, texto y llamada a la acción' },
  { id: 'split', name: 'Foto + texto', description: 'Historia con una imagen protagonista' },
  { id: 'quote', name: 'Testimonio', description: 'Una cita con presencia editorial' },
  { id: 'faq', name: 'Preguntas', description: 'Respuestas claras en una sección' },
] as const;

export type LocalTemplateId = typeof LOCAL_TEMPLATES[number]['id'];

export function makeTemplateSection(id: LocalTemplateId): SectionBlock {
  if (id === 'blank') return makeSection('Nueva sección', '#ffffff', 65);
  if (id === 'hero') return makeSection('Presentación', '#f6f5f1', 82, [
    makeText('TU PROYECTO, TU VOZ', 50, 22, 70, 8, 18, '#e12118'),
    makeText('Una idea que merece su propio espacio.', 50, 43, 80, 27, 68, '#111111', 'h1'),
    makeText('Cuenta aquí lo que haces de una forma directa y memorable.', 50, 65, 62, 11, 22, '#555555'),
    makeElement('button', 50, 80),
  ]);
  if (id === 'split') {
    const image = makeElement('image', 28, 50);
    image.width = 42; image.height = 72;
    return makeSection('Foto + texto', '#ffffff', 70, [
      image,
      makeText('NUESTRA HISTORIA', 72, 29, 37, 9, 18, '#e12118'),
      makeText('Detrás de cada proyecto hay personas.', 72, 49, 39, 26, 48, '#111111', 'h2'),
      makeText('Este espacio es para explicar qué te mueve y por qué importa tu trabajo.', 72, 73, 39, 18, 20, '#555555'),
    ]);
  }
  if (id === 'quote') return makeSection('Testimonio', '#111111', 55, [
    makeText('“Encontramos justo lo que necesitábamos para dar el siguiente paso.”', 50, 46, 80, 30, 46, '#ffffff', 'h2'),
    makeText('— Alguien que confía en tu trabajo', 50, 76, 70, 8, 18, '#e12118'),
  ]);
  return makeSection('Preguntas frecuentes', '#f6f5f1', 78, [
    makeText('Preguntas frecuentes', 50, 17, 80, 15, 52, '#111111', 'h2'),
    makeText('¿Cómo empezamos?', 50, 39, 72, 8, 26, '#111111', 'h2'),
    makeText('Escríbenos y conversemos sobre tu idea.', 50, 49, 72, 8, 18, '#555555'),
    makeText('¿Dónde trabajan?', 50, 64, 72, 8, 26, '#111111', 'h2'),
    makeText('Trabajamos desde cualquier lugar, cerca de cada proyecto.', 50, 74, 72, 8, 18, '#555555'),
  ]);
}

function makeText(text: string, x: number, y: number, width: number, height: number, fontSize: number, color: string, tag: 'h1' | 'h2' | 'p' = 'p'): BlockElement {
  const element = makeElement('text', x, y);
  return { ...element, width, height, config: { ...element.config, text, tag, fontSize, customColor: color, align: 'center' } } as BlockElement;
}

export function starterDocument(): LocalDocument {
  const home: PageMeta = { id: newId('page'), slug: 'home', name: 'Inicio', order: 0 };
  const navbar = createBlock('navbar')!;
  if (navbar.type === 'navbar') navbar.config = { ...navbar.config, siteName: 'ESTUDIO NORTE', backgroundColor: '#ffffff', textColor: '#111111', accentColor: '#e12118', links: [{ id: newId('link'), label: 'Nosotros', url: '#nosotros' }, { id: newId('link'), label: 'Contacto', url: '#contacto' }] };
  const hero = makeSection('Presentación', '#f6f5f1', 82, [
    makeText('IDEAS HECHAS PARA DURAR', 50, 19, 68, 7, 17, '#e12118'),
    makeText('Tu siguiente gran idea empieza aquí.', 50, 42, 82, 27, 74, '#111111', 'h1'),
    makeText('Una página propia para contar lo que haces y conectar con quienes te buscan.', 50, 64, 62, 11, 22, '#555555'),
    { ...makeElement('button', 50, 79), config: { ...(makeElement('button').config as object), text: 'Hablemos', url: 'mailto:hola@ejemplo.cl' } } as BlockElement,
  ]);
  const about = makeSection('Nosotros', '#111111', 62, [
    makeText('01 / NOSOTROS', 50, 23, 65, 8, 18, '#e12118'),
    makeText('Un espacio para contar tu historia.', 50, 45, 78, 25, 58, '#ffffff', 'h2'),
    makeText('Edita cada bloque, mueve los elementos y dale a esta página una identidad realmente tuya.', 50, 69, 70, 13, 22, '#bbbbbb'),
  ]);
  const footer = createBlock('footer')!;
  if (footer.type === 'footer') footer.config = { ...footer.config, siteName: 'ESTUDIO NORTE', description: 'Ideas con forma propia.', copyright: '© 2026 Estudio Norte', backgroundColor: '#111111', textColor: '#ffffff', accentColor: '#e12118', columns: [] };
  return {
    format: 'joel-local-site', version: 2, name: 'Estudio Norte', pages: [home], activePageId: home.id,
    blocksByPage: { [home.id]: [navbar, hero, about, footer] },
    tokens: { ...DEFAULT_DESIGN_TOKENS, colors: { primary: '#e12118', secondary: '#111111', background: '#ffffff', text: '#111111', accent: '#e12118' } },
    media: [], updatedAt: new Date().toISOString(),
  };
}

export function sanitizeDocument(input: unknown): LocalDocument {
  if (!input || typeof input !== 'object') throw new Error('Archivo JSON inválido');
  const value = input as Partial<LocalDocument>;
  if (value.format !== 'joel-local-site' || value.version !== 2 || !Array.isArray(value.pages) || !value.blocksByPage || typeof value.blocksByPage !== 'object') throw new Error('Formato de sitio no compatible');
  const pages = value.pages.filter((p): p is PageMeta => !!p && typeof p.id === 'string' && typeof p.slug === 'string' && typeof p.name === 'string').slice(0, 30);
  if (!pages.length) throw new Error('El sitio no contiene páginas');
  const blocksByPage: Record<string, AnyBlock[]> = {};
  for (const page of pages) blocksByPage[page.id] = Array.isArray(value.blocksByPage[page.id]) ? value.blocksByPage[page.id].filter((b) => b && typeof b.id === 'string' && typeof b.type === 'string').slice(0, 100) : [];
  const base = starterDocument();
  return {
    ...base,
    name: typeof value.name === 'string' ? value.name.slice(0, 80) : base.name,
    pages,
    activePageId: pages.some((p) => p.id === value.activePageId) ? value.activePageId! : pages[0].id,
    blocksByPage,
    tokens: value.tokens && typeof value.tokens === 'object' ? value.tokens : base.tokens,
    media: Array.isArray(value.media) ? value.media.filter((m): m is MediaItem => !!m && typeof m.id === 'string' && typeof m.url === 'string').slice(0, 40) : [],
    updatedAt: new Date().toISOString(),
  };
}

export function loadLocalDocument(): LocalDocument {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return sanitizeDocument(JSON.parse(raw));
    const old = localStorage.getItem(OLD_STORAGE_KEY);
    if (old) {
      const previous = JSON.parse(old) as { brand?: string; headline?: string; description?: string; accent?: string };
      const document = starterDocument();
      if (previous.brand) document.name = previous.brand;
      const navbar = document.blocksByPage[document.activePageId][0];
      if (navbar.type === 'navbar' && previous.brand) navbar.config.siteName = previous.brand;
      const section = document.blocksByPage[document.activePageId][1];
      if (section.type === 'section') {
        const elements = section.config.elements;
        if (previous.headline && elements[1]?.type === 'text') (elements[1].config as TextBlockConfig).text = previous.headline;
        if (previous.description && elements[2]?.type === 'text') (elements[2].config as TextBlockConfig).text = previous.description;
      }
      if (/^#[0-9a-f]{6}$/i.test(previous.accent || '')) document.tokens.colors.primary = previous.accent!;
      return document;
    }
  } catch { /* Recupera el ejemplo si el almacenamiento está dañado o bloqueado. */ }
  return starterDocument();
}

export function saveLocalDocument(document: LocalDocument): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...document, updatedAt: new Date().toISOString() }));
}
