import AdminSidebar from "@/app/admin/components/AdminSidebar";


export default function AdminLayout({children}: { children: React.ReactNode }) {
    return (
        <div style={{ display: 'flex' }}>
            <AdminSidebar />
            <main>{children}</main>
        </div>
    );
}