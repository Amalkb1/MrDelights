const products = {
    dates: [
        { id: 'd1', name: 'Ajwa Dates', desc: 'Premium black dates with an exceptionally soft and fruity profile. A luxurious treat.', icon: '🌴', image: 'ajwa_dates.png' },
        { id: 'd2', name: 'Deglet Noor', desc: 'The "Queen of Dates". Light, sweet, and semi-dry with a honey-like taste.', icon: '🏜️', image: 'deglet_noor.png' },
        { id: 'd3', name: 'Sukkary Dates', desc: 'Melt-in-your-mouth sweetness with a golden hue. Crisp on the outside, soft inside.', icon: '✨', image: 'sukkary_dates.png' },
        { id: 'd4', name: 'Mabroom Dates', desc: 'Slender, dark red dates with a chewy flesh. Naturally robust flavor.', icon: '💎' },
    ],
    figs: [
        { id: 'f1', name: 'Turkish Figs', desc: 'Large, naturally sun-dried figs with a rich, caramel-like sweetness.', icon: '🍯', image: 'turkish_figs.png' },
        { id: 'f2', name: 'Afghani Figs', desc: 'Premium white figs, incredibly soft and nutrient-dense from the highlands.', icon: '🏔️', image: 'afghani_figs.png' }
    ]
};

// Populate Products
function renderProducts() {
    const datesGrid = document.getElementById('dates-grid');
    const figsGrid = document.getElementById('figs-grid');

    if (!datesGrid || !figsGrid) return;

    const generateCard = (prod) => `
        <div class="product-card">
            <div class="product-img-wrap">
                ${prod.image ? `<img src="${prod.image}" alt="${prod.name}" class="product-image">` : `<span class="product-emoji-placeholder">${prod.icon}</span>`}
            </div>
            <div class="product-content">
                <h4 class="product-name">${prod.name}</h4>
                <p class="product-desc">${prod.desc}</p>
                <button class="btn btn-order" data-product="${prod.name}">Order Now</button>
            </div>
        </div>
    `;

    datesGrid.innerHTML = products.dates.map(generateCard).join('');
    figsGrid.innerHTML = products.figs.map(generateCard).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial Render
    renderProducts();

    // 2. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'var(--glass-bg)';
                navLinks.style.backdropFilter = 'blur(10px)';
                navLinks.style.padding = '1rem';
                navLinks.style.borderBottom = '1px solid var(--glass-border)';
            }
        });
    }

    // 3. Modal Logic
    const modal = document.getElementById('order-modal');
    const closeBtn = document.querySelector('.close-modal');
    const displayProductName = document.getElementById('display-product-name');
    const hiddenProductInput = document.getElementById('selected-product');

    // Attach listener to dynamically generated order buttons
    document.body.addEventListener('click', (e) => {
        if(e.target.classList.contains('btn-order')) {
            const productName = e.target.getAttribute('data-product');
            openModal(productName);
        }
    });

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        modal.addEventListener('click', (e) => {
            if(e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    function openModal(productName) {
        if (displayProductName && hiddenProductInput && modal) {
            displayProductName.textContent = productName;
            hiddenProductInput.value = productName;
            modal.classList.add('active');
        }
    }

    // 4. Form Submission -> WhatsApp
    const form = document.getElementById('order-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const product = hiddenProductInput.value;
            const qty = document.getElementById('quantity').value;
            const address = document.getElementById('address').value;

            // Construct Message
            const message = `Hi, I want to order from MR Delights\nName: ${name}\nPhone: ${phone}\nProduct: ${product}\nQuantity: ${qty}\nAddress: ${address}`;
            
            // Encode URL
            const encodedMessage = encodeURIComponent(message);
            const whatsappNumber = "8289842739"; // Requested number
            
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            
            // Open WhatsApp in new tab
            window.open(whatsappUrl, '_blank');
            
            // Close modal and reset
            modal.classList.remove('active');
            form.reset();
        });
    }
});
