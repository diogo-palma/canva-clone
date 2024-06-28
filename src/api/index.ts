// api/index.ts

import axios from 'axios';

const ACCESS_KEY = import.meta.env.VITE_UNPLASH_ACCESS_KEY;
const url = import.meta.env.VITE_UNPLASH_URL;

export const getPhotos = async (page = 1, perPage = 10) => {
  try {
    const response = await axios.get(`${url}/photos`, {
      params: {
        page,
        per_page: perPage,        
      },
      headers: {
        Authorization: `Client-ID ${ACCESS_KEY}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao obter fotos do Unsplash:', error);
    return [];
  }
};

export const searchPhotos = async (query = '', page = 1, perPage = 10) => {
  try {
    const response = await axios.get(`${url}/search/photos`, {
      params: {
        query,
        page,
        per_page: perPage,
      },
      headers: {
        Authorization: `Client-ID ${ACCESS_KEY}`,
      },
    });
    console.log("response.data", response.data)

    return response.data.results; 
  } catch (error) {
    console.error('Erro ao buscar fotos no Unsplash:', error);
    return [];
  }
};
