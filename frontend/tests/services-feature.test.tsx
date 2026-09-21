import React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getServicesQueryKey, useArchiveService, useCreateService, useRestoreService, useServices, useUpdateService } from "@/features/services/hooks/use-services";
import { ServiceForm } from "@/features/services/components/service-form";
import type { Service, ServiceCategory } from "@/api/types";

const { apiMocks, translations } = vi.hoisted(() => ({
  apiMocks: { list: vi.fn(), create: vi.fn(), update: vi.fn(), archive: vi.fn(), restore: vi.fn() },
  translations: vi.fn((key: string, values?: { count?: number }) => values?.count !== undefined ? `${key}:${values.count}` : key),
}));

vi.mock("@/api/services", () => ({ listServices: apiMocks.list, createService: apiMocks.create, updateService: apiMocks.update, archiveService: apiMocks.archive, restoreService: apiMocks.restore }));
vi.mock("next-intl", () => ({ useTranslations: () => translations }));

const category: ServiceCategory = { id: "category-1", businessId: "business-1", name: "Hair", slug: "hair", parentCategoryId: null, status: "active", archivedAt: null, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" };
const service: Service = { id: "service-1", businessId: "business-1", categoryId: "category-1", name: "Cut", slug: "cut", durationMinutes: 30, status: "active", archivedAt: null, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" };

function TestQueryProvider({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

function ListProbe({ status = "active" as const }: { status?: "active" | "archived" | "all" }) {
  const query = useServices("business-1", status);
  return <output data-testid="services">{query.isLoading ? "loading" : query.error ? (query.error as { code: string }).code : JSON.stringify(query.data ?? [])}</output>;
}

function MutationProbe() {
  const create = useCreateService("business-1");
  const update = useUpdateService("business-1");
  const archive = useArchiveService("business-1");
  const restore = useRestoreService("business-1");
  return <div><button onClick={() => create.mutate({ categoryId: "category-1", name: "Cut", slug: "cut", durationMinutes: 30 })}>create</button><button onClick={() => update.mutate({ serviceId: "service-1", request: { categoryId: "category-1", durationMinutes: 45 } })}>update</button><button onClick={() => archive.mutate("service-1")}>archive</button><button onClick={() => restore.mutate("service-1")}>restore</button></div>;
}

describe("Services API/query infrastructure", () => {
  afterEach(() => { cleanup(); vi.clearAllMocks(); });

  it("isolates service queries by business ID and status", async () => {
    apiMocks.list.mockResolvedValue({ ok: true, data: [service], status: 200 });
    render(<TestQueryProvider><ListProbe status="archived" /></TestQueryProvider>);
    await waitFor(() => expect(screen.getByTestId("services").textContent).toContain("Cut"));
    expect(apiMocks.list).toHaveBeenCalledWith("business-1", "archived");
    expect(getServicesQueryKey("business-1", "archived")).toEqual(["services", "business-1", "archived"]);
    expect(getServicesQueryKey("business-1", "active")).not.toEqual(getServicesQueryKey("business-1", "archived"));
  });

  it("renders loading and empty states", async () => {
    let resolveRequest!: (value: unknown) => void;
    apiMocks.list.mockReturnValue(new Promise((resolve) => { resolveRequest = resolve; }));
    render(<TestQueryProvider><ListProbe /></TestQueryProvider>);
    expect(screen.getByTestId("services").textContent).toBe("loading");
    resolveRequest({ ok: true, data: [], status: 200 });
    await waitFor(() => expect(screen.getByTestId("services").textContent).toBe("[]"));
  });

  it.each(["BUSINESS_NOT_FOUND", "BUSINESS_ACCESS_DENIED", "PERSISTENCE_FAILURE"])("preserves %s list errors", async (code) => {
    apiMocks.list.mockResolvedValue({ ok: false, status: 500, error: { code, message: "Backend error", details: {}, httpStatus: 500 } });
    render(<TestQueryProvider><ListProbe /></TestQueryProvider>);
    await waitFor(() => expect(screen.getByTestId("services").textContent).toBe(code));
  });

  it("renders only same-business category options", () => {
    render(<ServiceForm categories={[category, { ...category, id: "archived-category", status: "archived", name: "Archived" }]} isSubmitting={false} onSubmit={vi.fn()} onCancel={vi.fn()} />);
    const options = Array.from(screen.getByLabelText("fields.category").querySelectorAll("option"));
    expect(options.map((option) => option.textContent)).toEqual(["fields.selectCategory", "Hair"]);
    expect(screen.queryByText("Archived")).toBeNull();
  });

  it("uses exact selected-business payloads and invalidates scoped queries", async () => {
    apiMocks.create.mockResolvedValue({ ok: true, data: service, status: 201 });
    apiMocks.update.mockResolvedValue({ ok: true, data: service, status: 200 });
    apiMocks.archive.mockResolvedValue({ ok: true, data: { ...service, status: "archived" }, status: 201 });
    apiMocks.restore.mockResolvedValue({ ok: true, data: service, status: 201 });
    const invalidate = vi.spyOn(QueryClient.prototype, "invalidateQueries");
    render(<TestQueryProvider><MutationProbe /></TestQueryProvider>);
    fireEvent.click(screen.getByRole("button", { name: "create" }));
    fireEvent.click(screen.getByRole("button", { name: "update" }));
    fireEvent.click(screen.getByRole("button", { name: "archive" }));
    fireEvent.click(screen.getByRole("button", { name: "restore" }));
    await waitFor(() => expect(apiMocks.create).toHaveBeenCalledWith("business-1", { categoryId: "category-1", name: "Cut", slug: "cut", durationMinutes: 30 }));
    expect(apiMocks.update).toHaveBeenCalledWith("business-1", "service-1", { categoryId: "category-1", durationMinutes: 45 });
    expect(apiMocks.archive).toHaveBeenCalledWith("business-1", "service-1");
    expect(apiMocks.restore).toHaveBeenCalledWith("business-1", "service-1");
    await waitFor(() => expect(invalidate).toHaveBeenCalledWith({ queryKey: ["services", "business-1"] }));
  });

  it("preserves category-archived restore errors", async () => {
    apiMocks.restore.mockResolvedValue({ ok: false, status: 409, error: { code: "CATEGORY_ARCHIVED", message: "Cannot restore", details: {}, httpStatus: 409 } });
    const result = await apiMocks.restore("business-1", "service-1");
    expect(result.error.code).toBe("CATEGORY_ARCHIVED");
  });
});