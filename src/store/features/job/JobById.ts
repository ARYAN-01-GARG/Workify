import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchJobById = createAsyncThunk(
    "job/fetchJobById",
    async (id: string) => {
        const response = await fetch(`https://naitikjain.me/api/jobs/${id}`);
        const data = await response.json();
        return data;
    }
);