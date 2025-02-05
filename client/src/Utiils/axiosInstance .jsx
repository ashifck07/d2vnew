import axios from 'axios';

// Create axios instance
const apiClient = axios.create({
  baseURL: 'http://localhost:5000', // Update this to your backend URL
});

// Add a request interceptor to include the token dynamically
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('jwt'); // Retrieve the token dynamically
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
