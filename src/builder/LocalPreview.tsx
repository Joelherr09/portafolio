import { useMemo } from 'react';
import { BuilderCanvas } from './BuilderCanvas';
import { loadLocalDocument } from './local-document';

export default function LocalPreview() {
  const document = useMemo(() => loadLocalDocument(), []);
  const requested = new URLSearchParams(window.location.search).get('page') || 'home';
  const page = document.pages.find((item) => item.slug === requested) || document.pages[0];
  const blocks = document.blocksByPage[page.id] || [];
  return <div className="lb-preview-shell"><BuilderCanvas blocks={blocks} tokens={document.tokens} device={window.innerWidth < 640 ? 'mobile' : 'desktop'} siteName={document.name} pages={document.pages} /><a className="lb-preview-back" href="/constructor/">← Volver al editor</a></div>;
}
