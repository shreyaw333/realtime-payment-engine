const API_BASE_URL = 'https://backend-solitary-bush-7320.fly.dev/api';

const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

export const authAPI = {
  register: async (email, password, name) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    if (data.token) {
      setAuthToken(data.token);
    }

    return data;
  },

  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    if (data.token) {
      setAuthToken(data.token);
    }

    return data;
  },

  logout: () => {
    removeAuthToken();
    return Promise.resolve();
  },
};

export const paymentAPI = {
  processPayment: async (paymentData) => {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/payments/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(paymentData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Payment processing failed');
    }

    return data;
  },

  getPayment: async (transactionId) => {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/payments/${transactionId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get payment');
    }

    return data;
  },
};

export const transactionAPI = {
  getTransactions: async () => {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/transactions`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get transactions');
    }

    return data;
  },
};

export const userAPI = {
  getProfile: async () => {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get profile');
    }

    return data;
  },

  getBalance: async () => {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/user/balance`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get balance');
    }

    return data;
  },
};

export { getAuthToken, setAuthToken, removeAuthToken };