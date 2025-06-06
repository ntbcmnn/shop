import CategoriesList from "@/components/CategoriesList";

export default function CategoriesPage() {
    return (
        <div className="px-4 flex flex-col items-center">
            <h1 className="mt-10 mb-10 text-3xl font-semibold">Категории</h1>

            <div>
                <CategoriesList/>
            </div>
        </div>
    );
}
