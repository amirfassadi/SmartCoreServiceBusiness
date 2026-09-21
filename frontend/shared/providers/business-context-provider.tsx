"use client";

import { getBusiness } from "@/api/businesses";
import type { ApiError } from "@/api/errors";
import type { Business } from "@/api/types";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export const BUSINESS_SELECTION_STORAGE_KEY = "smartcore:selected-business-id";

export function getBusinessQueryKey(businessId: string) {
  return ["business", businessId] as const;
}

type BusinessContextValue = {
  businessId: string | null;
  business: Business | null;
  isLoading: boolean;
  error: ApiError | null;
  setBusinessId: (businessId: string | null) => void;
  clearBusiness: () => void;
};

const BusinessContext = createContext<BusinessContextValue | null>(null);

function normalizeBusinessId(businessId: string | null) {
  const normalized = businessId?.trim() ?? "";
  return normalized.length > 0 ? normalized : null;
}

export function BusinessContextProvider({ children }: { children: React.ReactNode }) {
  const [businessId, setBusinessIdState] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const storedBusinessId = window.localStorage.getItem(BUSINESS_SELECTION_STORAGE_KEY);
    setBusinessIdState(normalizeBusinessId(storedBusinessId));
    setIsHydrated(true);
  }, []);

  const selectedBusinessQuery = useQuery<Business, ApiError>({
    queryKey: businessId ? getBusinessQueryKey(businessId) : ["business", null],
    queryFn: async () => {
      const result = await getBusiness(businessId as string);
      if (!result.ok) {
        throw result.error;
      }
      return result.data;
    },
    enabled: isHydrated && businessId !== null,
    retry: false,
  });

  const setBusinessId = (nextBusinessId: string | null) => {
    const normalizedBusinessId = normalizeBusinessId(nextBusinessId);
    setBusinessIdState(normalizedBusinessId);

    if (normalizedBusinessId === null) {
      window.localStorage.removeItem(BUSINESS_SELECTION_STORAGE_KEY);
    } else {
      window.localStorage.setItem(BUSINESS_SELECTION_STORAGE_KEY, normalizedBusinessId);
    }
  };

  const clearBusiness = () => setBusinessId(null);

  const value = useMemo<BusinessContextValue>(
    () => ({
      businessId,
      business: selectedBusinessQuery.data ?? null,
      isLoading: selectedBusinessQuery.isLoading,
      error: selectedBusinessQuery.error ?? null,
      setBusinessId,
      clearBusiness,
    }),
    [businessId, clearBusiness, selectedBusinessQuery.data, selectedBusinessQuery.error, selectedBusinessQuery.isLoading],
  );

  return <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>;
}

export function useBusinessContext() {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error("useBusinessContext must be used within BusinessContextProvider");
  }

  return context;
}