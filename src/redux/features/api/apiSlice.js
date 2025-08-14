import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";

export const apiSlice = createApi({
    reducerPath: "chatApi",
    baseQuery: fetchBaseQuery({baseUrl:''})
})