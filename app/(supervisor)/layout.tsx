import Sidebar from "@/components/Sidebar";

export default function SupervisorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />
      <main className="ml-64 overflow-auto">{children}</main>
    </div>
  );
}
