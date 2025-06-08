'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { ProductFilt, fetchPriceRange, fetchFilteredProducts } from '@/stores/products/productStore';
import { Category, fetchCategories } from '@/stores/categories/categoriesStore';
import { fetchSubCategories, SubCategory } from '@/stores/subcategories/subcategoryStore';
import ProductFilter from "@/components/ProductFilter";
import ProductCardCatalog from "@/components/ProductCardCatalog";

const ITEMS_PER_PAGE = 12;

export default function Catalog() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [products, setProducts] = useState<ProductFilt[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<ProductFilt[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const currentFilters = {
        categoryId: getValidNumberParam(searchParams, 'categoryId'),
        subcategoryId: getValidNumberParam(searchParams, 'subcategoryId'),
        minPrice: getValidNumberParam(searchParams, 'minPrice'),
        maxPrice: getValidNumberParam(searchParams, 'maxPrice'),
        inStock: searchParams.get('inStock') === 'true',
        discount: searchParams.get('discount') === 'true',
        search: searchParams.get('search') || undefined,
        page: getValidNumberParam(searchParams, 'page') || 1,
    };

    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const [cats, subs, range] = await Promise.all([
                    fetchCategories(),
                    fetchSubCategories(),
                    fetchPriceRange({})
                ]);

                setCategories(cats);
                setSubcategories(subs);
                setPriceRange(range);
            } catch (err) {
                console.error('Ошибка загрузки данных:', err);
                setError('Не удалось загрузить данные. Пожалуйста, попробуйте позже.');
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();
    }, []);

    useEffect(() => {
        const applyFilters = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const filters = {
                    ...(currentFilters.categoryId && { categoryId: currentFilters.categoryId }),
                    ...(currentFilters.subcategoryId && { subcategoryId: currentFilters.subcategoryId }),
                    ...(currentFilters.minPrice && { minPrice: currentFilters.minPrice }),
                    ...(currentFilters.maxPrice && { maxPrice: currentFilters.maxPrice }),
                    ...(currentFilters.inStock && { inStock: currentFilters.inStock }),
                    ...(currentFilters.discount && { discount: currentFilters.discount }),
                    ...(currentFilters.search && { search: currentFilters.search })
                };

                const allFilteredProducts = await fetchFilteredProducts(filters);
                setFilteredProducts(allFilteredProducts);


                const totalPages = Math.ceil(allFilteredProducts.length / ITEMS_PER_PAGE);
                setTotalPages(totalPages);

                const page = currentFilters.page || 1;
                setCurrentPage(Math.min(page, totalPages));

                const startIndex = (page - 1) * ITEMS_PER_PAGE;
                const endIndex = startIndex + ITEMS_PER_PAGE;
                const paginatedProducts = allFilteredProducts.slice(startIndex, endIndex);

                setProducts(paginatedProducts);

                if (allFilteredProducts.length > 0) {
                    const prices = allFilteredProducts.map(p => p.price);
                    setPriceRange({
                        min: Math.min(...prices),
                        max: Math.max(...prices)
                    });
                }
            } catch (err) {
                console.error('Ошибка фильтрации:', err);
                setError('Ошибка при применении фильтров');
            } finally {
                setIsLoading(false);
            }
        };

        applyFilters();
    }, [searchParams]);

    function getValidNumberParam(params: URLSearchParams, key: string): number | undefined {
        const value = params.get(key);
        return value && !isNaN(Number(value)) ? Number(value) : undefined;
    }

    function hasActiveFilters(filters: typeof currentFilters): boolean {
        return Boolean(
            filters.categoryId ||
            filters.subcategoryId ||
            filters.minPrice ||
            filters.maxPrice ||
            filters.inStock ||
            filters.discount ||
            filters.search
        );
    }

    const handleFilterChange = (newFilters: {
        categoryId?: number;
        subcategoryId?: number;
        minPrice?: number;
        maxPrice?: number;
        inStock?: boolean;
        discount?: boolean;
        search?: string;
    }) => {
        const params = new URLSearchParams(searchParams.toString());

        params.delete('page');

        if (newFilters.categoryId !== undefined) {
            params.set('categoryId', newFilters.categoryId.toString());
        } else {
            params.delete('categoryId');
        }

        if (newFilters.subcategoryId !== undefined) {
            params.set('subcategoryId', newFilters.subcategoryId.toString());
        } else {
            params.delete('subcategoryId');
        }

        if (newFilters.minPrice !== undefined) {
            params.set('minPrice', newFilters.minPrice.toString());
        } else {
            params.delete('minPrice');
        }

        if (newFilters.maxPrice !== undefined) {
            params.set('maxPrice', newFilters.maxPrice.toString());
        } else {
            params.delete('maxPrice');
        }

        if (newFilters.inStock) {
            params.set('inStock', 'true');
        } else {
            params.delete('inStock');
        }

        if (newFilters.discount) {
            params.set('discount', 'true');
        } else {
            params.delete('discount');
        }

        if (newFilters.search) {
            params.set('search', newFilters.search);
        } else {
            params.delete('search');
        }

        router.replace(`${pathname}?${params.toString()}`);
    };

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        router.replace(`${pathname}?${params.toString()}`);
    };

    const resetFilters = () => {
        router.replace(pathname);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">Каталог товаров</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/4">
                    <ProductFilter
                        categories={categories}
                        subcategories={subcategories}
                        priceRange={priceRange}
                        currentFilters={currentFilters}
                        onChange={handleFilterChange}
                        onReset={resetFilters}
                    />
                </div>

                <div className="w-full md:w-3/4">
                    {isLoading ? (
                        <p>Загрузка...</p>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 mb-4">
                                {hasActiveFilters(currentFilters)
                                    ? "Товары по вашему запросу не найдены"
                                    : "Выберите фильтры для отображения товаров"}
                            </p>
                            {hasActiveFilters(currentFilters) && (
                                <button
                                    onClick={resetFilters}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Сбросить фильтры
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="mb-4 flex justify-between items-center">
                                <p className="text-gray-600">
                                    Найдено товаров: {filteredProducts.length}
                                </p>
                                <p className="text-gray-600">
                                    Страница {currentPage} из {totalPages}
                                </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <ProductCardCatalog key={product.id} product={product} />
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="flex justify-center mt-8">
                                    <nav className="inline-flex rounded-lg shadow overflow-hidden border border-gray-300">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className={`px-4 py-2 transition-colors duration-200 ${
                                                currentPage === 1
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-white text-black hover:bg-gray-100'
                                            }`}
                                        >
                                            Назад
                                        </button>

                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`px-4 py-2 transition-colors duration-200 border-l border-gray-300 ${
                                                    currentPage === page
                                                        ? 'bg-black text-white'
                                                        : 'bg-white text-black hover:bg-gray-100'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className={`px-4 py-2 transition-colors duration-200 border-l border-gray-300 ${
                                                currentPage === totalPages
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-white text-black hover:bg-gray-100'
                                            }`}
                                        >
                                            Вперед
                                        </button>
                                    </nav>
                                </div>
                            )}

                        </>
                    )}
                </div>
            </div>
        </div>
    );
}