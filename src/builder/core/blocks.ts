import { newId } from './ids';

/**
 * Placeholder image data URI — a simple gray rectangle with a camera icon.
 * Used as default src for image elements so users see a visual placeholder
 * instead of a blank space, and can click to replace with their own image.
 */
export const IMAGE_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%2327272a' width='400' height='300'/%3E%3Crect x='1' y='1' width='398' height='298' rx='8' fill='none' stroke='%233f3f46' stroke-width='2' stroke-dasharray='8 4'/%3E%3Cpath d='M160 120 L200 80 L240 120 L280 120 L280 200 L120 200 L120 120 Z' fill='%233f3f46'/%3E%3Ccircle cx='170' cy='155' r='15' fill='%2352525b'/%3E%3Cpath d='M120 200 L180 150 L220 180 L260 140 L280 160 L280 200 Z' fill='%2352525b'/%3E%3Ctext x='200' y='240' text-anchor='middle' font-family='system-ui,sans-serif' font-size='13' fill='%2371717a'%3EClick para agregar imagen%3C/text%3E%3C/svg%3E";

export type BlockType =
  | 'contact'
  | 'container'
  | 'section'
  | 'navbar'
  | 'footer'
  | 'text'
  | 'image'
  | 'button'
  | 'list';

export interface BaseBlock<TConfig = unknown> {
  id: string;
  type: BlockType;
  enabled: boolean;
  desktopVisible?: boolean;
  mobileVisible?: boolean;
  config: TConfig;
  /** Mobile overrides for style/layout properties. Content stays desktop-only. */
  mobile?: BlockMobileOverride;
  /**
   * Navbar/footer only: when true, this page's chrome is independent and is
   * neither overwritten by nor propagated to the site-wide synced navbar/footer.
   * Undefined/false = synced globally across all pages.
   */
  detached?: boolean;
}

export interface MatchListBlockConfig {
  title: string;
  hideTitle?: boolean;
  source: 'team' | 'tournament';
  teamId?: string;
  tournamentId?: string;
  status?: 'all' | 'programado' | 'en_vivo' | 'finalizado';
  limit: number;
  showResults: boolean;
  scrollDirection: 'vertical' | 'horizontal';
  /** Layout format: 'table' (rows) or 'cards' (grid). */
  format?: 'table' | 'cards';
  /** Which columns to show. */
  visibleColumns?: {
    date?: boolean;
    teams?: boolean;
    score?: boolean;
    venue?: boolean;
  };
  /** Custom colors per team (team name → hex color). */
  teamColors?: Record<string, string>;
  // Style fields
  backgroundColor?: string;
  textColor?: string;
  cardBg?: string;
  cardOpacity?: number;
  cardRadius?: number;
  borderColor?: string;
  borderWidth?: number;
  cardPadding?: number;
  cardShadow?: 'none' | 'sm' | 'md' | 'lg';
  /** Fixed card width in px for all cards. */
  uniformCardWidth?: number;
  // List style
  listSpacing?: number;
  listBorderColor?: string;
  listBorderWidth?: number;
  listItemPadding?: number;
  listItemBg?: string;
  // Container
  containerMaxWidth?: number;
  containerPadding?: number;
  containerBg?: string;
  containerBgOpacity?: number;
  containerBorder?: string;
  containerBorderWidth?: number;
  containerRadius?: number;
  containerAlign?: 'start' | 'center' | 'end';
  // Grid fields (used by cards format)
  /** Grid columns for card format (2-6). */
  columns?: number;
  /** Mobile grid columns for card format (1-3). */
  columnsMobile?: number;
  /** Grid gap in px for card format. */
  gap?: number;
  /** Cross-axis alignment for incomplete rows. */
  crossAxisAlign?: 'start' | 'center' | 'end';
}

/**
 * Partido destacado: el módulo de "matchday" de los sitios de clubes. Muestra el
 * próximo partido con cuenta regresiva, el que se está jugando o, si no hay
 * ninguno programado, el último resultado.
 */
export interface NextMatchBlockConfig {
  title: string;
  hideTitle?: boolean;
  source: 'team' | 'tournament';
  teamId?: string;
  tournamentId?: string;
  /** `auto`: en vivo → próximo → último resultado. */
  mode?: 'auto' | 'next' | 'last';
  /** `card`: tarjeta con fondo. `banner`: sin caja, tipografía grande, para ir sobre una foto. */
  variant?: 'card' | 'banner';
  showCountdown?: boolean;
  showTournament?: boolean;
  showVenue?: boolean;
  ctaLabel?: string;
  ctaUrl?: string;
  // Style fields
  textColor?: string;
  accentColor?: string;
  cardBg?: string;
  cardOpacity?: number;
  cardRadius?: number;
  borderColor?: string;
  borderWidth?: number;
  cardPadding?: number;
  cardShadow?: 'none' | 'sm' | 'md' | 'lg';
  // Container
  containerMaxWidth?: number;
  containerPadding?: number;
  containerBg?: string;
  containerBgOpacity?: number;
  containerBorder?: string;
  containerBorderWidth?: number;
  containerRadius?: number;
  containerAlign?: 'start' | 'center' | 'end';
}

export interface StandingsBlockConfig {
  title: string;
  hideTitle?: boolean;
  tournamentId: string;
  showGroupFilter: boolean;
  showSetDifference: boolean;
  /** Which columns to show in the standings table. */
  visibleColumns?: {
    position?: boolean;
    team?: boolean;
    played?: boolean;
    won?: boolean;
    lost?: boolean;
    setsWon?: boolean;
    setsLost?: boolean;
    setDifference?: boolean;
    points?: boolean;
  };
  /** Background color for top-N positions (first 3). */
  highlightColor?: string;
  /** Filas máximas por grupo (vacío o 0 = todas). Para una tabla resumida en la portada. */
  limit?: number;
  // Style fields
  backgroundColor?: string;
  backgroundOpacity?: number;
  textColor?: string;
  headerBg?: string;
  cardBg?: string;
  cardRadius?: number;
  borderColor?: string;
  borderWidth?: number;
  cardPadding?: number;
  cardShadow?: 'none' | 'sm' | 'md' | 'lg';
  /** Fixed card width in px for all cards. */
  uniformCardWidth?: number;
  // List style
  listSpacing?: number;
  listBorderColor?: string;
  listBorderWidth?: number;
  listItemPadding?: number;
  listItemBg?: string;
  // Container
  containerMaxWidth?: number;
  containerPadding?: number;
  containerBg?: string;
  containerBgOpacity?: number;
  containerBorder?: string;
  containerBorderWidth?: number;
  containerRadius?: number;
  containerAlign?: 'start' | 'center' | 'end';
  // Grid fields (used by cards variant)
  columns?: number;
  columnsMobile?: number;
  gap?: number;
  crossAxisAlign?: 'start' | 'center' | 'end';
}

export interface RosterBlockConfig {
  title: string;
  hideTitle?: boolean;
  teamId: string;
  showRoles: boolean;
  showNumbers: boolean;
  /** Cantidad inicial a mostrar; el resto se revela con "Cargar más...". */
  limit?: number;
  /** Layout: 'grid' (cards) or 'list' (rows). */
  layout?: 'grid' | 'list';
  /** Which fields to show. */
  visibleFields?: {
    name?: boolean;
    number?: boolean;
    position?: boolean;
    role?: boolean;
    photo?: boolean;
  };
  // Style fields
  backgroundColor?: string;
  backgroundOpacity?: number;
  textColor?: string;
  cardBg?: string;
  cardRadius?: number;
  borderColor?: string;
  borderWidth?: number;
  cardPadding?: number;
  cardShadow?: 'none' | 'sm' | 'md' | 'lg';
  /** Fixed card width in px for all cards. */
  uniformCardWidth?: number;
  // List style
  listSpacing?: number;
  listBorderColor?: string;
  listBorderWidth?: number;
  listItemPadding?: number;
  listItemBg?: string;
  // Container
  containerMaxWidth?: number;
  containerPadding?: number;
  containerBg?: string;
  containerBgOpacity?: number;
  containerBorder?: string;
  containerBorderWidth?: number;
  containerRadius?: number;
  containerAlign?: 'start' | 'center' | 'end';
  // Grid fields (used by cards variant)
  columns?: number;
  columnsMobile?: number;
  gap?: number;
  crossAxisAlign?: 'start' | 'center' | 'end';
}

export interface TournamentHistoryBlockConfig {
  title: string;
  hideTitle?: boolean;
  teamId?: string;
  asociacionId?: string;
  limit: number;
  showResults: boolean;
  /** Format: 'timeline', 'table', or 'cards'. */
  format?: 'timeline' | 'table' | 'cards';
  /** Color for 1st place results. */
  goldColor?: string;
  /** Color for 2nd place results. */
  silverColor?: string;
  // Style fields
  backgroundColor?: string;
  backgroundOpacity?: number;
  textColor?: string;
  cardRadius?: number;
  borderColor?: string;
  borderWidth?: number;
  cardPadding?: number;
  cardShadow?: 'none' | 'sm' | 'md' | 'lg';
  /** Fixed card width in px for all cards. */
  uniformCardWidth?: number;
  cardBg?: string;
  // List style
  listSpacing?: number;
  listBorderColor?: string;
  listBorderWidth?: number;
  listItemPadding?: number;
  listItemBg?: string;
  // Timeline style
  timelineLineWidth?: number;
  timelineDotSize?: number;
  // Container
  containerMaxWidth?: number;
  containerPadding?: number;
  containerBg?: string;
  containerBgOpacity?: number;
  containerBorder?: string;
  containerBorderWidth?: number;
  containerRadius?: number;
  containerAlign?: 'start' | 'center' | 'end';
  // Grid fields (used by cards/timeline variant)
  columns?: number;
  columnsMobile?: number;
  gap?: number;
  crossAxisAlign?: 'start' | 'center' | 'end';
}

export interface TournamentTeamsBlockConfig {
  title: string;
  hideTitle?: boolean;
  /** Tournament whose teams are listed. If empty, shows an empty state. */
  tournamentId?: string;
  /** Layout: 'grid' (responsive cards), 'list' (rows), or 'cards' (logo+info). */
  layout: 'grid' | 'list' | 'cards';
  /** Group teams by `torneo_equipos.grupo` column. */
  showGroup: boolean;
  showLogo: boolean;
  showSiglas: boolean;
  showLocation: boolean;
  /** Max teams to show. 0 = no limit. */
  limit: number;
  // Style fields
  backgroundColor?: string;
  backgroundOpacity?: number;
  textColor?: string;
  cardRadius?: number;
  borderColor?: string;
  borderWidth?: number;
  cardPadding?: number;
  cardShadow?: 'none' | 'sm' | 'md' | 'lg';
  cardBg?: string;
  /** Fixed card width in px for all cards. */
  uniformCardWidth?: number;
  // List style
  listSpacing?: number;
  listBorderColor?: string;
  listBorderWidth?: number;
  listItemPadding?: number;
  listItemBg?: string;
  // Container
  containerMaxWidth?: number;
  containerPadding?: number;
  containerBg?: string;
  containerBgOpacity?: number;
  containerBorder?: string;
  containerBorderWidth?: number;
  containerRadius?: number;
  containerAlign?: 'start' | 'center' | 'end';
  // Grid fields (used by cards variant)
  columns?: number;
  columnsMobile?: number;
  gap?: number;
  crossAxisAlign?: 'start' | 'center' | 'end';
}

export interface ContactBlockConfig {
  title: string;
  email?: string;
  phone?: string;
  instagram?: string;
  web?: string;
  showForm: boolean;
  elements: BlockElement[];
  backgroundColor?: string;
  backgroundType?: 'solid' | 'gradient';
  gradientAngle?: number;
  gradientColor?: string;
  textColor?: string;
  buttonColor?: string;
}

export type ContactBlock = BaseBlock<ContactBlockConfig> & { type: 'contact' };

export type ContainerPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';
export type ContainerMaxWidth = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type ContainerBackground = 'transparent' | 'subtle' | 'card' | 'primary' | 'custom';
export type ContainerAlign = 'left' | 'center' | 'right';
export type ContainerLayout = 'stack' | 'free';
export type ContainerAspect = 'auto' | 'square' | '4:3' | '16:9' | '21:9';

export type SectionElementType =
  | 'text'
  | 'image'
  | 'button'
  | 'box'
  | 'grid'
  | 'icon'
  | 'list'
  | 'gallery'
  | 'video'
  | 'match-list'
  | 'match-list-compact'
  | 'next-match'
  | 'standings'
  | 'standings-cards'
  | 'roster'
  | 'roster-cards'
  | 'tournament-history'
  | 'tournament-timeline'
  | 'tournament-teams'
  | 'news'
  | 'coachpro-inscripcion'
  | 'coachpro-pago'
  | 'coachpro-cobro-link';

export interface NewsBlockConfig {
  title: string;
  hideTitle?: boolean;
  limit: number;
  /** `grid`: tarjetas iguales. `featured`: la primera en grande y el resto en columna. `list`: filas con miniatura. */
  layout?: 'grid' | 'featured' | 'list';
  /** Muestra la bajada bajo el título. */
  showSummary?: boolean;
  // Style fields
  backgroundColor?: string;
  backgroundOpacity?: number;
  textColor?: string;
  cardBg?: string;
  cardRadius?: number;
  borderColor?: string;
  borderWidth?: number;
  cardPadding?: number;
  cardShadow?: 'none' | 'sm' | 'md' | 'lg';
  cardOpacity?: number;
  uniformCardWidth?: number;
  // Container
  containerMaxWidth?: number;
  containerPadding?: number;
  containerBg?: string;
  containerBgOpacity?: number;
  containerBorder?: string;
  containerBorderWidth?: number;
  containerRadius?: number;
  containerAlign?: 'start' | 'center' | 'end';
  // Grid fields
  columns?: number;
  columnsMobile?: number;
  gap?: number;
  crossAxisAlign?: 'start' | 'center' | 'end';
}

/** CTA que enlaza al formulario público /inscripcion/{panelSlug} de un panel CoachPro. */
/**
 * Modo de presentación de los bloques CoachPro.
 * - `inline`: el formulario vive DENTRO del sitio del club, con su paleta. Es el
 *   modo por defecto de los bloques nuevos.
 * - `link`: solo un botón que manda a la página de plataforma. Es lo único que
 *   existía antes, así que las configs guardadas sin `mode` se leen como `link`
 *   para no cambiarle el sitio a nadie.
 */
export type CoachproBlockMode = 'inline' | 'link';

/** Campos opcionales del formulario público de inscripción. El nombre siempre va. */
export interface CoachproInscripcionFields {
  rut?: boolean;
  fechaNacimiento?: boolean;
  genero?: boolean;
  categoria?: boolean;
  telefono?: boolean;
  emailAlumno?: boolean;
  nombreApoderado?: boolean;
  telefonoApoderado?: boolean;
  emailApoderado?: boolean;
  direccion?: boolean;
}

export interface CoachproInscripcionBlockConfig {
  /** Slug del panel CoachPro (inmutable) — arma el href /inscripcion/{slug}. */
  panelSlug: string;
  /** Nombre del panel, cacheado solo para mostrarlo en el inspector. */
  panelLabel?: string;
  mode?: CoachproBlockMode;
  /** Encabezado del formulario inline. */
  title?: string;
  subtitle?: string;
  /** Muestra la mensualidad publicada por el club. */
  showArancel?: boolean;
  /** Muestra logo y descripción pública del panel dentro del bloque. */
  showPanelIdentity?: boolean;
  /** Qué campos pide el formulario inline. */
  fields?: CoachproInscripcionFields;
  /** Texto de la pantalla de éxito. */
  successText?: string;
  /** Aviso cuando el club tiene las inscripciones cerradas. */
  closedText?: string;
  buttonText: string;
  openInNewTab?: boolean;
  variant: ButtonVariant;
  size: ButtonSize;
  align: ContainerAlign;
  fill?: boolean;
  backgroundColor?: string;
  textColor?: string;
  /** Paleta del formulario inline (independiente del botón). */
  surfaceColor?: string;
  surfaceOpacity?: number;
  bodyTextColor?: string;
  accentColor?: string;
  borderColor?: string;
  width?: number;
  height?: number;
  borderRadius?: number;
  opacity?: number;
}

/**
 * Estado de cuenta del deportista dentro del sitio del club.
 *
 * En modo `inline` el apoderado escribe RUT + fecha de nacimiento y ve su deuda
 * sin salir del sitio (misma server action e idéntico límite de intentos que
 * /pagar/{slug}). En modo `link` es el CTA de siempre.
 */
export interface CoachproPagoBlockConfig {
  /** Slug del panel CoachPro (inmutable) — arma el href /pagar/{slug}. */
  panelSlug: string;
  /** Nombre del panel, cacheado solo para mostrarlo en el inspector. */
  panelLabel?: string;
  mode?: CoachproBlockMode;
  title?: string;
  subtitle?: string;
  /** @deprecated El bloque ya no tiene input de RUT; la identificación vive en /pagar. */
  placeholder?: string;
  buttonText: string;
  /** Datos de transferencia del club bajo el detalle de la deuda. */
  showBankDetails?: boolean;
  /** Permite subir el comprobante desde el propio sitio. */
  showUploader?: boolean;
  /** Muestra logo y descripción pública del panel dentro del bloque. */
  showPanelIdentity?: boolean;
  backgroundColor?: string;
  /** Opacidad del fondo del bloque (0-1), para apoyarlo sobre una foto. */
  backgroundOpacity?: number;
  textColor?: string;
  /** Color del botón y de las cifras destacadas. */
  accentColor?: string;
  borderColor?: string;
  cardRadius?: number;
}

/**
 * Link de cobro (rifa, inscripción a torneo, cuota extra) dentro del sitio.
 *
 * En modo `inline` el bloque muestra título, monto, imagen, cupos y el
 * formulario del link; al enviarlo se sigue a `/c/{publicId}/pago/{pagoId}`,
 * que es donde vive la subida del comprobante (el `pagoId` es la capability y
 * solo lo conoce quien completó el formulario).
 */
export interface CoachproCobroLinkBlockConfig {
  /** publicId del link de cobro (inmutable) — arma el href /c/{publicId}. */
  publicId: string;
  /** Título del link de cobro, cacheado solo para mostrarlo en el inspector. */
  linkLabel?: string;
  mode?: CoachproBlockMode;
  /** Encabezado propio; vacío = usa el título del link de cobro. */
  title?: string;
  subtitle?: string;
  /** Muestra la imagen de portada del link. */
  showImage?: boolean;
  /** Muestra la descripción del link. */
  showDescription?: boolean;
  /** Muestra "quedan N de M". */
  showCupo?: boolean;
  /** Datos de transferencia del club bajo el formulario. */
  showBankDetails?: boolean;
  /** Muestra logo y nombre del club dentro del bloque. */
  showPanelIdentity?: boolean;
  /** Aviso cuando el link está cerrado o agotado. */
  closedText?: string;
  /** Paleta del formulario inline (independiente del botón). */
  surfaceColor?: string;
  surfaceOpacity?: number;
  bodyTextColor?: string;
  accentColor?: string;
  borderColor?: string;
  buttonText: string;
  openInNewTab?: boolean;
  variant: ButtonVariant;
  size: ButtonSize;
  align: ContainerAlign;
  fill?: boolean;
  backgroundColor?: string;
  textColor?: string;
  width?: number;
  height?: number;
  borderRadius?: number;
  opacity?: number;
}

export interface BoxBlockConfig {
  /** Background color (hex, e.g. #ea580c) — alpha comes from backgroundOpacity */
  backgroundColor: string;
  /** Background alpha 0-1 (1 = solid) */
  backgroundOpacity: number;
  /** Border radius in % (0-50) */
  borderRadius: number;
  /** Border color (hex). If empty, no border. */
  borderColor: string;
  /** Border width in px */
  borderWidth: number;
  /** Border alpha 0-1 */
  borderOpacity: number;
  /** Box shadow */
  shadow: 'none' | 'sm' | 'md' | 'lg';
}

/** Grid child element: arranges its sub-children in a responsive CSS grid. */
export interface GridChildConfig {
  columnsDesktop: GridColumns;
  columnsMobile: GridMobileColumns;
  gap: GridGap;
  backgroundColor: string;
  borderRadius: number;
  /** Sub-children of the grid child. */
  children: SectionElement[];
}

/** List element — ordered or unordered with customizable markers and styling. */
export interface ListBlockConfig {
  /** 'ul' = unordered, 'ol' = ordered */
  type: 'ul' | 'ol';
  /** List items. */
  items: string[];
  /** Marker style. */
  marker: 'disc' | 'circle' | 'square' | 'decimal' | 'decimal-leading-zero'
        | 'lower-roman' | 'upper-roman' | 'lower-alpha' | 'upper-alpha'
        | 'none' | 'custom';
  /** Custom marker character (e.g. '→', '★'). Only used when marker === 'custom'. */
  customMarker?: string;
  /** Marker color (hex). */
  markerColor: string;
  /** Text color (hex). */
  textColor: string;
  /** Marker font size in px. */
  markerSize: number;
  /** Item text size in px. */
  itemSize: number;
  /** Item font weight. */
  itemWeight: 'normal' | 'medium' | 'semibold' | 'bold';
  /** Line height multiplier. */
  lineHeight: number;
  /** Spacing between items in px. */
  itemSpacing: number;
  /** Show divider line between items. */
  showDivider: boolean;
  /** Divider color (hex). */
  dividerColor: string;
  /** Text alignment. */
  align: 'left' | 'center' | 'right';
  /** Font family. */
  fontFamily?: string;
  /** Italic text. */
  italic?: boolean;
}

/** Single image inside a gallery/carousel/mosaic. */
export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
}

/** Photo gallery element — supports grid, carousel, and mosaic layouts. */
export interface GalleryChildConfig {
  /** Visual variant. */
  variant: 'gallery' | 'carousel' | 'mosaic';
  /** Image collection. */
  images: GalleryImage[];
  /** Grid columns (gallery + mosaic). */
  columns: 2 | 3 | 4;
  /** Spacing between images. */
  gap: 'none' | 'sm' | 'md' | 'lg';
  /** Aspect ratio for each image (gallery + carousel). */
  aspectRatio: 'square' | '4:3' | '16:9' | '21:9' | 'original';
  /** Border radius for each image. */
  rounded: 'none' | 'sm' | 'md' | 'lg' | 'full';
  /** Show caption below each image. */
  showCaptions: boolean;
  /** Click on image opens a fullscreen lightbox. */
  clickToEnlarge: boolean;
  /** Auto-advance the carousel (carousel variant only). */
  autoplay?: boolean;
}

/** YouTube video embed element. Single video per element. */
export interface VideoChildConfig {
  /**
   * De dónde sale el video.
   * - `youtube`: se incrusta el reproductor de YouTube (lo único que existía).
   * - `file`: archivo propio (mp4/webm) subido a la biblioteca del sitio y
   *   servido con la etiqueta `<video>` nativa, sin terceros ni cookies.
   */
  source?: 'youtube' | 'file';
  /** YouTube video URL or 11-char video ID, o URL del archivo cuando source='file'. */
  url: string;
  /** Imagen de portada del archivo propio (`poster`). */
  posterUrl?: string;
  /** Solo para `file`: arranca solo (obliga a mudo, como exigen los navegadores). */
  autoplay?: boolean;
  /** Solo para `file`: repite en bucle. */
  loop?: boolean;
  /** Solo para `file`: parte sin audio. */
  muted?: boolean;
  /** Solo para `file`: muestra los controles nativos. */
  controls?: boolean;
  /** Aspect ratio of the embedded iframe. */
  aspectRatio: '16:9' | '4:3' | '1:1' | '9:16';
  /** Start time in seconds (0 = start at beginning). */
  startTime: number;
  /** Caption shown below the iframe. */
  caption: string;
  /** Border radius of the iframe. */
  rounded: 'none' | 'sm' | 'md' | 'lg';
  /** Use privacy-enhanced mode (youtube-nocookie.com). */
  privacyEnhanced: boolean;
}

export interface SectionElementConfigMap {
  text: TextBlockConfig;
  image: ImageBlockConfig;
  button: ButtonBlockConfig;
  box: BoxBlockConfig;
  grid: GridChildConfig;
  icon: IconBlockConfig;
  list: ListBlockConfig;
  gallery: GalleryChildConfig;
  video: VideoChildConfig;
  'match-list': MatchListBlockConfig;
  'match-list-compact': MatchListBlockConfig;
  'next-match': NextMatchBlockConfig;
  standings: StandingsBlockConfig;
  'standings-cards': StandingsBlockConfig;
  roster: RosterBlockConfig;
  'roster-cards': RosterBlockConfig;
  'tournament-history': TournamentHistoryBlockConfig;
  'tournament-timeline': TournamentHistoryBlockConfig;
  'tournament-teams': TournamentTeamsBlockConfig;
  'news': NewsBlockConfig;
  'coachpro-inscripcion': CoachproInscripcionBlockConfig;
  'coachpro-pago': CoachproPagoBlockConfig;
  'coachpro-cobro-link': CoachproCobroLinkBlockConfig;
}

/** Simple icon element — Lucide icon + optional label. */
export interface IconBlockConfig {
  /** Lucide icon name (e.g. 'Trophy', 'Users', 'Star'). */
  name: string;
  /** Icon size in px. */
  size: number;
  /** Icon stroke color. */
  color: string;
  /** Stroke width. */
  strokeWidth?: number;
  /** Optional label rendered next to the icon. */
  label?: string;
  /** Alignment of icon+label inside the element box. */
  align?: 'left' | 'center' | 'right';
  /** Layout: icon stacked above label, or inline. */
  layout?: 'inline' | 'stacked';
}

export type MobileOverride = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  visible?: boolean;
  // Text overrides — solo propiedades que mobileTextCSS puede emitir en el
  // sitio público (size/tag no tienen equivalente CSS; se comparten).
  fontSize?: number;
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  align?: TextAlign;
  textAlignVertical?: 'top' | 'middle' | 'bottom';
  lineHeight?: number;
  fontFamily?: string;
  color?: TextColor;
  customColor?: string;
  // List overrides
  itemSize?: number;
  itemSpacing?: number;
  markerSize?: number;
};

/** Mobile overrides for block-level config (style/layout only, not content). */
export type BlockMobileOverride = {
  visible?: boolean;
  // Spacing
  paddingY?: ContainerPadding;
  paddingX?: ContainerPadding;
  // Typography (navbar/footer/section text)
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  // Colors
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  // Sizing
  height?: number;
  // Layout
  maxWidth?: ContainerMaxWidth;
  align?: ContainerAlign;
  columns?: number;
  gap?: number;
};

export type SectionElement<T extends SectionElementType = SectionElementType> = {
  id: string;
  type: T;
  x: number;
  y: number;
  width: number;
  height: number;
  visible: boolean;
  zIndex: number;
  locked?: boolean;
  groupId?: string;
  groupName?: string;
  config: SectionElementConfigMap[T];
  /** Mobile override — position + text properties when editor device is 'mobile' */
  mobile?: MobileOverride;
};

export type AnySectionElement = SectionElement<SectionElementType>;

// BlockElement is the unified element type used by every section.
export type BlockElement<T extends SectionElementType = SectionElementType> = SectionElement<T>;
export type AnyBlockElement = AnySectionElement;

/** @deprecated Use SectionElement */
export type ContainerChild<T extends SectionElementType = SectionElementType> = SectionElement<T>;
/** @deprecated Use SectionElementType */
export type ContainerChildType = SectionElementType;
/** @deprecated Use SectionElementConfigMap */
export type ContainerChildConfigMap = SectionElementConfigMap;
/** @deprecated Use AnySectionElement */
export type AnyContainerChild = AnySectionElement;

/** Get the effective position/size of an element for the given device mode. */
export function getSectionElements(block: AnyBlock): BlockElement[] | null {
  if (block.type === 'container') return (block.config as { children?: BlockElement[] }).children || [];
  if (block.type === 'contact') return (block.config as { elements?: BlockElement[] }).elements || [];
  if (block.type === 'section') return (block.config as { elements?: BlockElement[] }).elements || [];
  if (block.type === 'navbar') {
    return null;
  }
  if (block.type === 'footer') {
    return null;
  }
  return null;
}

/**
 * Devuelve los hijos directos de un elemento, o null si el tipo no es un
 * contenedor. Única definición de "qué elemento tiene hijos" — hoy solo `grid`
 * (config.children). Usar este accessor en vez de leer `config.children` a mano
 * para que la traversal del árbol tenga una sola fuente de verdad.
 */
export function getElementChildren(el: BlockElement): BlockElement[] | null {
  if (el.type === 'grid') {
    const children = (el.config as { children?: BlockElement[] }).children;
    return Array.isArray(children) ? children : [];
  }
  return null;
}

/**
 * Recorre recursivamente (pre-orden) una lista de elementos, incluyendo los
 * hijos de grids. Lo usan el loader (para cargar data de data-blocks anidados),
 * el refresh del editor y cualquier consumidor que necesite "todos los
 * elementos del árbol".
 */
export function flattenElements(elements: BlockElement[]): BlockElement[] {
  const out: BlockElement[] = [];
  for (const el of elements) {
    out.push(el);
    const children = getElementChildren(el);
    if (children && children.length > 0) {
      out.push(...flattenElements(children));
    }
  }
  return out;
}

/**
 * Compute the axis-aligned bounding box (in % units, center-model) that
 * wraps every element in the list. Returns null if the list is empty.
 *
 * The result uses the same center-model as positioning: x/y = center of
 * the box; width/height = the box's total size in % of the canvas.
 */
export function getBoundingBoxForElements(
  elements: BlockElement[],
  device: 'desktop' | 'mobile' = 'desktop'
): { x: number; y: number; width: number; height: number } | null {
  if (elements.length === 0) return null;
  let minLeft = Infinity;
  let minTop = Infinity;
  let maxRight = -Infinity;
  let maxBottom = -Infinity;
  for (const el of elements) {
    const pos = getElementPosition(el, device);
    const left = pos.x - pos.width / 2;
    const right = pos.x + pos.width / 2;
    const top = pos.y - pos.height / 2;
    const bottom = pos.y + pos.height / 2;
    if (left < minLeft) minLeft = left;
    if (right > maxRight) maxRight = right;
    if (top < minTop) minTop = top;
    if (bottom > maxBottom) maxBottom = bottom;
  }
  const width = maxRight - minLeft;
  const height = maxBottom - minTop;
  return { x: minLeft + width / 2, y: minTop + height / 2, width, height };
}

export function getElementPosition(
  el: BlockElement,
  device: 'desktop' | 'mobile'
): { x: number; y: number; width: number; height: number; visible: boolean } {
  if (device === 'mobile' && el.mobile) {
    return {
      x: el.mobile.x ?? el.x,
      y: el.mobile.y ?? el.y,
      width: el.mobile.width ?? el.width,
      height: el.mobile.height ?? el.height,
      visible: el.mobile.visible ?? el.visible,
    };
  }
  return { x: el.x, y: el.y, width: el.width, height: el.height, visible: el.visible };
}

/** Get the effective text config of an element for the given device mode. */
export function getTextConfig(
  el: BlockElement,
  device: 'desktop' | 'mobile'
): TextBlockConfig {
  const cfg = el.config as TextBlockConfig;
  if (device === 'mobile' && el.mobile) {
    return {
      text: cfg.text,
      tag: cfg.tag,
      size: cfg.size,
      align: el.mobile.align ?? cfg.align,
      color: el.mobile.color ?? cfg.color,
      customColor: el.mobile.customColor ?? cfg.customColor,
      weight: el.mobile.weight ?? cfg.weight,
      italic: cfg.italic,
      underline: cfg.underline,
      fontFamily: el.mobile.fontFamily ?? cfg.fontFamily,
      fontSize: el.mobile.fontSize ?? cfg.fontSize,
      lineHeight: el.mobile.lineHeight ?? cfg.lineHeight,
      textAlignVertical: el.mobile.textAlignVertical ?? cfg.textAlignVertical,
    };
  }
  return cfg;
}

/**
 * Normaliza un override móvil de elemento: quita las claves undefined y
 * devuelve undefined si no queda ninguna, para que "sin overrides" vuelva a
 * ser `mobile: undefined` (el indicador del editor y generateMobileCSS tratan
 * `{}` como override activo).
 */
export function cleanMobileOverride(m: MobileOverride | undefined): MobileOverride | undefined {
  if (!m) return undefined;
  const entries = Object.entries(m).filter(([, v]) => v !== undefined);
  if (entries.length === 0) return undefined;
  return Object.fromEntries(entries) as MobileOverride;
}

/**
 * True when a text element should let its box grow with the content (the saved
 * height becomes a minimum) instead of clipping. Único punto de verdad
 * compartido por el wrapper del canvas (SectionElementWrapper) y el CSS móvil
 * (generateMobileCSS) para que coincidan. Solo se excluye `autoFit`, que de
 * forma intencional mantiene la caja fija y encoge la fuente. Los textos con
 * alineación vertical middle/bottom también crecen: el componente usa flex con
 * justify-center/justify-end sobre el min-height, así centran cuando sobra
 * espacio y crecen sin cortar cuando la fuente no cabe.
 */
export function isAutoHeightTextElement(el: BlockElement): boolean {
  if (el.type !== 'text') return false;
  return (el.config as TextBlockConfig).autoFit !== true;
}

export interface ContainerBlockConfig {
  paddingY: ContainerPadding;
  paddingX: ContainerPadding;
  /** 'color' = use background palette; 'image' = use backgroundImage (overrides color) */
  backgroundType?: 'color' | 'image';
  background: ContainerBackground;
  customBackground?: string;
  /** URL of the background image (only used when backgroundType === 'image') */
  backgroundImage?: string;
  /** Dark overlay opacity 0-1 applied on top of the image for legibility */
  backgroundOverlay?: number;
  maxWidth: ContainerMaxWidth;
  align: ContainerAlign;
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  /** Display name shown in the sidebar block list (optional). */
  name?: string;
  /** When true, the canvas fills the viewport (100vh). Falls back to minHeight. */
  fullscreen?: boolean;
  // Free-positioning (Figma-like canvas)
  layout?: ContainerLayout;
  aspectRatio?: ContainerAspect;
  minHeight?: number;
  snapToGrid?: boolean;
  gridSize?: number;
  children?: SectionElement[];
  // Custom background styling (gradient)
  solidBackgroundColor?: string;
  gradientColor1?: string;
  gradientColor2?: string;
  gradientAngle?: number;
}

export type TextTag = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
export type TextSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
export type TextAlign = 'left' | 'center' | 'right';
export type TextColor = 'default' | 'primary' | 'muted' | 'custom' | 'gradient';

export interface TextBlockConfig {
  text: string;
  tag: TextTag;
  size: TextSize;
  align: TextAlign;
  textAlignVertical?: 'top' | 'middle' | 'bottom';
  color: TextColor;
  customColor?: string;
  gradientFrom?: string;
  gradientVia?: string;
  gradientTo?: string;
  gradientAngle?: number;
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  italic?: boolean;
  underline?: boolean;
  fontFamily?: string;
  fontSize?: number;
  lineHeight?: number;
  letterSpacing?: number;
  opacity?: number;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  boxShadow?: 'none' | 'sm' | 'md' | 'lg';
  /** Optional URL — makes this text element act as a clickable link. */
  linkUrl?: string;
  /** Open link in a new tab. Only used when linkUrl is set. */
  linkOpenInNewTab?: boolean;
  /** When true, font size is reduced (via binary search) so text never overflows its box. */
  autoFit?: boolean;
}

export type ImageAspect = 'original' | 'square' | '4:3' | '16:9' | '21:9';
export type ImageFit = 'cover' | 'contain';
export type ImageRounded = 'none' | 'sm' | 'md' | 'lg' | 'full';

export interface ImageBlockConfig {
  src: string;
  alt: string;
  aspectRatio: ImageAspect;
  objectFit: ImageFit;
  rounded: ImageRounded;
  maxWidth: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  opacity?: number;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  boxShadow?: 'none' | 'sm' | 'md' | 'lg';
}

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonBlockConfig {
  text: string;
  url: string;
  variant: ButtonVariant;
  size: ButtonSize;
  align: ContainerAlign;
  openInNewTab: boolean;
  /** Fill the full height of the element container */
  fill?: boolean;
  // Custom styling
  backgroundColor?: string;
  textColor?: string;
  width?: number;
  height?: number;
  borderRadius?: number;
  opacity?: number;
}

export type ContainerBlock = BaseBlock<ContainerBlockConfig> & { type: 'container' };

export type SectionTemplate =
  | 'blank'
  | 'hero-sport'
  | 'stats-row'
  | 'cobros-club'
  | 'galeria-temporada'
  | 'sponsors'
  | 'testimonios'
  | 'cta-inscripcion'
  | 'feature-split'
  | 'video-destacado'
  | 'faq'
  | 'ubicacion'
  | 'historia-club';

export interface SectionBlockConfig {
  template: SectionTemplate;
  paddingY: ContainerPadding;
  paddingX: ContainerPadding;
  backgroundType?: 'color' | 'image';
  background: ContainerBackground;
  customBackground?: string;
  backgroundImage?: string;
  backgroundOverlay?: number;
  maxWidth: ContainerMaxWidth;
  align: ContainerAlign;
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  name?: string;
  height?: number; // vh, decimal allowed (e.g. 50, 75.5, 100)
  layout?: ContainerLayout;
  snapToGrid?: boolean;
  gridSize?: number;
  elements: BlockElement[];
  // Custom background styling (gradient)
  solidBackgroundColor?: string;
  gradientColor1?: string;
  gradientColor2?: string;
  gradientAngle?: number;
}

export type SectionBlock = BaseBlock<SectionBlockConfig> & { type: 'section' };

/** Column count options for grid elements. */
export type GridColumns = 1 | 2 | 3 | 4 | 6;
export type GridMobileColumns = 1 | 2;
export type GridGap = 'none' | 'sm' | 'md' | 'lg';

/** Navbar block: top-level header with editable links, colors and optional logo. */
export interface NavbarLink {
  id: string;
  label: string;
  url: string;
  openInNewTab?: boolean;
  icon?: string;
  /** Optional children for dropdown submenu. */
  children?: NavbarLink[];
  // ── Per-link styling overrides (optional, falls back to global) ──
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  letterSpacing?: string;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
}

export type NavbarVariant =
  | 'classic' // logo left, links right, hamburger mobile
  | 'centered' // logo center, links row below
  | 'minimal' // single row, no logo, links only
  | 'transparent' // overlay over hero, transparent bg
  | 'with-cta'; // logo left, links, CTA button right

export type LogoPosition = 'left' | 'center' | 'right';
export type LinkHoverStyle = 'opacity' | 'underline' | 'background';

export interface NavbarBlockConfig {
  /** Visual variant. */
  variant: NavbarVariant;
  /** If true, the navbar is rendered as a sticky top bar with backdrop blur. */
  sticky: boolean;
  /** Backdrop blur effect (only when sticky=true and background is semi-transparent). */
  blur: boolean;
  /** If true, automatically append a link to the home page of the site. */
  showHome: boolean;
  /** Site name displayed next to the logo (or instead of it). */
  siteName: string;
  /** Optional override for the logo URL. Falls back to the website's logo. */
  logoUrl?: string;
  /** Where the logo sits within the bar. */
  logoPosition: LogoPosition;
  backgroundType?: 'solid' | 'gradient';
  backgroundColor: string;
  gradientColor1?: string;
  gradientColor2?: string;
  gradientAngle?: number;
  textColor: string;
  accentColor: string;
  /** Border separator at the bottom of the navbar. */
  borderBottom: boolean;
  /** Hover effect on link taps. */
  linkHover: LinkHoverStyle;
  /** CTA button on the right (for 'with-cta' variant or any variant). */
  cta: {
    enabled: boolean;
    label: string;
    url: string;
    openInNewTab: boolean;
    backgroundColor: string;
    textColor: string;
  };
  /** Social icons shown on the right (for 'with-cta' or 'classic'). */
  social: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    youtube?: string;
    tiktok?: string;
  };
  links: NavbarLink[];
  /** Element-based link representation for layers panel + per-link styling. */
  elements?: BlockElement[];

  // ── Global link typography defaults ──
  linkFontFamily?: string;
  linkFontSize?: string;
  linkFontWeight?: string;
  linkLetterSpacing?: string;
  linkTextTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  /** Gap between links (CSS value). */
  linkGap?: string;
  linkPaddingX?: string;
  linkPaddingY?: string;
  linkBorderRadius?: string;

  // ── Dropdown styling ──
  dropdownBg?: string;
  dropdownTextColor?: string;
  dropdownBorderRadius?: string;
  dropdownShadow?: 'none' | 'sm' | 'md' | 'lg';
  dropdownMinWidth?: string;
  dropdownAnimationMs?: number;

  // ── Mobile menu styling ──
  mobileMenuAnimationMs?: number;
  mobileMenuBg?: string;
  /** Horizontal alignment of links in the mobile dropdown menu. */
  mobileMenuAlign?: 'left' | 'center' | 'right';
}

export type NavbarBlock = BaseBlock<NavbarBlockConfig> & { type: 'navbar' };

/** Footer block: bottom section with description, link columns, social URLs. */
export interface FooterLink {
  id: string;
  label: string;
  url: string;
  openInNewTab?: boolean;
  /** Optional per-link icon (lucide icon name). */
  icon?: string;
  // ── Per-link styling overrides ──
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  letterSpacing?: string;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
}

export interface FooterColumn {
  id: string;
  title: string;
  links: FooterLink[];
  // ── Per-column title styling ──
  titleFontFamily?: string;
  titleFontSize?: string;
  titleFontWeight?: string;
  titleColor?: string;
  titleTextTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  /** Column width (CSS value). */
  width?: string;
}

export type FooterVariant =
  | 'classic' // 3 columns: about | links | contact
  | 'centered' // logo + socials top, links row below
  | 'simple' // single column: copyright + legal
  | 'socials'; // full-width, social icons large

export interface FooterBlockConfig {
  /** Visual variant. */
  variant: FooterVariant;
  siteName: string;
  description: string;
  copyright: string;
  backgroundType?: 'solid' | 'gradient';
  backgroundColor: string;
  gradientColor1?: string;
  gradientColor2?: string;
  gradientAngle?: number;
  textColor: string;
  accentColor: string;
  /** Border separator at the top of the footer. */
  borderTop: boolean;
  /** Vertical padding scale. */
  padding: 'compact' | 'normal' | 'spacious';
  /** Width of inner content container. */
  maxWidth: 'standard' | 'wide' | 'full';
  /** How to align the inner content (centered or left). */
  align: 'left' | 'center';
  columns: FooterColumn[];
  /** Element-based column/link representation for layers panel + per-link styling. */
  elements?: BlockElement[];
  social: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    youtube?: string;
    tiktok?: string;
  };
  // Logo
  logoUrl?: string;
  logoSize?: 'sm' | 'md' | 'lg';

  // ── Global link typography defaults ──
  linkFontFamily?: string;
  linkFontSize?: string;
  linkFontWeight?: string;
  linkLetterSpacing?: string;
  linkTextTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  linkGap?: string;

  // ── Column title defaults ──
  titleFontFamily?: string;
  titleFontSize?: string;
  titleFontWeight?: string;
  titleColor?: string;
  titleTextTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';

  // ── Column gap ──
  columnGap?: string;
}

export type FooterBlock = BaseBlock<FooterBlockConfig> & { type: 'footer' };

export type TextBlock = BaseBlock<TextBlockConfig> & { type: 'text' };
export type ImageBlock = BaseBlock<ImageBlockConfig> & { type: 'image' };
export type ButtonBlock = BaseBlock<ButtonBlockConfig> & { type: 'button' };
export type ListBlock = BaseBlock<ListBlockConfig> & { type: 'list' };

export type AnyBlock =
  | ContactBlock
  | ContainerBlock
  | SectionBlock
  | NavbarBlock
  | FooterBlock
  | TextBlock
  | ImageBlock
  | ButtonBlock
  | ListBlock;

/** Data block type aliases — used only as section children, NOT as top-level blocks. */
export interface MatchListBlock { id: string; type: 'match-list'; enabled: boolean; config: MatchListBlockConfig }
export interface MatchListCompactBlock { id: string; type: 'match-list-compact'; enabled: boolean; config: MatchListBlockConfig }
export interface StandingsBlock { id: string; type: 'standings'; enabled: boolean; config: StandingsBlockConfig }
export interface StandingsCardsBlock { id: string; type: 'standings-cards'; enabled: boolean; config: StandingsBlockConfig }
export interface RosterBlock { id: string; type: 'roster'; enabled: boolean; config: RosterBlockConfig }
export interface RosterCardsBlock { id: string; type: 'roster-cards'; enabled: boolean; config: RosterBlockConfig }
export interface TournamentHistoryBlock { id: string; type: 'tournament-history'; enabled: boolean; config: TournamentHistoryBlockConfig }
export interface TournamentTimelineBlock { id: string; type: 'tournament-timeline'; enabled: boolean; config: TournamentHistoryBlockConfig }
export interface TournamentTeamsBlock { id: string; type: 'tournament-teams'; enabled: boolean; config: TournamentTeamsBlockConfig }

export interface DesignTokens {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
    /** Color del thumb de las scrollbars del sitio. Opcional: los tokens ya
     * guardados no lo traen — sin valor se mantiene el estilo global actual. */
    scrollbar?: string;
  };
  typography: {
    fontFamily: string;
    headingFont: string;
  };
  layout: {
    maxWidth: string;
    borderRadius: string;
  };
}

export const DEFAULT_DESIGN_TOKENS: DesignTokens = {
  colors: {
    primary: '#ea580c',
    secondary: '#18181b',
    background: '#09090b',
    text: '#fafafa',
    accent: '#f59e0b',
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    headingFont: 'Inter, system-ui, sans-serif',
  },
  layout: {
    maxWidth: '1200px',
    borderRadius: '0.75rem',
  },
};

export const BLOCK_CATALOG: Array<{
  type: BlockType;
  label: string;
  description: string;
  icon: string;
  unique: boolean;
  planRequired: 'free' | 'paid';
  defaultConfig: Omit<AnyBlock, 'id' | 'enabled'>;
}> = [
  {
    type: 'contact',
    label: 'Contacto',
    description: 'Información de contacto y redes sociales',
    icon: 'Mail',
    unique: true,
    planRequired: 'paid',
    defaultConfig: {
      type: 'contact',
      config: {
        title: 'Contáctanos',
        showForm: false,
        elements: [],
      },
    } as Omit<ContactBlock, 'id' | 'enabled'>,
  },
  {
    type: 'section',
    label: 'Sección',
    description: 'Sección versátil con layout libre o apilado',
    icon: 'LayoutTemplate',
    unique: false,
    planRequired: 'free',
    defaultConfig: {
      type: 'section',
      config: {
        template: 'blank',
        paddingY: 'lg',
        paddingX: 'md',
        backgroundType: 'color',
        background: 'transparent',
        maxWidth: 'lg',
        align: 'center',
        borderRadius: 'none',
        height: 75,
        layout: 'free',
        snapToGrid: false,
        gridSize: 5,
        elements: [],
      },
    } as Omit<SectionBlock, 'id' | 'enabled'>,
  },
  {
    type: 'navbar',
    label: 'Barra de navegación',
    description: 'Header con links, logo y colores personalizables',
    icon: 'Menu',
    unique: true,
    planRequired: 'free',
    defaultConfig: {
      type: 'navbar',
      config: {
        variant: 'classic',
        sticky: true,
        blur: true,
        showHome: true,
        siteName: 'Mi sitio',
        logoUrl: '',
        logoPosition: 'left',
        backgroundColor: '#09090b',
        textColor: '#fafafa',
        accentColor: '#ea580c',
        borderBottom: true,
        linkHover: 'opacity',
        cta: {
          enabled: false,
          label: 'Únete',
          url: '#',
          openInNewTab: false,
          backgroundColor: '#ea580c',
          textColor: '#ffffff',
        },
        social: {
          instagram: '',
          facebook: '',
          twitter: '',
          youtube: '',
          tiktok: '',
        },
        links: [],
      },
    } as Omit<NavbarBlock, 'id' | 'enabled'>,
  },
  {
    type: 'footer',
    label: 'Pie de página',
    description: 'Footer con descripción, links y redes sociales',
    icon: 'PanelBottom',
    unique: true,
    planRequired: 'free',
    defaultConfig: {
      type: 'footer',
      config: {
        variant: 'classic',
        siteName: 'Mi sitio',
        description: 'Descripción breve de tu equipo o proyecto.',
        copyright: '© 2024 Mi sitio. Todos los derechos reservados.',
        backgroundColor: '#09090b',
        textColor: '#fafafa',
        accentColor: '#ea580c',
        borderTop: true,
        padding: 'normal',
        maxWidth: 'standard',
        align: 'left',
        columns: [
          {
            id: 'links',
            title: 'Enlaces',
            links: [
              { id: 'home', label: 'Inicio', url: '/', openInNewTab: false },
              { id: 'contacto', label: 'Contacto', url: '#contacto', openInNewTab: false },
            ],
          },
        ],
        social: {
          instagram: '',
          facebook: '',
          twitter: '',
          youtube: '',
          tiktok: '',
        },
      },
    } as Omit<FooterBlock, 'id' | 'enabled'>,
  },
];

/**
 * Crea un bloque top-level a partir del catálogo, con un id nuevo y una copia
 * profunda del config por defecto (para que dos bloques del mismo tipo no
 * compartan la misma referencia de config/elements). Única fuente de verdad
 * para "agregar un bloque" — usada por el editor.
 */
export function createBlock(type: BlockType): AnyBlock | null {
  const catalog = BLOCK_CATALOG.find((b) => b.type === type);
  if (!catalog) return null;
  return {
    id: newId(type),
    enabled: true,
    ...structuredClone(catalog.defaultConfig),
  } as AnyBlock;
}

// Section templates - each template pre-populates elements[] and optional
// SectionBlockConfig overrides that are applied before user-editable defaults.
export const SECTION_TEMPLATES: Record<
  SectionTemplate,
  {
    label: string;
    description: string;
    elements: Omit<BlockElement, 'id'>[];
    config?: Partial<Omit<SectionBlockConfig, 'elements' | 'template'>>;
  }
> = {
  blank: {
    label: 'En blanco',
    description: 'Sección vacía para agregar elementos desde cero',
    elements: [],
  },

  'hero-sport': {
    label: 'Hero deportivo',
    description: 'Hero de pantalla completa con título, bajada y botón de llamada a acción',
    config: {
      height: 100,
      backgroundType: 'color',
      background: 'custom',
      solidBackgroundColor: '#111118',
      paddingY: 'none',
      paddingX: 'none',
    },
    elements: [
      {
        type: 'text',
        x: 50, y: 38, width: 78, height: 18,
        visible: true, zIndex: 2,
        config: {
          text: 'NOMBRE DEL CLUB',
          tag: 'h1',
          size: 'xl',
          align: 'center',
          color: 'custom',
          customColor: '#ffffff',
          weight: 'bold',
          fontSize: 64,
        } as TextBlockConfig,
      },
      {
        type: 'text',
        x: 50, y: 56, width: 60, height: 12,
        visible: true, zIndex: 2,
        config: {
          text: 'Tu equipo. Tu pasión.',
          tag: 'p',
          size: 'xl',
          align: 'center',
          color: 'custom',
          customColor: '#a1a1aa',
        } as TextBlockConfig,
      },
      {
        type: 'button',
        x: 50, y: 73, width: 24, height: 9,
        visible: true, zIndex: 2,
        config: {
          text: 'Ver partidos',
          url: '#partidos',
          variant: 'primary',
          size: 'lg',
          align: 'center',
          openInNewTab: false,
          fill: true,
          backgroundColor: '#ea580c',
          textColor: '#ffffff',
          borderRadius: 6,
        } as ButtonBlockConfig,
      },
    ],
  },

  'stats-row': {
    label: 'Fila de estadísticas',
    description: 'Tres estadísticas numéricas destacadas sobre fondo oscuro',
    config: {
      height: 40,
      backgroundType: 'color',
      background: 'custom',
      solidBackgroundColor: '#18181b',
      paddingY: 'none',
      paddingX: 'none',
    },
    elements: [
      // Stat 1: número + label
      {
        type: 'text',
        x: 20, y: 38, width: 28, height: 20,
        visible: true, zIndex: 2,
        config: {
          text: '128',
          tag: 'h2',
          size: '2xl',
          align: 'center',
          color: 'primary',
          weight: 'bold',
          fontSize: 48,
        } as TextBlockConfig,
      },
      {
        type: 'text',
        x: 20, y: 62, width: 28, height: 12,
        visible: true, zIndex: 2,
        config: {
          text: 'Partidos',
          tag: 'p',
          size: 'lg',
          align: 'center',
          color: 'custom',
          customColor: '#a1a1aa',
        } as TextBlockConfig,
      },
      // Stat 2
      {
        type: 'text',
        x: 50, y: 38, width: 28, height: 20,
        visible: true, zIndex: 2,
        config: {
          text: '24',
          tag: 'h2',
          size: '2xl',
          align: 'center',
          color: 'primary',
          weight: 'bold',
          fontSize: 48,
        } as TextBlockConfig,
      },
      {
        type: 'text',
        x: 50, y: 62, width: 28, height: 12,
        visible: true, zIndex: 2,
        config: {
          text: 'Títulos',
          tag: 'p',
          size: 'lg',
          align: 'center',
          color: 'custom',
          customColor: '#a1a1aa',
        } as TextBlockConfig,
      },
      // Stat 3
      {
        type: 'text',
        x: 80, y: 38, width: 28, height: 20,
        visible: true, zIndex: 2,
        config: {
          text: '156',
          tag: 'h2',
          size: '2xl',
          align: 'center',
          color: 'primary',
          weight: 'bold',
          fontSize: 48,
        } as TextBlockConfig,
      },
      {
        type: 'text',
        x: 80, y: 62, width: 28, height: 12,
        visible: true, zIndex: 2,
        config: {
          text: 'Jugadores',
          tag: 'p',
          size: 'lg',
          align: 'center',
          color: 'custom',
          customColor: '#a1a1aa',
        } as TextBlockConfig,
      },
    ],
  },

  'cobros-club': {
    label: 'Cobros del club',
    description: 'Consulta de cobros por RUT conectada a tu panel CoachPro',
    config: {
      height: 55,
      backgroundType: 'color',
      background: 'custom',
      gradientColor1: '#09090b',
      gradientColor2: '#1f1209',
      gradientAngle: 180,
      paddingY: 'none',
      paddingX: 'none',
    },
    elements: [
      {
        type: 'text',
        x: 50, y: 24, width: 72, height: 14,
        visible: true, zIndex: 2,
        config: {
          text: 'Consulta tus cobros',
          tag: 'h2',
          size: 'xl',
          align: 'center',
          color: 'custom',
          customColor: '#ffffff',
          weight: 'bold',
          fontSize: 44,
        } as TextBlockConfig,
        mobile: { y: 19, width: 92, fontSize: 28 },
      },
      {
        type: 'text',
        x: 50, y: 38, width: 54, height: 10,
        visible: true, zIndex: 2,
        config: {
          text: 'Ingresa tu RUT y revisa al instante tus mensualidades y cobros pendientes.',
          tag: 'p',
          size: 'lg',
          align: 'center',
          color: 'custom',
          customColor: '#a1a1aa',
          fontSize: 17,
        } as TextBlockConfig,
        mobile: { y: 33, width: 86, fontSize: 14 },
      },
      {
        type: 'coachpro-pago',
        x: 50, y: 60, width: 40, height: 20,
        visible: true, zIndex: 2,
        config: {
          panelSlug: '',
          title: '',
          placeholder: 'Ej: 12.345.678-9',
          buttonText: 'Ver estado de cuenta',
          backgroundColor: '#18181b',
          textColor: '#fafafa',
          cardRadius: 14,
        } as CoachproPagoBlockConfig,
        mobile: { y: 59, width: 92, height: 24 },
      },
      {
        type: 'text',
        x: 50, y: 77, width: 60, height: 6,
        visible: true, zIndex: 2,
        config: {
          text: 'Pago en línea seguro · Tu comprobante queda registrado en el club',
          tag: 'p',
          size: 'sm',
          align: 'center',
          color: 'custom',
          customColor: '#71717a',
          fontSize: 13,
        } as TextBlockConfig,
        mobile: { y: 82, width: 90, fontSize: 12 },
      },
    ],
  },

  'galeria-temporada': {
    label: 'Galería de temporada',
    description: 'Título editorial + galería de fotos con lightbox',
    config: {
      height: 85,
      backgroundType: 'color',
      background: 'custom',
      solidBackgroundColor: '#0b0b0e',
      paddingY: 'none',
      paddingX: 'none',
    },
    elements: [
      {
        type: 'text',
        x: 50, y: 8, width: 40, height: 5,
        visible: true, zIndex: 2,
        config: {
          text: 'EN IMÁGENES',
          tag: 'span',
          size: 'sm',
          align: 'center',
          color: 'custom',
          customColor: '#a1a1aa',
          weight: 'medium',
          fontSize: 13,
        } as TextBlockConfig,
      },
      {
        type: 'text',
        x: 50, y: 16, width: 70, height: 10,
        visible: true, zIndex: 2,
        config: {
          text: 'La temporada',
          tag: 'h2',
          size: '2xl',
          align: 'center',
          color: 'custom',
          customColor: '#ffffff',
          weight: 'bold',
          fontSize: 48,
        } as TextBlockConfig,
        mobile: { fontSize: 30, width: 90 },
      },
      {
        type: 'gallery',
        x: 50, y: 60, width: 90, height: 66,
        visible: true, zIndex: 2,
        config: {
          variant: 'gallery',
          images: [
            { id: 'g1', src: '', alt: 'Foto 1' },
            { id: 'g2', src: '', alt: 'Foto 2' },
            { id: 'g3', src: '', alt: 'Foto 3' },
            { id: 'g4', src: '', alt: 'Foto 4' },
            { id: 'g5', src: '', alt: 'Foto 5' },
            { id: 'g6', src: '', alt: 'Foto 6' },
          ],
          columns: 3,
          gap: 'md',
          aspectRatio: '4:3',
          rounded: 'md',
          showCaptions: false,
          clickToEnlarge: true,
          autoplay: false,
        } as GalleryChildConfig,
      },
    ],
  },

  sponsors: {
    label: 'Auspiciadores',
    description: 'Logos de sponsors en fila sobre fondo neutro',
    config: {
      height: 45,
      backgroundType: 'color',
      background: 'custom',
      solidBackgroundColor: '#0d0d10',
      paddingY: 'none',
      paddingX: 'none',
    },
    elements: [
      {
        type: 'text',
        x: 50, y: 14, width: 40, height: 8,
        visible: true, zIndex: 2,
        config: {
          text: 'NOS APOYAN',
          tag: 'span',
          size: 'sm',
          align: 'center',
          color: 'custom',
          customColor: '#a1a1aa',
          weight: 'medium',
          fontSize: 13,
        } as TextBlockConfig,
      },
      {
        type: 'text',
        x: 50, y: 28, width: 60, height: 14,
        visible: true, zIndex: 2,
        config: {
          text: 'Auspiciadores',
          tag: 'h2',
          size: 'xl',
          align: 'center',
          color: 'custom',
          customColor: '#ffffff',
          weight: 'bold',
          fontSize: 34,
        } as TextBlockConfig,
        mobile: { fontSize: 24 },
      },
      ...[20, 40, 60, 80].map((x, i) => ({
        type: 'image' as const,
        x, y: 64, width: 14, height: 26,
        visible: true, zIndex: 2,
        config: {
          src: IMAGE_PLACEHOLDER,
          alt: `Sponsor ${i + 1}`,
          aspectRatio: 'square',
          objectFit: 'contain',
          rounded: 'md',
          maxWidth: 'full',
        } as ImageBlockConfig,
        mobile: { x: i % 2 === 0 ? 28 : 72, y: i < 2 ? 55 : 80, width: 34, height: 18 },
      })),
    ],
  },

  testimonios: {
    label: 'Testimonio',
    description: 'Cita destacada con foto, nombre y rol',
    config: {
      height: 55,
      backgroundType: 'color',
      background: 'custom',
      solidBackgroundColor: '#111114',
      paddingY: 'none',
      paddingX: 'none',
    },
    elements: [
      {
        type: 'text',
        x: 50, y: 32, width: 72, height: 28,
        visible: true, zIndex: 2,
        config: {
          text: '“El club es nuestra segunda familia. Los niños esperan cada entrenamiento con ganas.”',
          tag: 'p',
          size: 'xl',
          align: 'center',
          color: 'custom',
          customColor: '#fafafa',
          italic: true,
          fontSize: 26,
          lineHeight: 1.4,
        } as TextBlockConfig,
        mobile: { fontSize: 18, width: 90 },
      },
      {
        type: 'image',
        x: 50, y: 62, width: 6, height: 14,
        visible: true, zIndex: 2,
        config: {
          src: IMAGE_PLACEHOLDER,
          alt: 'Foto',
          aspectRatio: 'square',
          objectFit: 'cover',
          rounded: 'full',
          maxWidth: 'full',
        } as ImageBlockConfig,
        mobile: { width: 14, height: 10 },
      },
      {
        type: 'text',
        x: 50, y: 76, width: 40, height: 6,
        visible: true, zIndex: 2,
        config: {
          text: 'María Fernández',
          tag: 'p',
          size: 'md',
          align: 'center',
          color: 'custom',
          customColor: '#ffffff',
          weight: 'semibold',
          fontSize: 15,
        } as TextBlockConfig,
      },
      {
        type: 'text',
        x: 50, y: 84, width: 40, height: 5,
        visible: true, zIndex: 2,
        config: {
          text: 'Apoderada · Categoría Sub-14',
          tag: 'span',
          size: 'sm',
          align: 'center',
          color: 'custom',
          customColor: '#71717a',
          fontSize: 12,
        } as TextBlockConfig,
      },
    ],
  },

  'cta-inscripcion': {
    label: 'Llamado a inscripción',
    description: 'Banda de conversión con título grande y botón',
    config: {
      height: 45,
      backgroundType: 'color',
      background: 'custom',
      gradientColor1: '#1f1209',
      gradientColor2: '#09090b',
      gradientAngle: 135,
      paddingY: 'none',
      paddingX: 'none',
    },
    elements: [
      {
        type: 'text',
        x: 50, y: 30, width: 80, height: 16,
        visible: true, zIndex: 2,
        config: {
          text: '¿Listo para sumarte al equipo?',
          tag: 'h2',
          size: '2xl',
          align: 'center',
          color: 'custom',
          customColor: '#ffffff',
          weight: 'bold',
          fontSize: 40,
        } as TextBlockConfig,
        mobile: { fontSize: 26, width: 92 },
      },
      {
        type: 'text',
        x: 50, y: 48, width: 60, height: 10,
        visible: true, zIndex: 2,
        config: {
          text: 'Entrenamientos para todas las categorías. Ven a probar una clase sin compromiso.',
          tag: 'p',
          size: 'lg',
          align: 'center',
          color: 'custom',
          customColor: '#a1a1aa',
          fontSize: 16,
        } as TextBlockConfig,
        mobile: { width: 88, fontSize: 14 },
      },
      {
        type: 'button',
        x: 50, y: 70, width: 26, height: 12,
        visible: true, zIndex: 2,
        config: {
          text: 'Inscríbete ahora',
          url: '/contacto',
          variant: 'primary',
          size: 'lg',
          align: 'center',
          openInNewTab: false,
          fill: true,
          backgroundColor: '#ea580c',
          textColor: '#ffffff',
          borderRadius: 8,
        } as ButtonBlockConfig,
        mobile: { width: 60 },
      },
    ],
  },

  'feature-split': {
    label: 'Foto + texto',
    description: 'Imagen a un lado, título y texto al otro',
    config: {
      height: 75,
      backgroundType: 'color',
      background: 'custom',
      solidBackgroundColor: '#0b0b0e',
      paddingY: 'none',
      paddingX: 'none',
    },
    elements: [
      {
        type: 'image',
        x: 27, y: 50, width: 42, height: 72,
        visible: true, zIndex: 1,
        config: {
          src: IMAGE_PLACEHOLDER,
          alt: 'Foto del club',
          aspectRatio: '4:3',
          objectFit: 'cover',
          rounded: 'lg',
          maxWidth: 'full',
        } as ImageBlockConfig,
        mobile: { x: 50, y: 24, width: 90, height: 36 },
      },
      {
        type: 'text',
        x: 73, y: 22, width: 42, height: 5,
        visible: true, zIndex: 2,
        config: {
          text: 'NUESTRO CLUB',
          tag: 'span',
          size: 'sm',
          align: 'left',
          color: 'primary',
          weight: 'medium',
          fontSize: 13,
        } as TextBlockConfig,
        mobile: { x: 50, y: 48, width: 90 },
      },
      {
        type: 'text',
        x: 73, y: 33, width: 42, height: 12,
        visible: true, zIndex: 2,
        config: {
          text: 'Más que un equipo',
          tag: 'h2',
          size: '2xl',
          align: 'left',
          color: 'custom',
          customColor: '#ffffff',
          weight: 'bold',
          fontSize: 38,
        } as TextBlockConfig,
        mobile: { x: 50, y: 57, width: 90, fontSize: 26 },
      },
      {
        type: 'text',
        x: 73, y: 52, width: 42, height: 20,
        visible: true, zIndex: 2,
        config: {
          text: 'Formamos deportistas y personas. Entrenamos con seriedad, competimos con garra y celebramos cada logro como familia.',
          tag: 'p',
          size: 'md',
          align: 'left',
          color: 'custom',
          customColor: '#a1a1aa',
          fontSize: 16,
          lineHeight: 1.6,
        } as TextBlockConfig,
        mobile: { x: 50, y: 73, width: 90, fontSize: 14 },
      },
      {
        type: 'button',
        x: 62, y: 72, width: 20, height: 9,
        visible: true, zIndex: 2,
        config: {
          text: 'Conócenos',
          url: '#',
          variant: 'outline',
          size: 'md',
          align: 'left',
          openInNewTab: false,
          borderRadius: 8,
        } as ButtonBlockConfig,
        mobile: { x: 50, y: 90, width: 50 },
      },
    ],
  },

  'video-destacado': {
    label: 'Video destacado',
    description: 'Título + video de YouTube en 16:9',
    config: {
      height: 80,
      backgroundType: 'color',
      background: 'custom',
      solidBackgroundColor: '#0b0b0e',
      paddingY: 'none',
      paddingX: 'none',
    },
    elements: [
      {
        type: 'text',
        x: 50, y: 8, width: 40, height: 5,
        visible: true, zIndex: 2,
        config: {
          text: 'ASÍ SE VIVE',
          tag: 'span',
          size: 'sm',
          align: 'center',
          color: 'custom',
          customColor: '#a1a1aa',
          weight: 'medium',
          fontSize: 13,
        } as TextBlockConfig,
      },
      {
        type: 'text',
        x: 50, y: 16, width: 70, height: 10,
        visible: true, zIndex: 2,
        config: {
          text: 'El último partido',
          tag: 'h2',
          size: '2xl',
          align: 'center',
          color: 'custom',
          customColor: '#ffffff',
          weight: 'bold',
          fontSize: 40,
        } as TextBlockConfig,
        mobile: { fontSize: 26, width: 90 },
      },
      {
        type: 'video',
        x: 50, y: 58, width: 76, height: 64,
        visible: true, zIndex: 2,
        config: {
          url: '',
          aspectRatio: '16:9',
          startTime: 0,
          caption: '',
          rounded: 'lg',
          privacyEnhanced: false,
        } as VideoChildConfig,
        mobile: { width: 94 },
      },
    ],
  },

  faq: {
    label: 'Preguntas frecuentes',
    description: 'Título + preguntas y respuestas apiladas',
    config: {
      height: 75,
      backgroundType: 'color',
      background: 'custom',
      solidBackgroundColor: '#111114',
      paddingY: 'none',
      paddingX: 'none',
    },
    elements: [
      {
        type: 'text',
        x: 50, y: 10, width: 70, height: 10,
        visible: true, zIndex: 2,
        config: {
          text: 'Preguntas frecuentes',
          tag: 'h2',
          size: 'xl',
          align: 'center',
          color: 'custom',
          customColor: '#ffffff',
          weight: 'bold',
          fontSize: 34,
        } as TextBlockConfig,
        mobile: { fontSize: 24, width: 90 },
      },
      ...[
        {
          q: '¿Desde qué edad se puede entrenar?',
          a: 'Recibimos niñas y niños desde los 8 años. Las categorías se arman por edad y nivel.',
          y: 27,
        },
        {
          q: '¿Necesito experiencia previa?',
          a: 'No. Hay grupos de iniciación donde se enseña desde cero, con entrenadores certificados.',
          y: 49,
        },
        {
          q: '¿Cuánto cuesta la mensualidad?',
          a: 'Escríbenos por el formulario de contacto y te enviamos los valores y horarios actualizados.',
          y: 71,
        },
      ].flatMap(({ q, a, y }) => [
        {
          type: 'text' as const,
          x: 50, y, width: 70, height: 7,
          visible: true, zIndex: 2,
          config: {
            text: q,
            tag: 'h3',
            size: 'lg',
            align: 'left',
            color: 'custom',
            customColor: '#ffffff',
            weight: 'semibold',
            fontSize: 18,
          } as TextBlockConfig,
          mobile: { width: 90, fontSize: 15 },
        },
        {
          type: 'text' as const,
          x: 50, y: y + 9, width: 70, height: 9,
          visible: true, zIndex: 2,
          config: {
            text: a,
            tag: 'p',
            size: 'md',
            align: 'left',
            color: 'custom',
            customColor: '#a1a1aa',
            fontSize: 14,
            lineHeight: 1.6,
          } as TextBlockConfig,
          mobile: { width: 90, fontSize: 13 },
        },
      ]),
    ],
  },

  ubicacion: {
    label: 'Ubicación y horarios',
    description: 'Dónde y cuándo entrenar, con foto del recinto',
    config: {
      height: 65,
      backgroundType: 'color',
      background: 'custom',
      solidBackgroundColor: '#0b0b0e',
      paddingY: 'none',
      paddingX: 'none',
    },
    elements: [
      {
        type: 'text',
        x: 30, y: 18, width: 40, height: 10,
        visible: true, zIndex: 2,
        config: {
          text: 'Dónde entrenamos',
          tag: 'h2',
          size: 'xl',
          align: 'left',
          color: 'custom',
          customColor: '#ffffff',
          weight: 'bold',
          fontSize: 32,
        } as TextBlockConfig,
        mobile: { x: 50, y: 8, width: 90, fontSize: 24 },
      },
      ...[
        { name: 'MapPin', label: 'Gimnasio Municipal · Av. Principal 123', y: 38 },
        { name: 'Clock', label: 'Martes y Jueves · 19:00 a 21:00', y: 50 },
        { name: 'Calendar', label: 'Sábados · 10:00 a 12:00', y: 62 },
      ].map((item, i) => ({
        type: 'icon' as const,
        x: 30, y: item.y, width: 38, height: 8,
        visible: true, zIndex: 2,
        config: {
          name: item.name,
          size: 20,
          color: '#ea580c',
          strokeWidth: 2,
          label: item.label,
          align: 'left',
          layout: 'inline',
        } as IconBlockConfig,
        mobile: { x: 50, y: 20 + i * 10, width: 90 },
      })),
      {
        type: 'button',
        x: 20, y: 79, width: 20, height: 10,
        visible: true, zIndex: 2,
        config: {
          text: 'Cómo llegar',
          url: 'https://maps.google.com',
          variant: 'outline',
          size: 'md',
          align: 'left',
          openInNewTab: true,
          borderRadius: 8,
        } as ButtonBlockConfig,
        mobile: { x: 50, y: 54, width: 55 },
      },
      {
        type: 'image',
        x: 74, y: 52, width: 40, height: 62,
        visible: true, zIndex: 1,
        config: {
          src: IMAGE_PLACEHOLDER,
          alt: 'Nuestro gimnasio',
          aspectRatio: '4:3',
          objectFit: 'cover',
          rounded: 'lg',
          maxWidth: 'full',
        } as ImageBlockConfig,
        mobile: { x: 50, y: 80, width: 90, height: 30 },
      },
    ],
  },

  'historia-club': {
    label: 'Nuestra historia',
    description: 'Relato del club con cifras que dan prestigio',
    config: {
      height: 65,
      backgroundType: 'color',
      background: 'custom',
      solidBackgroundColor: '#111114',
      paddingY: 'none',
      paddingX: 'none',
    },
    elements: [
      {
        type: 'text',
        x: 50, y: 12, width: 40, height: 5,
        visible: true, zIndex: 2,
        config: {
          text: 'DESDE 2005',
          tag: 'span',
          size: 'sm',
          align: 'center',
          color: 'primary',
          weight: 'medium',
          fontSize: 13,
        } as TextBlockConfig,
      },
      {
        type: 'text',
        x: 50, y: 23, width: 70, height: 12,
        visible: true, zIndex: 2,
        config: {
          text: 'Nuestra historia',
          tag: 'h2',
          size: '2xl',
          align: 'center',
          color: 'custom',
          customColor: '#ffffff',
          weight: 'bold',
          fontSize: 40,
        } as TextBlockConfig,
        mobile: { fontSize: 26, width: 90 },
      },
      {
        type: 'text',
        x: 50, y: 44, width: 62, height: 18,
        visible: true, zIndex: 2,
        config: {
          text: 'Partimos como un grupo de amigos en la cancha del barrio. Hoy somos un club con categorías formativas y competitivas que representa a nuestra comuna en todo el país.',
          tag: 'p',
          size: 'md',
          align: 'center',
          color: 'custom',
          customColor: '#a1a1aa',
          fontSize: 16,
          lineHeight: 1.7,
        } as TextBlockConfig,
        mobile: { width: 90, fontSize: 14 },
      },
      ...[
        { n: '20', label: 'Años de historia', x: 26 },
        { n: '12', label: 'Títulos ganados', x: 50 },
        { n: '150', label: 'Familias del club', x: 74 },
      ].flatMap(({ n, label, x }) => [
        {
          type: 'text' as const,
          x, y: 70, width: 20, height: 12,
          visible: true, zIndex: 2,
          config: {
            text: n,
            tag: 'h3',
            size: 'xl',
            align: 'center',
            color: 'primary',
            weight: 'bold',
            fontSize: 34,
          } as TextBlockConfig,
          mobile: { fontSize: 24 },
        },
        {
          type: 'text' as const,
          x, y: 84, width: 24, height: 6,
          visible: true, zIndex: 2,
          config: {
            text: label,
            tag: 'span',
            size: 'sm',
            align: 'center',
            color: 'custom',
            customColor: '#71717a',
            fontSize: 12,
          } as TextBlockConfig,
          mobile: { fontSize: 10 },
        },
      ]),
    ],
  },
};
