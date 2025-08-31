import { apiSlice } from "../api/apiSlice";

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query({
      query: (email) => `/users?email=${email}`,
    }),
  }),
});

export const { useGetUsersQuery } = usersApi;
