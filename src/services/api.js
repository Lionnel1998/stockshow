// Service API pour communiquer avec le backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.token = localStorage.getItem('token');
    }

    // Méthode générique pour les requêtes HTTP
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(this.token && { Authorization: `Bearer ${this.token}` }),
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);
            
            // Gérer les erreurs 401 (non autorisé)
            if (response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
                throw new Error('Session expirée');
            }

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Erreur serveur');
            }
            
            return data;
        } catch (error) {
            console.error('Erreur API:', error);
            throw error;
        }
    }

    // Authentification
    async login(email, motDePasse) {
        const data = await this.request('/auth/connexion', {
            method: 'POST',
            body: JSON.stringify({ email, motDePasse }),
        });
        
        if (data.token) {
            this.token = data.token;
            localStorage.setItem('token', data.token);
        }
        
        return data;
    }

    async register(userData) {
        return await this.request('/auth/inscription', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async logout() {
        try {
            await this.request('/auth/deconnexion', { method: 'POST' });
        } finally {
            this.token = null;
            localStorage.removeItem('token');
        }
    }

    async verifyEmail(token) {
        return await this.request(`/auth/verification-email?token=${token}`);
    }

    // Utilisateurs
    async getUsers() {
        return await this.request('/users');
    }

    async createUser(userData) {
        return await this.request('/users', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async updateUser(id, userData) {
        return await this.request(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
    }

    async updateUserStatus(id, statut_inscription) {
        return await this.request(`/users/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ statut_inscription }),
        });
    }

    async deleteUser(id) {
        return await this.request(`/users/${id}`, {
            method: 'DELETE',
        });
    }

    async toggleUser(id) {
        return await this.request(`/users/${id}/toggle`, {
            method: 'PATCH',
        });
    }

    async getProfile() {
        return await this.request('/users/profile');
    }

    // Rôles
    async getRoles() {
        return await this.request('/roles');
    }

    async createRole(roleData) {
        return await this.request('/roles', {
            method: 'POST',
            body: JSON.stringify(roleData),
        });
    }

    async updateRole(id, roleData) {
        return await this.request(`/roles/${id}`, {
            method: 'PUT',
            body: JSON.stringify(roleData),
        });
    }

    async deleteRole(id) {
        return await this.request(`/roles/${id}`, {
            method: 'DELETE',
        });
    }

    // Produits
    async getProducts() {
        return await this.request('/products');
    }

    async getProduct(id) {
        return await this.request(`/products/${id}`);
    }

    async createProduct(productData) {
        return await this.request('/products', {
            method: 'POST',
            body: JSON.stringify(productData),
        });
    }

    async updateProduct(id, productData) {
        return await this.request(`/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(productData),
        });
    }

    async deleteProduct(id) {
        return await this.request(`/products/${id}`, {
            method: 'DELETE',
        });
    }

    async updateProductStock(id, stock) {
        return await this.request(`/products/${id}/stock`, {
            method: 'PATCH',
            body: JSON.stringify({ stock }),
        });
    }

    async getStockAlerts() {
        return await this.request('/products/alerts/check');
    }

    // Catégories
    async getCategories() {
        return await this.request('/categories');
    }

    async getCategory(id) {
        return await this.request(`/categories/${id}`);
    }

    async createCategory(categoryData) {
        return await this.request('/categories', {
            method: 'POST',
            body: JSON.stringify(categoryData),
        });
    }

    async updateCategory(id, categoryData) {
        return await this.request(`/categories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(categoryData),
        });
    }

    async deleteCategory(id) {
        return await this.request(`/categories/${id}`, {
            method: 'DELETE',
        });
    }

    // Fournisseurs
    async getSuppliers() {
        return await this.request('/suppliers');
    }

    async getSupplier(id) {
        return await this.request(`/suppliers/${id}`);
    }

    async createSupplier(supplierData) {
        return await this.request('/suppliers', {
            method: 'POST',
            body: JSON.stringify(supplierData),
        });
    }

    async updateSupplier(id, supplierData) {
        return await this.request(`/suppliers/${id}`, {
            method: 'PUT',
            body: JSON.stringify(supplierData),
        });
    }

    async deleteSupplier(id) {
        return await this.request(`/suppliers/${id}`, {
            method: 'DELETE',
        });
    }

    // Alertes
    async getAlerts(filters = {}) {
        const params = new URLSearchParams(filters).toString();
        return await this.request(`/alerts${params ? '?' + params : ''}`);
    }

    async getUnreadAlerts() {
        return await this.request('/alerts/unread');
    }

    async markAlertAsRead(id) {
        return await this.request(`/alerts/${id}/read`, {
            method: 'PATCH',
        });
    }

    async markAllAlertsAsRead() {
        return await this.request('/alerts/read-all', {
            method: 'PATCH',
        });
    }

    async treatAlert(id, action) {
        return await this.request(`/alerts/${id}/treat`, {
            method: 'PATCH',
            body: JSON.stringify({ action }),
        });
    }

    async getAlertStats() {
        return await this.request('/alerts/stats');
    }

    // Mouvements de stock
    async recordStockMovement(movementData) {
        return await this.request('/stock/mouvement', {
            method: 'POST',
            body: JSON.stringify(movementData),
        });
    }

    async getStockMovements(filters = {}) {
        const params = new URLSearchParams(filters).toString();
        return await this.request(`/stock/mouvements${params ? '?' + params : ''}`);
    }

    async getStockStatus() {
        return await this.request('/stock/etat');
    }

    async updateProductThreshold(id, seuil) {
        return await this.request(`/stock/${id}/seuil`, {
            method: 'PATCH',
            body: JSON.stringify({ seuilAlerte: seuil }),
        });
    }

    // Ventes
    async recordSale(saleData) {
        return await this.request('/sales', {
            method: 'POST',
            body: JSON.stringify(saleData),
        });
    }

    async getSalesStats(filters = {}) {
        const params = new URLSearchParams(filters).toString();
        return await this.request(`/sales/stats${params ? '?' + params : ''}`);
    }

    setToken(token) {
        this.token = token;
    }
}

const apiService = new ApiService();

export default apiService;
export { apiService };
