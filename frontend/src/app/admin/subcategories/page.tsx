import SubCategoriesList from "@/components/SubCategoriesList";

export default function SubCategoriesPage() {
    return (
        <div className="px-4 flex flex-col items-center">
            <h1 className="mt-10 mb-10 text-3xl font-semibold">Подкатегории</h1>

            <div>
                <SubCategoriesList/>
            </div>
        </div>
    );
}
