import React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getLocationsQueryKey, useCreateLocation, useDeactivateLocation, useLocations, useUpdateLocation } from "@/features/locations/hooks/use-locations";
import type { BusinessLocation } from "@/api/types";

const { apiMocks, contextMock, localeMock, translations } = vi.hoisted(() => ({
  apiMocks: { list: vi.fn(), create: vi.fn(), update: vi.fn(), deactivate: vi.fn() },
  contextMock: vi.fn(),
  localeMock: vi.fn(),
  translations: vi.fn((key: string, values?: { name?: string }) => values?.name ? `${key}:${values.name}` : key),
}));

vi.mock("@/api/locations", () => ({
  listLocations: apiMocks.list,
  createLocation: apiMocks.create,
  updateLocation: apiMocks.update,
  deactivateLocation: apiMocks.deactivate,
}));

vi.mock("@/shared/providers/business-context-provider", () => ({ useBusinessContext: contextMock }));
vi.mock("next-intl", () => ({ useLocale: localeMock, useTranslations: () => translations }));
vi.mock("next/navigation", () => ({ usePathname: () => "/en/locations" }));
vi.mock("next/link", () => ({ default: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => <a href={href} {...props}>{children}</a> }));

const location: BusinessLocation = {
  id: "location-1",
  businessId: "business-1",
  name: "Main Branch",
  address: "1 Main Street",
  timezone: "UTC",
  active: true,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

function TestQueryProvider({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

function HookProbe({ businessId = "business-1" }: { businessId?: string | null }) {
  const query = useLocations(businessId);
  return <output data-testid="locations">{query.isLoading ? "loading" : query.error ? (query.error as { code: string }).code : JSON.stringify(query.data ?? [])}</output>;
}

function MutationProbe() {
  const create = useCreateLocation("business-1");
  const update = useUpdateLocation("business-1");
  const deactivate = useDeactivateLocation("business-1");
  return <div><button onClick={() => create.mutate({ name: "Branch", timezone: "UTC", address: "Address" })}>create</button><button onClick={() => update.mutate({ locationId: "location-1", request: { name: "Updated" } })}>update</button><button onClick={() => deactivate.mutate("location-1")}>deactivate</button></div>;
}

describe("Locations API/query infrastructure", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("uses a business-scoped query key and selected business ID", async () => {
    apiMocks.list.mockResolvedValue({ ok: true, data: [location], status: 200 });
    render(<TestQueryProvider><HookProbe /></TestQueryProvider>);
    await waitFor(() => expect(screen.getByTestId("locations").textContent).toContain("Main Branch"));
    expect(apiMocks.list).toHaveBeenCalledWith("business-1");
    expect(getLocationsQueryKey("business-1")).toEqual(["locations", "business-1"]);
  });

  it("renders loading and empty query states", async () => {
    let resolveRequest!: (value: unknown) => void;
    apiMocks.list.mockReturnValue(new Promise((resolve) => { resolveRequest = resolve; }));
    render(<TestQueryProvider><HookProbe /></TestQueryProvider>);
    expect(screen.getByTestId("locations").textContent).toBe("loading");
    resolveRequest({ ok: true, data: [], status: 200 });
    await waitFor(() => expect(screen.getByTestId("locations").textContent).toBe("[]"));
  });

  it("exposes backend errors without changing them", async () => {
    apiMocks.list.mockResolvedValue({ ok: false, status: 403, error: { code: "BUSINESS_ACCESS_DENIED", message: "Denied", details: {}, httpStatus: 403 } });
    render(<TestQueryProvider><HookProbe /></TestQueryProvider>);
    await waitFor(() => expect(screen.getByTestId("locations").textContent).toBe("BUSINESS_ACCESS_DENIED"));
  });

  it("uses exact selected-business request shapes and invalidates the scoped query", async () => {
    apiMocks.create.mockResolvedValue({ ok: true, data: location, status: 201 });
    apiMocks.update.mockResolvedValue({ ok: true, data: location, status: 200 });
    apiMocks.deactivate.mockResolvedValue({ ok: true, data: { ...location, active: false }, status: 201 });
    const invalidate = vi.spyOn(QueryClient.prototype, "invalidateQueries");
    render(<TestQueryProvider><MutationProbe /></TestQueryProvider>);

    fireEvent.click(screen.getByRole("button", { name: "create" }));
    fireEvent.click(screen.getByRole("button", { name: "update" }));
    fireEvent.click(screen.getByRole("button", { name: "deactivate" }));

    await waitFor(() => expect(apiMocks.create).toHaveBeenCalledWith("business-1", { name: "Branch", timezone: "UTC", address: "Address" }));
    expect(apiMocks.update).toHaveBeenCalledWith("business-1", "location-1", { name: "Updated" });
    expect(apiMocks.deactivate).toHaveBeenCalledWith("business-1", "location-1");
    await waitFor(() => expect(invalidate).toHaveBeenCalledWith({ queryKey: ["locations", "business-1"] }));
  });
});