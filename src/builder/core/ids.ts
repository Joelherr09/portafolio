/**
 * Generador único de IDs para el site builder.
 *
 * Todos los IDs de bloques y elementos del árbol deben generarse aquí para
 * mantener un formato consistente (`${prefix}-${timestamp}-${base36}`) y evitar
 * mezclar formatos (p. ej. `crypto.randomUUID()` con `Date.now()-base36`) dentro
 * de un mismo árbol, lo que dificulta el debugging y la regeneración de IDs al
 * duplicar.
 */
export function newId(prefix = 'el'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
