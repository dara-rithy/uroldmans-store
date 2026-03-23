// CART
// ============================================================
function addToCart(product, idx, qty) {
    var existing = cart.find(function(item) { return item.partNum === product.partNum; });
    if (existing) { existing.qty += qty; existing.price = product.price; }
    else { cart.push({ partNum: product.partNum, name: product.name, manufacturer: product.manufacturer, price: product.price, qty: qty }); }
    updateCartUI();
    showToast('Added ' + qty + 'x ' + product.partNum + ' to cart');
    if (idx != null) {
        var btn = document.getElementById('add-btn-' + idx);
        if (btn) { btn.classList.add('added'); btn.textContent = 'Added!'; setTimeout(function() { btn.classList.remove('added'); btn.textContent = 'Add'; }, 1500); }
    }
}

function updateCartUI() {
    localStorage.setItem('uro_cart', JSON.stringify(cart));
    var totalItems = cart.reduce(function(s, i) { return s + i.qty; }, 0);
    document.getElementById('cart-count-label').textContent = totalItems + ' item' + (totalItems !== 1 ? 's' : '');
    var badge = document.getElementById('cart-badge');
    badge.textContent = totalItems;
    badge.classList.toggle('visible', totalItems > 0);

    var body = document.getElementById('cart-body');
    if (cart.length === 0) {
        body.innerHTML = '<div class="cart-empty"><div class="cart-empty-icon">&#128722;</div><p>Your cart is empty</p></div>';
        document.getElementById('cart-footer').innerHTML = '';
        return;
    }

    body.innerHTML = cart.map(function(item, i) {
        return '<div class="cart-item"><div class="cart-item-info">' +
            '<div class="cart-item-name">' + item.partNum + '</div>' +
            '<div class="cart-item-detail">' + item.manufacturer + ' &middot; $' + item.price.toFixed(2) + ' ea</div>' +
            '<div class="cart-qty-controls">' +
                '<button class="cart-qty-btn" data-ci="' + i + '" data-ca="dec">-</button>' +
                '<div class="cart-qty-val">' + item.qty + '</div>' +
                '<button class="cart-qty-btn" data-ci="' + i + '" data-ca="inc">+</button>' +
            '</div></div>' +
            '<button class="cart-item-remove" data-ci="' + i + '" data-ca="remove">&times;</button></div>';
    }).join('');

    body.querySelectorAll('[data-ca]').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var idx = parseInt(this.getAttribute('data-ci'));
            var action = this.getAttribute('data-ca');
            if (action === 'inc') cart[idx].qty++;
            else if (action === 'dec') { cart[idx].qty--; if (cart[idx].qty < 1) cart.splice(idx, 1); }
            else if (action === 'remove') cart.splice(idx, 1);
            updateCartUI();
        });
    });

    var total = cart.reduce(function(s, i) { return s + i.price * i.qty; }, 0);
    document.getElementById('cart-footer').innerHTML =
        '<div class="cart-total"><span>Total</span><span>$' + total.toFixed(2) + '</span></div>' +
        '<button class="btn-primary" onclick="checkout()">Proceed to Checkout</button>' +
        '<button class="btn-secondary" style="margin-top:8px;" onclick="navigatePage(\'Request a Quote\');closeCart();">Request a Quote</button>';
}

function checkout() {
    var count = cart.reduce(function(s, i) { return s + i.qty; }, 0);
    var total = cart.reduce(function(s, i) { return s + i.price * i.qty; }, 0);
    if (!confirm('Confirm order?\n\n' + count + ' item' + (count !== 1 ? 's' : '') + ' — $' + total.toFixed(2) + ' total\n\nThis will place your order.')) return;
    showToast('Order confirmed! ' + count + ' items, $' + total.toFixed(2) + ' total.');
    cart = [];
    updateCartUI();
    closeCart();
}

function openCart() {
    document.getElementById('cart-panel').classList.add('active');
    document.getElementById('cart-overlay').classList.add('active');
}
function closeCart() {
    document.getElementById('cart-panel').classList.remove('active');
    document.getElementById('cart-overlay').classList.remove('active');
}
