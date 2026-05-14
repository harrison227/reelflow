// Mock data for Reelflow's frontend.
// Mirrors the design prototype data. Replace with real fetches as backend endpoints land.

export type UserId = 'maya' | 'jules' | 'sam';

export type MockUser = {
  id: UserId;
  name: string;
  role: 'owner' | 'editor' | 'va';
  initials: string;
  short: string;
};

export const USERS: Record<UserId, MockUser> = {
  maya: { id: 'maya', name: 'Maya Chen', role: 'owner', initials: 'MC', short: 'Maya' },
  jules: { id: 'jules', name: 'Jules Fontaine', role: 'editor', initials: 'JF', short: 'Jules' },
  sam: { id: 'sam', name: 'Sam Okafor', role: 'va', initials: 'SO', short: 'Sam' },
};

export type ClientId = 'ppd' | 'lee' | 'marlow' | 'vanguard' | 'driscoll';

export type MockClient = {
  id: ClientId;
  name: string;
  stripe: string;
  sector: string;
  active: number;
};

export const CLIENTS: MockClient[] = [
  { id: 'ppd', name: 'PPD', stripe: 'var(--c-ppd)', sector: 'Wealth advisory', active: 4 },
  { id: 'lee', name: 'Lee', stripe: 'var(--c-lee)', sector: 'Personal brand', active: 2 },
  { id: 'marlow', name: 'Marlow Realty', stripe: 'var(--c-marlow)', sector: 'Real estate', active: 1 },
  { id: 'vanguard', name: 'Vanguard Wealth', stripe: 'var(--c-vanguard)', sector: 'Wealth advisory', active: 1 },
  { id: 'driscoll', name: 'Driscoll & Park', stripe: 'var(--c-driscoll)', sector: 'Law firm — PI', active: 1 },
];

export const CLIENT_BY_ID: Record<string, MockClient> = Object.fromEntries(CLIENTS.map((c) => [c.id, c]));

export type ColumnId = 'brief' | 'footage' | 'editing' | 'review' | 'revisions' | 'approved' | 'delivered';

export type Column = {
  id: ColumnId;
  name: string;
};

export const COLUMNS: Column[] = [
  { id: 'brief', name: 'Brief' },
  { id: 'footage', name: 'Footage ready' },
  { id: 'editing', name: 'Editing' },
  { id: 'review', name: 'Review' },
  { id: 'revisions', name: 'Revisions' },
  { id: 'approved', name: 'Approved' },
  { id: 'delivered', name: 'Delivered' },
];

export type MockCard = {
  id: string;
  title: string;
  client: ClientId;
  column: ColumnId;
  assignee: UserId | null;
  length: string;
  format: string;
  due: string;
  updated: string;
  updatedBy: UserId;
  unread: boolean;
  versions: number;
  comments: number;
  files: number;
  brief: string;
  deliverables: string[];
};

export const CARDS: MockCard[] = [
  {
    id: 'V-241', title: 'Haynes Reel — testimonial cut',
    client: 'ppd', column: 'review',
    assignee: 'jules', length: '0:42', format: '9:16',
    due: 'May 17', updated: '2h ago', updatedBy: 'jules',
    unread: true, versions: 3, comments: 4, files: 12,
    brief: 'Hard cut testimonial for Mike Haynes — Q1 close numbers, focused on referral talking points. Hook: client surprise reaction. End card: book a call CTA. Cuts to two B-roll moments (signing, office walk).',
    deliverables: ['Master 9:16 @ 1080×1920 H.264', 'Captioned variant', 'Square 1:1 cutdown :30'],
  },
  {
    id: 'V-243', title: 'Partners Reel — Q2 sizzle',
    client: 'ppd', column: 'editing',
    assignee: 'jules', length: '1:15', format: '9:16',
    due: 'May 21', updated: '38m ago', updatedBy: 'sam',
    unread: false, versions: 1, comments: 0, files: 18,
    brief: 'Sizzle covering the two partners — Q2 wins, recent close numbers. Open with anonymous client surprise reaction, hard cut to office. Target: 60–80s.',
    deliverables: ['Master 9:16', 'Vertical caption pass'],
  },
  {
    id: 'V-238', title: 'Lee vid 1 — broker takedown',
    client: 'lee', column: 'approved',
    assignee: 'jules', length: '0:58', format: '9:16',
    due: 'May 14', updated: 'Yesterday', updatedBy: 'maya',
    unread: false, versions: 4, comments: 11, files: 9,
    brief: "Direct-response hook against legacy broker fee structures. Open with whiteboard math, end with CTA to Lee's funnel.",
    deliverables: ['Master 9:16', 'Captioned'],
  },
  {
    id: 'V-244', title: 'Lee vid 2 — fee structure breakdown',
    client: 'lee', column: 'revisions',
    assignee: 'jules', length: '1:02', format: '9:16',
    due: 'May 16', updated: '14m ago', updatedBy: 'maya',
    unread: true, versions: 2, comments: 6, files: 7,
    brief: 'Companion to vid 1 — same on-camera setup, breakdown of fee structures, walks viewer through three scenarios.',
    deliverables: ['Master 9:16', 'Captioned', 'Cutdown for stories :15'],
  },
  {
    id: 'V-240', title: '5512 Oak — open house promo',
    client: 'marlow', column: 'footage',
    assignee: 'jules', length: '—', format: '9:16',
    due: 'May 19', updated: '4h ago', updatedBy: 'sam',
    unread: false, versions: 0, comments: 0, files: 24,
    brief: 'Open house promo for 5512 Oak Ridge. Drone open, walkthrough beats: foyer, kitchen, primary, back deck. End: agent piece-to-camera with CTA.',
    deliverables: ['9:16 master :60', '16:9 cutdown for MLS'],
  },
  {
    id: 'V-237', title: 'Q3 testimonial — Janet R.',
    client: 'vanguard', column: 'delivered',
    assignee: 'jules', length: '1:08', format: '9:16',
    due: 'May 10', updated: '3d ago', updatedBy: 'sam',
    unread: false, versions: 5, comments: 14, files: 11,
    brief: 'Janet R. on the retirement transition coaching. Soft music, no captions on initial cut. 60–75s.',
    deliverables: ['Master 9:16', 'Captioned', '16:9 for website'],
  },
  {
    id: 'V-246', title: 'DUI lead magnet v2 — hook test',
    client: 'driscoll', column: 'brief',
    assignee: null, length: '—', format: '9:16',
    due: 'May 24', updated: '1h ago', updatedBy: 'sam',
    unread: false, versions: 0, comments: 0, files: 0,
    brief: 'Replace the failing v1 hook — swap opening line, keep middle and outro. Test three intro variants.',
    deliverables: ['3 × 9:16 hook variants :30 each'],
  },
  {
    id: 'V-245', title: 'PPD holiday slot — May 26',
    client: 'ppd', column: 'editing',
    assignee: 'jules', length: '0:30', format: '9:16',
    due: 'May 23', updated: '6h ago', updatedBy: 'jules',
    unread: false, versions: 1, comments: 2, files: 6,
    brief: 'Short Memorial Day post — PPD partners speaking to camera, soft music, no CTA.',
    deliverables: ['Master 9:16 :30'],
  },
  {
    id: 'V-239', title: 'Partners Reel — January batch',
    client: 'ppd', column: 'approved',
    assignee: 'jules', length: '1:22', format: '9:16',
    due: 'May 8', updated: '5d ago', updatedBy: 'maya',
    unread: false, versions: 6, comments: 22, files: 14,
    brief: 'Reel covering January close highlights.',
    deliverables: ['Master 9:16'],
  },
];

export const FOCUS_CARD_ID = 'V-241';

export type ThreadFileRef = {
  name: string;
  size: string;
  dur: string;
};

export type ThreadFile = ThreadFileRef & {
  uploader: UserId;
  when: string;
};

export type ThreadItem =
  | { id: string; kind: 'create' | 'brief' | 'assign' | 'note'; who: UserId; when: string; body: string }
  | { id: string; kind: 'upload'; who: UserId; when: string; body: string; files: ThreadFileRef[] }
  | { id: string; kind: 'wip'; who: UserId; when: string; body: string; version: string; file: ThreadFile };

export const FOCUS_THREAD: ThreadItem[] = [
  { id: 't1', kind: 'create', who: 'sam', when: 'May 12 · 9:24', body: 'Created card and pulled raw from shoot drive.' },
  { id: 't2', kind: 'brief', who: 'sam', when: 'May 12 · 9:31', body: 'Brief drafted from shoot notes.' },
  {
    id: 't3', kind: 'upload', who: 'sam', when: 'May 12 · 10:14', body: 'Uploaded raw footage',
    files: [
      { name: 'A-CAM_HAYNES_001.MP4', size: '4.2 GB', dur: '00:23:11' },
      { name: 'A-CAM_HAYNES_002.MP4', size: '3.8 GB', dur: '00:18:42' },
      { name: 'B-CAM_OFFICE_BROLL.MP4', size: '1.1 GB', dur: '00:06:09' },
      { name: 'AUDIO_LAV_MIKE.WAV', size: '288 MB', dur: '00:48:30' },
    ],
  },
  { id: 't4', kind: 'assign', who: 'sam', when: 'May 12 · 10:18', body: 'Assigned to Jules · due May 17.' },
  {
    id: 't5', kind: 'wip', who: 'jules', when: 'May 13 · 15:02', body: 'WIP v1 uploaded', version: 'v1',
    file: { name: 'HAYNES_REEL_v1.mp4', size: '184 MB', dur: '0:41', uploader: 'jules', when: 'May 13 · 15:02' },
  },
  {
    id: 't6', kind: 'note', who: 'maya', when: 'May 13 · 18:47',
    body: 'Feedback on v1 — tighter cold open, lower-third Mike’s name on the first cut, music dips during the surprise beat, end card a frame earlier.',
  },
  {
    id: 't7', kind: 'wip', who: 'jules', when: 'May 14 · 11:09', body: 'WIP v2 uploaded', version: 'v2',
    file: { name: 'HAYNES_REEL_v2.mp4', size: '176 MB', dur: '0:42', uploader: 'jules', when: 'May 14 · 11:09' },
  },
  {
    id: 't8', kind: 'note', who: 'maya', when: 'May 14 · 14:30',
    body: 'Feedback on v2 — almost there, just the closing CTA: CTA card needs 4 more frames, audio fade a hair too fast, lift shadows on the close-up.',
  },
  {
    id: 't9', kind: 'wip', who: 'jules', when: 'May 15 · 09:51', body: 'WIP v3 uploaded', version: 'v3',
    file: { name: 'HAYNES_REEL_v3.mp4', size: '178 MB', dur: '0:42', uploader: 'jules', when: 'May 15 · 09:51' },
  },
];

export type FileEntry = {
  name: string;
  size: string;
  dur: string;
  when: string;
  version?: string;
  current?: boolean;
};

export type FocusFiles = {
  raw: FileEntry[];
  wips: FileEntry[];
  refs: FileEntry[];
};

export const FOCUS_FILES: FocusFiles = {
  raw: [
    { name: 'A-CAM_HAYNES_001.MP4', size: '4.2 GB', dur: '23:11', when: 'May 12' },
    { name: 'A-CAM_HAYNES_002.MP4', size: '3.8 GB', dur: '18:42', when: 'May 12' },
    { name: 'B-CAM_OFFICE_BROLL.MP4', size: '1.1 GB', dur: '6:09', when: 'May 12' },
    { name: 'AUDIO_LAV_MIKE.WAV', size: '288 MB', dur: '48:30', when: 'May 12' },
  ],
  wips: [
    { name: 'HAYNES_REEL_v3.mp4', size: '178 MB', dur: '0:42', when: 'May 15', version: 'v3', current: true },
    { name: 'HAYNES_REEL_v2.mp4', size: '176 MB', dur: '0:42', when: 'May 14', version: 'v2' },
    { name: 'HAYNES_REEL_v1.mp4', size: '184 MB', dur: '0:41', when: 'May 13', version: 'v1' },
  ],
  refs: [
    { name: 'ref_alex_pearl_hook.mp4', size: '12 MB', dur: '0:38', when: 'May 12' },
    { name: 'mike_brand_colors.pdf', size: '1.4 MB', dur: '—', when: 'May 12' },
  ],
};

export type NotificationKind = 'wip' | 'feedback' | 'mention' | 'assign' | 'deadline' | 'approved' | 'delivered';

export type MockNotification = {
  id: string;
  kind: NotificationKind;
  who: UserId | null;
  when: string;
  card: string;
  title: string;
  body: string;
  unread: boolean;
};

export const NOTIFICATIONS: MockNotification[] = [
  { id: 'n1', kind: 'wip', who: 'jules', when: '14m ago', card: 'V-241', title: 'Haynes Reel — testimonial cut', body: 'uploaded WIP v3', unread: true },
  { id: 'n2', kind: 'feedback', who: 'maya', when: '3h ago', card: 'V-244', title: 'Lee vid 2 — fee structure breakdown', body: 'left feedback on v2', unread: true },
  { id: 'n3', kind: 'mention', who: 'sam', when: '4h ago', card: 'V-240', title: '5512 Oak — open house promo', body: 'mentioned you: "@maya raw is on the drive, ready to assign"', unread: true },
  { id: 'n4', kind: 'assign', who: 'sam', when: 'Yesterday', card: 'V-246', title: 'DUI lead magnet v2', body: 'created card — brief draft ready for review', unread: false },
  { id: 'n5', kind: 'deadline', who: null, when: 'Yesterday', card: 'V-244', title: 'Lee vid 2', body: 'due in 2 days', unread: false },
  { id: 'n6', kind: 'approved', who: 'maya', when: '2d ago', card: 'V-238', title: 'Lee vid 1 — broker takedown', body: 'approved v4 — ready to deliver', unread: false },
  { id: 'n7', kind: 'delivered', who: 'sam', when: '3d ago', card: 'V-237', title: 'Q3 testimonial — Janet R.', body: 'sent preview link to Vanguard', unread: false },
];

export const ME: MockUser = USERS.maya;
