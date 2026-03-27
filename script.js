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

// 2. Render Products to Page
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

// 3. Modal & Pricing Logic
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
    
    let currentProd = null;
    for (const cat in products) {
        currentProd = products[cat].find(p => p.name === productName);
        if (currentProd) break;
    }

    if (currentProd && currentProd.prices) {
        priceDisplay.textContent = currentProd.prices[qty];
    }
}

// 4. Form Submission (WhatsApp)
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

    window.open(`https://wa.me/918289842739?text=${encodeURIComponent(message)}`, '_blank');
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    quantitySelect.addEventListener('change', updatePrice);
    
    // Close modal logic
    document.querySelector('.close-modal').onclick = () => modal.classList.remove('active');
    window.onclick = (e) => { if (e.target == modal) modal.classList.remove('active'); };
});
