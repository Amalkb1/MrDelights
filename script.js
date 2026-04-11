// 1. Full Product Data with Pricing
const products = {
    dates: [
        { id: 'd1', name: 'Ajwa Dates', prices: { '250g': 450, '500g': 850, '1kg': 1600 }, desc: 'Premium black dates with an exceptionally soft profile.', icon: '🌴', image: 'ajwa_dates.png' },
        { id: 'd2', name: 'Deglet Noor', prices: { '250g': 200, '500g': 380, '1kg': 700 }, desc: 'The "Queen of Dates". Light, sweet, and semi-dry.', icon: '🏜️', image: 'deglet_noor.png' },
        { id: 'd3', name: 'Sukkary Dates', prices: { '250g': 300, '500g': 550, '1kg': 1000 }, desc: 'Melt-in-your-mouth sweetness with a golden hue.', icon: '✨', image: 'sukkary_dates.png' },
        { id: 'd4', name: 'Mabroom Dates', prices: { '250g': 350, '500g': 650, '1kg': 1200 }, desc: 'Slender, dark red dates with a chewy flesh.', icon: '💎', image: 'Mabroom_Dates.png' }
    ],
    figs: [
        { id: 'f1', name: 'Turkish Figs', prices: { '250g': 300, '500g': 580, '1kg': 1100 }, desc: 'Large, sun-dried figs with a rich caramel sweetness.', icon: '🍯', image: 'turkish_figs.png' },
        { id: 'f2', name: 'Afghani Figs', prices: { '250g': 400, '500g': 750, '1kg': 1400 }, desc: 'Premium white figs, incredibly soft and nutrient-dense.', icon: '🏔️', image: 'afghani_figs.png' }
    ],
    nuts: [
        { id: 'n1', name: 'Cashew', prices: { '250g': 250, '500g': 480, '1kg': 900 }, desc: 'Creamy, buttery, and premium grade crunchy cashews.', icon: '🥜', image: 'Cashew_nut.png' },
        { id: 'n2', name: 'Almond', prices: { '250g': 220, '500g': 420, '1kg': 800 }, desc: 'Crunchy California almonds, rich in Vitamin E.', icon: '🌰', image: 'Almond.png' },
        { id: 'n3', name: 'Pistachio', prices: { '250g': 350, '500g': 650, '1kg': 1200 }, desc: 'Perfectly roasted and lightly salted premium pistachios.', icon: '💚', image: 'pistachio_nut.png' },
        { id: 'n4', name: 'Walnut', prices: { '250g': 300, '500g': 550, '1kg': 1050 }, desc: 'High-quality walnuts, packed with Omega-3.', icon: '🧠', image: 'Walnut.png' }
    ],
    seeds: [
        { id: 's1', name: 'Sunflower Seed', prices: { '250g': 100, '500g': 180, '1kg': 350 }, desc: 'Nutrient-rich seeds, perfect for a healthy crunch.', icon: '🌻', image: 'sunflower_seeds.png' },
        { id: 's2', name: 'Pumpkin Seed', prices: { '250g': 150, '500g': 280, '1kg': 500 }, desc: 'Premium green pumpkin seeds, great for energy.', icon: '🎃', image: 'pumpkin_seeds.png' },
        { id: 's3', name: 'Watermelon Seed', prices: { '250g': 80, '500g': 150, '1kg': 280 }, desc: 'Sun-dried seeds, a traditional healthy mineral-rich snack.', icon: '🍉', image: 'watermelon_seeds.png' }
    ]
};

// ─── Cart State ───────────────────────────────────────────────────────────────
// Each item: { id, name, qty ('250g'|'500g'|'1kg'), price, unitKey }
let cart = [];

function getCartKey(name, qty) {
    return `${name}__${qty}`;
}

function findProduct(name) {
    for (const cat in products) {
        const found = products[cat].find(p => p.name === name);
        if (found) return found;
    }
    return null;
}

function addToCart(productName, qty) {
    const prod = findProduct(productName);
    if (!prod) return;

    const key = getCartKey(productName, qty);
    const existing = cart.find(i => i.key === key);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({
            key,
            name: productName,
            size: qty,
            unitPrice: prod.prices[qty],
            qty: 1
        });
    }

    updateCartBadge();
    renderCartItems();
    showCartToast(productName, qty);
}

function removeFromCart(key) {
    cart = cart.filter(i => i.key !== key);
    updateCartBadge();
    renderCartItems();
}

function changeCartQty(key, delta) {
    const item = cart.find(i => i.key === key);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        removeFromCart(key);
        return;
    }
    updateCartBadge();
    renderCartItems();
}

function updateCartBadge() {
    const total = cart.reduce((sum, i) => sum + i.qty, 0);
    const badge = document.getElementById('cart-badge');
    if (badge) {
        badge.textContent = total;
        badge.style.display = total > 0 ? 'flex' : 'none';
    }
}

function cartTotal() {
    return cart.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
}

// ─── Cart Toast ───────────────────────────────────────────────────────────────
function showCartToast(name, qty) {
    const toast = document.getElementById('cart-toast');
    if (!toast) return;
    toast.textContent = `✓ ${name} (${qty}) added to cart`;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2500);
}

// ─── Cart Sidebar ─────────────────────────────────────────────────────────────
function openCart() {
    document.getElementById('cart-sidebar').classList.add('active');
    document.getElementById('cart-overlay').classList.add('active');
}

function closeCart() {
    document.getElementById('cart-sidebar').classList.remove('active');
    document.getElementById('cart-overlay').classList.remove('active');
}

function renderCartItems() {
    const container = document.getElementById('cart-items-list');
    const totalEl = document.getElementById('cart-grand-total');
    const emptyEl = document.getElementById('cart-empty');
    const checkoutBtn = document.getElementById('cart-checkout-btn');

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '';
        emptyEl.style.display = 'flex';
        checkoutBtn.style.display = 'none';
        totalEl.textContent = '₹0';
        return;
    }

    emptyEl.style.display = 'none';
    checkoutBtn.style.display = 'flex';

    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <span class="cart-item-name">${item.name}</span>
                <span class="cart-item-size">${item.size}</span>
            </div>
            <div class="cart-item-controls">
                <button class="qty-btn" onclick="changeCartQty('${item.key}', -1)">−</button>
                <span class="qty-value">${item.qty}</span>
                <button class="qty-btn" onclick="changeCartQty('${item.key}', 1)">+</button>
            </div>
            <div class="cart-item-price">
                <span>₹${item.unitPrice * item.qty}</span>
                <button class="remove-btn" onclick="removeFromCart('${item.key}')"><i class='bx bx-trash'></i></button>
            </div>
        </div>
    `).join('');

    totalEl.textContent = `₹${cartTotal()}`;
}

// ─── Checkout Flow ────────────────────────────────────────────────────────────
function proceedToCheckout() {
    if (cart.length === 0) return;
    closeCart();

    // Populate the cart summary in the modal
    const summaryEl = document.getElementById('cart-modal-summary');
    if (summaryEl) {
        summaryEl.innerHTML =
            cart.map(item => `
                <div class="cart-summary-item">
                    <span>${item.name} (${item.size}) ×${item.qty}</span>
                    <span>₹${item.unitPrice * item.qty}</span>
                </div>
            `).join('') +
            `<div class="cart-summary-total">
                <span>Total</span>
                <span>₹${cartTotal()}</span>
            </div>`;
    }

    document.getElementById('cart-order-modal').classList.add('active');
}

// ─── Render Products ──────────────────────────────────────────────────────────
function renderProducts() {
    const generateCard = (prod) => `
        <div class="product-card">
            <div class="product-img-wrap">
                <img src="${prod.image}" alt="${prod.name}" class="product-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                <span class="product-emoji-placeholder" style="display: none;">${prod.icon}</span>
            </div>
            <div class="product-content">
                <h4 class="product-name">${prod.name}</h4>
                <p class="product-desc">${prod.desc}</p>
                <div class="card-size-select-wrap">
                    <select class="card-size-select" id="size-${prod.id}">
                        <option value="250g">250g — ₹${prod.prices['250g']}</option>
                        <option value="500g">500g — ₹${prod.prices['500g']}</option>
                        <option value="1kg">1kg — ₹${prod.prices['1kg']}</option>
                    </select>
                </div>
                <button class="btn btn-add-cart" onclick="addToCart('${prod.name}', document.getElementById('size-${prod.id}').value)">
                    <i class='bx bx-cart-add'></i> Add to Cart
                </button>
                <button class="btn btn-order" onclick="openOrderModal('${prod.name}')">Order Now</button>
            </div>
        </div>
    `;

    const grids = {
        'dates-grid': products.dates,
        'figs-grid': products.figs,
        'nuts-grid': products.nuts,
        'seeds-grid': products.seeds
    };

    for (const [id, data] of Object.entries(grids)) {
        const container = document.getElementById(id);
        if (container) container.innerHTML = data.map(generateCard).join('');
    }
}

// ─── Single Product Order Modal ────────────────────────────────────────────────
const modal = document.getElementById('order-modal');
const quantitySelect = document.getElementById('quantity');
const priceDisplay = document.getElementById('display-price');
const productNameDisplay = document.getElementById('display-product-name');
const selectedProductInput = document.getElementById('selected-product');

function openOrderModal(productName) {
    productNameDisplay.textContent = productName;
    selectedProductInput.value = productName;
    updatePrice();
    modal.classList.add('active');
}

function updatePrice() {
    const productName = selectedProductInput.value;
    const qty = quantitySelect.value;
    let currentProd = findProduct(productName);
    if (currentProd && currentProd.prices) {
        priceDisplay.textContent = currentProd.prices[qty];
    }
}

document.getElementById('order-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const product = selectedProductInput.value;
    const qty = quantitySelect.value;
    const price = priceDisplay.textContent;

    const message = `Hi MR Delights! I want to order:\n\n` +
                    `*Product:* ${product}\n` +
                    `*Quantity:* ${qty}\n` +
                    `*Total Price:* ₹${price}\n` +
                    `------------------\n` +
                    `*Customer:* ${name}\n` +
                    `*Phone:* ${phone}\n` +
                    `*Address:* ${address}`;

    window.open(`https://wa.me/919400449073?text=${encodeURIComponent(message)}`, '_blank');
});

// ─── Cart Order Modal Submit ──────────────────────────────────────────────────
document.getElementById('cart-order-form').addEventListener('submit', function(e) {
    e.preventDefault();
    if (cart.length === 0) return;

    const name = document.getElementById('cart-name').value;
    const phone = document.getElementById('cart-phone').value;
    const address = document.getElementById('cart-address').value;

    let itemLines = cart.map(item =>
        `  • ${item.name} (${item.size}) x${item.qty} = ₹${item.unitPrice * item.qty}`
    ).join('\n');

    const message =
        `Hi MR Delights! 🛒 I want to place a cart order:\n\n` +
        `*Items:*\n${itemLines}\n\n` +
        `*Grand Total:* ₹${cartTotal()}\n` +
        `------------------\n` +
        `*Customer:* ${name}\n` +
        `*Phone:* ${phone}\n` +
        `*Address:* ${address}`;

    window.open(`https://wa.me/919400449073?text=${encodeURIComponent(message)}`, '_blank');
});

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartBadge();
    renderCartItems();

    quantitySelect.addEventListener('change', updatePrice);

    // Close single-product modal
    document.querySelector('.close-modal').onclick = () => modal.classList.remove('active');
    window.onclick = (e) => {
        if (e.target == modal) modal.classList.remove('active');
        if (e.target == document.getElementById('cart-order-modal')) {
            document.getElementById('cart-order-modal').classList.remove('active');
        }
    };

    // Cart sidebar
    document.getElementById('cart-btn').addEventListener('click', openCart);
    document.getElementById('cart-overlay').addEventListener('click', closeCart);
    document.getElementById('close-cart-btn').addEventListener('click', closeCart);
    document.getElementById('cart-checkout-btn').addEventListener('click', proceedToCheckout);

    // Close cart order modal
    document.querySelector('.close-cart-modal').addEventListener('click', () => {
        document.getElementById('cart-order-modal').classList.remove('active');
    });

    // Mobile nav toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
        // close mobile nav when clicking outside it
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                navLinks.classList.remove('active');
            }
        });
    }

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
});
