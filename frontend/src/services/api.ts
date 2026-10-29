import axios from 'axios';

export const TOKEN_KEY = 'token';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api',
});

// Request: injeta o JWT em toda chamada
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response: token expirado/inválido -> limpa sessão e volta ao login.
// (Exceto no próprio /auth/login, onde 401 = credenciais erradas, tratado na tela.)
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const url: string = error.config?.url ?? '';
    if (error.response?.status === 401 && !url.startsWith('/auth/')) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default api;
