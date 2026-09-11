import { redirect } from "next/navigation";

/**
 * Legacy Procurement Desk route.
 * Redirects into the single Unified Admin Portal (/admin/dashboard).
 */
export default function LegacyProcurementRedirect() {
  redirect("/admin/dashboard");
}
