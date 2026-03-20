/**
 * API Integration for Portfolio Frontend
 * Handles dynamic data loading and form submissions
 */

const API_BASE = '/api';

// ============================================
// INQUIRY FORM HANDLER
// ============================================

function initInquiryForms() {
  document.querySelectorAll('form.inquire-form').forEach(function(form) {
    if (form.dataset.apiIntegrated) return;
    form.dataset.apiIntegrated = 'true';
    
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.textContent : 'Submit';
      
      // Show loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }
      
      // Gather form data
      const formData = {
        name: form.elements.name ? form.elements.name.value.trim() : '',
        email: form.elements.email ? form.elements.email.value.trim() : '',
        phone: form.elements.phone ? form.elements.phone.value.trim() : '',
        company: form.elements.company ? form.elements.company.value.trim() : '',
        projectType: form.elements.project_type ? form.elements.project_type.value : '',
        service: form.elements.service ? form.elements.service.value : '',
        budget: form.elements.budget ? form.elements.budget.value : '',
        message: form.elements.message ? form.elements.message.value.trim() : '',
        source: window.location.pathname
      };
      
      try {
        // Try API first
        const response = await fetch(API_BASE + '/inquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        
        if (response.ok) {
          // Success
          form.reset();
          alert('Thank you for your inquiry! I will get back to you within 24-48 hours.');
          
          // Close modal if inside one
          const modal = form.closest('.inquire-modal');
          if (modal) {
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
          }
        } else {
          throw new Error('Server error');
        }
      } catch (error) {
        console.log('API unavailable, using fallback email');
        // Fallback to mailto
        submitFormViaEmail(form);
      } finally {
        // Reset button
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      }
    });
  });
}

function submitFormViaEmail(form) {
  const to = 'rovicdenielmejia@gmail.com';
  const cc = 'wrs.recruitment.hr@gmail.com,techprintcoreph@gmail.com,rovicmejia.hrd@gmail.com';
  
  const name = form.elements.name ? form.elements.name.value.trim() : '';
  const email = form.elements.email ? form.elements.email.value.trim() : '';
  const phone = form.elements.phone ? form.elements.phone.value.trim() : '';
  const message = form.elements.message ? form.elements.message.value.trim() : '';
  
  let body = [];
  if (name) body.push('Name: ' + name);
  if (email) body.push('Email: ' + email);
  if (phone) body.push('Phone: ' + phone);
  body.push('');
  body.push(message || '');
  
  let bodyStr = body.join('\n');
  if (bodyStr.length > 1200) bodyStr = bodyStr.slice(0, 1200) + '\n\n[... truncated ...]';
  
  const mailto = 'mailto:' + to + '?cc=' + encodeURIComponent(cc) + '&subject=' + encodeURIComponent('Portfolio Inquiry') + '&body=' + encodeURIComponent(bodyStr);
  window.location.href = mailto;
}

// ============================================
// DYNAMIC PORTFOLIO LOADER
// ============================================

async function loadPortfolioItems(containerSelector, options = {}) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  
  const { category = null, featured = false, limit = null } = options;
  
  try {
    let url = API_BASE + '/portfolio?';
    if (category) url += 'category=' + category + '&';
    if (featured) url += 'featured=true&';
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to load portfolio');
    
    let items = await response.json();
    if (limit) items = items.slice(0, limit);
    
    // Render items
    container.innerHTML = items.map(item => createPortfolioCard(item)).join('');
    
    // Initialize lightbox for new items
    if (typeof initLightbox === 'function') {
      initLightbox();
    }
    
  } catch (error) {
    console.error('Error loading portfolio:', error);
    // Keep static content if API fails
  }
}

function createPortfolioCard(item) {
  const imageUrl = item.imageUrl || 'Assets/placeholder.png';
  const categoryLabel = formatCategory(item.category);
  
  return `
    <figure class="portfolio-featured-item">
      <div class="gallery-item">
        <img loading="lazy" src="${imageUrl}" alt="${item.title}">
      </div>
      <figcaption class="portfolio-item-caption">${item.title}</figcaption>
      <p class="portfolio-item-description">${item.description || ''}</p>
    </figure>
  `;
}

// ============================================
// DYNAMIC SERVICES LOADER
// ============================================

async function loadServices(containerSelector, options = {}) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  
  const { category = null, active = true } = options;
  
  try {
    let url = API_BASE + '/services?';
    if (category) url += 'category=' + category + '&';
    if (active) url += 'active=true&';
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to load services');
    
    const services = await response.json();
    
    container.innerHTML = services.map(service => createServiceCard(service)).join('');
    
  } catch (error) {
    console.error('Error loading services:', error);
  }
}

function createServiceCard(service) {
  const features = Array.isArray(service.features) 
    ? service.features.map(f => `<li>${f}</li>`).join('')
    : '';
  
  return `
    <article class="pricing-card">
      <h3 class="pricing-card-title">${service.title}</h3>
      <p class="pricing-card-desc">${service.shortDesc || service.description || ''}</p>
      ${service.price ? `<p class="pricing-card-price">${service.price}</p>` : ''}
      ${features ? `<ul class="pricing-features">${features}</ul>` : ''}
      <a href="contact" class="btn btn-outline">Get Started</a>
    </article>
  `;
}

// ============================================
// DYNAMIC BLOG LOADER
// ============================================

async function loadBlogPosts(containerSelector, options = {}) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  
  const { category = null, published = true, limit = null } = options;
  
  try {
    let url = API_BASE + '/blog?';
    if (category) url += 'category=' + category + '&';
    if (published) url += 'published=true&';
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to load blog posts');
    
    let posts = await response.json();
    if (limit) posts = posts.slice(0, limit);
    
    container.innerHTML = posts.map(post => createBlogCard(post)).join('');
    
  } catch (error) {
    console.error('Error loading blog posts:', error);
  }
}

function createBlogCard(post) {
  const date = post.publishedAt 
    ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  
  return `
    <article class="blog-card">
      ${post.coverImage ? `<img src="${post.coverImage}" alt="${post.title}" loading="lazy">` : ''}
      <div class="blog-card-content">
        <span class="blog-card-date">${date}</span>
        <h3 class="blog-card-title"><a href="blog/${post.slug}">${post.title}</a></h3>
        <p class="blog-card-excerpt">${post.excerpt || ''}</p>
      </div>
    </article>
  `;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatCategory(category) {
  const categories = {
    'brand-identity': 'Brand Identity',
    'marketing': 'Marketing',
    'social-media': 'Social Media',
    'event': 'Event',
    'print': 'Print',
    'specialized': 'Specialized',
    'brand-strategy': 'Brand Strategy',
    'hr-strategy': 'HR Strategy'
  };
  return categories[category] || category || '';
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  // Initialize inquiry forms
  initInquiryForms();
  
  // Load dynamic content based on page
  const path = window.location.pathname;
  
  if (path.includes('portfolio')) {
    // Homepage featured work uses specific grid - uncomment if needed
    // loadPortfolioItems('.featured-grid', { featured: true, limit: 4 });
  }
  
  if (path.includes('services')) {
    // loadServices('.services-pillars-grid');
  }
  
  if (path.includes('blog') && !path.includes('/blog/')) {
    // loadBlogPosts('.blog-grid');
  }
});

// Export for manual use
window.PortfolioAPI = {
  loadPortfolioItems,
  loadServices,
  loadBlogPosts,
  initInquiryForms
};
