interface Category {
    id: number;
    name: string;
    subCategories: string[];
}

export default function CategoriesList () {
    const categories: Category[] = [
        { id: 1, name: 'Одежда', subCategories: ['Платья', 'Топы', 'Штаны'] },
        { id: 2, name: 'Обувь', subCategories: ['Кроссовки', 'Туфли'] },
    ];

    return (
        <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Категории</h2>
            <div className="space-y-4">
                {categories.map((category) => (
                    <div key={category.id}>
                        <h3 className="font-semibold">{category.name}</h3>
                        <ul className="ml-4 space-y-2">
                            {category.subCategories.map((sub, index) => (
                                <li key={index} className="text-sm">{sub}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};
