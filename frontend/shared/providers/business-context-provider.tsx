"use client";

import { getBusiness } from "@/api/businesses";
import type { ApiError } from "@/api/errors";
import type { Business } from "@/api/types";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { createContext, useContext, useCallback, useMemo, useSyncExternalStore } from "react";

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
const selectionEvent = "smartcore:business-selection";

function subscribeSelection(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(selectionEvent, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(selectionEvent, onChange);
  };
}

function readSelection() {
  try { return normalizeBusinessId(window.localStorage.getItem(BUSINESS_SELECTION_STORAGE_KEY)); }
  catch { return null; }
}

function serverSelection(): undefined { return undefined; }

function normalizeBusinessId(businessId: string | null) {
  const normalized = businessId?.trim() ?? "";
  return normalized.length > 0 ? normalized : null;
}

export function BusinessContextProvider({ children }: { children: React.ReactNode }) {
  const selected = useSyncExternalStore(subscribeSelection, readSelection, serverSelection);
  const businessId = selected ?? null;
  const isHydrated = selected !== undefined;

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

  const setBusinessId = useCallback((nextBusinessId: string | null) => {
    const normalizedBusinessId = normalizeBusinessId(nextBusinessId);
    try {
      if (normalizedBusinessId === null) window.localStorage.removeItem(BUSINESS_SELECTION_STORAGE_KEY);
      else window.localStorage.setItem(BUSINESS_SELECTION_STORAGE_KEY, normalizedBusinessId);
    } catch { return; }
    window.dispatchEvent(new Event(selectionEvent));
  }, []);

  const clearBusiness = useCallback(() => setBusinessId(null), [setBusinessId]);

  const value = useMemo<BusinessContextValue>(
    () => ({
      businessId,
      business: selectedBusinessQuery.data ?? null,
      isLoading: selectedBusinessQuery.isLoading,
      error: selectedBusinessQuery.error ?? null,
      setBusinessId,
      clearBusiness,
    }),
    [businessId, clearBusiness, setBusinessId, selectedBusinessQuery.data, selectedBusinessQuery.error, selectedBusinessQuery.isLoading],
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
