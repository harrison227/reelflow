import { ForbiddenError } from '../errors';

export type Role = 'owner' | 'editor' | 'va';

export type Action =
  | 'client.read'
  | 'client.write'
  | 'client.delete'
  | 'deliverable.read.all'
  | 'deliverable.read.assigned'
  | 'deliverable.write'
  | 'deliverable.delete'
  | 'deliverable.approve'
  | 'asset.upload'
  | 'asset.delete'
  | 'user.manage';

const permissions: Record<Role, ReadonlyArray<Action>> = {
  owner: [
    'client.read',
    'client.write',
    'client.delete',
    'deliverable.read.all',
    'deliverable.write',
    'deliverable.delete',
    'deliverable.approve',
    'asset.upload',
    'asset.delete',
    'user.manage',
  ],
  va: [
    'client.read',
    'client.write',
    'deliverable.read.all',
    'deliverable.write',
    'asset.upload',
  ],
  editor: [
    'client.read',
    'deliverable.read.assigned',
    'deliverable.write',
    'asset.upload',
  ],
};

export function can(role: Role, action: Action): boolean {
  return permissions[role].includes(action);
}

export function assertCan(role: Role, action: Action): void {
  if (!can(role, action)) {
    throw new ForbiddenError(`Role '${role}' lacks permission: ${action}`);
  }
}

export type Actor = {
  id: string;
  role: Role;
};
