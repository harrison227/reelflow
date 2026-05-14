import { relations } from 'drizzle-orm';
import {
  bigint,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

// ----------------------------------------------------------------------------
// Enums
// ----------------------------------------------------------------------------

export const roleEnum = pgEnum('role', ['owner', 'editor', 'va']);

export const deliverableStatusEnum = pgEnum('deliverable_status', [
  'brief',
  'footage_ready',
  'editing',
  'review',
  'revisions',
  'approved',
  'delivered',
  'archived',
]);

export const assetKindEnum = pgEnum('asset_kind', ['raw_footage', 'wip', 'final', 'reference']);

export const priorityEnum = pgEnum('priority', ['low', 'normal', 'high']);

export const notificationChannelEnum = pgEnum('notification_channel', ['in_app', 'email', 'push']);

export const recordingProviderEnum = pgEnum('recording_provider', ['komodo', 'loom']);

// ----------------------------------------------------------------------------
// Users + Auth.js adapter tables
// ----------------------------------------------------------------------------

export const users = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('email_verified', { mode: 'date', withTimezone: true }),
  image: text('image'),
  passwordHash: text('password_hash'),
  role: roleEnum('role').notNull().default('editor'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const accounts = pgTable(
  'account',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('provider_account_id').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    pk: primaryKey({ columns: [account.provider, account.providerAccountId] }),
  }),
);

export const sessions = pgTable('session', {
  sessionToken: text('session_token').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date', withTimezone: true }).notNull(),
});

export const verificationTokens = pgTable(
  'verification_token',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date', withTimezone: true }).notNull(),
  },
  (vt) => ({
    pk: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

// ----------------------------------------------------------------------------
// Clients
// ----------------------------------------------------------------------------

export const clients = pgTable(
  'clients',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    color: text('color').notNull(),
    contactEmail: text('contact_email'),
    contactName: text('contact_name'),
    defaultOutputSpecs: jsonb('default_output_specs'),
    archivedAt: timestamp('archived_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    nameIdx: index('clients_name_idx').on(t.name),
    activeIdx: index('clients_active_idx').on(t.archivedAt),
  }),
);

// ----------------------------------------------------------------------------
// Deliverables
// ----------------------------------------------------------------------------

export const deliverables = pgTable(
  'deliverables',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    clientId: uuid('client_id')
      .notNull()
      .references(() => clients.id, { onDelete: 'restrict' }),
    title: text('title').notNull(),
    type: text('type'),
    status: deliverableStatusEnum('status').notNull().default('brief'),
    priority: priorityEnum('priority').notNull().default('normal'),
    deadline: timestamp('deadline', { withTimezone: true }),
    assignedEditorId: uuid('assigned_editor_id').references(() => users.id, { onDelete: 'set null' }),
    createdById: uuid('created_by_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    brief: jsonb('brief'),
    labels: text('labels').array().notNull().default([]),
    currentRevisionRound: integer('current_revision_round').notNull().default(0),
    archivedAt: timestamp('archived_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    clientIdx: index('deliverables_client_idx').on(t.clientId),
    statusIdx: index('deliverables_status_idx').on(t.status),
    assigneeIdx: index('deliverables_assignee_idx').on(t.assignedEditorId),
    deadlineIdx: index('deliverables_deadline_idx').on(t.deadline),
  }),
);

// ----------------------------------------------------------------------------
// Assets
// ----------------------------------------------------------------------------

export const assets = pgTable(
  'assets',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    deliverableId: uuid('deliverable_id')
      .notNull()
      .references(() => deliverables.id, { onDelete: 'cascade' }),
    kind: assetKindEnum('kind').notNull(),
    storageKey: text('storage_key').notNull(),
    filename: text('filename').notNull(),
    mimeType: text('mime_type').notNull(),
    sizeBytes: bigint('size_bytes', { mode: 'bigint' }).notNull(),
    durationSeconds: integer('duration_seconds'),
    width: integer('width'),
    height: integer('height'),
    thumbnailKey: text('thumbnail_key'),
    version: integer('version').notNull().default(1),
    uploadedById: uuid('uploaded_by_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    uploadCompletedAt: timestamp('upload_completed_at', { withTimezone: true }),
    uploadIdempotencyKey: text('upload_idempotency_key').unique(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    deliverableIdx: index('assets_deliverable_idx').on(t.deliverableId),
    kindIdx: index('assets_kind_idx').on(t.deliverableId, t.kind, t.version),
  }),
);

// ----------------------------------------------------------------------------
// Revision threads + comments
// ----------------------------------------------------------------------------

export const revisionThreads = pgTable(
  'revision_threads',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    deliverableId: uuid('deliverable_id')
      .notNull()
      .references(() => deliverables.id, { onDelete: 'cascade' }),
    roundNumber: integer('round_number').notNull(),
    openedById: uuid('opened_by_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    closedAt: timestamp('closed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    uniqRound: uniqueIndex('revision_threads_uniq_round').on(t.deliverableId, t.roundNumber),
  }),
);

export const comments = pgTable(
  'comments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    threadId: uuid('thread_id')
      .notNull()
      .references(() => revisionThreads.id, { onDelete: 'cascade' }),
    authorId: uuid('author_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    body: text('body').notNull(),
    recordingProvider: recordingProviderEnum('recording_provider'),
    recordingId: text('recording_id'),
    recordingUrl: text('recording_url'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    threadIdx: index('comments_thread_idx').on(t.threadId, t.createdAt),
  }),
);

// ----------------------------------------------------------------------------
// Notifications
// ----------------------------------------------------------------------------

export const notifications = pgTable(
  'notifications',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    payload: jsonb('payload').notNull(),
    channel: notificationChannelEnum('channel').notNull(),
    readAt: timestamp('read_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userUnreadIdx: index('notifications_user_unread_idx').on(t.userId, t.readAt),
  }),
);

// ----------------------------------------------------------------------------
// Audit log
// ----------------------------------------------------------------------------

export const auditLog = pgTable(
  'audit_log',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    deliverableId: uuid('deliverable_id').references(() => deliverables.id, { onDelete: 'set null' }),
    actorId: uuid('actor_id').references(() => users.id, { onDelete: 'set null' }),
    action: text('action').notNull(),
    before: jsonb('before'),
    after: jsonb('after'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    deliverableIdx: index('audit_log_deliverable_idx').on(t.deliverableId, t.createdAt),
    actorIdx: index('audit_log_actor_idx').on(t.actorId, t.createdAt),
  }),
);

// ----------------------------------------------------------------------------
// Relations
// ----------------------------------------------------------------------------

export const clientsRelations = relations(clients, ({ many }) => ({
  deliverables: many(deliverables),
}));

export const deliverablesRelations = relations(deliverables, ({ one, many }) => ({
  client: one(clients, { fields: [deliverables.clientId], references: [clients.id] }),
  assignedEditor: one(users, { fields: [deliverables.assignedEditorId], references: [users.id] }),
  createdBy: one(users, { fields: [deliverables.createdById], references: [users.id] }),
  assets: many(assets),
  revisionThreads: many(revisionThreads),
}));

export const assetsRelations = relations(assets, ({ one }) => ({
  deliverable: one(deliverables, { fields: [assets.deliverableId], references: [deliverables.id] }),
  uploadedBy: one(users, { fields: [assets.uploadedById], references: [users.id] }),
}));

export const revisionThreadsRelations = relations(revisionThreads, ({ one, many }) => ({
  deliverable: one(deliverables, { fields: [revisionThreads.deliverableId], references: [deliverables.id] }),
  openedBy: one(users, { fields: [revisionThreads.openedById], references: [users.id] }),
  comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  thread: one(revisionThreads, { fields: [comments.threadId], references: [revisionThreads.id] }),
  author: one(users, { fields: [comments.authorId], references: [users.id] }),
}));

export type User = typeof users.$inferSelect;
export type Client = typeof clients.$inferSelect;
export type Deliverable = typeof deliverables.$inferSelect;
export type Asset = typeof assets.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type RevisionThread = typeof revisionThreads.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type AuditEntry = typeof auditLog.$inferSelect;
