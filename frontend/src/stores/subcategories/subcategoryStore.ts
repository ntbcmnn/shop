import { axiosApi } from '@/globalConstants';
import { Category } from '../categories/categoriesStore';

export interface SubCategory {
    id: number;
    name: string;
    category_id: number;
    category: Category
}

export interface SubCategoryMutation {
    name: string;
    category_id: number;
}


export async function fetchSubCategories(): Promise<SubCategory[]> {
    const res = await axiosApi.get<SubCategory[]>('/subcategories');
    return res.data;
}

export async function fetchSubCategory(id: number): Promise<SubCategory> {
    const res = await axiosApi.get<SubCategory>(`/subcategories/${id}`);
    return res.data;
}

export async function createSubCategory(data: SubCategoryMutation): Promise<SubCategory> {
    const res = await axiosApi.post<SubCategory>('/subcategories', data, {
        headers: { Authorization: `${localStorage.getItem('token') ?? ''}` },
    });
    return res.data;
}

export async function updateSubCategory(
    id: number,
    data: Partial<SubCategoryMutation>,
): Promise<SubCategory> {
    const res = await axiosApi.put<SubCategory>(`/subcategories/${id}`, data, {
        headers: {
            Authorization: `${localStorage.getItem('token') ?? ''}`,
        },
    });
    return res.data;
}

export async function deleteSubCategory(id: number): Promise<void> {
    await axiosApi.delete(`/subcategories/${id}`, {
        headers: {
            Authorization: `${localStorage.getItem('token') ?? ''}`,
        },
    });
}
