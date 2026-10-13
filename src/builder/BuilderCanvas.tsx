import { useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react';
import { ArrowUpRight, Image as ImageIcon, Sparkles, Star, Heart, Zap, MapPin, Menu } from 'lucide-react';
import { getElementPosition, getSectionElements, type AnyBlock, type BlockElement, type BoxBlockConfig, type ButtonBlockConfig, type DesignTokens, type FooterBlockConfig, type IconBlockConfig, type ImageBlockConfig, type ListBlockConfig, type NavbarBlockConfig, type SectionBlockConfig, type TextBlockConfig } from './core/blocks';

type Device = 'desktop' | 'mobile';
type CanvasProps = {
  blocks: AnyBlock[];
  tokens: DesignTokens;
  device: Device;
  siteName: string;
  selectedBlockId?: string | null;
  selectedElementId?: string | null;
  onSelectBlock?: (id: string) => void;
  onSelectElement?: (blockId: string, elementId: string) => void;
  onMoveElement?: (blockId: string, elementId: string, patch: { x?: number; y?: number; width?: number; height?: number }) => void;
  onNavigate?: (slug: string) => void;
  pages?: Array<{ slug: string; name: string }>;
};

const iconMap = { Sparkles, Star, Heart, Zap, MapPin };
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

function safeHref(value: string | undefined) {
  if (!value) return '#';
  const trimmed = value.trim();
  return /^(https?:\/\/|mailto:|tel:|#|\/(?!\/))/i.test(trimmed) ? trimmed : '#';
}

function backgroundFor(config: SectionBlockConfig, tokens: DesignTokens): CSSProperties {
  if (config.backgroundType === 'image' && config.backgroundImage) return { backgroundImage: `linear-gradient(rgba(0,0,0,${(config.backgroundOverlay ?? 0) / 100}),rgba(0,0,0,${(config.backgroundOverlay ?? 0) / 100})),url("${config.backgroundImage.replaceAll('"', '')}")`, backgroundSize: 'cover', backgroundPosition: 'center' };
  if (config.gradientColor1 && config.gradientColor2) return { background: `linear-gradient(${config.gradientAngle ?? 135}deg, ${config.gradientColor1}, ${config.gradientColor2})` };
  if (config.background === 'primary') return { background: tokens.colors.primary };
  if (config.background === 'card') return { background: tokens.colors.secondary };
  if (config.background === 'custom') return { background: config.solidBackgroundColor || config.customBackground || tokens.colors.background };
  return { background: tokens.colors.background };
}

function ElementBody({ element, device, tokens, readOnly }: { element: BlockElement; device: Device; tokens: DesignTokens; readOnly: boolean }): ReactNode {
  const mobile = device === 'mobile' ? element.mobile : undefined;
  if (element.type === 'text') {
    const config = element.config as TextBlockConfig;
    const size = mobile?.fontSize ?? config.fontSize ?? (config.tag === 'h1' ? 64 : config.tag === 'h2' ? 44 : 22);
    const fontSize = device === 'mobile' && !mobile?.fontSize ? Math.min(size, Math.max(18, size * .62)) : size;
    return <div className="sb-text" style={{ color: mobile?.customColor || config.customColor || (config.color === 'primary' ? tokens.colors.primary : tokens.colors.text), fontSize, fontWeight: mobile?.weight === 'normal' ? 400 : config.weight === 'normal' ? 400 : config.weight === 'medium' ? 500 : config.weight === 'semibold' ? 600 : 800, fontFamily: mobile?.fontFamily || config.fontFamily || (config.tag.startsWith('h') ? tokens.typography.headingFont : tokens.typography.fontFamily), textAlign: mobile?.align || config.align || 'left', lineHeight: mobile?.lineHeight || config.lineHeight || 1.06, letterSpacing: config.letterSpacing ? `${config.letterSpacing}px` : '-.03em', opacity: config.opacity ?? 1, fontStyle: config.italic ? 'italic' : 'normal', textDecoration: config.underline ? 'underline' : 'none' }}>{config.text}</div>;
  }
  if (element.type === 'image') {
    const config = element.config as ImageBlockConfig;
    return config.src ? <img className="sb-image" src={config.src} alt={config.alt || ''} style={{ objectFit: config.objectFit || 'cover', opacity: config.opacity ?? 1, borderRadius: config.borderRadius ?? (config.rounded === 'full' ? 999 : config.rounded === 'lg' ? 20 : config.rounded === 'md' ? 10 : 0) }} /> : <div className="sb-image-placeholder"><ImageIcon size={28} /><span>Agregar imagen</span></div>;
  }
  if (element.type === 'button') {
    const config = element.config as ButtonBlockConfig;
    return <a className="sb-button" href={readOnly ? safeHref(config.url) : '#'} onClick={readOnly ? undefined : (event) => event.preventDefault()} style={{ color: config.textColor || '#fff', background: config.variant === 'outline' || config.variant === 'ghost' ? 'transparent' : config.backgroundColor || tokens.colors.primary, borderColor: config.backgroundColor || tokens.colors.primary, borderRadius: config.borderRadius ?? 4, opacity: config.opacity ?? 1 }}>{config.text}<ArrowUpRight size={16} /></a>;
  }
  if (element.type === 'box') {
    const config = element.config as BoxBlockConfig;
    return <div className="sb-box" style={{ backgroundColor: config.backgroundColor, opacity: config.backgroundOpacity, borderRadius: `${config.borderRadius}%`, border: config.borderWidth ? `${config.borderWidth}px solid ${config.borderColor}` : undefined }} />;
  }
  if (element.type === 'list') {
    const config = element.config as ListBlockConfig;
    return <ul className="sb-list" style={{ color: config.textColor, fontSize: device === 'mobile' ? (element.mobile?.itemSize || Math.min(config.itemSize, 17)) : config.itemSize, textAlign: config.align, gap: config.itemSpacing }}>{config.items.map((item, index) => <li key={index}><span style={{ color: config.markerColor }}>{config.marker === 'none' ? '' : config.marker === 'custom' ? config.customMarker : '•'}</span>{item}</li>)}</ul>;
  }
  if (element.type === 'icon') {
    const config = element.config as IconBlockConfig;
    const Icon = iconMap[config.name as keyof typeof iconMap] || Sparkles;
    return <div className="sb-icon" style={{ color: config.color, flexDirection: config.layout === 'inline' ? 'row' : 'column' }}><Icon size={config.size || 42} strokeWidth={config.strokeWidth || 2} />{config.label && <span>{config.label}</span>}</div>;
  }
  return <div className="sb-unsupported">{element.type}</div>;
}

function EditableElement({ element, blockId, device, tokens, selected, onSelect, onMove }: { element: BlockElement; blockId: string; device: Device; tokens: DesignTokens; selected: boolean; onSelect?: CanvasProps['onSelectElement']; onMove?: CanvasProps['onMoveElement'] }) {
  const [drag, setDrag] = useState<{ x: number; y: number; mode: 'move' | 'resize' } | null>(null);
  const pointer = useRef<{ x: number; y: number; bounds: DOMRect; position: ReturnType<typeof getElementPosition>; mode: 'move' | 'resize' } | null>(null);
  const position = getElementPosition(element, device);
  const begin = (event: PointerEvent<HTMLDivElement | HTMLButtonElement>, mode: 'move' | 'resize') => {
    if (!onMove) return;
    event.preventDefault(); event.stopPropagation();
    onSelect?.(blockId, element.id);
    const bounds = event.currentTarget.closest('.sb-section')?.getBoundingClientRect();
    if (!bounds) return;
    pointer.current = { x: event.clientX, y: event.clientY, bounds, position, mode };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDrag({ x: 0, y: 0, mode });
  };
  const move = (event: PointerEvent<HTMLDivElement | HTMLButtonElement>) => {
    if (!pointer.current) return;
    setDrag({ x: event.clientX - pointer.current.x, y: event.clientY - pointer.current.y, mode: pointer.current.mode });
  };
  const end = (event: PointerEvent<HTMLDivElement | HTMLButtonElement>) => {
    const active = pointer.current;
    if (!active || !onMove) return;
    const dx = ((event.clientX - active.x) / active.bounds.width) * 100;
    const dy = ((event.clientY - active.y) / active.bounds.height) * 100;
    onMove(blockId, element.id, active.mode === 'resize'
      ? { width: clamp(active.position.width + dx, 5, 100), height: clamp(active.position.height + dy, 4, 100) }
      : { x: clamp(active.position.x + dx, 0, 100), y: clamp(active.position.y + dy, 0, 100) });
    pointer.current = null;
    setDrag(null);
  };
  const style: CSSProperties = { left: `${position.x}%`, top: `${position.y}%`, width: `${position.width}%`, height: `${position.height}%`, zIndex: element.zIndex || 1, transform: `translate(-50%, -50%) ${drag?.mode === 'move' ? `translate(${drag.x}px, ${drag.y}px)` : ''}`, opacity: element.visible && element.mobile?.visible !== false ? 1 : .25 };
  if (drag?.mode === 'resize') { style.width = `calc(${position.width}% + ${drag.x}px)`; style.height = `calc(${position.height}% + ${drag.y}px)`; }
  return <div className={`sb-element ${selected ? 'selected' : ''} ${onMove ? 'editable' : ''}`} data-element-id={element.id} style={style} onPointerDown={(event) => onMove && begin(event, 'move')} onPointerMove={move} onPointerUp={end} onPointerCancel={() => { pointer.current = null; setDrag(null); }} onClick={(event) => { event.stopPropagation(); onSelect?.(blockId, element.id); }}><ElementBody element={element} device={device} tokens={tokens} readOnly={!onMove} />{selected && onMove && <button className="sb-resize-handle" type="button" aria-label="Cambiar tamaño" onPointerDown={(event) => begin(event, 'resize')} onPointerMove={move} onPointerUp={end} />}</div>;
}

function RenderBlock({ block, props }: { block: AnyBlock; props: CanvasProps }) {
  const { device, tokens, onSelectBlock, onSelectElement, onMoveElement, selectedBlockId, selectedElementId, siteName, pages = [] } = props;
  if (!block.enabled || (device === 'desktop' && block.desktopVisible === false) || (device === 'mobile' && (block.mobileVisible === false || block.mobile?.visible === false))) return null;
  const selected = selectedBlockId === block.id;
  const selectBlock = () => onSelectBlock?.(block.id);
  if (block.type === 'section') {
    const config = block.config as SectionBlockConfig;
    const height = Math.max(240, (block.mobile?.height ?? config.height ?? 75) * (device === 'mobile' ? 7.4 : 7.2));
    return <section className={`sb-section sb-block ${selected ? 'selected' : ''}`} data-block-id={block.id} id={(config.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')} style={{ ...backgroundFor(config, tokens), height }} onClick={selectBlock}>{config.elements.map((element) => <EditableElement key={element.id} element={element} blockId={block.id} device={device} tokens={tokens} selected={selected && selectedElementId === element.id} onSelect={onSelectElement} onMove={onMoveElement} />)}{onSelectBlock && <span className="sb-block-label">{config.name || 'Sección'}</span>}</section>;
  }
  if (block.type === 'navbar') {
    const config = block.config as NavbarBlockConfig;
    return <nav className={`sb-navbar sb-block ${selected ? 'selected' : ''}`} data-block-id={block.id} onClick={selectBlock} style={{ color: config.textColor, background: config.backgroundColor, borderBottomColor: config.borderBottom ? config.accentColor : 'transparent' }}><strong>{config.siteName || siteName}</strong>{device === 'desktop' ? <div>{config.links.map((link) => <a key={link.id} href={safeHref(link.url)} onClick={onSelectBlock ? (event) => event.preventDefault() : undefined}>{link.label}</a>)}{pages.filter((page) => page.slug !== 'home').map((page) => <a key={page.slug} href={`?page=${encodeURIComponent(page.slug)}`} onClick={onSelectBlock ? (event) => event.preventDefault() : undefined}>{page.name}</a>)}</div> : <Menu size={22} />}</nav>;
  }
  if (block.type === 'footer') {
    const config = block.config as FooterBlockConfig;
    return <footer className={`sb-footer sb-block ${selected ? 'selected' : ''}`} data-block-id={block.id} onClick={selectBlock} style={{ color: config.textColor, background: config.backgroundColor }}><div><strong>{config.siteName || siteName}</strong><p>{config.description}</p></div><span>{config.copyright}</span></footer>;
  }
  if (block.type === 'contact') {
    const config = block.config as { title: string; email?: string; description?: string };
    return <section className={`sb-contact sb-block ${selected ? 'selected' : ''}`} data-block-id={block.id} onClick={selectBlock}><small>CONTACTO</small><h2>{config.title}</h2><p>{config.description || 'Aquí pueden encontrarte y comenzar una conversación.'}</p>{config.email && <a href={safeHref(`mailto:${config.email}`)}>Escribir correo ↗</a>}</section>;
  }
  return null;
}

export function BuilderCanvas(props: CanvasProps) {
  const styles = { '--site-primary': props.tokens.colors.primary, '--site-accent': props.tokens.colors.accent, color: props.tokens.colors.text, background: props.tokens.colors.background, fontFamily: props.tokens.typography.fontFamily } as CSSProperties;
  return <div className={`sb-site sb-device-${props.device}`} style={styles}>{props.blocks.map((block) => <RenderBlock key={block.id} block={block} props={props} />)}</div>;
}
