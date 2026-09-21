import { afterEach, describe, expect, it, vi } from "vitest";
import { buildUrl, requestJson } from "@/api/client";
import { classifyApiError } from "@/api/errors";
import { createBusiness } from "@/api/businesses";
import { listCategories } from "@/api/categories";
import { updatePolicy } from "@/api/policies";

const fetchMock = vi.fn();

describe("typed API contract layer", () => {
  afterEach(() => {
    fetchMock.mockReset();
    vi.unstubAllGlobals();
    delete process.env.NEXT_PUBLIC_API_BASE_URL;
  });

  it("constructs query parameters without empty values", () => {
    expect(buildUrl("/resource", { status: "active", empty: "", missing: undefined, page: 2 })).toBe(
      "/resource?status=active&page=2",
    );
  });

  it("constructs a POST URL, method, and serialized request body", async () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.example.test";
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ id: "business-1" }), { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);

    const request = { slug: "salon", profileName: "Salon", defaultLocale: "en", supportedLocales: ["en"], timezone: "UTC", currency: "USD" };
    const result = await createBusiness(request);

    expect(fetchMock).toHaveBeenCalledWith("https://api.example.test/api/v1/businesses", expect.objectContaining({
      method: "POST",
      body: JSON.stringify(request),
    }));
    expect(result).toEqual({ ok: true, data: { id: "business-1" }, status: 201 });
  });

  it("constructs lifecycle query routes through the shared client", async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify([]), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await listCategories("business-1", "archived");

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/v1/businesses/business-1/service-categories?status=archived",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("uses PUT for policy updates and preserves typed response data", async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ policyKey: "service.confirmation", version: 2 }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const request = { policyValueJson: { required: true } };
    const result = await updatePolicy("business-1", "service.confirmation", request);

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/v1/businesses/business-1/policies/service.confirmation",
      expect.objectContaining({ method: "PUT", body: JSON.stringify(request) }),
    );
    expect(result).toEqual({ ok: true, data: { policyKey: "service.confirmation", version: 2 }, status: 200 });
  });

  it("preserves known backend errors, details, and status", async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ code: "POLICY_VERSION_CONFLICT", message: "Conflict", details: { expected: 1 } }), { status: 409 }));
    vi.stubGlobal("fetch", fetchMock);

    const result = await requestJson("/resource");

    expect(result).toEqual({
      ok: false,
      status: 409,
      error: { code: "POLICY_VERSION_CONFLICT", message: "Conflict", details: { expected: 1 }, httpStatus: 409 },
    });
    expect(classifyApiError(result.ok ? { code: "", message: "" } : result.error)).toBe("conflict");
  });

  it("preserves unknown backend error codes", async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ code: "NEW_BACKEND_CODE", message: "New failure", details: { reason: "test" } }), { status: 422 }));
    vi.stubGlobal("fetch", fetchMock);

    const result = await requestJson("/resource");

    expect(result).toEqual({
      ok: false,
      status: 422,
      error: { code: "NEW_BACKEND_CODE", message: "New failure", details: { reason: "test" }, httpStatus: 422 },
    });
    expect(classifyApiError(result.ok ? { code: "", message: "" } : result.error)).toBe("unprocessableEntity");
  });

  it("preserves network failures as a distinct frontend error", async () => {
    fetchMock.mockRejectedValue(new Error("connection refused"));
    vi.stubGlobal("fetch", fetchMock);

    const result = await requestJson("/resource");

    expect(result).toEqual({
      ok: false,
      status: 0,
      error: { code: "NETWORK_ERROR", message: "connection refused", details: {}, httpStatus: 0 },
    });
    expect(classifyApiError(result.ok ? { code: "", message: "" } : result.error)).toBe("network");
  });
});