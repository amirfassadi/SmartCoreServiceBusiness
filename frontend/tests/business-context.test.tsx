import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BUSINESS_SELECTION_STORAGE_KEY, BusinessContextProvider, getBusinessQueryKey, useBusinessContext } from "@/shared/providers/business-context-provider";
import type { Business } from "@/api/types";

const { getBusinessMock } = vi.hoisted(() => ({ getBusinessMock: vi.fn() }));

vi.mock("@/api/businesses", () => ({
  getBusiness: getBusinessMock,
}));

const business: Business = {
  id: "business-1",
  organizationId: "organization-1",
  slug: "example-business",
  defaultLocale: "en",
  supportedLocales: ["en"],
  timezone: "UTC",
  currency: "USD",
  status: "active",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  profile: undefined,
};

function Probe() {
  const context = useBusinessContext();
  return (
    <div>
      <output data-testid="business-id">{context.businessId ?? "none"}</output>
      <output data-testid="business-name">{context.business?.slug ?? "none"}</output>
      <output data-testid="loading">{String(context.isLoading)}</output>
      <output data-testid="error">{context.error?.code ?? "none"}</output>
      <button onClick={() => context.setBusinessId("business-1")}>select</button>
      <button onClick={context.clearBusiness}>clear</button>
    </div>
  );
}

function renderContext() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <BusinessContextProvider>
        <Probe />
      </BusinessContextProvider>
    </QueryClientProvider>,
  );
}

describe("Business Context infrastructure", () => {
  afterEach(() => {
    cleanup();
    window.localStorage.clear();
    getBusinessMock.mockReset();
  });

  it("starts without a selected business", async () => {
    renderContext();

    await waitFor(() => expect(screen.getByTestId("business-id").textContent).toBe("none"));
    expect(screen.getByTestId("business-name").textContent).toBe("none");
    expect(getBusinessMock).not.toHaveBeenCalled();
  });

  it("sets and persists a selected business ID", async () => {
    getBusinessMock.mockResolvedValue({ ok: true, data: business, status: 200 });
    renderContext();

    screen.getByRole("button", { name: "select" }).click();

    await waitFor(() => expect(screen.getByTestId("business-id").textContent).toBe("business-1"));
    expect(window.localStorage.getItem(BUSINESS_SELECTION_STORAGE_KEY)).toBe("business-1");
    expect(getBusinessMock).toHaveBeenCalledWith("business-1");
    await waitFor(() => expect(screen.getByTestId("business-name").textContent).toBe("example-business"));
  });

  it("clears selection and persistence", async () => {
    window.localStorage.setItem(BUSINESS_SELECTION_STORAGE_KEY, "business-1");
    getBusinessMock.mockResolvedValue({ ok: true, data: business, status: 200 });
    renderContext();

    await waitFor(() => expect(screen.getByTestId("business-id").textContent).toBe("business-1"));
    screen.getByRole("button", { name: "clear" }).click();

    await waitFor(() => expect(screen.getByTestId("business-id").textContent).toBe("none"));
    expect(window.localStorage.getItem(BUSINESS_SELECTION_STORAGE_KEY)).toBeNull();
    expect(screen.getByTestId("business-name").textContent).toBe("none");
  });

  it("isolates query data by business ID", () => {
    expect(getBusinessQueryKey("business-1")).toEqual(["business", "business-1"]);
    expect(getBusinessQueryKey("business-2")).not.toEqual(getBusinessQueryKey("business-1"));
  });

  it.each([
    ["BUSINESS_NOT_FOUND"],
    ["BUSINESS_ACCESS_DENIED"],
  ])("exposes backend error %s without interpreting authorization", async (code) => {
    getBusinessMock.mockResolvedValue({
      ok: false,
      status: code === "BUSINESS_NOT_FOUND" ? 404 : 403,
      error: { code, message: "Backend response", details: {}, httpStatus: code === "BUSINESS_NOT_FOUND" ? 404 : 403 },
    });
    renderContext();
    screen.getByRole("button", { name: "select" }).click();

    await waitFor(() => expect(screen.getByTestId("error").textContent).toBe(code));
    expect(screen.getByTestId("business-id").textContent).toBe("business-1");
    expect(window.localStorage.getItem(BUSINESS_SELECTION_STORAGE_KEY)).toBe("business-1");
  });
});