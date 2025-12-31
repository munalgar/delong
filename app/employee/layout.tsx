import EmployeeSidebar from "@/components/EmployeeSidebar";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100">
      <EmployeeSidebar />
      <main className="ml-64 overflow-auto">{children}</main>
    </div>
  );
}
