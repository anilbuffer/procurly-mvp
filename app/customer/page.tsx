import { redirect } from "next/navigation";

export default function CustomerIndexPage({
  searchParams,
}: {
  searchParams?: { tab?: string };
}) {
  const tab = searchParams?.tab;
  if (
    tab &&
    ["dashboard", "requests", "orders", "shipments", "payments", "documents", "settings"].includes(tab)
  ) {
    redirect(`/customer/${tab}`);
  }
  redirect("/customer/dashboard");
}
