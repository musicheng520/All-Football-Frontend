import apiClient from "./apiClient";

export const getFixtures = (params) => {
    return apiClient.get("/fixtures", { params });
};