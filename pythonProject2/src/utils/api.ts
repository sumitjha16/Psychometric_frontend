import axios from 'axios';

// Health check API
export async function healthCheck(): Promise<boolean> {
  try {
    const response = await axios.get('/api/health');
    return response.status === 200;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
}

// Resume analysis API
export async function analyzeResume(file: File): Promise<any> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post('/api/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error analyzing resume:', error);
    throw error.response?.data?.detail || 'Failed to analyze the resume.';
  }
}
