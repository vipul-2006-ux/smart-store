document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const loginBtn = document.getElementById('loginBtn');
  const loginModal = document.getElementById('loginModal');
  const closeLogin = document.getElementById('closeLogin');
  const loginForm = document.getElementById('loginForm');
  const productsGrid = document.getElementById('productsGrid');
  const exploreBtn = document.getElementById('exploreBtn');
  const loginError = document.getElementById('loginError');
  const cartBtn = document.getElementById('cartBtn');
  
  // Checkout Elements
  const checkoutModal = document.getElementById('checkoutModal');
  const closeCheckout = document.getElementById('closeCheckout');
  const confirmOrderBtn = document.getElementById('confirmOrderBtn');
  const checkoutItemsDiv = document.getElementById('checkoutItems');
  const checkoutTotal = document.getElementById('checkoutTotal');
  const checkoutMessage = document.getElementById('checkoutMessage');
  
  let cartCount = 0;
  let cartTotal = 0;
  let cartItems = [];
  let allProducts = []; // Store all products for filtering

  // Check if admin is logged in
  const navAdminContainer = document.getElementById('navAdminContainer');
  if (navAdminContainer && localStorage.getItem('isAdmin') === 'true') {
    navAdminContainer.style.display = 'block';
  }

  // Smooth scroll
  if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
      document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    });
  }
  
  const navShop = document.getElementById('navShop');
  if (navShop) {
    navShop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const navCategories = document.getElementById('navCategories');
  if (navCategories) {
    navCategories.addEventListener('click', (e) => {
      e.preventDefault();
      const catSection = document.getElementById('categoriesGrid');
      if (catSection) {
        catSection.parentElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Modal logic
  if (loginBtn && loginModal) {
    loginBtn.addEventListener('click', () => {
      loginModal.classList.add('active');
    });

    closeLogin.addEventListener('click', () => {
      loginModal.classList.remove('active');
      loginError.innerText = '';
    });

    loginModal.addEventListener('click', (e) => {
      if (e.target === loginModal) {
        loginModal.classList.remove('active');
        loginError.innerText = '';
      }
    });
  }

  // Checkout Modal logic
  if (cartBtn && checkoutModal) {
    cartBtn.addEventListener('click', () => {
      if (cartCount === 0) return alert('Cart is empty!');
      const token = localStorage.getItem('token');
      if (!token) return alert('Please login to place an order!');
      
      checkoutModal.classList.add('active');
      checkoutItemsDiv.innerHTML = cartItems.map(item => `<div>${item.name} - $${item.price}</div>`).join('');
      checkoutTotal.innerText = `Total: $${cartTotal.toFixed(2)}`;
    });

    closeCheckout.addEventListener('click', () => {
      checkoutModal.classList.remove('active');
      checkoutMessage.innerText = '';
    });
  }

  // Confirm Order Logic (Hits API Gateway v1/v2 -> Formspree)
  if (confirmOrderBtn) {
    confirmOrderBtn.addEventListener('click', async () => {
      confirmOrderBtn.innerText = 'Processing...';
      try {
        const token = localStorage.getItem('token');
        
        let endpoint = '/api/v1/orders/confirm'; // Default to v1
        if (window.location.pathname.includes('/api/v2/')) {
          endpoint = '/api/v2/orders/confirm';
        }

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            totalAmount: cartTotal.toFixed(2),
            items: cartItems
          })
        });
        
        const data = await response.json();
        if (data.success) {
          checkoutMessage.innerText = data.message;
          cartCount = 0;
          cartTotal = 0;
          cartItems = [];
          cartBtn.innerText = 'Cart (0)';
          setTimeout(() => checkoutModal.classList.remove('active'), 3000);
        } else {
          checkoutMessage.style.color = 'var(--error)';
          checkoutMessage.innerText = data.message || 'Error processing order';
        }
      } catch (err) {
        checkoutMessage.style.color = 'var(--error)';
        checkoutMessage.innerText = 'Connection error';
      } finally {
        confirmOrderBtn.innerText = 'Place Order';
      }
    });
  }

  // Auth Submit
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const btn = loginForm.querySelector('button');
      
      btn.innerText = 'Loading...';
      btn.style.opacity = '0.7';
      
      if (username && password) {
        try {
          let endpoint = '/api/auth/login';
          if (window.location.pathname.includes('/api/v1/')) {
            endpoint = '/api/v1/login';
          } else if (window.location.pathname.includes('/api/v2/')) {
            endpoint = '/api/v2/login';
          }
  
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
          });
        
        const data = await response.json();
        
        if (data.success) {
          const actualToken = data.data && data.data.token ? data.data.token : data.token;
          localStorage.setItem('token', actualToken);
          
          if (username === 'admin' || username === 'uvan_1005') {
            localStorage.setItem('isAdmin', 'true');
            // Admin Redirect
            window.location.href = '/admin.html';
            return;
          } else {
            localStorage.setItem('isAdmin', 'false');
          }

          loginBtn.innerText = 'Profile';
          loginBtn.onclick = () => alert('Welcome to your profile, ' + username);
          loginModal.classList.remove('active');
          
          // Show micro-interaction notification
          const notif = document.createElement('div');
          notif.className = 'glass-card fade-in-up';
          notif.style.position = 'fixed';
          notif.style.bottom = '20px';
          notif.style.right = '20px';
          notif.style.padding = '15px 20px';
          notif.style.color = '#10b981';
          notif.style.zIndex = '9999';
          notif.innerText = 'Successfully logged in!';
          document.body.appendChild(notif);
          setTimeout(() => notif.remove(), 3000);
        } else {
          loginError.innerText = data.message || 'Invalid credentials';
        }
        } catch (err) {
          const errorMsg = document.getElementById('loginError');
          errorMsg.innerText = 'Server connection failed';
          errorMsg.style.display = 'block';
        } finally {
          btn.innerText = 'Login';
          btn.style.opacity = '1';
        }
      }
    });
  }

  // Fetch Categories
  const categoriesGrid = document.getElementById('categoriesGrid');
  if (categoriesGrid) {
    fetchCategories();
  }

  async function fetchCategories() {
    try {
      const response = await fetch('/api/products/categories');
      const data = await response.json();
      if (data.success && data.data) {
        categoriesGrid.innerHTML = '';
        data.data.forEach((cat, i) => {
          const card = document.createElement('div');
          card.className = `glass-card fade-in-up category-card`;
          card.style.animationDelay = `${i * 0.1}s`;
          card.style.padding = '1.5rem';
          card.style.textAlign = 'center';
          card.style.cursor = 'pointer';
          card.innerHTML = `<h3 style="margin:0;color:var(--accent-primary)">${cat.name}</h3>`;
          
          card.addEventListener('click', () => {
            renderProducts(cat.name);
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
          });
          
          categoriesGrid.appendChild(card);
        });
      }
    } catch (err) {}
  }

  // Fetch Products
  if (productsGrid) {
    fetchProducts();
  }

  async function fetchProducts() {
    try {
      // Small delay to show skeleton animation beautifully
      await new Promise(r => setTimeout(r, 800));
      const response = await fetch('/api/products');
      const data = await response.json();

      if (data.success && data.data) {
        allProducts = data.data;
        renderProducts(); // Render all initially
      }
    } catch (err) {
      productsGrid.innerHTML = '<p class="error-msg">Failed to load products. Ensure the API is running.</p>';
    }
  }

  function renderProducts(categoryFilter = null) {
    if (!productsGrid) return;
    productsGrid.innerHTML = '';
    
    let filteredProducts = allProducts;
    if (categoryFilter) {
      filteredProducts = allProducts.filter(p => p.category_name === categoryFilter);
    }
    
    if (filteredProducts.length === 0) {
      productsGrid.innerHTML = '<p class="error-msg">No products found in this category.</p>';
      return;
    }

    filteredProducts.forEach((product, i) => {
      const card = document.createElement('div');
      card.className = `product-card glass-card fade-in-up`;
      card.style.animationDelay = `${(i % 10) * 0.05}s`;
      card.innerHTML = `
        <div class="product-image"></div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <div class="price">$${product.price}</div>
          <button class="btn-outline full-width add-to-cart">Add to Cart</button>
        </div>
      `;
      productsGrid.appendChild(card);
    });

    // Add to cart logic
    document.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', function() {
        cartCount++;
        cartBtn.innerText = `Cart (${cartCount})`;
        
        // Add to cart payload
        const cardInfo = this.parentElement;
        const name = cardInfo.querySelector('h3').innerText;
        const price = parseFloat(cardInfo.querySelector('.price').innerText.replace('$', ''));
        
        cartTotal += price;
        cartItems.push({ name, price });
        
        // Pop animation on button
        this.innerText = 'Added!';
        this.style.background = 'var(--success)';
        this.style.color = '#fff';
        this.style.borderColor = 'var(--success)';
        
        setTimeout(() => {
          this.innerText = 'Add to Cart';
          this.style.background = 'transparent';
          this.style.color = 'var(--text-primary)';
          this.style.borderColor = 'var(--border-glass)';
        }, 1000);
      });
    });
  }
});
