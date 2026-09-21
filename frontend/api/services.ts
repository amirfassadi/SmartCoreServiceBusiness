import { buildUrl, requestJson } from "@/api/client";
import type { CreateServiceRequest, LifecycleStatus, Service, UpdateServiceRequest } from "@/api/types";

function servicesPath(businessId: string) {
  return `/api/v1/businesses/${businessId}/services`;
}

export function createService(businessId: string, request: CreateServiceRequest) {
  return requestJson<Service>(servicesPath(businessId), { method: "POST", body: JSON.stringify(request) });
}

export function listServices(businessId: string, status?: LifecycleStatus) {
  return requestJson<Service[]>(buildUrl(servicesPath(businessId), { status }));
}

export function getService(businessId: string, serviceId: string) {
  return requestJson<Service>(`${servicesPath(businessId)}/${serviceId}`);
}

export function updateService(businessId: string, serviceId: string, request: UpdateServiceRequest) {
  return requestJson<Service>(`${servicesPath(businessId)}/${serviceId}`, { method: "PATCH", body: JSON.stringify(request) });
}

export function archiveService(businessId: string, serviceId: string) {
  return requestJson<Service>(`${servicesPath(businessId)}/${serviceId}/archive`, { method: "POST" });
}

export function restoreService(businessId: string, serviceId: string) {
  return requestJson<Service>(`${servicesPath(businessId)}/${serviceId}/restore`, { method: "POST" });
}