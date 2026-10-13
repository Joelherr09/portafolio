import type { AnyBlock } from './blocks';
import { newId } from './ids';

/**
 * Global navbar/footer sync.
 *
 * Navbar and footer are stored per page (inside `app_pages.blocks`) but kept in
 * sync across every page of a site: editing the navbar/footer on any page
 * propagates its appearance and links to all other pages. A page can opt out by
 * marking its navbar/footer block `detached` (per-page override).
 *
 * Only `config` (which holds navbar/footer styles + links) and `mobile`
 * overrides are synced. Per-page concerns — `enabled`, `desktopVisible`,
 * `mobileVisible`, `detached`, the block id — are never overwritten, so a page
 * can still hide its chrome locally without affecting others.
 */

export const CHROME_TYPES = ['navbar', 'footer'] as const;
export type ChromeType = (typeof CHROME_TYPES)[number];

export interface CanonicalChrome {
  navbar?: AnyBlock;
  footer?: AnyBlock;
}

/** The non-detached navbar/footer of a page — the source that propagates. */
export function getSyncableChrome(blocks: AnyBlock[]): CanonicalChrome {
  return {
    navbar: blocks.find((b) => b.type === 'navbar' && b.detached !== true),
    footer: blocks.find((b) => b.type === 'footer' && b.detached !== true),
  };
}

/** Stable signature of a page's syncable chrome, to detect real edits. */
export function chromeSignature(blocks: AnyBlock[]): string {
  const { navbar, footer } = getSyncableChrome(blocks);
  return JSON.stringify([
    navbar?.config ?? null,
    navbar?.mobile ?? null,
    footer?.config ?? null,
    footer?.mobile ?? null,
  ]);
}

function chromeMatches(target: AnyBlock, canon: AnyBlock): boolean {
  return (
    JSON.stringify(target.config) === JSON.stringify(canon.config) &&
    JSON.stringify(target.mobile ?? null) === JSON.stringify(canon.mobile ?? null)
  );
}

/**
 * Apply the canonical navbar/footer onto a target page's blocks.
 *
 * - A detached target block of that type is left untouched.
 * - A non-detached target block is updated (config + mobile) in place.
 * - A page missing that block gets a clone inserted (navbar first, footer last).
 *
 * Existence is never removed — deleting a navbar/footer stays a per-page action.
 * Returns the new blocks array, or `null` when nothing changed.
 */
export function applyChromeToBlocks(
  targetBlocks: AnyBlock[],
  canonical: CanonicalChrome
): AnyBlock[] | null {
  let result = targetBlocks;
  let changed = false;

  for (const type of CHROME_TYPES) {
    const canon = canonical[type];
    if (!canon) continue;

    const idx = result.findIndex((b) => b.type === type);
    if (idx >= 0) {
      const target = result[idx];
      if (target.detached === true) continue;
      if (chromeMatches(target, canon)) continue;
      const next = result.slice();
      // target and canon are the same chrome type at runtime; the union widens
      // the config type, so re-assert AnyBlock. Clonamos config/mobile para que
      // las páginas no compartan la misma referencia de objeto en memoria.
      next[idx] = {
        ...target,
        config: structuredClone(canon.config),
        mobile: canon.mobile ? structuredClone(canon.mobile) : canon.mobile,
      } as AnyBlock;
      result = next;
      changed = true;
    } else {
      // Insertamos un clon con id propio: el block id debe ser único por página,
      // nunca reutilizar el id del bloque de origen.
      const clone = {
        ...structuredClone(canon),
        id: newId(type),
        enabled: true,
      } as AnyBlock;
      result = type === 'navbar' ? [clone, ...result] : [...result, clone];
      changed = true;
    }
  }

  return changed ? result : null;
}
