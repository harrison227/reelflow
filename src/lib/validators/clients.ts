import { z } from 'zod';

const hexColor = z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a 6-digit hex color');

export const createClientSchema = z.object({
  name: z.string().min(1).max(200),
  color: hexColor,
  contactEmail: z.string().email().optional(),
  contactName: z.string().max(200).optional(),
  defaultOutputSpecs: z.record(z.unknown()).optional(),
});

export const updateClientSchema = createClientSchema.partial();

export const clientIdParam = z.object({
  id: z.string().uuid(),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
