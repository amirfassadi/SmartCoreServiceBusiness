import { requestJson } from "@/api/client";
import type { BusinessPolicy, CreatePolicyRequest, PolicyVersion, UpdatePolicyRequest } from "@/api/types";

function policiesPath(businessId: string) {
  return `/api/v1/businesses/${businessId}/policies`;
}

export function createPolicy(businessId: string, request: CreatePolicyRequest) {
  return requestJson<BusinessPolicy>(policiesPath(businessId), { method: "POST", body: JSON.stringify(request) });
}

export function getPolicy(businessId: string, policyKey: string) {
  return requestJson<BusinessPolicy>(`${policiesPath(businessId)}/${policyKey}`);
}

export function getPolicyVersions(businessId: string, policyKey: string) {
  return requestJson<PolicyVersion[]>(`${policiesPath(businessId)}/${policyKey}/versions`);
}

export function updatePolicy(businessId: string, policyKey: string, request: UpdatePolicyRequest) {
  return requestJson<BusinessPolicy>(`${policiesPath(businessId)}/${policyKey}`, { method: "PUT", body: JSON.stringify(request) });
}