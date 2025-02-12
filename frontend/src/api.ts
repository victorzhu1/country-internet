import axios from "axios";
import { Country, InternetStatistics } from "./types";

const API_BASE_URL = "http://localhost:4000/api";
const API_KEY = "victor1234567890";

// Send API Key in headers for authentication
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "x-api-key": API_KEY },
});

// API function to get all countries
export const getCountries = async (): Promise<Country[]> => {
  const response = await api.get("/countries");
  return response.data;
};

// API function to get all internet statistics
export const getInternetStatistics = async (countryCode: string): Promise<InternetStatistics> => {
  const response = await api.get(`/statistics/${countryCode}`);
  return response.data;
};

// API function to update WB data
export const updateInternetStatistics = async (countryCode: string, rate_wb: number) => {
  const response = await api.put(`/statistics/${countryCode}`, { rate_wb });
  return response.data;
};