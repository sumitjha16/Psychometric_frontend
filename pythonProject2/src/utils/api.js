import axios from "axios";

// Analyze resume API
export const analyzeResume = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(`/api/analyze`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

// Backend health check API
export const healthCheck = async () => {
  try {
    const response = await axios.get(`/api/health`); // Adjusted to `/api`
    return response.status === 200;
  } catch {
    return false;
  }
};
