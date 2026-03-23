// CONTENT PAGES - all functional
// ============================================================
function renderContentPage(pageName) {
    var main = document.getElementById('main-area');
    var back = '<div class="back-link" onclick="navigateHome()">&#8592; Back to Products</div>';
    var html = '';

    switch(pageName) {
        case 'Help Center':
            html = '<div class="content-page">' + back + '<h2>Help Center</h2><p>Find answers to common questions and get support.</p>';
            html += '<div class="content-section"><h3>Frequently Asked Questions</h3><ul>';
            html += '<li><strong>How do I place an order?</strong> Browse products, add to cart, then proceed to checkout.</li>';
            html += '<li><strong>What payment methods do you accept?</strong> Visa, MasterCard, PayPal, wire transfer, and purchase orders for approved accounts.</li>';
            html += '<li><strong>How can I track my order?</strong> Use the Order Status page with your order number and email.</li>';
            html += '<li><strong>What is your return policy?</strong> Returns accepted within 30 days in original packaging.</li>';
            html += '<li><strong>Do you ship internationally?</strong> Yes, we ship to 170+ countries worldwide.</li>';
            html += '<li><strong>Do you offer bulk pricing?</strong> Yes, submit a quote request for volume discounts.</li>';
            html += '</ul></div>';
            html += '<div class="content-section"><h3>Contact Support</h3><div class="info-grid">';
            html += '<div class="info-card"><div class="ic-icon">&#128231;</div><h4>Email</h4><p>support@uroldmans.com</p></div>';
            html += '<div class="info-card"><div class="ic-icon">&#128222;</div><h4>Phone</h4><p>+1 (555) 123-4567</p></div>';
            html += '</div></div></div>';
            break;

        case 'Order Status':
            html = '<div class="content-page">' + back + '<h2>Order Status</h2><p>Track your order with the form below.</p>';
            html += '<div class="content-section"><h3>Track Your Order</h3>';
            html += '<div class="form-group"><label>Order Number</label><input type="text" id="order-num" placeholder="e.g., ORD-2026-00123"></div>';
            html += '<div class="form-group"><label>Email Address</label><input type="email" id="order-email" placeholder="you@example.com"></div>';
            html += '<button class="btn-primary" style="max-width:200px;" onclick="trackOrder()">Track Order</button>';
            html += '<div id="order-result" style="margin-top:16px;"></div>';
            html += '</div></div>';
            break;

        case 'Shipping Info':
            html = '<div class="content-page">' + back + '<h2>Shipping Information</h2><p>We offer multiple shipping options to meet your needs.</p>';
            html += '<div class="content-section"><h3>Shipping Options</h3><div class="info-grid">';
            html += '<div class="info-card"><div class="ic-icon">&#128666;</div><h4>Standard</h4><p>3-5 business days<br>Free over $50</p></div>';
            html += '<div class="info-card"><div class="ic-icon">&#9889;</div><h4>Express</h4><p>1-2 business days<br>From $12.99</p></div>';
            html += '<div class="info-card"><div class="ic-icon">&#127760;</div><h4>International</h4><p>5-14 business days<br>From $19.99</p></div>';
            html += '<div class="info-card"><div class="ic-icon">&#128230;</div><h4>Same Day</h4><p>Order by 2 PM local<br>Select cities only</p></div>';
            html += '</div></div></div>';
            break;

        case 'Contact Us':
            html = '<div class="content-page">' + back + '<h2>Contact Us</h2><p>We\'d love to hear from you.</p>';
            html += '<div class="content-section"><h3>Send a Message</h3>';
            html += '<div class="form-row"><div class="form-group"><label>Name</label><input type="text" id="contact-name" placeholder="Your name"></div>';
            html += '<div class="form-group"><label>Email</label><input type="email" id="contact-email" placeholder="you@example.com"></div></div>';
            html += '<div class="form-group"><label>Subject</label><select id="contact-subject"><option>General Inquiry</option><option>Order Support</option><option>Technical Question</option><option>Return Request</option><option>Partnership</option></select></div>';
            html += '<div class="form-group"><label>Message</label><textarea id="contact-msg" placeholder="How can we help?"></textarea></div>';
            html += '<button class="btn-primary" style="max-width:200px;" onclick="submitContact()">Send Message</button>';
            html += '<div id="contact-result" style="margin-top:12px;"></div>';
            html += '</div></div>';
            break;

        case 'About Us':
            html = '<div class="content-page">' + back + '<h2>About Uroldman\'s Store</h2><p>Your trusted partner for electronic components since 2020.</p>';
            html += '<div class="content-section"><h3>Our Mission</h3><p style="margin-bottom:0;">We make it easy for engineers, makers, and businesses to find the electronic components they need. With a massive inventory, fast shipping, and expert support, we\'re here to power your next project.</p></div>';
            html += '<div class="content-section"><h3>Why Choose Us?</h3><div class="info-grid">';
            html += '<div class="info-card"><div class="ic-icon">&#128230;</div><h4>15,000+ Products</h4><p>Massive inventory</p></div>';
            html += '<div class="info-card"><div class="ic-icon">&#9989;</div><h4>100% Authentic</h4><p>Authorized sources</p></div>';
            html += '<div class="info-card"><div class="ic-icon">&#128666;</div><h4>Fast Shipping</h4><p>Same-day dispatch</p></div>';
            html += '<div class="info-card"><div class="ic-icon">&#127760;</div><h4>Global Reach</h4><p>170+ countries</p></div>';
            html += '</div></div></div>';
            break;

        case 'Request a Quote':
            html = '<div class="content-page">' + back + '<h2>Request a Quote</h2><p>Need bulk pricing or custom sourcing? Fill out the form below.</p>';
            html += '<div class="content-section"><h3>Quote Request Form</h3>';
            html += '<div class="form-row"><div class="form-group"><label>Name *</label><input type="text" id="quote-name" placeholder="Full name"></div>';
            html += '<div class="form-group"><label>Company</label><input type="text" id="quote-company" placeholder="Company (optional)"></div></div>';
            html += '<div class="form-row"><div class="form-group"><label>Email *</label><input type="email" id="quote-email" placeholder="you@example.com"></div>';
            html += '<div class="form-group"><label>Phone</label><input type="tel" id="quote-phone" placeholder="+1 (555) 123-4567"></div></div>';
            html += '<div class="form-group"><label>Part Numbers & Quantities *</label><textarea id="quote-parts" placeholder="ATmega328P - 500 pcs\nLM7805 - 1000 pcs\nNE555 - 2000 pcs"></textarea></div>';
            html += '<button class="btn-primary" style="max-width:250px;" onclick="submitQuote()">Submit Quote Request</button>';
            html += '<div id="quote-result" style="margin-top:12px;"></div>';
            html += '</div></div>';
            break;

        case 'Privacy Policy':
            html = '<div class="content-page">' + back + '<h2>Privacy Policy</h2><p>Last updated: March 2026</p>';
            html += '<div class="content-section"><h3>Information We Collect</h3><ul><li>Name, email, and phone for account and order processing</li><li>Shipping and billing addresses</li><li>Browsing data to improve your experience</li></ul>';
            html += '<h3 style="margin-top:16px;">How We Use It</h3><ul><li>Process and fulfill your orders</li><li>Send order confirmations and shipping updates</li><li>Improve our website and services</li></ul>';
            html += '<h3 style="margin-top:16px;">Your Rights</h3><ul><li>Access, correct, or delete your personal data</li><li>Opt out of marketing communications</li><li>We never sell your data to third parties</li></ul></div></div>';
            break;

        case 'Terms of Service':
            html = '<div class="content-page">' + back + '<h2>Terms of Service</h2><p>Last updated: March 2026</p>';
            html += '<div class="content-section"><h3>Orders & Pricing</h3><ul><li>All prices are in USD and subject to change without notice</li><li>Minimum order value: $5.00</li><li>Orders are confirmed via email</li></ul>';
            html += '<h3 style="margin-top:16px;">Returns & Warranty</h3><ul><li>Returns accepted within 30 days in original, unopened packaging</li><li>Manufacturer\'s original warranty applies</li><li>Defective items: free return shipping</li><li>Refunds processed within 5-7 business days</li></ul></div></div>';
            break;

        case 'New Products':
            html = renderNewProductsPage(back);
            break;

        case 'Deals':
            html = renderDealsPage(back);
            break;

        case 'Manufacturers':
            html = renderManufacturersPage(back);
            break;

        case 'Resources':
            html = '<div class="content-page">' + back + '<h2>Engineering Resources</h2><p>Free tools and references for your designs.</p>';
            html += '<div class="content-section"><h3>Tools & Calculators</h3><div class="info-grid">';
            html += '<div class="info-card" style="cursor:pointer;" onclick="showToast(\'Resistor Calculator loaded!\')"><div class="ic-icon">&#127919;</div><h4>Resistor Calculator</h4><p>Color code & SMD decoder</p></div>';
            html += '<div class="info-card" style="cursor:pointer;" onclick="showToast(\'Ohm\\\'s Law Calculator loaded!\')"><div class="ic-icon">&#9889;</div><h4>Ohm\'s Law</h4><p>V, I, R, P calculator</p></div>';
            html += '<div class="info-card" style="cursor:pointer;" onclick="showToast(\'Filter Designer loaded!\')"><div class="ic-icon">&#128200;</div><h4>Filter Designer</h4><p>RC, LC, active filters</p></div>';
            html += '<div class="info-card" style="cursor:pointer;" onclick="showToast(\'PCB Trace Calculator loaded!\')"><div class="ic-icon">&#128268;</div><h4>PCB Trace Calc</h4><p>Width & impedance</p></div>';
            html += '</div></div>';
            html += '<div class="content-section"><h3>Reference Designs</h3><div class="info-grid">';
            html += '<div class="info-card"><div class="ic-icon">&#9889;</div><h4>USB-C PD Charger</h4><p>100W Power Delivery</p></div>';
            html += '<div class="info-card"><div class="ic-icon">&#128225;</div><h4>IoT Sensor Node</h4><p>BLE + WiFi with battery</p></div>';
            html += '<div class="info-card"><div class="ic-icon">&#128295;</div><h4>Motor Controller</h4><p>3-phase BLDC driver</p></div>';
            html += '<div class="info-card"><div class="ic-icon">&#128187;</div><h4>Dev Board Template</h4><p>STM32 breakout board</p></div>';
            html += '</div></div></div>';
            break;

        default:
            html = '<div class="content-page">' + back + '<h2>' + pageName + '</h2><p>This page is coming soon.</p></div>';
    }
    main.innerHTML = html;
}

function renderNewProductsPage(back) {
    var rng = seededRandom('newproducts2026');
    var html = '<div class="content-page">' + back + '<h2>New Products</h2><p>Latest additions to our inventory.</p><div class="product-card-grid">';
    CATEGORIES.forEach(function(cat) {
        var sc = cat.subcats[Math.floor(rng() * cat.subcats.length)];
        var mfr = MANUFACTURERS[Math.floor(rng() * MANUFACTURERS.length)];
        html += '<div class="product-mini-card" onclick="navigateSubcategory(\'' + esc(cat.name) + '\',\'' + esc(sc.name) + '\')">';
        html += '<div class="pmc-badge new">NEW</div>';
        html += '<div style="font-size:32px;margin-bottom:8px;">' + cat.icon + '</div>';
        html += '<div class="pmc-name">' + sc.name + '</div>';
        html += '<div class="pmc-mfr">' + mfr + '</div>';
        html += '<div class="pmc-price">$' + (rng() * 20 + 1).toFixed(2) + '</div>';
        html += '</div>';
    });
    html += '</div></div>';
    return html;
}

function renderDealsPage(back) {
    var rng = seededRandom('deals2026');
    var html = '<div class="content-page">' + back + '<h2>Deals & Special Offers</h2><p>Limited time discounts on popular components.</p><div class="product-card-grid">';
    CATEGORIES.forEach(function(cat) {
        var sc = cat.subcats[Math.floor(rng() * cat.subcats.length)];
        var mfr = MANUFACTURERS[Math.floor(rng() * MANUFACTURERS.length)];
        var origPrice = (rng() * 25 + 2).toFixed(2);
        var discount = Math.floor(rng() * 30 + 10);
        var salePrice = (origPrice * (1 - discount/100)).toFixed(2);
        html += '<div class="product-mini-card" onclick="navigateSubcategory(\'' + esc(cat.name) + '\',\'' + esc(sc.name) + '\')">';
        html += '<div class="pmc-badge deal">' + discount + '% OFF</div>';
        html += '<div style="font-size:32px;margin-bottom:8px;">' + cat.icon + '</div>';
        html += '<div class="pmc-name">' + sc.name + '</div>';
        html += '<div class="pmc-mfr">' + mfr + '</div>';
        html += '<div class="pmc-price">$' + salePrice + ' <span style="text-decoration:line-through;color:var(--text-light);font-size:12px;">$' + origPrice + '</span></div>';
        html += '</div>';
    });
    html += '</div></div>';
    return html;
}

function renderManufacturersPage(back) {
    var html = '<div class="content-page">' + back + '<h2>All Manufacturers</h2><p>Browse products from leading electronic component manufacturers.</p><div class="product-card-grid">';
    MANUFACTURERS.forEach(function(m) {
        html += '<div class="product-mini-card" onclick="navigateManufacturer(\'' + esc(m) + '\')">';
        html += '<div style="font-size:32px;margin-bottom:8px;color:var(--primary);">&#127981;</div>';
        html += '<div class="pmc-name">' + m + '</div>';
        html += '<div class="pmc-mfr">View all products</div>';
        html += '</div>';
    });
    html += '</div></div>';
    return html;
}

function renderManufacturerPage(mfrName) {
    var main = document.getElementById('main-area');
    var html = '<div class="content-page"><div class="back-link" onclick="navigatePage(\'Manufacturers\')">&#8592; Back to Manufacturers</div>';
    html += '<h2>' + mfrName + '</h2><p>Browse product categories from ' + mfrName + '.</p><div class="category-grid">';
    CATEGORIES.forEach(function(cat) {
        var rng = seededRandom(mfrName + cat.name);
        var count = Math.floor(rng() * 200 + 20);
        html += '<div class="category-card" onclick="navigateCategory(\'' + esc(cat.name) + '\')">';
        html += '<div class="category-card-icon">' + cat.icon + '</div>';
        html += '<div class="category-card-name">' + cat.name + '</div>';
        html += '<div class="category-card-count">' + count + ' Items</div>';
        html += '</div>';
    });
    html += '</div></div>';
    main.innerHTML = html;
}

// Form handlers
function trackOrder() {
    var num = document.getElementById('order-num').value.trim();
    var email = document.getElementById('order-email').value.trim();
    var result = document.getElementById('order-result');
    if (!num || !email) { result.innerHTML = '<p style="color:var(--primary);font-size:13px;">Please fill in both fields.</p>'; return; }
    result.innerHTML = '<div class="content-section" style="margin-top:0;"><h3>Order: ' + num + '</h3><p style="margin-bottom:4px;"><strong>Status:</strong> <span class="in-stock">Shipped</span></p><p style="margin-bottom:4px;"><strong>Shipped:</strong> March 20, 2026</p><p style="margin-bottom:4px;"><strong>Est. Delivery:</strong> March 24, 2026</p><p style="margin-bottom:0;"><strong>Tracking:</strong> <a onclick="showToast(\'Tracking page opened!\')">UPS 1Z999AA10123456784</a></p></div>';
    showToast('Order found!');
}

function submitContact() {
    var name = document.getElementById('contact-name').value.trim();
    var email = document.getElementById('contact-email').value.trim();
    var msg = document.getElementById('contact-msg').value.trim();
    var result = document.getElementById('contact-result');
    if (!name || !email || !msg) { result.innerHTML = '<p style="color:var(--primary);font-size:13px;">Please fill in all required fields.</p>'; return; }
    result.innerHTML = '<p style="color:#2e7d32;font-size:13px;font-weight:600;">Message sent successfully! We\'ll reply within 24 hours.</p>';
    showToast('Message sent!');
}

function submitQuote() {
    var name = document.getElementById('quote-name').value.trim();
    var email = document.getElementById('quote-email').value.trim();
    var parts = document.getElementById('quote-parts').value.trim();
    var result = document.getElementById('quote-result');
    if (!name || !email || !parts) { result.innerHTML = '<p style="color:var(--primary);font-size:13px;">Please fill in all required fields.</p>'; return; }
    var refNum = Math.floor(Date.now() / 1000) % 10000;
    result.innerHTML = '<p style="color:#2e7d32;font-size:13px;font-weight:600;">Quote request submitted! Reference: QR-2026-' + refNum + '. We\'ll respond within 1 business day.</p>';
    showToast('Quote request submitted!');
}
