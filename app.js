// ================================================
//  TechNova – App JavaScript
// ================================================

const WA_NUMBER = '51957411135'; // Perú +51

// ─── PRODUCT DATA ───────────────────────────────
const products = [
  {
    id: 1, category: 'laptop', emoji: '💻',
    name: 'MacBook Pro M4 14"',
    price: 34999, original: 42000,
    rating: 4.9, reviews: 238,
    badge: 'hot', desc: 'Chip M4 de Apple con 16GB RAM y 512GB SSD. La laptop más potente del mercado para profesionales.'
  },
  {
    id: 2, category: 'phone', emoji: '📱',
    name: 'iPhone 16 Pro Max',
    price: 29999, original: 32000,
    rating: 4.9, reviews: 512,
    badge: 'new', desc: 'Pantalla Super Retina XDR 6.9", chip A18 Pro, sistema de cámaras Pro con zoom óptico 5x.'
  },
  {
    id: 3, category: 'audio', emoji: '🎧',
    name: 'Sony WH-1000XM5',
    price: 7499, original: 9999,
    rating: 4.8, reviews: 891,
    badge: 'sale', desc: 'Cancelación de ruido líder de la industria, 30 horas de batería y audio Hi-Res. El estándar de oro.'
  },
  {
    id: 4, category: 'watch', emoji: '⌚',
    name: 'Apple Watch Ultra 2',
    price: 19999, original: null,
    rating: 4.7, reviews: 167,
    badge: 'new', desc: 'El smartwatch más resistente de Apple con pantalla de 49mm, titanio y GPS de doble frecuencia.'
  },
  {
    id: 5, category: 'laptop', emoji: '🖥️',
    name: 'Dell XPS 15 OLED',
    price: 28500, original: 34000,
    rating: 4.7, reviews: 304,
    badge: 'sale', desc: 'Pantalla OLED 3.5K táctil, Intel Core Ultra 9, RTX 4060. Diseño premium ultradelgado.'
  },
  {
    id: 6, category: 'gaming', emoji: '🎮',
    name: 'PlayStation 5 Pro',
    price: 13999, original: null,
    rating: 4.9, reviews: 1024,
    badge: 'hot', desc: 'Consola de última generación con GPU 45% más potente, soporte 8K y SSD ultrarrápido.'
  },
  {
    id: 7, category: 'phone', emoji: '🤖',
    name: 'Samsung Galaxy S25 Ultra',
    price: 27999, original: 31000,
    rating: 4.8, reviews: 445,
    badge: 'sale', desc: 'Galaxy AI integrado, S Pen incluido, cámara 200MP y batería de 5000mAh con carga 45W.'
  },
  {
    id: 8, category: 'audio', emoji: '🎵',
    name: 'AirPods Pro 3',
    price: 5999, original: 7499,
    rating: 4.8, reviews: 2341,
    badge: 'sale', desc: 'Cancelación activa de ruido, modo transparencia, audio espacial personalizado y hasta 30h de batería.'
  },
  {
    id: 9, category: 'gaming', emoji: '🖱️',
    name: 'Logitech G Pro X 2',
    price: 2999, original: 3999,
    rating: 4.7, reviews: 556,
    badge: null, desc: 'Mouse gaming profesional LIGHTFORCE 25K, inalámbrico, diseño ambidiestro sin compromiso.'
  },
  {
    id: 10, category: 'laptop', emoji: '💼',
    name: 'Lenovo ThinkPad X1 Carbon',
    price: 22000, original: 26500,
    rating: 4.6, reviews: 198,
    badge: null, desc: 'La laptop empresarial más ligera. 1.12kg, certificación MIL-SPEC, batería de 15 horas.'
  },
  {
    id: 11, category: 'watch', emoji: '⌚',
    name: 'Samsung Galaxy Watch 7',
    price: 6499, original: 7999,
    rating: 4.6, reviews: 289,
    badge: 'sale', desc: 'Monitoreo avanzado de salud, análisis de composición corporal, 40h de batería con AOD.'
  },
  {
    id: 12, category: 'audio', emoji: '🔊',
    name: 'Sonos Era 300',
    price: 11999, original: null,
    rating: 4.8, reviews: 134,
    badge: 'new', desc: 'Altavoz espacial con Dolby Atmos, seis drivers, Wi-Fi 6 y compatibilidad con voz. Sonido inmersivo 360°.'
  }
];

// ─── STATE ──────────────────────────────────────
let cart = [];
let wishlist = new Set();
let currentFilter = 'all';
let currentStep = 1;
let currentQvProduct = null;
let countdownEnd = Date.now() + (8 * 3600 + 34 * 60 + 20) * 1000;

// ─── UTILITY FUNCTIONS ──────────────────────────
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

function fmt(n) {
  return '$' + n.toLocaleString('es-MX') + ' MXN';
}

function stars(r) {
  return '★'.repeat(Math.floor(r)) + (r % 1 >= .5 ? '½' : '') + '☆'.repeat(5 - Math.ceil(r));
}

function showToast(msg, type = 'info') {
  const container = $('toast-container');
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.innerHTML = msg;
  container.appendChild(t);
  setTimeout(() => {
    t.classList.add('removing');
    setTimeout(() => t.remove(), 300);
  }, 2500);
}

function genOrderNumber() {
  return Math.floor(Math.random() * 900000 + 100000).toString();
}

function buildWaMessage(items = null) {
  const cartItems = items || cart;
  if (cartItems.length === 0) return 'Hola TechNova, me gustaría hacer un pedido.';
  const list = cartItems.map(i => `• ${i.name} x${i.qty} = ${fmt(i.price * i.qty)}`).join('\n');
  const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  return encodeURIComponent(`Hola TechNova! 👋\n\nQuiero confirmar mi pedido:\n\n${list}\n\n*Total: ${fmt(total)}*\n\nPor favor, indíqueme los pasos para completar mi compra. ¡Gracias!`);
}

function updateWaLinks() {
  const msg = buildWaMessage();
  const url = `https://wa.me/${WA_NUMBER}?text=${msg}`;
  const els = ['wa-order-btn', 'wa-checkout-link', 'wa-payment-link', 'wa-confirm-link'];
  els.forEach(id => { const el = $(id); if (el) el.href = url; });
}

// ─── CART LOGIC ─────────────────────────────────
function addToCart(productId) {
  const p = products.find(x => x.id === productId);
  if (!p) return;
  const existing = cart.find(x => x.id === productId);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...p, qty: 1 });
  }
  updateCartUI();
  updateWaLinks();
  showToast(`🛒 <strong>${p.name}</strong> agregado al carrito`, 'success');
  animateCartBtn();
}

function removeFromCart(productId) {
  cart = cart.filter(x => x.id !== productId);
  updateCartUI();
  updateWaLinks();
}

function updateQty(productId, delta) {
  const item = cart.find(x => x.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(productId);
  else updateCartUI();
  updateWaLinks();
}

function updateCartUI() {
  // Count badge
  const total = cart.reduce((s, i) => s + i.qty, 0);
  $('cart-count').textContent = total;
  $('cart-count').style.display = total > 0 ? 'flex' : 'none';

  // Items list
  const container = $('cart-items');
  const empty = $('cart-empty');
  const footer = $('cart-footer');

  if (cart.length === 0) {
    container.innerHTML = '';
    container.appendChild(empty);
    footer.style.display = 'none';
    return;
  }

  footer.style.display = 'block';
  const html = cart.map(item => `
    <div class="cart-item">
      <div class="ci-emoji">${item.emoji}</div>
      <div class="ci-info">
        <div class="ci-name">${item.name}</div>
        <div class="ci-price">${fmt(item.price)}</div>
        <div class="ci-qty-controls">
          <button class="qty-btn" onclick="updateQty(${item.id}, -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
        </div>
      </div>
      <button class="ci-remove" onclick="removeFromCart(${item.id})">✕</button>
    </div>
  `).join('');

  container.innerHTML = html;

  // Totals
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  $('cart-subtotal').textContent = fmt(subtotal);
  $('cart-total').textContent = fmt(subtotal);
  $('cart-shipping').textContent = 'GRATIS';
}

function animateCartBtn() {
  const btn = $('cart-btn');
  btn.style.transform = 'scale(1.2)';
  btn.style.background = 'var(--accent)';
  setTimeout(() => {
    btn.style.transform = '';
    btn.style.background = '';
  }, 300);
}

// ─── CART SIDEBAR ────────────────────────────────
function openCart() {
  $('cart-sidebar').classList.add('open');
  $('cart-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  $('cart-sidebar').classList.remove('open');
  $('cart-overlay').classList.remove('active');
  document.body.style.overflow = '';
}

// ─── PRODUCTS RENDERING ──────────────────────────
function renderProducts(filter = 'all') {
  const grid = $('products-grid');
  const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);

  grid.innerHTML = filtered.map(p => {
    const disc = p.original ? Math.round((1 - p.price / p.original) * 100) : null;
    const liked = wishlist.has(p.id);
    return `
      <div class="product-card" data-id="${p.id}" style="animation: fade-up .35s ease ${filtered.indexOf(p) * .05}s both">
        ${p.badge ? `<span class="product-badge badge-${p.badge}">${p.badge === 'sale' ? `−${disc}%` : p.badge === 'new' ? 'Nuevo' : '🔥 Hot'}</span>` : ''}
        <button class="product-wishlist ${liked ? 'liked' : ''}" onclick="toggleWishlist(${p.id}, this)" aria-label="Favorito">
          ${liked ? '❤️' : '🤍'}
        </button>
        <div class="product-image">
          <span>${p.emoji}</span>
          <div class="product-quick-view" onclick="openQuickView(${p.id})">Ver detalles →</div>
        </div>
        <div class="product-info">
          <span class="product-category">${categoryLabel(p.category)}</span>
          <h3 class="product-name">${p.name}</h3>
          <div class="product-rating">
            <span class="stars">${stars(p.rating)}</span>
            <span class="rating-count">(${p.reviews.toLocaleString()})</span>
          </div>
          <div class="product-pricing">
            <span class="product-price">${fmt(p.price)}</span>
            ${p.original ? `<span class="product-original">${fmt(p.original)}</span>` : ''}
            ${disc ? `<span class="product-discount">−${disc}%</span>` : ''}
          </div>
          <div class="product-actions">
            <button class="btn-add-cart" onclick="addToCart(${p.id})">🛒 Agregar</button>
            <button class="btn-quick-add" onclick="addToCartWA(${p.id})" title="Comprar por WhatsApp">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function categoryLabel(cat) {
  const map = { laptop: 'Laptops', phone: 'Smartphones', audio: 'Audio', watch: 'Wearables', gaming: 'Gaming', accesorios: 'Accesorios' };
  return map[cat] || cat;
}

function addToCartWA(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  const msg = encodeURIComponent(`Hola TechNova! 👋\n\nMe interesa comprar:\n• ${p.name} - ${fmt(p.price)}\n\n¿Está disponible? ¡Gracias!`);
  window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank');
}

// ─── QUICK VIEW ─────────────────────────────────
function openQuickView(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  currentQvProduct = p;
  const disc = p.original ? Math.round((1 - p.price / p.original) * 100) : null;

  $('qv-content').innerHTML = `
    <div class="qv-image">${p.emoji}</div>
    <div class="qv-info">
      <span class="qv-category">${categoryLabel(p.category)}</span>
      <h2 class="qv-name">${p.name}</h2>
      <div class="product-rating">
        <span class="stars">${stars(p.rating)}</span>
        <span class="rating-count">(${p.reviews.toLocaleString()} reseñas)</span>
      </div>
      <div class="qv-price-row">
        <span class="qv-price">${fmt(p.price)}</span>
        ${p.original ? `<span class="qv-original">${fmt(p.original)}</span>` : ''}
        ${disc ? `<span class="product-discount">−${disc}% OFF</span>` : ''}
      </div>
      <p class="qv-desc">${p.desc}</p>
      <div class="qv-actions">
        <button class="btn btn-primary" onclick="addToCart(${p.id}); closeQuickView()">🛒 Agregar al carrito</button>
        <button class="btn btn-whatsapp" onclick="addToCartWA(${p.id})">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
          Comprar por WhatsApp
        </button>
      </div>
    </div>
  `;

  $('quickview-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeQuickView() {
  $('quickview-overlay').classList.remove('active');
  document.body.style.overflow = '';
}

// ─── WISHLIST ────────────────────────────────────
function toggleWishlist(id, btn) {
  if (wishlist.has(id)) {
    wishlist.delete(id);
    btn.innerHTML = '🤍';
    btn.classList.remove('liked');
    showToast('💔 Eliminado de favoritos', 'info');
  } else {
    wishlist.add(id);
    btn.innerHTML = '❤️';
    btn.classList.add('liked');
    showToast('❤️ Agregado a favoritos', 'success');
  }
}

// ─── FILTER ─────────────────────────────────────
function initFilters() {
  $$('.filter-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.filter-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderProducts(currentFilter);
    });
  });

  $$('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      const filter = card.dataset.filter;
      document.querySelector('#productos').scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        $$('.filter-tab').forEach(b => b.classList.remove('active'));
        const tab = document.querySelector(`[data-filter="${filter}"]`);
        if (tab) { tab.classList.add('active'); renderProducts(filter); }
      }, 600);
    });
  });
}

// ─── SEARCH ─────────────────────────────────────
function initSearch() {
  const btn = $('search-btn');
  const overlay = $('search-overlay');
  const closeBtn = $('search-close');
  const input = $('search-input');
  const results = $('search-results');

  btn.addEventListener('click', () => {
    overlay.classList.add('active');
    setTimeout(() => input.focus(), 100);
  });

  closeBtn.addEventListener('click', () => overlay.classList.remove('active'));
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('active'); });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') overlay.classList.remove('active');
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); btn.click(); }
  });

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    if (!q) { results.innerHTML = ''; return; }
    const matches = products.filter(p => p.name.toLowerCase().includes(q) || categoryLabel(p.category).toLowerCase().includes(q));
    results.innerHTML = matches.slice(0, 6).map(p => `
      <div class="search-result-item">
        <span class="sr-emoji">${p.emoji}</span>
        <div class="sr-info">
          <div class="sr-name">${p.name}</div>
          <div class="sr-price">${fmt(p.price)}</div>
        </div>
        <button class="sr-add" onclick="addToCart(${p.id}); $('search-overlay').classList.remove('active')">Agregar</button>
      </div>
    `).join('') || '<div style="color:var(--text-3);text-align:center;padding:20px">Sin resultados</div>';
  });
}

// ─── NAVBAR SCROLL ───────────────────────────────
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  // Mobile drawer
  const toggle   = $('menu-toggle');
  const drawer   = $('mobile-drawer');
  const overlay  = $('mobile-overlay');
  const closeBtn = $('drawer-close');

  function openDrawer() {
    drawer.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', openDrawer);
  closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  // Cerrar al tocar cualquier link del drawer
  $$('.drawer-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}


// ─── PAYMENT MODAL ───────────────────────────────
function openPaymentModal() {
  if (cart.length === 0) {
    showToast('🛒 Tu carrito está vacío', 'info');
    return;
  }
  closeCart();
  currentStep = 1;
  renderPaymentStep();
  renderOrderSummary();
  $('payment-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closePaymentModal() {
  $('payment-overlay').classList.remove('active');
  document.body.style.overflow = '';
}

function renderPaymentStep() {
  // Step indicators
  for (let i = 1; i <= 3; i++) {
    const el = $(`step-${i}-indicator`);
    el.classList.remove('active', 'done');
    if (i === currentStep) el.classList.add('active');
    else if (i < currentStep) el.classList.add('done');
  }
  // Step content
  for (let i = 1; i <= 3; i++) {
    $(`step-${i}`).classList.toggle('hidden', i !== currentStep);
  }
}

function renderOrderSummary() {
  const el = $('payment-order-summary');
  if (!el) return;
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  el.innerHTML = `
    <div class="pos-title">Resumen del pedido</div>
    ${cart.map(i => `
      <div class="pos-item">
        <span>${i.emoji} ${i.name} x${i.qty}</span>
        <span>${fmt(i.price * i.qty)}</span>
      </div>
    `).join('')}
    <div class="pos-item">
      <span>Total</span>
      <span>${fmt(subtotal)}</span>
    </div>
  `;
}

function initPaymentMethods() {
  $$('.pay-method').forEach(pm => {
    pm.addEventListener('click', () => {
      $$('.pay-method').forEach(p => p.classList.remove('active'));
      pm.classList.add('active');
      const val = pm.querySelector('input').value;
      ['card-form', 'paypal-form', 'oxxo-form', 'whatsapp-form'].forEach(id => $$(id.replace('-', '-')));
      $('card-form').classList.toggle('hidden', val !== 'card');
      $('paypal-form').classList.toggle('hidden', val !== 'paypal');
      $('oxxo-form').classList.toggle('hidden', val !== 'oxxo');
      $('whatsapp-form').classList.toggle('hidden', val !== 'whatsapp');
      const goStep3 = $('go-step-3');
      if (val === 'whatsapp') {
        goStep3.style.display = 'none';
      } else {
        goStep3.style.display = '';
      }
    });
  });
}

function initCardInputs() {
  const numInput = $('card-number');
  const nameInput = $('card-name');
  const expInput = $('card-exp');

  numInput.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '').substring(0, 16);
    e.target.value = v.match(/.{1,4}/g)?.join(' ') || v;
    $('card-number-display').textContent = v.padEnd(16, '•').match(/.{1,4}/g).join(' ');
  });

  nameInput.addEventListener('input', e => {
    $('card-name-display').textContent = e.target.value.toUpperCase() || 'NOMBRE TITULAR';
  });

  expInput.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length >= 2) v = v.substring(0, 2) + '/' + v.substring(2, 4);
    e.target.value = v;
    $('card-exp-display').textContent = v || 'MM/AA';
  });
}

// ─── COUNTDOWN ───────────────────────────────────
function updateCountdown() {
  const diff = Math.max(0, countdownEnd - Date.now());
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  $('hours').textContent = String(h).padStart(2, '0');
  $('minutes').textContent = String(m).padStart(2, '0');
  $('seconds').textContent = String(s).padStart(2, '0');
}

// ─── HEADER VISIBILITY ON SCROLL ─────────────────
function initScrollAnimations() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  $$('.trust-item, .category-card, .product-card').forEach(el => {
    observer.observe(el);
  });
}

// ─── INIT ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  updateCartUI();
  initFilters();
  initSearch();
  initNavbar();
  initCardInputs();
  initPaymentMethods();
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Cart open/close
  $('cart-btn').addEventListener('click', openCart);
  $('cart-close').addEventListener('click', closeCart);
  $('cart-overlay').addEventListener('click', closeCart);

  // Checkout button
  $('checkout-btn').addEventListener('click', openPaymentModal);

  // Close quick view
  $('quickview-close').addEventListener('click', closeQuickView);
  $('quickview-overlay').addEventListener('click', e => {
    if (e.target === $('quickview-overlay')) closeQuickView();
  });

  // Close payment modal
  $('payment-close').addEventListener('click', closePaymentModal);
  $('payment-overlay').addEventListener('click', e => {
    if (e.target === $('payment-overlay')) closePaymentModal();
  });

  // Payment steps
  $('go-step-2').addEventListener('click', () => {
    const fname = $('fname').value.trim();
    const email = $('email').value.trim();
    if (!fname || !email) {
      showToast('⚠️ Por favor completa tu nombre y email', 'info');
      return;
    }
    currentStep = 2;
    renderPaymentStep();
    renderOrderSummary();
    updateWaLinks();
  });

  $('back-step-1').addEventListener('click', () => {
    currentStep = 1;
    renderPaymentStep();
  });

  $('go-step-3').addEventListener('click', () => {
    const selectedMethod = document.querySelector('.pay-method.active input')?.value || 'card';
    if (selectedMethod === 'card') {
      const num = $('card-number').value.replace(/\s/g, '');
      if (num.length < 16) {
        showToast('⚠️ Ingresa un número de tarjeta válido', 'info');
        return;
      }
    }
    currentStep = 3;
    $('order-number').textContent = genOrderNumber();
    renderPaymentStep();
    updateWaLinks();
    cart = [];
    updateCartUI();
  });

  $('confirm-close').addEventListener('click', () => {
    closePaymentModal();
    showToast('🎉 ¡Gracias por tu compra en TechNova!', 'success');
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeCart();
      closeQuickView();
      closePaymentModal();
    }
  });

  // Smooth scroll for logo
  $('logo-link').addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // WhatsApp cart order button
  updateWaLinks();

  // Simulate initial cart count hidden
  $('cart-count').style.display = 'none';

  // Scroll animations via CSS
  const style = document.createElement('style');
  style.textContent = `
    .product-card { opacity: 0; transform: translateY(20px); transition: opacity .5s ease, transform .5s ease; }
    .product-card[style*="animation"] { opacity: 1; transform: none; }
  `;
  document.head.appendChild(style);

  console.log('🚀 TechNova store initialized!');
});
