// api.ts
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8020/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.response.use(
    response => response,
    error => {
        return Promise.reject(error);
    }
);

export default api;
export { };  // Make sure TypeScript treats this as a module
