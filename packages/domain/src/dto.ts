import type { DiscoveryProfile, PlayerProfile, PrivateProfileDto, PublicDiscoveryProfileDto, User } from "./types.js";

export function calculateProfileCompletion(profile: PlayerProfile): number {
  const checks = [
    Boolean(profile.displayName),
    Boolean(profile.nickname),
    profile.age >= 16,
    Boolean(profile.region),
    profile.bio.trim().length >= 20,
    profile.languages.length > 0,
    profile.contacts.length > 0,
    Boolean(profile.gameProfile.role),
    profile.gameProfile.elo > 0,
    profile.gameProfile.maps.length > 0,
    Boolean(profile.gameProfile.availability),
    profile.providerAccounts.some((account) => account.provider === "faceit" && account.verified)
  ];

  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export function toPrivateProfileDto(user: User, profile: PlayerProfile): PrivateProfileDto {
  return {
    user,
    profile,
    completion: calculateProfileCompletion(profile)
  };
}

export function toPublicDiscoveryProfile(profile: PlayerProfile): PublicDiscoveryProfileDto {
  const faceit = profile.providerAccounts.find((account) => account.provider === "faceit") ?? null;
  const discoveryProfile: DiscoveryProfile = {
    id: profile.id,
    nickname: profile.nickname,
    displayName: profile.displayName,
    age: profile.age,
    region: profile.region,
    bio: profile.bio,
    languages: profile.languages,
    isOnline: profile.isOnline,
    isVerified: profile.isVerified,
    avatarHue: profile.avatarHue,
    gameProfile: profile.gameProfile,
    faceit: faceit
      ? {
          nickname: faceit.nickname,
          profileUrl: faceit.profileUrl,
          verified: faceit.verified
        }
      : null
  };

  return { profile: discoveryProfile };
}
