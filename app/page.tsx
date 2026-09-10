import { Suspense } from "react";
import { LoginView } from "@/components/auth/login-view";

export default function RootPage() {
  return (
    <Suspense>
      <LoginView />
    </Suspense>
  );
}
