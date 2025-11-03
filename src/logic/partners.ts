import { z } from 'zod';

const partnerSchema = z.object({
  name: z.string(),
  location: z.string().nullable(),
  discount: z.string(),
  website: z.string().nullable(),
});

export type Partner = z.infer<typeof partnerSchema>;

export function validatePartners(data: unknown): Partner[] {
  const partnersArraySchema = z.array(partnerSchema);
  return partnersArraySchema.parse(data);
}
