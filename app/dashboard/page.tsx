import { redirect } from "next/navigation";

export default function DashboardLegacyRedirect({
  searchParams,
}: {
  searchParams?: { tab?: string };
}) {
  const tab = searchParams?.tab;
  if (
    tab &&
    ["dashboard", "requests", "orders", "shipments", "payments", "settings"].includes(tab)
  ) {
    redirect(`/customer/${tab}`);
  }
  redirect("/customer/dashboard");
}
