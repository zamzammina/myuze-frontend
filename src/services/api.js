import axios from 'axios';

const API_BASE_URL = 'https://myuze-mvp.onrender.com/api';
const USER_ID = 1;

// Tutorials
export const checkProgress = async (jobId) => {
  const response = await axios.get(`${API_BASE_URL}/tutorials/progress/${jobId}`);
  return response.data;
};

export const createTutorial = async (url, name, platform, numSteps, folderId = null) => {
  const response = await axios.post(`${API_BASE_URL}/tutorials/create`, {
    url,
    name,
    platform,
    numSteps,
    folderId,
    userId: USER_ID
  });
  return response.data;
};

export const getTutorials = async () => {
  const response = await axios.get(`${API_BASE_URL}/tutorials?userId=${USER_ID}`);
  return response.data;
};

export const getTutorial = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/tutorials/${id}`);
  return response.data;
};

export const updateTutorial = async (id, data) => {
  const response = await axios.put(`${API_BASE_URL}/tutorials/${id}`, data);
  return response.data;
};

export const deleteTutorial = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/tutorials/${id}`);
  return response.data;
};

export const uploadResultPhoto = async (tutorialId, photoBase64) => {
  const response = await axios.post(
    `${API_BASE_URL}/tutorials/${tutorialId}/result-photo`,
    { photoBase64 }
  );
  return response.data;
};

// Steps
export const deleteStep = async (stepId) => {
  const response = await axios.delete(`${API_BASE_URL}/steps/${stepId}`);
  return response.data;
};

// Folders
export const getFolders = async () => {
  const response = await axios.get(`${API_BASE_URL}/folders?userId=${USER_ID}`);
  return response.data;
};

export const createFolder = async (name) => {
  const response = await axios.post(`${API_BASE_URL}/folders`, {
    name,
    userId: USER_ID
  });
  return response.data;
};

// Products
export const addProductToStep = async (stepId, productName, productBrand = '') => {
  const response = await axios.post(`${API_BASE_URL}/products/steps/${stepId}`, {
    productName,
    productBrand
  });
  return response.data;
};

export const getTutorialProducts = async (tutorialId) => {
  const response = await axios.get(`${API_BASE_URL}/products/tutorials/${tutorialId}`);
  return response.data;
};

export const deleteProduct = async (productId) => {
  const response = await axios.delete(`${API_BASE_URL}/products/${productId}`);
  return response.data;
};

export const deleteProductFromStep = async (stepId, productId) => {
  const response = await axios.delete(`${API_BASE_URL}/products/steps/${stepId}/${productId}`);
  return response.data;
};

// Kit
export const getKit = async () => {
  const response = await axios.get(`${API_BASE_URL}/kit?userId=${USER_ID}`);
  return response.data;
};

export const addToKit = async (productId, hasProduct) => {
  const response = await axios.post(`${API_BASE_URL}/kit`, {
    productId,
    hasProduct,
    userId: USER_ID
  });
  return response.data;
};

export const toggleKitItem = async (kitItemId, hasProduct) => {
  const response = await axios.put(`${API_BASE_URL}/kit/${kitItemId}`, {
    hasProduct
  });
  return response.data;
};

export const checkTutorialCompatibility = async (tutorialId) => {
  const response = await axios.get(
    `${API_BASE_URL}/kit/tutorials/${tutorialId}/check?userId=${USER_ID}`
  );
  return response.data;
};

// Categories
export const getCategories = async () => {
  const response = await axios.get(`${API_BASE_URL}/categories?userId=${USER_ID}`);
  return response.data;
};

export const createCustomCategory = async (name) => {
  const response = await axios.post(`${API_BASE_URL}/categories`, { 
    name, 
    userId: USER_ID 
  });
  return response.data;
};