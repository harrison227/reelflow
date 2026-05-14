import type { CSSProperties } from 'react';

export type IconName =
  | 'search' | 'inbox' | 'kanban' | 'users' | 'cog' | 'plus' | 'check' | 'play' | 'pause'
  | 'record' | 'mic' | 'monitor' | 'video' | 'file' | 'download' | 'upload' | 'arrow-r'
  | 'chev-r' | 'chev-d' | 'x' | 'more' | 'clock' | 'calendar' | 'paperclip' | 'link'
  | 'eye' | 'send' | 'comment' | 'lightning' | 'filter' | 'logo' | 'sort' | 'globe'
  | 'bolt-line' | 'home' | 'queue' | 'cmd' | 'back' | 'at' | 'bell' | 'edit' | 'spark';

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  style?: CSSProperties;
};

export function Icon({ name, size = 16, color = 'currentColor', style = {} }: Props) {
  const stroke = { fill: 'none' as const, stroke: color, strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const fill = { fill: color };
  const wrap: CSSProperties = { width: size, height: size, display: 'inline-block', flex: 'none', ...style };

  switch (name) {
    case 'search': return <svg viewBox="0 0 16 16" style={wrap}><circle cx="7" cy="7" r="4.5" {...stroke} /><path d="M10.5 10.5L14 14" {...stroke} /></svg>;
    case 'inbox': return <svg viewBox="0 0 16 16" style={wrap}><path d="M2 9V4a1 1 0 011-1h10a1 1 0 011 1v5m-12 0v3a1 1 0 001 1h10a1 1 0 001-1V9m-12 0h3l1 2h4l1-2h3" {...stroke} /></svg>;
    case 'kanban': return <svg viewBox="0 0 16 16" style={wrap}><rect x="2" y="2.5" width="3.5" height="11" rx="0.5" {...stroke} /><rect x="6.5" y="2.5" width="3.5" height="7" rx="0.5" {...stroke} /><rect x="11" y="2.5" width="3.5" height="9" rx="0.5" {...stroke} /></svg>;
    case 'users': return <svg viewBox="0 0 16 16" style={wrap}><circle cx="8" cy="6" r="2.4" {...stroke} /><path d="M3 13.5c.6-2.4 2.7-3.5 5-3.5s4.4 1.1 5 3.5" {...stroke} /></svg>;
    case 'cog': return <svg viewBox="0 0 16 16" style={wrap}><circle cx="8" cy="8" r="2" {...stroke} /><path d="M8 1.5v1.8M8 12.7v1.8M14.5 8h-1.8M3.3 8H1.5M12.6 3.4l-1.3 1.3M4.7 11.3l-1.3 1.3M12.6 12.6l-1.3-1.3M4.7 4.7L3.4 3.4" {...stroke} /></svg>;
    case 'plus': return <svg viewBox="0 0 16 16" style={wrap}><path d="M8 3v10M3 8h10" {...stroke} /></svg>;
    case 'check': return <svg viewBox="0 0 16 16" style={wrap}><path d="M3 8.5l3 3 6.5-7" {...stroke} /></svg>;
    case 'play': return <svg viewBox="0 0 16 16" style={wrap}><path d="M4.5 3.2L12 8l-7.5 4.8z" {...stroke} /></svg>;
    case 'pause': return <svg viewBox="0 0 16 16" style={wrap}><path d="M5 3v10M11 3v10" {...stroke} /></svg>;
    case 'record': return <svg viewBox="0 0 16 16" style={wrap}><circle cx="8" cy="8" r="4" {...fill} /></svg>;
    case 'mic': return <svg viewBox="0 0 16 16" style={wrap}><rect x="6" y="2" width="4" height="8" rx="2" {...stroke} /><path d="M3.5 8c0 2.5 2 4.5 4.5 4.5S12.5 10.5 12.5 8M8 12.5V14" {...stroke} /></svg>;
    case 'monitor': return <svg viewBox="0 0 16 16" style={wrap}><rect x="2" y="3" width="12" height="8" rx="1" {...stroke} /><path d="M6 14h4M8 11v3" {...stroke} /></svg>;
    case 'video': return <svg viewBox="0 0 16 16" style={wrap}><rect x="2" y="4" width="9" height="8" rx="1" {...stroke} /><path d="M11 7l3-1.5v5L11 9" {...stroke} /></svg>;
    case 'file': return <svg viewBox="0 0 16 16" style={wrap}><path d="M4 2h5l3 3v9H4z" {...stroke} /><path d="M9 2v3h3" {...stroke} /></svg>;
    case 'download': return <svg viewBox="0 0 16 16" style={wrap}><path d="M8 2v8m0 0L5 7m3 3l3-3M3 13h10" {...stroke} /></svg>;
    case 'upload': return <svg viewBox="0 0 16 16" style={wrap}><path d="M8 11V3m0 0L5 6m3-3l3 3M3 13h10" {...stroke} /></svg>;
    case 'arrow-r': return <svg viewBox="0 0 16 16" style={wrap}><path d="M3 8h10M9 4l4 4-4 4" {...stroke} /></svg>;
    case 'chev-r': return <svg viewBox="0 0 16 16" style={wrap}><path d="M6 4l4 4-4 4" {...stroke} /></svg>;
    case 'chev-d': return <svg viewBox="0 0 16 16" style={wrap}><path d="M4 6l4 4 4-4" {...stroke} /></svg>;
    case 'x': return <svg viewBox="0 0 16 16" style={wrap}><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" {...stroke} /></svg>;
    case 'more': return <svg viewBox="0 0 16 16" style={wrap}><circle cx="3.5" cy="8" r="1" {...fill} /><circle cx="8" cy="8" r="1" {...fill} /><circle cx="12.5" cy="8" r="1" {...fill} /></svg>;
    case 'clock': return <svg viewBox="0 0 16 16" style={wrap}><circle cx="8" cy="8" r="5.5" {...stroke} /><path d="M8 5v3l2 1.5" {...stroke} /></svg>;
    case 'calendar': return <svg viewBox="0 0 16 16" style={wrap}><rect x="2.5" y="3.5" width="11" height="10" rx="1" {...stroke} /><path d="M2.5 6.5h11M5.5 2v3M10.5 2v3" {...stroke} /></svg>;
    case 'paperclip': return <svg viewBox="0 0 16 16" style={wrap}><path d="M12.5 7L8 11.5a3 3 0 11-4-4l5-5a2 2 0 113 3l-5 5a1 1 0 11-1.5-1.5L10 5.5" {...stroke} /></svg>;
    case 'link': return <svg viewBox="0 0 16 16" style={wrap}><path d="M9 4l1.5-1.5a2.5 2.5 0 113.5 3.5L12.5 7.5M7 12l-1.5 1.5a2.5 2.5 0 11-3.5-3.5L3.5 8.5M5.5 10.5l5-5" {...stroke} /></svg>;
    case 'eye': return <svg viewBox="0 0 16 16" style={wrap}><path d="M1.5 8C3 5 5.5 3.5 8 3.5S13 5 14.5 8C13 11 10.5 12.5 8 12.5S3 11 1.5 8z" {...stroke} /><circle cx="8" cy="8" r="2" {...stroke} /></svg>;
    case 'send': return <svg viewBox="0 0 16 16" style={wrap}><path d="M14 2L2 7.5l4.5 1.5M14 2l-3 12-3-5L14 2" {...stroke} /></svg>;
    case 'comment': return <svg viewBox="0 0 16 16" style={wrap}><path d="M2.5 4a1 1 0 011-1h9a1 1 0 011 1v6a1 1 0 01-1 1H7l-3 2.5V11h-.5a1 1 0 01-1-1V4z" {...stroke} /></svg>;
    case 'lightning': return <svg viewBox="0 0 16 16" style={wrap}><path d="M8.5 1.5L3 9h4l-.5 5.5L12 7H8z" {...stroke} /></svg>;
    case 'filter': return <svg viewBox="0 0 16 16" style={wrap}><path d="M2 4h12M4 8h8M6 12h4" {...stroke} /></svg>;
    case 'logo': return <svg viewBox="0 0 16 16" style={wrap}><rect x="2" y="2" width="12" height="12" rx="2" fill="currentColor" opacity="0.12" /><path d="M5 4v8M5 4l5 3.5M5 12l5-3.5M10 7.5h2M10 7.5l2.5-3M10 7.5l2.5 4.5" {...stroke} /></svg>;
    case 'sort': return <svg viewBox="0 0 16 16" style={wrap}><path d="M5 3v10m0 0l-2-2m2 2l2-2M11 13V3m0 0l-2 2m2-2l2 2" {...stroke} /></svg>;
    case 'globe': return <svg viewBox="0 0 16 16" style={wrap}><circle cx="8" cy="8" r="5.5" {...stroke} /><path d="M2.5 8h11M8 2.5c2 2 2 9 0 11M8 2.5c-2 2-2 9 0 11" {...stroke} /></svg>;
    case 'bolt-line': return <svg viewBox="0 0 16 16" style={wrap}><path d="M9 2L4 9h3l-1 5 6-7H9z" {...stroke} /></svg>;
    case 'home': return <svg viewBox="0 0 16 16" style={wrap}><path d="M2.5 7L8 2.5 13.5 7v6a1 1 0 01-1 1H10v-4H6v4H3.5a1 1 0 01-1-1V7z" {...stroke} /></svg>;
    case 'queue': return <svg viewBox="0 0 16 16" style={wrap}><path d="M2 3.5h12M2 8h12M2 12.5h8" {...stroke} /></svg>;
    case 'cmd': return <svg viewBox="0 0 16 16" style={wrap}><path d="M5 5h6v6H5zM5 5V3.5A1.5 1.5 0 103.5 5H5zM5 11v1.5A1.5 1.5 0 113.5 11H5zM11 5h1.5A1.5 1.5 0 1011 3.5V5zM11 11v1.5a1.5 1.5 0 11-1.5-1.5H11z" {...stroke} /></svg>;
    case 'back': return <svg viewBox="0 0 16 16" style={wrap}><path d="M10 3L5 8l5 5" {...stroke} /></svg>;
    case 'at': return <svg viewBox="0 0 16 16" style={wrap}><circle cx="8" cy="8" r="3" {...stroke} /><path d="M11 8v1.5a2 2 0 002 2c1 0 1.5-1 1.5-3 0-3-2.5-6.5-7-6.5S1.5 5 1.5 8c0 4.5 3.5 6.5 6.5 6.5 2 0 3-.5 3.5-1" {...stroke} /></svg>;
    case 'bell': return <svg viewBox="0 0 16 16" style={wrap}><path d="M4 11V7.5a4 4 0 118 0V11l1 2H3l1-2zM6.5 13.5a1.5 1.5 0 003 0" {...stroke} /></svg>;
    case 'edit': return <svg viewBox="0 0 16 16" style={wrap}><path d="M9.5 3.5l3 3-7 7H2.5v-3l7-7z" {...stroke} /></svg>;
    case 'spark': return <svg viewBox="0 0 16 16" style={wrap}><path d="M8 2v3M8 11v3M2 8h3M11 8h3M4 4l2 2M10 10l2 2M4 12l2-2M10 6l2-2" {...stroke} /></svg>;
    default: return <svg viewBox="0 0 16 16" style={wrap}><rect x="3" y="3" width="10" height="10" {...stroke} /></svg>;
  }
}
