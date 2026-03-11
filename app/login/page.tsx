import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Login | Hydro CRM",
  description: "Secure sign-in for Hydro CRM admin and super admin users.",
};

export default function LoginPage() {
  return <LoginForm />;
}
