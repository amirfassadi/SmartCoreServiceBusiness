import { requestJson } from "@/api/client";
import type { BusinessLocation, CreateLocationRequest, UpdateLocationRequest } from "@/api/types";

function locationsPath(businessId: string) {
  return `/api/v1/businesses/${businessId}/locations`;
}

export function createLocation(businessId: string, request: CreateLocationRequest) {
  return requestJson<BusinessLocation>(locationsPath(businessId), { method: "POST", body: JSON.stringify(request) });
}

export function listLocations(businessId: string) {
  return requestJson<BusinessLocation[]>(locationsPath(businessId));
}

export function updateLocation(businessId: string, locationId: string, request: UpdateLocationRequest) {
  return requestJson<BusinessLocation>(`${locationsPath(businessId)}/${locationId}`, {
    method: "PATCH",
    body: JSON.stringify(request),
  });
}

export function deactivateLocation(businessId: string, locationId: string) {
  return requestJson<BusinessLocation>(`${locationsPath(businessId)}/${locationId}/deactivate`, { method: "POST" });
}