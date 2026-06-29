import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MediaLibraryPage from "@/components/admin/MediaLibraryPage";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/admin");
  return <MediaLibraryPage userEmail={session.user.email ?? ""} />;
}
