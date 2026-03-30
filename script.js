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

// card-level qty state
var cardQty = {};

function findProduct(name) {
    for (var cat in products) {
        var found = products[cat].find(function(p) { return p.name === name; });
        if (found) return found;
    }
    return null;
}

function findProductById(id) {
    for (var cat in products) {
        var found = products[cat].find(function(p) { return p.id === id; });
        if (found) return found;
    }
    return null;
}

// ─── Card qty + price live update ────────────────────────────────────────────
function initCardQty(prodId) {
    if (!cardQty[prodId]) cardQty[prodId] = 1;
}

function changeCardQty(prodId, delta) {
    initCardQty(prodId);
    cardQty[prodId] = Math.max(1, cardQty[prodId] + delta);
    var el = document.getElementById('card-qty-' + prodId);
    if (el) el.textContent = cardQty[prodId];
    updateCardPrice(prodId);
}

function updateCardPrice(prodId) {
    initCardQty(prodId);
    var sel = document.getElementById('size-' + prodId);
    var priceEl = document.getElementById('card-price-' + prodId);
    if (!sel || !priceEl) return;
    var prod = findProductById(prodId);
    if (prod) {
        var unitPrice = prod.prices[sel.value];
        priceEl.textContent = '\u20b9' + (unitPrice * cardQty[prodId]);
    }
}

// ─── Cart ─────────────────────────────────────────────────────────────────────
var cart = [];

function getCartKey(name, size) { return name + '__' + size; }

function addToCart(productName, prodId) {
    var sel = document.getElementById('size-' + prodId);
    var size = sel ? sel.value : '250g';
    var qty = cardQty[prodId] || 1;
    var prod = findProduct(productName);
    if (!prod) return;

    var key = getCartKey(productName, size);
    var existing = cart.find(function(i) { return i.key === key; });
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ key: key, name: productName, size: size, unitPrice: prod.prices[size], qty: qty });
    }

    // reset card qty
    cardQty[prodId] = 1;
    var qtyEl = document.getElementById('card-qty-' + prodId);
    if (qtyEl) qtyEl.textContent = '1';
    updateCardPrice(prodId);

    updateCartBadge();
    renderCartItems();
    showCartToast(productName, size, qty);
}

function removeFromCart(key) {
    cart = cart.filter(function(i) { return i.key !== key; });
    updateCartBadge();
    renderCartItems();
}

function changeCartQty(key, delta) {
    var item = cart.find(function(i) { return i.key === key; });
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) { removeFromCart(key); return; }
    updateCartBadge();
    renderCartItems();
}

function cartTotal() {
    return cart.reduce(function(sum, i) { return sum + i.unitPrice * i.qty; }, 0);
}

function updateCartBadge() {
    var total = cart.reduce(function(sum, i) { return sum + i.qty; }, 0);
    var badge = document.getElementById('cart-badge');
    if (badge) {
        badge.textContent = total;
        badge.style.display = total > 0 ? 'flex' : 'none';
    }
}

function showCartToast(name, size, qty) {
    var toast = document.getElementById('cart-toast');
    if (!toast) return;
    toast.textContent = '\u2713 ' + qty + 'x ' + name + ' (' + size + ') added!';
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function() { toast.classList.remove('show'); }, 2500);
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
    var container = document.getElementById('cart-items-list');
    var totalEl = document.getElementById('cart-grand-total');
    var emptyEl = document.getElementById('cart-empty');
    var checkoutBtn = document.getElementById('cart-checkout-btn');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '';
        emptyEl.style.display = 'flex';
        checkoutBtn.style.display = 'none';
        totalEl.textContent = '\u20b90';
        return;
    }

    emptyEl.style.display = 'none';
    checkoutBtn.style.display = 'flex';

    container.innerHTML = cart.map(function(item) {
        return '<div class="cart-item">' +
            '<div class="cart-item-info">' +
                '<span class="cart-item-name">' + item.name + '</span>' +
                '<span class="cart-item-size">' + item.size + ' &bull; \u20b9' + item.unitPrice + ' each</span>' +
            '</div>' +
            '<div class="cart-item-controls">' +
                '<button class="qty-btn" onclick="changeCartQty(\'' + item.key + '\', -1)">\u2212</button>' +
                '<span class="qty-value">' + item.qty + '</span>' +
                '<button class="qty-btn" onclick="changeCartQty(\'' + item.key + '\', 1)">+</button>' +
            '</div>' +
            '<div class="cart-item-price">' +
                '<span>\u20b9' + (item.unitPrice * item.qty) + '</span>' +
                '<button class="remove-btn" onclick="removeFromCart(\'' + item.key + '\')"><i class=\'bx bx-trash\'></i></button>' +
            '</div>' +
        '</div>';
    }).join('');

    totalEl.textContent = '\u20b9' + cartTotal();
}

function proceedToCheckout() {
    if (cart.length === 0) return;
    closeCart();
    var summaryEl = document.getElementById('cart-modal-summary');
    if (summaryEl) {
        var rows = cart.map(function(item) {
            return '<div class="cart-summary-item">' +
                '<span>' + item.name + ' (' + item.size + ') \u00d7' + item.qty + '</span>' +
                '<span>\u20b9' + (item.unitPrice * item.qty) + '</span>' +
            '</div>';
        }).join('');
        summaryEl.innerHTML = rows + '<div class="cart-summary-total"><span>Total</span><span>\u20b9' + cartTotal() + '</span></div>';
    }
    document.getElementById('cart-order-modal').classList.add('active');
}

// ─── Render Products ──────────────────────────────────────────────────────────
function renderProducts() {
    function generateCard(prod) {
        cardQty[prod.id] = 1;
        var defaultPrice = prod.prices['250g'];
        return '<div class="product-card">' +
            '<div class="product-img-wrap">' +
                '<img src="' + prod.image + '" alt="' + prod.name + '" class="product-image" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\';">' +
                '<span class="product-emoji-placeholder">' + prod.icon + '</span>' +
            '</div>' +
            '<div class="product-content">' +
                '<div class="product-header">' +
                    '<h4 class="product-name">' + prod.name + '</h4>' +
                    '<p class="product-desc">' + prod.desc + '</p>' +
                '</div>' +
                '<div class="product-footer">' +
                    '<div class="price-size-row">' +
                        '<span class="card-live-price" id="card-price-' + prod.id + '">\u20b9' + defaultPrice + '</span>' +
                        '<select class="card-size-select" id="size-' + prod.id + '" onchange="updateCardPrice(\'' + prod.id + '\')">' +
                            '<option value="250g">250g</option>' +
                            '<option value="500g">500g</option>' +
                            '<option value="1kg">1kg</option>' +
                        '</select>' +
                    '</div>' +
                    '<div class="card-actions-row">' +
                        '<div class="qty-stepper">' +
                            '<button class="stepper-btn" onclick="changeCardQty(\'' + prod.id + '\', -1)">\u2212</button>' +
                            '<span class="stepper-val" id="card-qty-' + prod.id + '">1</span>' +
                            '<button class="stepper-btn" onclick="changeCardQty(\'' + prod.id + '\', 1)">+</button>' +
                        '</div>' +
                        '<button class="btn-add-cart" onclick="addToCart(\'' + prod.name + '\', \'' + prod.id + '\')">' +
                            '<i class=\'bx bx-cart-add\'></i> Add to Cart' +
                        '</button>' +
                    '</div>' +
                    '<button class="btn-order-now" onclick="openOrderModal(\'' + prod.name + '\')">Order Now</button>' +
                '</div>' +
            '</div>' +
        '</div>';
    }

    var grids = { 'dates-grid': products.dates, 'figs-grid': products.figs, 'nuts-grid': products.nuts, 'seeds-grid': products.seeds };
    for (var id in grids) {
        var container = document.getElementById(id);
        if (container) container.innerHTML = grids[id].map(generateCard).join('');
    }
}

// ─── Single Product Order Modal ───────────────────────────────────────────────
function openOrderModal(productName) {
    document.getElementById('display-product-name').textContent = productName;
    document.getElementById('selected-product').value = productName;
    updateModalPrice();
    document.getElementById('order-modal').classList.add('active');
}

function updateModalPrice() {
    var productName = document.getElementById('selected-product').value;
    var qty = document.getElementById('quantity').value;
    var prod = findProduct(productName);
    if (prod && prod.prices) {
        document.getElementById('display-price').textContent = prod.prices[qty];
    }
}

document.getElementById('order-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var name = document.getElementById('name').value;
    var phone = document.getElementById('phone').value;
    var address = document.getElementById('address').value;
    var product = document.getElementById('selected-product').value;
    var qty = document.getElementById('quantity').value;
    var price = document.getElementById('display-price').textContent;
    var message = 'Hi MR Delights! I want to order:\n\n*Product:* ' + product + '\n*Quantity:* ' + qty + '\n*Total Price:* \u20b9' + price + '\n------------------\n*Customer:* ' + name + '\n*Phone:* ' + phone + '\n*Address:* ' + address;
    window.open('https://wa.me/918289842739?text=' + encodeURIComponent(message), '_blank');
});

document.getElementById('cart-order-form').addEventListener('submit', function(e) {
    e.preventDefault();
    if (cart.length === 0) return;
    var name = document.getElementById('cart-name').value;
    var phone = document.getElementById('cart-phone').value;
    var address = document.getElementById('cart-address').value;
    var itemLines = cart.map(function(item) { return '  \u2022 ' + item.name + ' (' + item.size + ') x' + item.qty + ' = \u20b9' + (item.unitPrice * item.qty); }).join('\n');
    var message = 'Hi MR Delights! \ud83d\uded2 Cart order:\n\n*Items:*\n' + itemLines + '\n\n*Grand Total:* \u20b9' + cartTotal() + '\n------------------\n*Customer:* ' + name + '\n*Phone:* ' + phone + '\n*Address:* ' + address;
    window.open('https://wa.me/918289842739?text=' + encodeURIComponent(message), '_blank');
});

// ─── Mobile Menu ──────────────────────────────────────────────────────────────
function toggleMobileMenu() {
    var menu = document.getElementById('mobile-menu');
    menu.classList.toggle('active');
}

function closeMobileMenu() {
    document.getElementById('mobile-menu').classList.remove('active');
}

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    updateCartBadge();
    renderCartItems();

    document.getElementById('quantity').addEventListener('change', updateModalPrice);

    document.querySelector('.close-modal').onclick = function() { document.getElementById('order-modal').classList.remove('active'); };
    window.onclick = function(e) {
        if (e.target === document.getElementById('order-modal')) document.getElementById('order-modal').classList.remove('active');
        if (e.target === document.getElementById('cart-order-modal')) document.getElementById('cart-order-modal').classList.remove('active');
    };

    document.getElementById('cart-btn').addEventListener('click', openCart);
    document.getElementById('cart-overlay').addEventListener('click', closeCart);
    document.getElementById('close-cart-btn').addEventListener('click', closeCart);
    document.getElementById('cart-checkout-btn').addEventListener('click', proceedToCheckout);
    document.querySelector('.close-cart-modal').addEventListener('click', function() { document.getElementById('cart-order-modal').classList.remove('active'); });

    document.getElementById('menu-toggle-btn').addEventListener('click', toggleMobileMenu);

    // Close mobile menu when a link is clicked
    document.querySelectorAll('#mobile-menu a').forEach(function(link) {
        link.addEventListener('click', closeMobileMenu);
    });

    window.addEventListener('scroll', function() {
        document.querySelector('.navbar').classList.toggle('scrolled', window.scrollY > 50);
    });
});
