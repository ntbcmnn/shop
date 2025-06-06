import {axiosApi} from '@/globalConstants';

export interface Category {
    id: number;
    name: string;
    photo: string;
}

export interface CategoryMutation {
    name: string;
    photo: string;
}

export async function fetchCategories(): Promise<Category[]> {
    const res = await axiosApi.get<Category[]>('/categories');
    return res.data;
}

export async function fetchCategory(id: number): Promise<Category> {
    const res = await axiosApi.get<Category>(`/categories/${id}`);
    return res.data;
}

export async function createCategory(data: CategoryMutation, file?: File): Promise<Category> {
    const formData = new FormData();
    formData.append('name', data.name);
    if (file) formData.append('photo', file);

    const res = await axiosApi.post<Category>('/categories', formData, {
        headers: {Authorization: `${localStorage.getItem('token') ?? ''}`},
    });

    return res.data;
}

export async function updateCategory(
    id: number,
    data: Partial<CategoryMutation>,
    file?: File,
): Promise<Category> {
    const formData = new FormData();
    if (data.name !== undefined) formData.append('name', data.name);
    if (file) formData.append('photo', file);

    const res = await axiosApi.put<Category>(`/categories/${id}`, formData, {
        headers: {
            Authorization: `${localStorage.getItem('token') ?? ''}`,
        },
    });

    return res.data;
}

export async function deleteCategory(id: number): Promise<void> {
    await axiosApi.delete(`/categories/${id}`, {
        headers: {
            Authorization: `${localStorage.getItem('token') ?? ''}`,
        },
    });
}
