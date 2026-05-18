import { z } from "zod";
import {
  APPLICATION_STATUSES,
  CONTACT_TYPES,
  CS2_MAPS,
  CS2_ROLES,
  LANGUAGES,
  ORGANIZATION_TYPES,
  RECRUITER_ROLES,
  REGIONS,
  USER_INTENTS
} from "./constants.js";

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
  openToOrganizations: z.boolean().optional(),
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
  openToOrganizations: z.boolean().default(true),
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

export const setUserIntentSchema = z.object({
  intent: z.enum(USER_INTENTS)
});

export const createRecruiterProfileSchema = z.object({
  role: z.enum(RECRUITER_ROLES),
  displayName: z.string().trim().min(2).max(40),
  contacts: z.array(profileContactSchema).max(6).default([])
});

const organizationSchemaShape = {
  type: z.enum(ORGANIZATION_TYPES),
  name: z.string().trim().min(2).max(48),
  game: z.literal("cs2").default("cs2"),
  region: z.enum(REGIONS),
  targetEloMin: z.number().int().min(0).max(5000),
  targetEloMax: z.number().int().min(0).max(5000),
  neededRoles: z.array(z.enum(CS2_ROLES)).min(1).max(6),
  languages: z.array(z.enum(LANGUAGES)).min(1).max(4),
  description: z.string().trim().min(20).max(400),
  isRecruiting: z.boolean().default(true)
};

export const createOrganizationSchema = z.object(organizationSchemaShape).refine((value) => value.targetEloMin <= value.targetEloMax, {
  message: "targetEloMin must be less than or equal to targetEloMax",
  path: ["targetEloMin"]
});

export const updateOrganizationSchema = z.object(organizationSchemaShape).partial().refine((value) => {
  if (value.targetEloMin === undefined || value.targetEloMax === undefined) return true;
  return value.targetEloMin <= value.targetEloMax;
}, {
  message: "targetEloMin must be less than or equal to targetEloMax",
  path: ["targetEloMin"]
});

export const organizationParamsSchema = z.object({
  id: z.string().min(1)
});

export const applicationParamsSchema = z.object({
  id: z.string().min(1)
});

export const createTeamApplicationSchema = z.object({
  message: z.string().trim().min(0).max(300).default("")
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(["accepted", "rejected"])
});

export const likeTargetParamsSchema = z.object({
  id: z.string().min(1)
});

export type ParsedDiscoveryFilters = z.infer<typeof discoveryFiltersSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateProfileInput = z.infer<typeof createProfileSchema>;
export type SetUserIntentInput = z.infer<typeof setUserIntentSchema>;
export type CreateRecruiterProfileInput = z.infer<typeof createRecruiterProfileSchema>;
export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
export type CreateTeamApplicationInput = z.infer<typeof createTeamApplicationSchema>;
export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>;
