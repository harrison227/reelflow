// Recognises shared links (Google Drive, Loom, Komodo, YouTube, Vimeo,
// Dropbox, Frame.io, WeTransfer, or any URL) and works out whether the
// link can be embedded inline. Embed URLs are always built from an
// extracted ID — the raw user-pasted string is never put in an iframe src.

export type LinkProvider =
  | 'gdrive-file'
  | 'gdrive-folder'
  | 'loom'
  | 'komodo'
  | 'youtube'
  | 'vimeo'
  | 'dropbox'
  | 'frameio'
  | 'wetransfer'
  | 'link';

export type ParsedLink = {
  provider: LinkProvider;
  url: string;
  embedUrl: string | null;
  label: string;
};

export function parseLink(raw: string): ParsedLink | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  let u: URL;
  try {
    u = new URL(trimmed);
  } catch {
    // Allow bare domains like "drive.google.com/file/..." — but only if the
    // input has no whitespace, otherwise the lenient URL parser waves
    // gibberish like "not a url at all" straight through.
    if (/\s/.test(trimmed)) return null;
    try {
      u = new URL(`https://${trimmed}`);
    } catch {
      return null;
    }
  }

  if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
  const host = u.hostname.replace(/^www\./, '');

  // The host must look like a real domain (label.tld). Rules out anything the
  // permissive URL parser accepted but a human would never call a link.
  if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(host)) return null;

  // ── Google Drive ──────────────────────────────────────────────
  if (host === 'drive.google.com') {
    const fileMatch = u.pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    const fileId = fileMatch?.[1];
    if (fileId) {
      return {
        provider: 'gdrive-file',
        url: trimmed,
        embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
        label: 'Google Drive · file',
      };
    }
    const folderMatch = u.pathname.match(/\/drive\/folders\/([a-zA-Z0-9_-]+)/);
    const folderId = folderMatch?.[1];
    if (folderId) {
      return {
        provider: 'gdrive-folder',
        url: trimmed,
        embedUrl: `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`,
        label: 'Google Drive · folder',
      };
    }
    const idParam = u.searchParams.get('id');
    if (idParam) {
      return {
        provider: 'gdrive-file',
        url: trimmed,
        embedUrl: `https://drive.google.com/file/d/${idParam}/preview`,
        label: 'Google Drive · file',
      };
    }
    return { provider: 'gdrive-file', url: trimmed, embedUrl: null, label: 'Google Drive' };
  }

  // ── Loom ──────────────────────────────────────────────────────
  if (host === 'loom.com') {
    const match = u.pathname.match(/\/(?:share|embed)\/([a-zA-Z0-9]+)/);
    const id = match?.[1];
    if (id) {
      return { provider: 'loom', url: trimmed, embedUrl: `https://www.loom.com/embed/${id}`, label: 'Loom recording' };
    }
    return { provider: 'loom', url: trimmed, embedUrl: null, label: 'Loom' };
  }

  // ── Komodo ────────────────────────────────────────────────────
  if (host === 'komododecks.com') {
    const match = u.pathname.match(/\/(?:recordings|embed)\/([a-zA-Z0-9_-]+)/);
    const id = match?.[1];
    if (id) {
      return {
        provider: 'komodo',
        url: trimmed,
        embedUrl: `https://komododecks.com/embed/${id}`,
        label: 'Komodo recording',
      };
    }
    return { provider: 'komodo', url: trimmed, embedUrl: null, label: 'Komodo' };
  }

  // ── YouTube ───────────────────────────────────────────────────
  if (host === 'youtube.com' || host === 'youtu.be' || host === 'm.youtube.com') {
    const id = host === 'youtu.be' ? u.pathname.slice(1) : (u.searchParams.get('v') ?? '');
    if (id) {
      return { provider: 'youtube', url: trimmed, embedUrl: `https://www.youtube.com/embed/${id}`, label: 'YouTube' };
    }
    return { provider: 'youtube', url: trimmed, embedUrl: null, label: 'YouTube' };
  }

  // ── Vimeo ─────────────────────────────────────────────────────
  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const match = u.pathname.match(/\/(?:video\/)?(\d+)/);
    const id = match?.[1];
    if (id) {
      return { provider: 'vimeo', url: trimmed, embedUrl: `https://player.vimeo.com/video/${id}`, label: 'Vimeo' };
    }
    return { provider: 'vimeo', url: trimmed, embedUrl: null, label: 'Vimeo' };
  }

  // ── Hosts that block framing — kept as link cards ─────────────
  if (host === 'dropbox.com' || host.endsWith('.dropbox.com')) {
    return { provider: 'dropbox', url: trimmed, embedUrl: null, label: 'Dropbox' };
  }
  if (host === 'frame.io' || host.endsWith('.frame.io')) {
    return { provider: 'frameio', url: trimmed, embedUrl: null, label: 'Frame.io' };
  }
  if (host === 'wetransfer.com' || host.endsWith('.wetransfer.com')) {
    return { provider: 'wetransfer', url: trimmed, embedUrl: null, label: 'WeTransfer' };
  }

  // ── Anything else ─────────────────────────────────────────────
  return { provider: 'link', url: trimmed, embedUrl: null, label: host };
}
