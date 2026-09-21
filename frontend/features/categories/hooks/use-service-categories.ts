"use client";

import { archiveCategory, createCategory, listCategories, restoreCategory, updateCategory } from "@/api/categories";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { LifecycleStatus, CreateServiceCategoryRequest, UpdateServiceCategoryRequest } from "@/api/types";

export function getServiceCategoriesQueryKey(businessId: string, status: LifecycleStatus) {
  return ["service-categories", businessId, status] as const;
}

export function useServiceCategories(businessId: string | null, status: LifecycleStatus, enabled = true) {
  return useQuery({
    queryKey: businessId ? getServiceCategoriesQueryKey(businessId, status) : ["service-categories", null, status],
    queryFn: async () => {
      const result = await listCategories(businessId as string, status);
      if (!result.ok) throw result.error;
      return result.data;
    },
    enabled: enabled && Boolean(businessId),
    retry: false,
  });
}

function useCategoryMutation<TVariables, TResult>(businessId: string, mutationFn: (variables: TVariables) => ReturnType<typeof createCategory>) {
  const queryClient = useQueryClient();
  return useMutation<TResult, unknown, TVariables>({
    mutationFn: async (variables) => {
      const result = await mutationFn(variables);
      if (!result.ok) throw result.error;
      return result.data as TResult;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["service-categories", businessId] }),
  });
}

export function useCreateCategory(businessId: string) {
  return useCategoryMutation<CreateServiceCategoryRequest, Awaited<ReturnType<typeof createCategory>> extends { ok: true; data: infer T } ? T : never>(businessId, (request) => createCategory(businessId, request));
}

export function useUpdateCategory(businessId: string) {
  return useCategoryMutation<{ categoryId: string; request: UpdateServiceCategoryRequest }, Awaited<ReturnType<typeof updateCategory>> extends { ok: true; data: infer T } ? T : never>(businessId, ({ categoryId, request }) => updateCategory(businessId, categoryId, request));
}

export function useArchiveCategory(businessId: string) {
  return useCategoryMutation<string, Awaited<ReturnType<typeof archiveCategory>> extends { ok: true; data: infer T } ? T : never>(businessId, (categoryId) => archiveCategory(businessId, categoryId));
}

export function useRestoreCategory(businessId: string) {
  return useCategoryMutation<string, Awaited<ReturnType<typeof restoreCategory>> extends { ok: true; data: infer T } ? T : never>(businessId, (categoryId) => restoreCategory(businessId, categoryId));
}