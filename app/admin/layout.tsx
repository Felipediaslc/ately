import AdminHeader from "@/components/ui/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0f0f11]">
      <AdminHeader />
      <main className="p-6">{children}</main>
    </div>
  );
}