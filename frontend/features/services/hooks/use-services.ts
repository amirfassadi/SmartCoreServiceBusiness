"use client";

import { archiveService, createService, listServices, restoreService, updateService } from "@/api/services";
import type { CreateServiceRequest, LifecycleStatus, UpdateServiceRequest } from "@/api/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function getServicesQueryKey(businessId: string, status: LifecycleStatus) {
  return ["services", businessId, status] as const;
}

export function useServices(businessId: string | null, status: LifecycleStatus, enabled = true) {
  return useQuery({
    queryKey: businessId ? getServicesQueryKey(businessId, status) : ["services", null, status],
    queryFn: async () => {
      const result = await listServices(businessId as string, status);
      if (!result.ok) throw result.error;
      return result.data;
    },
    enabled: enabled && Boolean(businessId),
    retry: false,
  });
}

function useServiceMutation<TVariables, TResult>(businessId: string, mutationFn: (variables: TVariables) => ReturnType<typeof createService>) {
  const queryClient = useQueryClient();
  return useMutation<TResult, unknown, TVariables>({
    mutationFn: async (variables) => {
      const result = await mutationFn(variables);
      if (!result.ok) throw result.error;
      return result.data as TResult;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["services", businessId] }),
  });
}

type ServiceResult = Awaited<ReturnType<typeof createService>> extends { ok: true; data: infer T } ? T : never;

export function useCreateService(businessId: string) {
  return useServiceMutation<CreateServiceRequest, ServiceResult>(businessId, (request) => createService(businessId, request));
}

export function useUpdateService(businessId: string) {
  return useServiceMutation<{ serviceId: string; request: UpdateServiceRequest }, ServiceResult>(businessId, ({ serviceId, request }) => updateService(businessId, serviceId, request));
}

export function useArchiveService(businessId: string) {
  return useServiceMutation<string, ServiceResult>(businessId, (serviceId) => archiveService(businessId, serviceId));
}

export function useRestoreService(businessId: string) {
  return useServiceMutation<string, ServiceResult>(businessId, (serviceId) => restoreService(businessId, serviceId));
}