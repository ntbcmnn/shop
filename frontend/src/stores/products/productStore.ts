import { axiosApi } from '@/globalConstants';
import { SubCategory } from '@/stores/subcategories/subcategoryStore';

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    subcategory_id: number;
    image_url: string | null;
    stock: boolean;
    discount: number;
    subCategory: SubCategory | null;
}

export interface ProductFilters {
    categoryId?: number;
    subcategoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
}

export interface ProductFilt {
    id: number;
    name: string;
    description: string | null;
    price: number;
    categoryId: number  | null;
    subcategory_id: number | null;
    image_url: string | null;
    stock: boolean;
    discount: number;
    subCategory: {
        id: number;
        name: string;
        category?: {
            id: number;
            name: string;
        } | null;
    } | null;
}


export interface ProductMutation {
    name: string;
    description: string;
    price: number;
    image_url?: string | null;
    subcategory_id: number;
    stock: boolean;
    discount: number;
}

export async function fetchProducts(): Promise<Product[]> {
    const res = await axiosApi.get<Product[]>('/products');
    return res.data;
}

export async function fetchProductsWithLimit(limit: number = 8): Promise<Product[]> {
    const res = await axiosApi.get<Product[]>(`/products/limited?limit=${limit}`);
    return res.data;
}

export async function fetchProduct(id: number): Promise<Product> {
    const res = await axiosApi.get<Product>(`/products/${id}`);
    return res.data;
}

export async function createProduct(data: ProductMutation, file?: File): Promise<Product> {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', String(data.price));
    formData.append('subcategory_id', String(data.subcategory_id));
    formData.append('stock', String(data.stock));       // "true" / "false"
    formData.append('discount', String(data.discount)); // число в строке

    if (file) formData.append('image_url', file);       // Ключ должен быть image_url

    const res = await axiosApi.post<Product>('/products', formData, {
        headers: {
            Authorization: `${localStorage.getItem('token') ?? ''}`,
            'Content-Type': 'multipart/form-data',
        },
    });

    return res.data;
}

export async function updateProduct(
    id: number,
    data: Partial<ProductMutation>,
    file?: File
): Promise<Product> {
    const formData = new FormData();

    if (data.name !== undefined) formData.append('name', data.name);
    if (data.description !== undefined) formData.append('description', data.description);
    if (data.price !== undefined) formData.append('price', String(data.price));
    if (data.subcategory_id !== undefined) formData.append('subcategory_id', String(data.subcategory_id));
    if (data.stock !== undefined) formData.append('stock', String(data.stock));
    if (data.discount !== undefined) formData.append('discount', String(data.discount));
    if (file) formData.append('image_url', file); // Ключ image_url, как на бекенде

    const res = await axiosApi.put<Product>(`/products/${id}`, formData, {
        headers: {
            Authorization: `${localStorage.getItem('token') ?? ''}`,
            'Content-Type': 'multipart/form-data',
        },
    });

    return res.data;
}

export async function deleteProduct(id: number): Promise<void> {
    await axiosApi.delete(`/products/${id}`, {
        headers: {
            Authorization: `${localStorage.getItem('token') ?? ''}`,
        },
    });
}
export async function fetchFilteredProducts(filters: {
    categoryId?: number;
    subcategoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    discount?: boolean;
    search?: string;
}): Promise<ProductFilt[]> {
    const params = new URLSearchParams();

    if (filters.categoryId !== undefined) {
        params.append('categoryId', filters.categoryId.toString());
    }
    if (filters.subcategoryId !== undefined) {
        params.append('subcategoryId', filters.subcategoryId.toString());
    }
    if (filters.minPrice !== undefined) {
        params.append('minPrice', Math.max(0, filters.minPrice).toString());
    }
    if (filters.maxPrice !== undefined) {
        params.append('maxPrice', Math.max(0, filters.maxPrice).toString());
    }
    if (filters.inStock !== undefined) {
        params.append('inStock', filters.inStock.toString());
    }
    if (filters.discount !== undefined) {
        params.append('discount', filters.discount.toString());
    }
    if (filters.search) {
        params.append('search', filters.search.trim());
    }

    try {
        const url = `/products/filter?${params.toString()}`;
        const res = await axiosApi.get<ProductFilt[]>(url);
        return res.data;
    } catch (error) {
        console.error('Error fetching filtered products:', error);
        throw error;
    }
}


export async function fetchPriceRange(filters: {
    categoryId?: number;
    subcategoryId?: number;
}): Promise<{ min: number; max: number }> {
    const params = new URLSearchParams();

    if (filters.categoryId !== undefined) {
        params.append('categoryId', filters.categoryId.toString());
    }
    if (filters.subcategoryId !== undefined) {
        params.append('subcategoryId', filters.subcategoryId.toString());
    }

    try {
        const response = await axiosApi.get<{ min: number; max: number }>('/products/price-range', {
            params: {
                categoryId: filters.categoryId,
                subcategoryId: filters.subcategoryId
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching price range:', error);
        return { min: 0, max: 10000 };
    }
}