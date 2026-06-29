import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — Cherif Ouali",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-layout">{children}</div>;
}
