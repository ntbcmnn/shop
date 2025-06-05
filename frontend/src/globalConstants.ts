import axios from "axios";
export const apiUrl = "http://localhost:8000";

export const axiosApi = axios.create({
    baseURL: apiUrl,
});