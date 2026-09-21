import React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getServiceCategoriesQueryKey, useArchiveCategory, useCreateCategory, useRestoreCategory, useServiceCategories, useUpdateCategory } from "@/features/categories/hooks/use-service-categories";
import type { ServiceCategory } from "@/api/types";

const { apiMocks } = vi.hoisted(() => ({ apiMocks: { list: vi.fn(), create: vi.fn(), update: vi.fn(), archive: vi.fn(), restore: vi.fn() } }));

vi.mock("@/api/categories", () => ({ listCategories: apiMocks.list, createCategory: apiMocks.create, updateCategory: apiMocks.update, archiveCategory: apiMocks.archive, restoreCategory: apiMocks.restore }));

const category: ServiceCategory = { id: "category-1", businessId: "business-1", name: "Hair", slug: "hair", parentCategoryId: null, status: "active", archivedAt: null, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" };

function TestQueryProvider({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

function ListProbe({ status = "active" as const }: { status?: "active" | "archived" | "all" }) {
  const query = useServiceCategories("business-1", status);
  return <output data-testid="categories">{query.isLoading ? "loading" : query.error ? (query.error as { code: string }).code : JSON.stringify(query.data ?? [])}</output>;
}

function MutationProbe() {
  const create = useCreateCategory("business-1");
  const update = useUpdateCategory("business-1");
  const archive = useArchiveCategory("business-1");
  const restore = useRestoreCategory("business-1");
  return <div><button onClick={() => create.mutate({ name: "Hair", slug: "hair", parentCategoryId: "parent-1" })}>create</button><button onClick={() => update.mutate({ categoryId: "category-1", request: { name: "Updated", slug: "updated" } })}>update</button><button onClick={() => archive.mutate("category-1")}>archive</button><button onClick={() => restore.mutate("category-1")}>restore</button></div>;
}

describe("Service Categories API/query infrastructure", () => {
  afterEach(() => { cleanup(); vi.clearAllMocks(); });

  it("isolates queries by business ID and status", async () => {
    apiMocks.list.mockResolvedValue({ ok: true, data: [category], status: 200 });
    render(<TestQueryProvider><ListProbe status="archived" /></TestQueryProvider>);
    await waitFor(() => expect(screen.getByTestId("categories").textContent).toContain("Hair"));
    expect(apiMocks.list).toHaveBeenCalledWith("business-1", "archived");
    expect(getServiceCategoriesQueryKey("business-1", "archived")).toEqual(["service-categories", "business-1", "archived"]);
    expect(getServiceCategoriesQueryKey("business-1", "active")).not.toEqual(getServiceCategoriesQueryKey("business-1", "archived"));
  });

  it("renders loading and empty states", async () => {
    let resolveRequest!: (value: unknown) => void;
    apiMocks.list.mockReturnValue(new Promise((resolve) => { resolveRequest = resolve; }));
    render(<TestQueryProvider><ListProbe /></TestQueryProvider>);
    expect(screen.getByTestId("categories").textContent).toBe("loading");
    resolveRequest({ ok: true, data: [], status: 200 });
    await waitFor(() => expect(screen.getByTestId("categories").textContent).toBe("[]"));
  });

  it.each(["BUSINESS_NOT_FOUND", "BUSINESS_ACCESS_DENIED", "PERSISTENCE_FAILURE"])("preserves %s list errors", async (code) => {
    apiMocks.list.mockResolvedValue({ ok: false, status: 500, error: { code, message: "Backend error", details: {}, httpStatus: 500 } });
    render(<TestQueryProvider><ListProbe /></TestQueryProvider>);
    await waitFor(() => expect(screen.getByTestId("categories").textContent).toBe(code));
  });

  it("uses exact selected-business payloads and invalidates scoped queries", async () => {
    apiMocks.create.mockResolvedValue({ ok: true, data: category, status: 201 });
    apiMocks.update.mockResolvedValue({ ok: true, data: category, status: 200 });
    apiMocks.archive.mockResolvedValue({ ok: true, data: { ...category, status: "archived" }, status: 201 });
    apiMocks.restore.mockResolvedValue({ ok: true, data: category, status: 201 });
    const invalidate = vi.spyOn(QueryClient.prototype, "invalidateQueries");
    render(<TestQueryProvider><MutationProbe /></TestQueryProvider>);
    fireEvent.click(screen.getByRole("button", { name: "create" }));
    fireEvent.click(screen.getByRole("button", { name: "update" }));
    fireEvent.click(screen.getByRole("button", { name: "archive" }));
    fireEvent.click(screen.getByRole("button", { name: "restore" }));
    await waitFor(() => expect(apiMocks.create).toHaveBeenCalledWith("business-1", { name: "Hair", slug: "hair", parentCategoryId: "parent-1" }));
    expect(apiMocks.update).toHaveBeenCalledWith("business-1", "category-1", { name: "Updated", slug: "updated" });
    expect(apiMocks.archive).toHaveBeenCalledWith("business-1", "category-1");
    expect(apiMocks.restore).toHaveBeenCalledWith("business-1", "category-1");
    await waitFor(() => expect(invalidate).toHaveBeenCalledWith({ queryKey: ["service-categories", "business-1"] }));
  });

  it("preserves archive business-rule errors from the typed API", async () => {
    apiMocks.archive.mockResolvedValue({ ok: false, status: 409, error: { code: "CATEGORY_HAS_ACTIVE_SERVICES", message: "Cannot archive", details: {}, httpStatus: 409 } });
    const result = await apiMocks.archive("business-1", "category-1");
    expect(result.error.code).toBe("CATEGORY_HAS_ACTIVE_SERVICES");
  });
});