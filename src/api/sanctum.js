import axios from 'axios';

export default axios.create({
    baseURL: `${import.meta.env.VITE_APP_API_URL}/sanctum`,
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});