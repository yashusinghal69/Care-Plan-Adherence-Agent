// API utility functions for handling base URLs and API calls

// Get the base URL for API calls
const getBaseUrl = () => {
  // In development, use relative paths
  if (import.meta.env.DEV) {
    return '';
  }
  
  // Check if VITE_BASE_URL is set and is not localhost
  const envBaseUrl = import.meta.env.VITE_BASE_URL;
  if (envBaseUrl && !envBaseUrl.includes('localhost')) {
    return envBaseUrl;
  }
  
  // In production, use the base path from Vite config
  return '/agents/patient-care-agent';
};

// Create API URL with proper base path
export const createApiUrl = (endpoint: string) => {
  const baseUrl = getBaseUrl();
  return `${baseUrl}${endpoint}`;
};

// API call wrapper
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = createApiUrl(endpoint);
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  return response;
};
