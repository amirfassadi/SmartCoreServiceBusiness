import { buildUrl, requestJson } from "@/api/client";
import type { CreateServiceCategoryRequest, LifecycleStatus, ServiceCategory, UpdateServiceCategoryRequest } from "@/api/types";

function categoriesPath(businessId: string) {
  return `/api/v1/businesses/${businessId}/service-categories`;
}

export function createCategory(businessId: string, request: CreateServiceCategoryRequest) {
  return requestJson<ServiceCategory>(categoriesPath(businessId), { method: "POST", body: JSON.stringify(request) });
}

export function listCategories(businessId: string, status?: LifecycleStatus) {
  return requestJson<ServiceCategory[]>(buildUrl(categoriesPath(businessId), { status }));
}

export function getCategory(businessId: string, categoryId: string) {
  return requestJson<ServiceCategory>(`${categoriesPath(businessId)}/${categoryId}`);
}

export function updateCategory(businessId: string, categoryId: string, request: UpdateServiceCategoryRequest) {
  return requestJson<ServiceCategory>(`${categoriesPath(businessId)}/${categoryId}`, { method: "PATCH", body: JSON.stringify(request) });
}

export function archiveCategory(businessId: string, categoryId: string) {
  return requestJson<ServiceCategory>(`${categoriesPath(businessId)}/${categoryId}/archive`, { method: "POST" });
}

export function restoreCategory(businessId: string, categoryId: string) {
  return requestJson<ServiceCategory>(`${categoriesPath(businessId)}/${categoryId}/restore`, { method: "POST" });
}