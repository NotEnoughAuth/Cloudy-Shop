/* =============================================
   Cloudy Shop — Main JavaScript
   "It works on my machine... which is in the cloud."
============================================= */

// ---- Product Catalogue ----
const PRODUCTS = [
  {
    icon: '☁️',
    name: 'Cumulus Mug',
    desc: 'Start every morning in the cloud. This 12 oz ceramic mug holds your coffee and your distributed dreams. Dishwasher safe — unlike your microservices.',
    price: 14.99,
    period: null,
    tag: 'Kitchen',
  },
  {
    icon: '🧦',
    name: 'Serverless Socks',
    desc: 'No threads to manage. These cozy socks auto-scale to fit any foot size and spin up instantly — cold starts not included.',
    price: 9.99,
    period: null,
    tag: 'Apparel',
  },
  {
    icon: '🖥️',
    name: 'Stratus VM Hoodie',
    desc: 'Rise above the rest in our premium hoodie. Elastically priced for all sizes. Provision one before your region sells out.',
    price: 39.99,
    period: null,
    tag: 'Apparel',
  },
  {
    icon: '📦',
    name: 'Nimbus Storage Box',
    desc: 'Virtually infinite storage — well, the physical kind. Fits exactly 12 cloud journals or one very ambitious rubber duck collection.',
    price: 19.99,
    period: null,
    tag: 'Storage',
  },
  {
    icon: '🔑',
    name: 'Zero-Trust Keychain',
    desc: 'Trust no one, not even your keys. This keychain verifies every access request before opening your door. (Verification is manual and on the honor system.)',
    price: 7.99,
    period: null,
    tag: 'Security',
  },
  {
    icon: '🌩️',
    name: 'Thunder Desk Mat',
    desc: 'A large desk mat with lightning bolt patterns for developers who like their workspaces the way they like their queries: fast and non-blocking.',
    price: 24.99,
    period: null,
    tag: 'Home Office',
  },
  {
    icon: '📡',
    name: 'Multi-Region Headband',
    desc: 'Keep your hair replicated across multiple zones simultaneously. Geo-redundant elasticity. Failover to your second pony tail in under 30ms.',
    price: 6.99,
    period: null,
    tag: 'Apparel',
  },
  {
    icon: '🤖',
    name: 'CI/CD Pipeline Poster',
    desc: 'A beautiful 24"×36" print of the perfect deployment pipeline. Frame it. Worship it. Cry next to it at 3 AM when the build fails. Motivational.',
    price: 17.99,
    period: null,
    tag: 'Decor',
  },
  {
    icon: '🐳',
    name: 'Container Ship Model',
    desc: 'A tiny ship model to remind you that containers were originally for cargo, not microservices. Comes pre-orchestrated. Kubernetes not included.',
    price: 34.99,
    period: null,
    tag: 'Collectibles',
  },
  {
    icon: '☕',
    name: 'Eventual Consistency Blend',
    desc: 'Our signature coffee roast. Not immediately strong — but give it time and it\'ll get there. Like a distributed write that propagates eventually.',
    price: 12.99,
    period: null,
    tag: 'Food & Drink',
  },
  {
    icon: '📓',
    name: 'Kubernetes Coloring Book',
    desc: 'For ages 5 and up (or senior engineers). Color in pods, nodes, and namespaces. Comes with a YAML-patterned cover. Very calming.',
    price: 11.99,
    period: null,
    tag: 'Books',
  },
  {
    icon: '🪣',
    name: 'S3 Bucket Hat',
    desc: 'Store everything you need on your head. Versioned brim, public read by default (misconfigured). Pairs well with our Zero-Trust Keychain.',
    price: 22.99,
    period: null,
    tag: 'Apparel',
  },
];

// ---- Cart State ----
let cart = [];

// ---- DOM Helpers ----
const productGrid = document.getElementById('productGrid');
const cartModal   = document.getElementById('cartModal');
const cartCount   = document.getElementById('cartCount');
const cartItems   = document.getElementById('cartItems');
const cartTotal   = document.getElementById('cartTotal');

// ---- Render Products ----
function renderProducts() {
  const fragment = document.createDocumentFragment();
  PRODUCTS.forEach((p) => {
    const card = document.createElement('div');
    card.className = 'product-card';

    const icon = document.createElement('div');
    icon.className = 'product-icon';
    icon.textContent = p.icon;

    const meta = document.createElement('div');
    const name = document.createElement('div');
    name.className = 'product-name';
    name.textContent = p.name;
    const tag = document.createElement('span');
    tag.className = 'product-tag';
    tag.textContent = p.tag;
    meta.append(name, tag);

    const desc = document.createElement('p');
    desc.className = 'product-desc';
    desc.textContent = p.desc;

    const price = document.createElement('div');
    price.className = 'product-price';
    const priceVal = document.createElement('span');
    priceVal.className = 'product-price-val';
    priceVal.textContent = `$${p.price.toFixed(2)}`;
    price.appendChild(priceVal);
    if (p.period) {
      const period = document.createElement('span');
      period.className = 'product-period';
      period.textContent = `/${p.period}`;
      price.appendChild(period);
    }

    const btn = document.createElement('button');
    btn.className = 'btn btn-primary add-to-cart-btn';
    btn.textContent = 'Add to Cart 🛒';
    btn.dataset.name = p.name;
    btn.dataset.price = p.price;

    card.append(icon, meta, desc, price, btn);
    fragment.appendChild(card);
  });
  productGrid.innerHTML = '';
  productGrid.appendChild(fragment);
}

// ---- Cart Logic ----
function addToCart(name, price) {
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  updateCartUI();
  cartModal.classList.remove('hidden');
}

function removeFromCart(name) {
  cart = cart.filter(i => i.name !== name);
  updateCartUI();
}

function updateCartUI() {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);

  cartCount.textContent = count;

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Your cart is emptier than a cold-started Lambda. Add something!</p>';
    cartTotal.textContent = '';
  } else {
    const fragment = document.createDocumentFragment();
    cart.forEach(i => {
      const row = document.createElement('div');
      row.className = 'cart-item';

      const itemName = document.createElement('span');
      itemName.className = 'cart-item-name';
      itemName.textContent = `${i.name} × ${i.qty}`;

      const itemPrice = document.createElement('span');
      itemPrice.className = 'cart-item-price';
      itemPrice.textContent = `$${(i.price * i.qty).toFixed(2)}`;

      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-btn remove-cart-btn';
      removeBtn.textContent = '🗑️';
      removeBtn.dataset.name = i.name;

      row.append(itemName, itemPrice, removeBtn);
      fragment.appendChild(row);
    });
    cartItems.innerHTML = '';
    cartItems.appendChild(fragment);
    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
  }
}

// ---- Cart Modal ----
document.getElementById('cartBtn').addEventListener('click', () => {
  cartModal.classList.remove('hidden');
});

document.getElementById('closeCart').addEventListener('click', () => {
  cartModal.classList.add('hidden');
});

cartModal.addEventListener('click', (e) => {
  if (e.target === cartModal) cartModal.classList.add('hidden');
});

// Event delegation — "Add to Cart" buttons in the product grid
productGrid.addEventListener('click', (e) => {
  const btn = e.target.closest('.add-to-cart-btn');
  if (!btn) return;
  addToCart(btn.dataset.name, parseFloat(btn.dataset.price));
});

// Event delegation — "Remove" buttons inside the cart modal
cartItems.addEventListener('click', (e) => {
  const btn = e.target.closest('.remove-cart-btn');
  if (!btn) return;
  removeFromCart(btn.dataset.name);
});

// Event delegation — "Add to Cart" buttons in the deals grid
document.querySelector('.deals-grid').addEventListener('click', (e) => {
  const btn = e.target.closest('.add-to-cart-deal');
  if (!btn) return;
  addToCart(btn.dataset.name, parseFloat(btn.dataset.price));
});

document.getElementById('checkoutBtn').addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Your cart is empty! Even our serverless functions need something to process. 🌩️');
    return;
  }
  cart = [];
  updateCartUI();
  cartModal.classList.add('hidden');
  alert('🚀 Order deployed successfully!\n\nYour purchase has been containerized, orchestrated with Kubernetes, and shipped via our artisanal CI/CD pipeline.\n\nExpected delivery: eventual consistency within 3-5 business days.');
});

// ---- Contact Form ----
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = document.getElementById('contactMsg');
  msg.textContent = '☁️ Message received and replicated across 3 availability zones! We\'ll respond with O(log n) latency. Thank you!';
  msg.classList.remove('hidden');
  e.target.reset();
  setTimeout(() => msg.classList.add('hidden'), 6000);
});

// ---- Init ----
renderProducts();
updateCartUI();
