import { z } from "zod";
import { CONTACT_TYPES, CS2_MAPS, CS2_ROLES, LANGUAGES, REGIONS } from "./constants.js";

export const emailSchema = z.string().trim().email().max(254);

export const discoveryFiltersSchema = z.object({
  role: z.enum([...CS2_ROLES, "all"]).optional().default("all"),
  region: z.enum(REGIONS).optional().default("EU+CIS"),
  ageMin: z.coerce.number().int().min(16).max(80).optional().default(18),
  ageMax: z.coerce.number().int().min(16).max(80).optional().default(35),
  eloMin: z.coerce.number().int().min(0).max(5000).optional().default(0),
  eloMax: z.coerce.number().int().min(0).max(5000).optional().default(5000),
  maps: z.array(z.enum(CS2_MAPS)).max(9).optional().default([]),
  onlyOnline: z.coerce.boolean().optional().default(false),
  withMic: z.coerce.boolean().optional().default(false),
  verifiedOnly: z.coerce.boolean().optional().default(false)
}).refine((value) => value.ageMin <= value.ageMax, {
  message: "ageMin must be less than or equal to ageMax",
  path: ["ageMin"]
}).refine((value) => value.eloMin <= value.eloMax, {
  message: "eloMin must be less than or equal to eloMax",
  path: ["eloMin"]
});

export const profileContactSchema = z.object({
  type: z.enum(CONTACT_TYPES),
  value: z.string().trim().min(2).max(80),
  isPrivate: z.boolean().default(true)
});

export const updateProfileSchema = z.object({
  nickname: z.string().trim().min(2).max(24).regex(/^[a-zA-Z0-9_.-]+$/).optional(),
  displayName: z.string().trim().min(2).max(40).optional(),
  age: z.number().int().min(16).max(80).optional(),
  region: z.enum(REGIONS).optional(),
  bio: z.string().trim().min(0).max(280).optional(),
  languages: z.array(z.enum(LANGUAGES)).min(1).max(4).optional(),
  contacts: z.array(profileContactSchema).max(6).optional(),
  gameProfile: z.object({
    role: z.enum(CS2_ROLES).optional(),
    elo: z.number().int().min(0).max(5000).optional(),
    peakElo: z.number().int().min(0).max(5000).nullable().optional(),
    maps: z.array(z.enum(CS2_MAPS)).min(1).max(9).optional(),
    availability: z.string().trim().min(2).max(80).optional(),
    hasMic: z.boolean().optional(),
    hours: z.number().int().min(0).max(50000).nullable().optional()
  }).optional()
});

export const createProfileSchema = z.object({
  nickname: z.string().trim().min(2).max(24).regex(/^[a-zA-Z0-9_.-]+$/),
  displayName: z.string().trim().min(2).max(40),
  age: z.number().int().min(16).max(80),
  region: z.enum(REGIONS),
  bio: z.string().trim().min(20).max(280),
  languages: z.array(z.enum(LANGUAGES)).min(1).max(4),
  contacts: z.array(profileContactSchema).max(6).default([]),
  gameProfile: z.object({
    role: z.enum(CS2_ROLES),
    elo: z.number().int().min(0).max(5000),
    peakElo: z.number().int().min(0).max(5000).nullable().default(null),
    maps: z.array(z.enum(CS2_MAPS)).min(1).max(9),
    availability: z.string().trim().min(2).max(80),
    hasMic: z.boolean(),
    hours: z.number().int().min(0).max(50000).nullable().default(null)
  })
});

export const likeTargetParamsSchema = z.object({
  id: z.string().min(1)
});

export type ParsedDiscoveryFilters = z.infer<typeof discoveryFiltersSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateProfileInput = z.infer<typeof createProfileSchema>;
