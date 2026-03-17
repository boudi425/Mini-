const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const request = async (path, options = {}, accessToken) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include'
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
};

export { API_URL };
