import axios from "axios";

const Api = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

const getConfig = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Authorization': token ? `Bearer ${token}` : ''
        }
    };
};


console.log(`Auth Header: ${localStorage.getItem('token')}`);


//user

export const registerApi = (data) => Api.post("/api/user/create", data);

export const loginApi = (data) => Api.post("/api/user/login", data);

export const resetPasswordApi = (data) => Api.post("/api/user/reset-password", data);

export const getAllUsersApi = () => {
    return Api.get('/api/user/get_users', getConfig())
        .then((res) => res.data)
        .catch((error) => {
            console.error('Get All Users Error:', error.response?.data || error.message);
            throw new Error('Failed to fetch users.');
        });
};

export const deleteUserApi = (id) => Api.delete(`/api/user/delete_user/${id}`, getConfig());

// product

export const createProductApi = (formData) => {
    return Api.post('/api/product/create_product', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const getAllProductsApi = () => Api.get('/api/product/get_products');

export const getSingleProductApi = (id) => Api.get(`/api/product/get_product/${id}`);

export const updateProductApi = (id, formData) => {
    return Api.put(`/api/product/update_product/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const deleteProductApi = (id) => Api.delete(`/api/product/delete_product/${id}`);





//cart

export const addToCartApi = (data) => Api.post('/api/cart/add', data, getConfig());

export const getAllCartsApi = (userId) => Api.get(`/api/cart/getcart/${userId}`, getConfig());

export const addtoCartsApi = (formData) => Api.post('/api/cart/add', formData, getConfig());

export const deleteCartApi = (formData) => Api.delete('/api/cart/delete', { data: formData, ...getConfig() });

export const clearCartApi = (userId) => Api.post('/api/cart/clear', { userId }, getConfig());

export const updateCartApi = (formData) => Api.put('/api/cart/update', formData, getConfig());

//checkout

export const checkoutApi = async (userId) => {
    try {
        console.log(`Posting to: /api/cart/checkout with userId: ${userId}`);
        const response = await Api.post('/api/cart/checkout', { userId });
        return response.data;
    } catch (error) {
        console.error('Error during checkout:', error);
        throw error;
    }
};


//order 

export const createOrderApi = (userId, phoneNumber, location) => {
    return Api.post('/api/orders/create', { userId, phoneNumber, location }, getConfig())
        .then(response => response.data)
        .catch(error => {
            console.error('Error creating order:', error);
            throw error;
        });
};

export const getUserOrdersApi = async (userId) => {
    try {
        const response = await Api.get(`/api/orders/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user orders:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch orders');
    }
};
export const deleteOrderApi = (orderId) => Api.delete(`/api/orders/${orderId}`, getConfig());

export const getCart = (userId) => {
    return Api.get(`/api/cart/getcart/${userId}`)
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching cart:', error);
            throw error;
        });
};
export const getAllOrdersApi = () => {
    return Api.get('/api/orders/getallorders')
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching all orders:', error);
            throw error;
        });
};
