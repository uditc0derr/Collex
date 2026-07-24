import { z } from "zod";

export const fileUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  folderId: z.string().nullable().optional(),
  favorite: z.boolean().optional()
});

export const moveFileSchema = z.object({
  fileId: z.string().min(1),
  folderId: z.string().nullable()
});
