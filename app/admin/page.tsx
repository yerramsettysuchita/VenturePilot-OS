import type { Metadata } from "next";
import AdminClient from "./AdminClient";

export const metadata: Metadata = {
  title: "Admin | VenturePilot OS",
  description: "Admin dashboard",
};

export default function AdminPage() {
  return <AdminClient />;
}
