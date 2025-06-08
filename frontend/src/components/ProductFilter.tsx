import { useState, useEffect } from 'react';
import { Category } from '@/stores/categories/categoriesStore';
import { SubCategory } from '@/stores/subcategories/subcategoryStore';

interface ProductFilterProps {
    categories: Category[];
    subcategories: SubCategory[];
    priceRange: { min: number; max: number };
    currentFilters: {
        categoryId?: number;
        subcategoryId?: number;
        minPrice?: number;
        maxPrice?: number;
        inStock?: boolean;
        discount?: boolean;
        search?: string;
    };
    onChange: (filters: {
        categoryId?: number;
        subcategoryId?: number;
        minPrice?: number;
        maxPrice?: number;
        inStock?: boolean;
        discount?: boolean;
        search?: string;
    }) => void;
    onReset: () => void;
}

export default function ProductFilter({
                                          categories,
                                          subcategories,
                                          priceRange,
                                          currentFilters,
                                          onChange,
                                          onReset,
                                      }: ProductFilterProps) {
    const [searchQuery, setSearchQuery] = useState(currentFilters.search || '');
    const [selectedCategory, setSelectedCategory] = useState<number | undefined>(currentFilters.categoryId);
    const [selectedSubcategory, setSelectedSubcategory] = useState<number | undefined>(currentFilters.subcategoryId);
    const [priceMin, setPriceMin] = useState<number | undefined>(currentFilters.minPrice);
    const [priceMax, setPriceMax] = useState<number | undefined>(currentFilters.maxPrice);
    const [inStock, setInStock] = useState<boolean>(currentFilters.inStock || false);
    const [discountOnly, setDiscountOnly] = useState<boolean>(currentFilters.discount || false);

    useEffect(() => {
        setSearchQuery(currentFilters.search || '');
        setSelectedCategory(currentFilters.categoryId);
        setSelectedSubcategory(currentFilters.subcategoryId);
        setPriceMin(currentFilters.minPrice);
        setPriceMax(currentFilters.maxPrice);
        setInStock(currentFilters.inStock || false);
        setDiscountOnly(currentFilters.discount || false);
    }, [currentFilters]);

    const handleApplyFilters = () => {
        onChange({
            categoryId: selectedCategory,
            subcategoryId: selectedSubcategory,
            minPrice: priceMin,
            maxPrice: priceMax,
            inStock,
            discount: discountOnly,
            search: searchQuery.trim() || undefined,
        });
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value ? parseInt(e.target.value) : undefined;
        setSelectedCategory(value);
        setSelectedSubcategory(undefined);
        onChange({
            categoryId: value,
            subcategoryId: undefined,
            minPrice: priceMin,
            maxPrice: priceMax,
            inStock,
            discount: discountOnly,
            search: searchQuery.trim() || undefined,
        });
    };

    const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value ? parseInt(e.target.value) : undefined;
        setSelectedSubcategory(value);

        onChange({
            categoryId: selectedCategory,
            subcategoryId: value,
            minPrice: priceMin,
            maxPrice: priceMax,
            inStock,
            discount: discountOnly,
            search: searchQuery.trim() || undefined,
        });
    };


    return (
        <div className="bg-white p-4 rounded-lg shadow sticky top-4">
            <h2 className="text-lg font-semibold mb-4">Фильтры</h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Поиск</label>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 border  rounded-md"
                        placeholder="Название товара"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
                    <select
                        value={selectedCategory || ''}
                        onChange={handleCategoryChange}
                        className="w-full px-3 py-2 border  rounded-md"
                    >
                        <option value="">Все категории</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Подкатегория</label>
                    <select
                        value={selectedSubcategory || ''}
                        onChange={handleSubcategoryChange}
                        className="w-full px-3 py-2 border rounded-md"
                        disabled={!selectedCategory}
                    >
                        <option value="">Все подкатегории</option>
                        {subcategories.map(subcategory => (
                            <option key={subcategory.id} value={subcategory.id}>
                                {subcategory.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Цена</label>
                    <div className="flex space-x-2">
                        <input
                            type="number"
                            value={priceMin || ''}
                            onChange={(e) => setPriceMin(e.target.value ? parseInt(e.target.value) : undefined)}
                            placeholder={`От ${priceRange.min}`}
                            className="w-1/2 px-3 py-2 border rounded-md"
                            min={priceRange.min}
                            max={priceRange.max}
                        />
                        <input
                            type="number"
                            value={priceMax || ''}
                            onChange={(e) => setPriceMax(e.target.value ? parseInt(e.target.value) : undefined)}
                            placeholder={`До ${priceRange.max}`}
                            className="w-1/2 px-3 py-2 border  rounded-md"
                            min={priceRange.min}
                            max={priceRange.max}
                        />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        Диапазон: {priceRange.min} - {priceRange.max}
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="inStock"
                            checked={inStock}
                            onChange={(e) => setInStock(e.target.checked)}
                            className="h-4 w-4 accent-black text-black border-gray-300 rounded"
                        />
                        <label htmlFor="inStock" className="ml-2 text-sm text-gray-700">
                            Только в наличии
                        </label>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="discount"
                            checked={discountOnly}
                            onChange={(e) => setDiscountOnly(e.target.checked)}
                            className="h-4 w-4 accent-black text-black border-gray-300 rounded"
                        />
                        <label htmlFor="discount" className="ml-2 text-sm text-gray-700">
                            Только со скидкой
                        </label>
                    </div>
                </div>

                <div className="flex space-x-2 pt-2">
                    <button
                        onClick={handleApplyFilters}
                        className="flex-1 bg-black  text-white py-2 px-4 rounded"
                    >
                        Применить
                    </button>
                    <button
                        onClick={() => {
                            onReset();
                            setSearchQuery('');
                            setSelectedCategory(undefined);
                            setSelectedSubcategory(undefined);
                            setPriceMin(undefined);
                            setPriceMax(undefined);
                            setInStock(false);
                            setDiscountOnly(false);
                        }}
                        className="flex-1 bg-white  text-black border-1 py-2 px-4 rounded"
                    >
                        Сбросить
                    </button>
                </div>
            </div>
        </div>
    );
}