"use client";

import { createPolicy, getPolicy, getPolicyVersions, updatePolicy } from "@/api/policies";
import type { CreatePolicyRequest, UpdatePolicyRequest } from "@/api/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function getPolicyQueryKey(businessId: string, policyKey: string) {
  return ["business-policies", businessId, policyKey] as const;
}

export function getPolicyVersionsQueryKey(businessId: string, policyKey: string) {
  return ["business-policy-versions", businessId, policyKey] as const;
}

export function useCurrentPolicy(businessId: string | null, policyKey: string) {
  return useQuery({
    queryKey: businessId ? getPolicyQueryKey(businessId, policyKey) : ["business-policies", null, policyKey],
    queryFn: async () => {
      const result = await getPolicy(businessId as string, policyKey);
      if (!result.ok) throw result.error;
      return result.data;
    },
    enabled: Boolean(businessId && policyKey),
    retry: false,
  });
}

export function usePolicyVersions(businessId: string | null, policyKey: string, enabled = true) {
  return useQuery({
    queryKey: businessId ? getPolicyVersionsQueryKey(businessId, policyKey) : ["business-policy-versions", null, policyKey],
    queryFn: async () => {
      const result = await getPolicyVersions(businessId as string, policyKey);
      if (!result.ok) throw result.error;
      return result.data;
    },
    enabled: enabled && Boolean(businessId && policyKey),
    retry: false,
  });
}

function usePolicyMutation<TVariables, TResult>(businessId: string, policyKey: string, mutationFn: (variables: TVariables) => ReturnType<typeof createPolicy>) {
  const queryClient = useQueryClient();
  return useMutation<TResult, unknown, TVariables>({
    mutationFn: async (variables) => {
      const result = await mutationFn(variables);
      if (!result.ok) throw result.error;
      return result.data as TResult;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: getPolicyQueryKey(businessId, policyKey) });
      void queryClient.invalidateQueries({ queryKey: getPolicyVersionsQueryKey(businessId, policyKey) });
    },
  });
}

type PolicyResult = Awaited<ReturnType<typeof createPolicy>> extends { ok: true; data: infer T } ? T : never;

export function useCreatePolicy(businessId: string, policyKey: string) {
  return usePolicyMutation<CreatePolicyRequest, PolicyResult>(businessId, policyKey, (request) => createPolicy(businessId, request));
}

export function useUpdatePolicy(businessId: string, policyKey: string) {
  return usePolicyMutation<UpdatePolicyRequest, PolicyResult>(businessId, policyKey, (request) => updatePolicy(businessId, policyKey, request));
}