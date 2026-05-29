import type { ApiUserData, UserData } from "../types";

// =============================================
// MAPPER
// =============================================

export const mapUserProfile = (raw: ApiUserData): UserData => ({
  firstName: raw.firstName ?? "",
  lastName: raw.lastName ?? "",
  email: raw.email ?? "",
  phone: raw.phone,
  image: raw.image ?? "",
  gender: raw.gender ?? "",
  name: `${raw.firstName ?? ""} ${raw.lastName ?? ""}`.trim() || "Unknown",
  avatar: raw.image ?? "",
  dob: raw.birthDate || "N/A",
  companyAddress: raw.company?.address?.address || "N/A",
  homeAddress: raw.address?.address || "N/A",
});
