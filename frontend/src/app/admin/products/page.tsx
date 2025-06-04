// pages/admin/page.tsx
import ProductTable from "@/components/ProductTable";

export default function ProductsPage () {
    return (
        <div className="ml-10">
            <h1 className="text-3xl font-semibold mb-10 mt-10">Продукты</h1>
            <ProductTable />
        </div>
    );
};