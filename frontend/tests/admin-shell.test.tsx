import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AppShell } from "@/components/app-shell";

const { contextMock, localeMock, pathnameMock } = vi.hoisted(() => ({
  contextMock: vi.fn(),
  localeMock: vi.fn(),
  pathnameMock: vi.fn(),
}));

vi.mock("@/shared/providers/business-context-provider", () => ({
  useBusinessContext: contextMock,
}));

vi.mock("next-intl", () => ({
  useLocale: localeMock,
  useTranslations: () => (key: string) => ({
    product: "Platform",
    section: "Administration",
    title: "Service Business",
    navigation: "Admin navigation",
    selector: "Selected business",
    noBusiness: "No business selected",
    loading: "Loading business...",
    clear: "Clear",
    openMenu: "Open navigation",
    closeMenu: "Close navigation",
    "errors.notFound": "Business not found",
    "errors.accessDenied": "Business unavailable",
    "nav.dashboard": "Dashboard",
    "nav.business": "Business",
    "nav.locations": "Locations",
    "nav.categories": "Service Categories",
    "nav.services": "Services",
    "nav.policies": "Policies",
  }[key] ?? key),
}));

vi.mock("next/navigation", () => ({
  usePathname: pathnameMock,
}));

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => <a href={href} {...props}>{children}</a>,
}));

const baseContext = {
  businessId: null,
  business: null,
  isLoading: false,
  error: null,
  setBusinessId: vi.fn(),
  clearBusiness: vi.fn(),
};

function renderShell() {
  return render(<AppShell><p>Page content</p></AppShell>);
}

describe("generic admin shell", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders navigation labels and locale-aware links", () => {
    localeMock.mockReturnValue("en");
    pathnameMock.mockReturnValue("/en");
    contextMock.mockReturnValue(baseContext);
    renderShell();

    expect(screen.getByRole("navigation", { name: "Admin navigation" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Dashboard" }).getAttribute("href")).toBe("/en");
    expect(screen.getByRole("link", { name: "Business" }).getAttribute("href")).toBe("/en/business");
    expect(screen.getByRole("link", { name: "Locations" }).getAttribute("href")).toBe("/en/locations");
    expect(screen.getByRole("link", { name: "Service Categories" }).getAttribute("href")).toBe("/en/categories");
    expect(screen.getByRole("link", { name: "Services" }).getAttribute("href")).toBe("/en/services");
    expect(screen.getByRole("link", { name: "Policies" }).getAttribute("href")).toBe("/en/policies");
  });

  it("renders the loaded Business profile name without fabricated data", () => {
    localeMock.mockReturnValue("fa");
    pathnameMock.mockReturnValue("/fa");
    contextMock.mockReturnValue({
      ...baseContext,
      businessId: "business-1",
      business: { profile: { name: "Actual Business" }, slug: "actual-business" },
    });
    renderShell();

    expect(screen.getByText("Actual Business")).toBeTruthy();
    expect(screen.queryByText("Kimia Beauty Salon")).toBeNull();
    expect(screen.getByRole("link", { name: "Business" }).getAttribute("href")).toBe("/fa/business");
  });

  it.each([
    ["no business", { ...baseContext }, "No business selected"],
    ["loading", { ...baseContext, businessId: "business-1", isLoading: true }, "Loading business..."],
    ["not found", { ...baseContext, businessId: "business-1", error: { code: "BUSINESS_NOT_FOUND" } }, "Business not found"],
    ["access denied", { ...baseContext, businessId: "business-1", error: { code: "BUSINESS_ACCESS_DENIED" } }, "Business unavailable"],
  ])("renders the %s context state", (_name, context, expected) => {
    localeMock.mockReturnValue("en");
    pathnameMock.mockReturnValue("/en");
    contextMock.mockReturnValue(context);
    renderShell();

    expect(screen.getByText(expected)).toBeTruthy();
  });

  it("uses the existing Business Context clear operation", () => {
    localeMock.mockReturnValue("en");
    pathnameMock.mockReturnValue("/en");
    const clearBusiness = vi.fn();
    contextMock.mockReturnValue({ ...baseContext, businessId: "business-1", clearBusiness });
    renderShell();

    screen.getByRole("button", { name: "Clear" }).click();
    expect(clearBusiness).toHaveBeenCalledOnce();
  });
});