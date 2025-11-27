// src/js/api.js
import store from './store.js';

const BASE_URL = 'https://shift.appap.it/api/v1';

export const ENDPOINTS = {
    LOGIN: '/auth/login.php',
    HOME_STATS: '/dashboard/home_stats.php',
    CLOCK_IN: '/shifts/clock_in.php',
    // VERIFICA CHE QUESTA RIGA CI SIA:
    ADMIN_USERS_LIST: '/admin/users/list.php', 
};

export const apiCall = async (endpoint, method = 'GET', body = null) => {
    const token = store.getters.token?.value || localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const config = { method, headers };
    if (body) config.body = JSON.stringify(body);

    try {
        if (!endpoint) throw new Error("Endpoint mancante");
        
        const response = await fetch(`${BASE_URL}${endpoint}`, config);
        
        if (response.status === 401) {
            store.dispatch('logout');
            window.location.reload();
            throw new Error("Sessione scaduta");
        }

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Errore API');
        
        return data;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};