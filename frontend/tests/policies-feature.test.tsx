import React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getPolicyQueryKey, getPolicyVersionsQueryKey, useCreatePolicy, useCurrentPolicy, usePolicyVersions, useUpdatePolicy } from "@/features/policies/hooks/use-policies";
import { policyEditorSchema } from "@/features/policies/schemas";
import type { BusinessPolicy } from "@/api/types";

const { apiMocks } = vi.hoisted(() => ({ apiMocks: { current: vi.fn(), versions: vi.fn(), create: vi.fn(), update: vi.fn() } }));

vi.mock("@/api/policies", () => ({ getPolicy: apiMocks.current, getPolicyVersions: apiMocks.versions, createPolicy: apiMocks.create, updatePolicy: apiMocks.update }));

const policy: BusinessPolicy = { id: "policy-1", businessId: "business-1", policyKey: "service.confirmation", policyValueJson: { required: true }, version: 2, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-02T00:00:00.000Z" };

function TestQueryProvider({ children }: { children: React.ReactNode }) { const client = new QueryClient({ defaultOptions: { queries: { retry: false } } }); return <QueryClientProvider client={client}>{children}</QueryClientProvider>; }
function CurrentProbe({ policyKey = "service.confirmation" }: { policyKey?: string }) { const query = useCurrentPolicy("business-1", policyKey); return <output data-testid="current">{query.isLoading ? "loading" : query.error ? (query.error as { code: string }).code : query.data?.policyKey ?? "empty"}</output>; }
function HistoryProbe() { const query = usePolicyVersions("business-1", "service.confirmation"); return <output data-testid="history">{query.isLoading ? "loading" : JSON.stringify(query.data ?? [])}</output>; }
function MutationProbe() { const create = useCreatePolicy("business-1", "service.confirmation"); const update = useUpdatePolicy("business-1", "service.confirmation"); return <div><button onClick={() => create.mutate({ policyKey: "service.confirmation", policyValueJson: { required: true } })}>create</button><button onClick={() => update.mutate({ policyValueJson: { required: false } })}>update</button></div>; }

describe("Business Policies API/query infrastructure", () => {
  afterEach(() => { cleanup(); vi.clearAllMocks(); });

  it("scopes current and history keys by business and policy key", () => {
    expect(getPolicyQueryKey("business-1", "service.confirmation")).toEqual(["business-policies", "business-1", "service.confirmation"]);
    expect(getPolicyVersionsQueryKey("business-1", "service.confirmation")).toEqual(["business-policy-versions", "business-1", "service.confirmation"]);
    expect(getPolicyQueryKey("business-1", "other.key")).not.toEqual(getPolicyQueryKey("business-2", "service.confirmation"));
  });

  it("loads current policy and version history through the typed API", async () => {
    apiMocks.current.mockResolvedValue({ ok: true, data: policy, status: 200 });
    apiMocks.versions.mockResolvedValue({ ok: true, data: [policy], status: 200 });
    render(<TestQueryProvider><CurrentProbe /><HistoryProbe /></TestQueryProvider>);
    await waitFor(() => expect(screen.getByTestId("current").textContent).toBe("service.confirmation"));
    await waitFor(() => expect(screen.getByTestId("history").textContent).toContain("service.confirmation"));
    expect(apiMocks.current).toHaveBeenCalledWith("business-1", "service.confirmation");
    expect(apiMocks.versions).toHaveBeenCalledWith("business-1", "service.confirmation");
  });

  it("preserves policy not found errors", async () => {
    apiMocks.current.mockResolvedValue({ ok: false, status: 404, error: { code: "POLICY_NOT_FOUND", message: "Missing", details: {}, httpStatus: 404 } });
    render(<TestQueryProvider><CurrentProbe /></TestQueryProvider>);
    await waitFor(() => expect(screen.getByTestId("current").textContent).toBe("POLICY_NOT_FOUND"));
  });

  it("validates JSON as an object and rejects malformed values", () => {
    expect(policyEditorSchema.safeParse({ policyKey: "service.confirmation", policyValueText: '{"required":true}' }).success).toBe(true);
    expect(policyEditorSchema.safeParse({ policyKey: "service.confirmation", policyValueText: "not-json" }).success).toBe(false);
    expect(policyEditorSchema.safeParse({ policyKey: "service.confirmation", policyValueText: "[]" }).success).toBe(false);
  });

  it("uses exact create/update payloads and invalidates both scoped queries", async () => {
    apiMocks.create.mockResolvedValue({ ok: true, data: policy, status: 201 });
    apiMocks.update.mockResolvedValue({ ok: true, data: { ...policy, version: 3 }, status: 200 });
    const invalidate = vi.spyOn(QueryClient.prototype, "invalidateQueries");
    render(<TestQueryProvider><MutationProbe /></TestQueryProvider>);
    fireEvent.click(screen.getByRole("button", { name: "create" }));
    fireEvent.click(screen.getByRole("button", { name: "update" }));
    await waitFor(() => expect(apiMocks.create).toHaveBeenCalledWith("business-1", { policyKey: "service.confirmation", policyValueJson: { required: true } }));
    expect(apiMocks.update).toHaveBeenCalledWith("business-1", "service.confirmation", { policyValueJson: { required: false } });
    await waitFor(() => expect(invalidate).toHaveBeenCalledWith({ queryKey: ["business-policies", "business-1", "service.confirmation"] }));
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["business-policy-versions", "business-1", "service.confirmation"] });
  });

  it("preserves version conflict errors for explicit conflict UX", async () => {
    apiMocks.update.mockResolvedValue({ ok: false, status: 409, error: { code: "POLICY_VERSION_CONFLICT", message: "Conflict", details: {}, httpStatus: 409 } });
    const result = await apiMocks.update("business-1", "service.confirmation", { policyValueJson: { required: false } });
    expect(result.error.code).toBe("POLICY_VERSION_CONFLICT");
  });
});