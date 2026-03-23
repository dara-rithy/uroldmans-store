// ============================================================
// NAVIGATION
// ============================================================
function pushHistory(state) {
    if (!skipPush) {
        var hash = '#' + state.view;
        if (state.cat) hash += '/' + encodeURIComponent(state.cat);
        if (state.subcat) hash += '/' + encodeURIComponent(state.subcat);
        if (state.page) hash += '/' + encodeURIComponent(state.page);
        if (state.partNum) hash += '/' + encodeURIComponent(state.partNum);
        history.pushState(state, '', hash);
    }
}

window.addEventListener('popstate', function(e) {
    skipPush = true;
    if (e.state) restoreState(e.state);
    else navigateHome();
    skipPush = false;
});

function restoreState(state) {
    switch (state.view) {
        case 'home': navigateHome(); break;
        case 'category': navigateCategory(state.cat); break;
        case 'subcategory': navigateSubcategory(state.cat, state.subcat); break;
        case 'product': navigateProduct(state.cat, state.subcat, state.partNum); break;
        case 'compare': if (compareList.length >= 2) showCompare(); else navigateHome(); break;
        case 'page':
            if (state.page && state.page.startsWith('mfr-')) navigateManufacturer(state.page.substring(4));
            else navigatePage(state.page);
            break;
        default: navigateHome();
    }
}

function renderBreadcrumb(items) {
    var bc = document.getElementById('breadcrumb');
    bc.innerHTML = items.map(function(item, i) {
        if (i < items.length - 1) return '<a onclick="' + item.action + '">' + item.label + '</a><span>&#8250;</span>';
        return '<span>' + item.label + '</span>';
    }).join('');
}

function navigateHome() {
    currentView = 'home';
    currentPage = 1;
    pushHistory({ view: 'home' });
    renderBreadcrumb([{ label: 'Home', action: 'navigateHome()' }, { label: 'All Categories' }]);
    document.getElementById('page-title').innerHTML = 'All Products <span class="result-count">' + getTotalCount().toLocaleString() + ' results</span>';
    renderSidebar(null);
    renderHomePage();
    window.scrollTo(0, 0);
}

function navigateCategory(catName) {
    currentView = 'category';
    currentPage = 1;
    var cat = CATEGORIES.find(function(c) { return c.name === catName; });
    if (!cat) return;
    pushHistory({ view: 'category', cat: catName });
    renderBreadcrumb([
        { label: 'Home', action: 'navigateHome()' },
        { label: cat.name }
    ]);
    var total = cat.subcats.reduce(function(s, sc) { return s + sc.count; }, 0);
    document.getElementById('page-title').innerHTML = cat.name + ' <span class="result-count">' + total.toLocaleString() + ' results</span>';
    renderSidebar(cat.name);
    renderSubcategoryGrid(cat);
    window.scrollTo(0, 0);
}

function navigateSubcategory(catName, subcatName) {
    currentView = 'subcategory';
    currentPage = 1;
    currentSort = { field: null, dir: 'asc' };
    activeFilters = {};
    var cat = CATEGORIES.find(function(c) { return c.name === catName; });
    var subcat = cat ? cat.subcats.find(function(s) { return s.name === subcatName; }) : null;
    if (!cat || !subcat) return;
    pushHistory({ view: 'subcategory', cat: catName, subcat: subcatName });
    renderBreadcrumb([
        { label: 'Home', action: 'navigateHome()' },
        { label: cat.name, action: "navigateCategory('" + esc(cat.name) + "')" },
        { label: subcat.name }
    ]);
    document.getElementById('page-title').innerHTML = subcat.name + ' <span class="result-count">' + subcat.count.toLocaleString() + ' results</span>';
    renderSidebar(cat.name, subcat.name);
    renderProductList(cat, subcat);
    window.scrollTo(0, 0);
}

function navigateProduct(catName, subcatName, partNum) {
    currentView = 'product';
    var cat = CATEGORIES.find(function(c) { return c.name === catName; });
    var subcat = cat ? cat.subcats.find(function(s) { return s.name === subcatName; }) : null;
    if (!cat || !subcat) return;
    var products = generateProducts(subcat, cat.name, true);
    var product = null;
    var prodIdx = 0;
    for (var i = 0; i < products.length; i++) {
        if (products[i].partNum === partNum) { product = products[i]; prodIdx = i; break; }
    }
    if (!product) return;
    pushHistory({ view: 'product', cat: catName, subcat: subcatName, partNum: partNum });
    renderBreadcrumb([
        { label: 'Home', action: 'navigateHome()' },
        { label: cat.name, action: "navigateCategory('" + esc(cat.name) + "')" },
        { label: subcat.name, action: "navigateSubcategory('" + esc(cat.name) + "','" + esc(subcat.name) + "')" },
        { label: product.mfrPartNum }
    ]);
    document.getElementById('page-title').innerHTML = product.mfrPartNum;
    renderSidebar(null);
    renderProductDetail(product, prodIdx);
    window.scrollTo(0, 0);
}

function navigatePage(pageName) {
    currentView = 'page';
    pushHistory({ view: 'page', page: pageName });
    renderBreadcrumb([
        { label: 'Home', action: 'navigateHome()' },
        { label: pageName }
    ]);
    document.getElementById('page-title').innerHTML = pageName;
    renderSidebar(null);
    renderContentPage(pageName);
    window.scrollTo(0, 0);
}

function navigateManufacturer(mfrName) {
    currentView = 'page';
    pushHistory({ view: 'page', page: 'mfr-' + mfrName });
    renderBreadcrumb([
        { label: 'Home', action: 'navigateHome()' },
        { label: 'Manufacturers', action: "navigatePage('Manufacturers')" },
        { label: mfrName }
    ]);
    document.getElementById('page-title').innerHTML = mfrName;
    renderSidebar(null);
    renderManufacturerPage(mfrName);
    window.scrollTo(0, 0);
}

function getTotalCount() {
    return CATEGORIES.reduce(function(s, c) { return s + c.subcats.reduce(function(ss, sc) { return ss + sc.count; }, 0); }, 0);
}


// NAV
// ============================================================
function buildNav() {
    var nav = document.getElementById('main-nav-inner');
    var html = '';

    // Products mega menu
    html += '<div class="nav-item-wrapper"><div class="nav-item">Products <span style="font-size:10px;">&#9662;</span></div>';
    html += '<div class="mega-menu"><div class="mega-menu-grid">';
    CATEGORIES.forEach(function(c) { html += '<a data-nav-cat="' + c.name + '">' + c.icon + ' ' + c.name + '</a>'; });
    html += '</div></div></div>';

    // Resources dropdown
    html += '<div class="nav-item-wrapper"><div class="nav-item">Resources <span style="font-size:10px;">&#9662;</span></div>';
    html += '<div class="nav-dropdown">';
    html += '<a onclick="navigatePage(\'Resources\')">Tools & Calculators</a>';
    html += '<a onclick="navigatePage(\'Manufacturers\')">All Manufacturers</a>';
    html += '</div></div>';

    // Support dropdown
    html += '<div class="nav-item-wrapper"><div class="nav-item">Support <span style="font-size:10px;">&#9662;</span></div>';
    html += '<div class="nav-dropdown">';
    ['Help Center', 'Order Status', 'Shipping Info', 'Contact Us', 'Request a Quote'].forEach(function(p) {
        html += '<a onclick="navigatePage(\'' + p + '\')">' + p + '</a>';
    });
    html += '</div></div>';

    // Direct links
    html += '<div class="nav-item-wrapper"><div class="nav-item" onclick="navigatePage(\'New Products\')">New</div></div>';
    html += '<div class="nav-item-wrapper"><div class="nav-item" onclick="navigatePage(\'Deals\')">Deals</div></div>';

    nav.innerHTML = html;

    // Bind mega menu clicks
    nav.querySelectorAll('[data-nav-cat]').forEach(function(a) {
        a.addEventListener('click', function() { navigateCategory(this.getAttribute('data-nav-cat')); });
    });
}

// ============================================================
// FOOTER
// ============================================================
function buildFooter() {
    document.getElementById('footer-links').innerHTML =
        '<div class="footer-col"><h4>Support</h4><ul>' +
        '<li><a onclick="navigatePage(\'Help Center\')">Help Center</a></li>' +
        '<li><a onclick="navigatePage(\'Order Status\')">Order Status</a></li>' +
        '<li><a onclick="navigatePage(\'Shipping Info\')">Shipping Info</a></li>' +
        '<li><a onclick="navigatePage(\'Contact Us\')">Contact Us</a></li>' +
        '<li><a onclick="navigatePage(\'Request a Quote\')">Request a Quote</a></li>' +
        '</ul></div>' +
        '<div class="footer-col"><h4>Company</h4><ul>' +
        '<li><a onclick="navigatePage(\'About Us\')">About Us</a></li>' +
        '<li><a onclick="navigatePage(\'Manufacturers\')">Manufacturers</a></li>' +
        '<li><a onclick="navigatePage(\'Resources\')">Resources</a></li>' +
        '<li><a onclick="navigatePage(\'New Products\')">New Products</a></li>' +
        '<li><a onclick="navigatePage(\'Deals\')">Deals</a></li>' +
        '</ul></div>';
}


// ============================================================
// INIT
// ============================================================
if (localStorage.getItem('uro_darkmode') === '1') document.body.classList.add('dark-mode');
var savedUser = JSON.parse(localStorage.getItem('uro_user') || 'null');
if (savedUser) document.getElementById('login-trigger').textContent = savedUser.name;
buildNav();
buildFooter();
renderSidebar(null);
renderHomePage();
updateCartUI();
updateCompareBar();

// Handle initial hash
if (location.hash) {
    var parts = location.hash.substring(1).split('/').map(decodeURIComponent);
    skipPush = true;
    if (parts[0] === 'category' && parts[1]) navigateCategory(parts[1]);
    else if (parts[0] === 'subcategory' && parts[1] && parts[2]) navigateSubcategory(parts[1], parts[2]);
    else if (parts[0] === 'product' && parts[1] && parts[2] && parts[3]) navigateProduct(parts[1], parts[2], parts[3]);
    else if (parts[0] === 'compare') { if (compareList.length >= 2) showCompare(); }
    else if (parts[0] === 'page' && parts[1]) {
        if (parts[1].startsWith('mfr-')) navigateManufacturer(parts[1].substring(4));
        else navigatePage(parts[1]);
    }
    skipPush = false;
}
