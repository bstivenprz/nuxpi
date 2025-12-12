"use client";

import z from "zod";

export const MAX_UPLOAD_SIZE = 10 * 1024 * 1024; // 10MB
export const ACCPETED_IMAGES_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];
export const ACCPETED_VIDEO_MIME_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "video/3gpp",
  "video/3gp",
];

export const schema = z.object({
  caption: z.string().optional(),
  audience: z.enum(["everyone", "paid-only"]).default("everyone"),
  assets: z.array(z.string()).optional(),
});

export type Form = z.infer<typeof schema>;
