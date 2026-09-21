import { requestJson } from "@/api/client";
import type { Business, CreateBusinessRequest, UpdateBusinessProfileRequest } from "@/api/types";

const businessesPath = "/api/v1/businesses";

export function createBusiness(request: CreateBusinessRequest) {
  return requestJson<Business>(businessesPath, { method: "POST", body: JSON.stringify(request) });
}

export function getBusiness(businessId: string) {
  return requestJson<Business>(`${businessesPath}/${businessId}`);
}

export function updateBusinessProfile(businessId: string, request: UpdateBusinessProfileRequest) {
  return requestJson<Business>(`${businessesPath}/${businessId}/profile`, {
    method: "PATCH",
    body: JSON.stringify(request),
  });
}