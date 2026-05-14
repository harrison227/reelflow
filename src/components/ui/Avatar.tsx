import type { MockUser, UserId } from '@/lib/mock-data';
import { USERS } from '@/lib/mock-data';

type Size = 'sm' | 'md' | 'lg';

type Props = {
  user: MockUser | UserId | null | undefined;
  size?: Size;
};

export function Avatar({ user, size = 'md' }: Props) {
  if (!user) return null;
  const u: MockUser | undefined = typeof user === 'string' ? USERS[user] : user;
  if (!u) return null;
  const cls = `avatar ${size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : ''}`.trim();
  return <span className={cls}>{u.initials}</span>;
}

export function AvatarStack({ users }: { users: Array<MockUser | UserId> }) {
  return (
    <span className="avatar-stack">
      {users.map((u, i) => (
        <Avatar key={i} user={u} size="sm" />
      ))}
    </span>
  );
}
