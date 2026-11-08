const productsList = [
    {
        id: 1,
        title: "Air Jordan 12 'Toro Bravo'",
        brand: "Jordan",
        price: 225.00,
        image: "https://static.nike.com/a/images/w_1280,q_auto,f_auto/7157b3fb-db6c-43c5-880d-73cafe192088/fecha-de-lanzamiento-de-los-air-jordan-12-black-and-varsity-red-ct8013-002.jpg",
        description: "Air Jordan 12 Retro Toro Bravo en acabado de gamuza premium y detalles en negro."
    },
    {
        id: 2,
        title: "Nike Air Force 1 '07 Black",
        brand: "Nike",
        price: 115.00,
        image: "https://2app.kicksonfire.com/kofapp/upload/events_images/ipad_nike-air-force-1-07-lv8-black-sail-3.png",
        description: "Nike Air Force 1 '07 versión Black en piel resistente con amortiguación Air."
    },
    {
        id: 3,
        title: "Nike Air Force 1 ‘07 Low Triple White Men’s 8.5",
        brand: "Nike",
        price: 115.00,
        image: "https://i.ebayimg.com/images/g/-dwAAeSwjvhnwzM9/s-l1600.jpg",
        description: "Las clásicas Nike Air Force 1 '07 Low en impecable color Triple White."
    },
    {
        id: 4,
        title: "Essential Hoodie Women Essentials",
        brand: "Essentials",
        price: 90.00,
        image: "https://i.etsystatic.com/52499278/r/il/2c011b/6080159651/il_1080xN.6080159651_5qn2.jpg",
        description: "Sudadera Essential Hoodie para mujer con diseño minimalista y máximo confort."
    },
    {
        id: 5,
        title: "T-Shirt TOMMY LOGO TIPPED TEE Slim Fit",
        brand: "Tommy Hilfiger",
        price: 49.50,
        image: "https://www.engelhorn.de/dw/image/v2/AALR_PRD/on/demandware.static/-/Sites-engelhorn-master-plattform/default/dwf2f9f0d3/images/P10/14/37/1X/V1080823C/engelhorn-Tommy-Hilfiger-Herren-T-Shirt-BOLD-GLOBAL-STRIPE-TIPPING-TEE-Vorderansicht-V1080823C-v1.jpg",
        description: "Camiseta Slim Fit Tommy Hilfiger con detalles ribeteados en cuello y mangas."
    },
    {
        id: 6,
        title: "Adidas Swift Run 22 'Royal Blue",
        brand: "Adidas",
        price: 90.00,
        image: "https://tse2.mm.bing.net/th/id/OIP.movM930D1Zp-7caSBkAitAHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
        description: "Zapatillas deportivas Adidas Swift Run 22 en tono azul real con amortiguación ligera."
    },
    {
        id: 7,
        title: "Rolex President Day-Date Yellow Gold Diamond Mens Watch",
        brand: "Rolex",
        price: 34500.00,
        image: "https://a.1stdibscdn.com/rolex-day-date-president-yellow-gold-string-diamond-emerald-mens-watch-18238-for-sale/22569652/j_193642921684736266920/j_19364292_1684736267218_bg_processed.jpg?disable=upscale&auto=webp&quality=60&width=960",
        description: "Edición exclusiva Rolex President Day-Date en oro amarillo con engaste de diamantes."
    }
];

let cart = JSON.parse(localStorage.getItem('cart_golden_style')) || [];
let selectedProduct = null;

document.addEventListener('DOMContentLoaded', () => {
    renderProducts(productsList);
    updateCartUI();

    document.getElementById('paymentForm').addEventListener('submit', (e) => {
        e.preventDefault();
        processPayment();
    });
});

function renderProducts(products) {
    const container = document.getElementById('productContainer');
    container.innerHTML = '';

    products.forEach(product => {
        container.innerHTML += `
            <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
                <div class="product-card h-100 d-flex flex-column justify-content-between p-3">
                    <div>
                        <div class="text-end mb-2">
                            <span class="badge bg-custom-purple border-neon">${product.brand}</span>
                        </div>
                        <div class="product-image-wrapper mb-3">
                            <img src="${product.image}" alt="${product.title}">
                        </div>
                        <h5 class="fw-bold text-light fs-6 text-truncate mb-1">${product.title}</h5>
                        <p class="text-neon fw-bold fs-5 mb-3">$${product.price.toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
                    </div>
                    <button class="btn btn-neon-outline w-100 py-2" onclick="openProductModal(${product.id})">
                        <i class="fa-solid fa-eye me-1"></i> Ver Detalle
                    </button>
                </div>
            </div>
        `;
    });
}

function openProductModal(id) {
    selectedProduct = productsList.find(p => p.id === id);
    document.getElementById('modalTitle').innerText = selectedProduct.title;
    document.getElementById('modalImage').src = selectedProduct.image;
    document.getElementById('modalDescription').innerText = selectedProduct.description;
    document.getElementById('modalPrice').innerText = `$${selectedProduct.price.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
    document.getElementById('modalQuantity').value = 1;

    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();
}

document.getElementById('addToCartBtn').addEventListener('click', () => {
    const quantity = parseInt(document.getElementById('modalQuantity').value) || 1;
    const existingIndex = cart.findIndex(item => item.id === selectedProduct.id);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push({ ...selectedProduct, quantity });
    }

    saveCart();
    updateCartUI();
    bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
});

function updateCartUI() {
    const cartItemsList = document.getElementById('cartItemsList');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');

    cartItemsList.innerHTML = '';
    let totalCount = 0;
    let totalPrice = 0;

    if (cart.length === 0) {
        cartItemsList.innerHTML = '<p class="text-center text-secondary py-4">Tu carrito está vacío.</p>';
    } else {
        cart.forEach((item, index) => {
            totalCount += item.quantity;
            let subtotal = item.price * item.quantity;
            totalPrice += subtotal;

            cartItemsList.innerHTML += `
                <div class="d-flex justify-content-between align-items-center mb-3 p-2 bg-dark rounded border border-secondary">
                    <div class="me-2" style="max-width: 60%;">
                        <h6 class="mb-0 text-truncate text-light small fw-bold">${item.title}</h6>
                        <small class="text-neon">$${item.price.toFixed(2)} x ${item.quantity}</small>
                    </div>
                    <div class="d-flex align-items-center gap-1">
                        <button class="btn btn-sm btn-outline-light py-0 px-2" onclick="changeQuantity(${index}, 1)">+</button>
                        <button class="btn btn-sm btn-outline-light py-0 px-2" onclick="changeQuantity(${index}, -1)">-</button>
                        <button class="btn btn-sm btn-outline-danger py-0 px-1 ms-1" onclick="removeItem(${index})"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
            `;
        });
    }

    cartCount.innerText = totalCount;
    cartTotal.innerText = `$${totalPrice.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
}

function changeQuantity(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    saveCart();
    updateCartUI();
}

function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('cart_golden_style', JSON.stringify(cart));
}

function processPayment() {
    const clientName = document.getElementById('clientName').value;
    generateReceiptPDF(clientName);

    cart = [];
    saveCart();
    updateCartUI();

    bootstrap.Modal.getInstance(document.getElementById('paymentModal')).hide();
    const offcanvasEl = document.getElementById('cartOffcanvas');
    const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasEl);
    if (offcanvasInstance) offcanvasInstance.hide();

    document.getElementById('paymentForm').reset();
    alert('¡Compra procesada con éxito! Tu ticket térmico se está descargando.');
}

function generateReceiptPDF(clientName) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [58, 160]
    });

    doc.setFont('courier', 'normal');
    doc.setFontSize(8);

    let y = 8;
    doc.text("================================", 3, y); y += 4;
    doc.text("         GOLDEN STYLE         ", 3, y); y += 4;
    doc.text("    RECIBO DE VENTA TERMICO   ", 3, y); y += 4;
    doc.text("================================", 3, y); y += 5;

    const now = new Date();
    doc.text(`Fecha: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`, 3, y); y += 4;
    doc.text(`Cliente: ${clientName}`, 3, y); y += 4;
    doc.text("--------------------------------", 3, y); y += 4;

    let totalFinal = 0;
    cart.forEach(item => {
        let subtotal = item.price * item.quantity;
        totalFinal += subtotal;
        doc.text(`${item.title.substring(0, 22)}`, 3, y); y += 4;
        doc.text(`  ${item.quantity} x $${item.price.toFixed(2)} = $${subtotal.toFixed(2)}`, 3, y); y += 4;
    });

    doc.text("--------------------------------", 3, y); y += 4;
    doc.text(`TOTAL: $${totalFinal.toFixed(2)}`, 3, y); y += 6;
    doc.text("     ¡GRACIAS POR SU COMPRA!    ", 3, y); y += 4;
    doc.text("================================", 3, y);

    doc.save("ticket-golden-style.pdf");
}