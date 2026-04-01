const BASE_URL = 'https://sənin-api-url-un.com/api';

export const fetchData = async (endpoint) => {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`);
    return await response.json();
  } catch (error) {
    console.error("API Xətası:", error);
    throw error;
  }
};