// API Client for Frontend
// Connects the static frontend to the Next.js backend API

const API_BASE = '/api';

async function fetchAPI(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'API request failed' }));
      throw new Error(error.error || 'API request failed');
    }

    return res.json();
  } catch (error) {
    console.warn('API Error:', error.message);
    throw error;
  }
}

// Inquiries API
window.portfolioAPI = {
  inquiries: {
    getAll: () => fetchAPI('/inquiries'),
    getOne: (id) => fetchAPI(`/inquiries/${id}`),
    create: (data) => fetchAPI('/inquiries', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => fetchAPI(`/inquiries/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => fetchAPI(`/inquiries/${id}`, { method: 'DELETE' }),
  },
  
  // Portfolio API
  portfolio: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return fetchAPI(`/portfolio${query ? `?${query}` : ''}`);
    },
    getOne: (slug) => fetchAPI(`/portfolio/${slug}`),
    create: (data) => fetchAPI('/portfolio', { method: 'POST', body: JSON.stringify(data) }),
    update: (slug, data) => fetchAPI(`/portfolio/${slug}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (slug) => fetchAPI(`/portfolio/${slug}`, { method: 'DELETE' }),
  },
  
  // Services API
  services: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return fetchAPI(`/services${query ? `?${query}` : ''}`);
    },
    getOne: (slug) => fetchAPI(`/services/${slug}`),
    create: (data) => fetchAPI('/services', { method: 'POST', body: JSON.stringify(data) }),
    update: (slug, data) => fetchAPI(`/services/${slug}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (slug) => fetchAPI(`/services/${slug}`, { method: 'DELETE' }),
  },
  
  // Blog API
  blog: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return fetchAPI(`/blog${query ? `?${query}` : ''}`);
    },
    getOne: (slug) => fetchAPI(`/blog/${slug}`),
    create: (data) => fetchAPI('/blog', { method: 'POST', body: JSON.stringify(data) }),
    update: (slug, data) => fetchAPI(`/blog/${slug}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (slug) => fetchAPI(`/blog/${slug}`, { method: 'DELETE' }),
  },
  
  // Settings API
  settings: {
    get: () => fetchAPI('/settings'),
    update: (data) => fetchAPI('/settings', { method: 'PUT', body: JSON.stringify(data) }),
  },
  
  // Upload API
  upload: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!res.ok) {
      throw new Error('Upload failed');
    }
    
    return res.json();
  },
  
  // Submit inquiry (convenience function)
  submitInquiry: (formData) => {
    return fetchAPI('/inquiries', {
      method: 'POST',
      body: JSON.stringify({
        ...formData,
        createdAt: new Date().toISOString()
      }),
    });
  },
};
