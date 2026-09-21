"use client";

import { createLocation, deactivateLocation, listLocations, updateLocation } from "@/api/locations";
import type { ApiError } from "@/api/errors";
import type { CreateLocationRequest, UpdateLocationRequest } from "@/api/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function getLocationsQueryKey(businessId: string) {
  return ["locations", businessId] as const;
}

export function useLocations(businessId: string | null, enabled = true) {
  return useQuery({
    queryKey: businessId ? getLocationsQueryKey(businessId) : ["locations", null],
    queryFn: async () => {
      const result = await listLocations(businessId as string);
      if (!result.ok) throw result.error;
      return result.data;
    },
    enabled: enabled && Boolean(businessId),
    retry: false,
  });
}

function useLocationMutation<TVariables>(mutationFn: (variables: TVariables) => ReturnType<typeof createLocation>, businessId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: TVariables) => {
      const result = await mutationFn(variables);
      if (!result.ok) throw result.error;
      return result.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: getLocationsQueryKey(businessId) }),
  });
}

export function useCreateLocation(businessId: string) {
  return useLocationMutation<CreateLocationRequest>((request) => createLocation(businessId, request), businessId);
}

export function useUpdateLocation(businessId: string) {
  return useLocationMutation<{ locationId: string; request: UpdateLocationRequest }>(
    ({ locationId, request }) => updateLocation(businessId, locationId, request) as ReturnType<typeof createLocation>,
    businessId,
  );
}

export function useDeactivateLocation(businessId: string) {
  return useLocationMutation<string>((locationId) => deactivateLocation(businessId, locationId) as ReturnType<typeof createLocation>, businessId);
}

export function getLocationMutationError(error: unknown) {
  return error as ApiError | null;
}