import { AppShell } from "@/components/app-shell";
import { BusinessContextProvider } from "@/shared/providers/business-context-provider";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <BusinessContextProvider>
      <AppShell>{children}</AppShell>
    </BusinessContextProvider>
  );
}
