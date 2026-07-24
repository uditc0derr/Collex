import { z } from "zod";

export const createFolderSchema = z.object({
  name: z.string().min(1),
  parentId: z.string().nullable().optional()
});

export const updateFolderSchema = z
  .object({
    name: z.string().min(1).optional(),
    parentId: z.string().nullable().optional(),
    favorite: z.boolean().optional(),
    status: z.enum(["ACTIVE", "TRASHED"]).optional()
  })
  .refine((value) => Object.keys(value).length > 0, { message: "At least one field is required" });
