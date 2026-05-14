export type RecordingProvider = 'komodo' | 'loom';

export type ParsedRecording = {
  provider: RecordingProvider;
  id: string;
  shareUrl: string;
  embedUrl: string;
};

const KOMODO_HOSTS = new Set(['komododecks.com', 'www.komododecks.com']);
const LOOM_HOSTS = new Set(['loom.com', 'www.loom.com']);

export function parseRecordingUrl(rawUrl: string): ParsedRecording | null {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return null;
  }

  if (KOMODO_HOSTS.has(url.hostname)) {
    const match = url.pathname.match(/\/recordings\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      const id = match[1];
      return {
        provider: 'komodo',
        id,
        shareUrl: `https://komododecks.com/recordings/${id}`,
        embedUrl: `https://komododecks.com/embed/${id}`,
      };
    }
  }

  if (LOOM_HOSTS.has(url.hostname)) {
    const match = url.pathname.match(/\/share\/([a-zA-Z0-9]+)/) ?? url.pathname.match(/\/embed\/([a-zA-Z0-9]+)/);
    if (match && match[1]) {
      const id = match[1];
      return {
        provider: 'loom',
        id,
        shareUrl: `https://www.loom.com/share/${id}`,
        embedUrl: `https://www.loom.com/embed/${id}`,
      };
    }
  }

  return null;
}
