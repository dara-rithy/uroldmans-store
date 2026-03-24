// HOME PAGE
// ============================================================
function renderHomePage() {
    var main = document.getElementById('main-area');
    var rng = seededRandom('arrivals2026');

    // New arrivals
    var arrivals = [];
    CATEGORIES.slice(0, 8).forEach(function(cat) {
        var sc = cat.subcats[Math.floor(rng() * cat.subcats.length)];
        arrivals.push({ name: sc.name, cat: cat.name, icon: cat.icon, price: (rng() * 20 + 0.5).toFixed(2), mfr: MANUFACTURERS[Math.floor(rng() * MANUFACTURERS.length)] });
    });

    var html = '<div class="section-title">New Arrivals</div><div class="arrivals-rail">';
    arrivals.forEach(function(a) {
        html += '<div class="arrival-card" onclick="navigateSubcategory(\'' + esc(a.cat) + '\',\'' + esc(a.name) + '\')">';
        html += '<div class="arrival-badge">NEW</div>';
        html += '<div class="arrival-card-img">' + generateProductImage(a.cat, a.cat + a.name, 80) + '</div>';
        html += '<div style="font-size:13px;font-weight:600;color:var(--link);margin-bottom:4px;">' + a.name + '</div>';
        html += '<div style="font-size:11px;color:var(--text-light);margin-bottom:4px;">' + a.mfr + '</div>';
        html += '<div style="font-size:14px;font-weight:700;">$' + a.price + '</div>';
        html += '</div>';
    });
    html += '</div>';

    html += '<div class="section-title">All Product Categories</div><div class="category-grid">';
    CATEGORIES.forEach(function(c) {
        html += '<div class="category-card" onclick="navigateCategory(\'' + esc(c.name) + '\')">';
        html += '<div class="category-card-icon">' + generateProductImage(c.name, c.name, 64) + '</div>';
        html += '<div class="category-card-name">' + c.name + '</div>';
        html += '<div class="category-card-count">' + c.count.toLocaleString() + ' Items</div>';
        html += '</div>';
    });
    html += '</div>';
    main.innerHTML = html;
}

// ============================================================
// SUBCATEGORY GRID
// ============================================================
function renderSubcategoryGrid(cat) {
    var main = document.getElementById('main-area');
    var html = '<div class="back-link" onclick="navigateHome()">&#8592; Back to All Categories</div>';
    html += '<div class="section-title">' + cat.name + ' Subcategories</div><div class="category-grid">';
    cat.subcats.forEach(function(sc) {
        html += '<div class="category-card" onclick="navigateSubcategory(\'' + esc(cat.name) + '\',\'' + esc(sc.name) + '\')">';
        html += '<div class="category-card-icon">' + generateProductImage(cat.name, cat.name + sc.name, 64) + '</div>';
        html += '<div class="category-card-name">' + sc.name + '</div>';
        html += '<div class="category-card-count">' + sc.count.toLocaleString() + ' Items</div>';
        html += '</div>';
    });
    html += '</div>';
    main.innerHTML = html;
}

// ============================================================
// PRODUCT LIST with working pagination
// ============================================================
function buildSortHeader(field, label) {
    var cls = 'sortable';
    var arrow = '';
    if (currentSort.field === field) {
        cls += currentSort.dir === 'asc' ? ' sort-asc' : ' sort-desc';
        arrow = '<span class="sort-arrow"></span>';
    }
    return '<th class="' + cls + '" onclick="sortProducts(\'' + field + '\')">' + label + arrow + '</th>';
}

function renderProductList(cat, subcat) {
    currentCatName = cat.name;
    currentSubcatName = subcat.name;
    priceBreaksMap = {};
    var allProducts = generateProducts(subcat, cat.name, !inStockOnly);

    // Apply parametric and manufacturer filters
    var filterKeys = Object.keys(activeFilters);
    if (filterKeys.length > 0) {
        allProducts = allProducts.filter(function(p) {
            return filterKeys.every(function(key) {
                var vals = activeFilters[key];
                if (!vals || vals.length === 0) return true;
                if (key === 'manufacturer') return vals.indexOf(p.manufacturer) >= 0;
                return p.specs && p.specs[key] && vals.indexOf(p.specs[key]) >= 0;
            });
        });
    }
    currentProducts = allProducts;

    // Sort
    if (currentSort.field) {
        allProducts = allProducts.slice().sort(function(a, b) {
            var va, vb;
            switch(currentSort.field) {
                case 'partNum': va = a.partNum; vb = b.partNum; break;
                case 'mfrPartNum': va = a.mfrPartNum; vb = b.mfrPartNum; break;
                case 'manufacturer': va = a.manufacturer; vb = b.manufacturer; break;
                case 'stock': va = a.stock; vb = b.stock; break;
                case 'price': va = getPriceAtQty(a.priceBreaks, priceAtQty); vb = getPriceAtQty(b.priceBreaks, priceAtQty); break;
                default: return 0;
            }
            if (typeof va === 'string') { va = va.toLowerCase(); vb = vb.toLowerCase(); }
            return (va < vb ? -1 : va > vb ? 1 : 0) * (currentSort.dir === 'asc' ? 1 : -1);
        });
        currentProducts = allProducts;
    }

    // Paginate
    var totalPages = Math.max(1, Math.ceil(allProducts.length / ITEMS_PER_PAGE));
    if (currentPage > totalPages) currentPage = totalPages;
    var start = (currentPage - 1) * ITEMS_PER_PAGE;
    var pageProducts = allProducts.slice(start, start + ITEMS_PER_PAGE);

    var main = document.getElementById('main-area');
    var html = '<div class="back-link" onclick="navigateCategory(\'' + esc(cat.name) + '\')">&#8592; Back to ' + cat.name + '</div>';
    var filterCount = Object.keys(activeFilters).length;
    html += '<div class="product-list-header"><h2>' + subcat.name + '</h2><span style="font-size:13px;color:var(--text-light);">' + allProducts.length + ' products' + (filterCount > 0 ? ' (filtered)' : '') + '</span>';
    html += '<button class="mobile-filter-btn" onclick="openMobileFilters()">&#9776; Filters' + (filterCount > 0 ? ' (' + filterCount + ')' : '') + '</button>';
    html += '</div>';
    html += '<div class="table-wrap"><table class="product-table"><thead><tr>';
    html += '<th style="width:32px;"><input type="checkbox" onchange="toggleSelectAll(this)" title="Select for compare"></th>';
    html += '<th style="width:44px;"></th>';
    html += buildSortHeader('partNum', 'Part #');
    html += buildSortHeader('mfrPartNum', 'Mfr Part #');
    html += '<th>Description</th>';
    html += buildSortHeader('manufacturer', 'Manufacturer');
    html += buildSortHeader('stock', 'Stock');
    html += buildSortHeader('price', 'Unit Price');
    html += '<th>Qty</th><th>Action</th>';
    html += '</tr></thead><tbody>';

    pageProducts.forEach(function(p, pi) {
        var globalIdx = start + pi;
        var unitPrice = getPriceAtQty(p.priceBreaks, priceAtQty);
        var statusCls = p.status === 'Last Time Buy' ? 'status-ltb' : p.status === 'Discontinued' ? 'status-discontinued' : 'status-active';
        var isCompared = compareList.some(function(c) { return c.partNum === p.partNum; });

        html += '<tr style="' + (!p.inStock ? 'opacity:0.6;' : '') + '">';
        html += '<td><input type="checkbox" ' + (isCompared ? 'checked' : '') + ' onchange="toggleCompare(' + globalIdx + ',this.checked)"></td>';
        html += '<td>' + generateProductImage(cat.name, p.partNum, 36) + '</td>';
        html += '<td><span class="prod-name" onclick="navigateProduct(\'' + esc(cat.name) + '\',\'' + esc(subcat.name) + '\',\'' + esc(p.partNum) + '\')">' + p.partNum + '</span></td>';
        html += '<td><span class="prod-name" onclick="navigateProduct(\'' + esc(cat.name) + '\',\'' + esc(subcat.name) + '\',\'' + esc(p.partNum) + '\')">' + p.mfrPartNum + '</span></td>';
        html += '<td style="max-width:200px;">' + p.name + ' <span class="status-badge ' + statusCls + '">' + p.status + '</span></td>';
        html += '<td><a onclick="navigateManufacturer(\'' + esc(p.manufacturer) + '\')">' + p.manufacturer + '</a></td>';
        html += '<td class="' + (p.inStock ? 'in-stock' : 'out-of-stock') + '">' + (p.inStock ? p.stock.toLocaleString() : 'Out of Stock') + '</td>';
        priceBreaksMap[globalIdx] = p.priceBreaks;
        html += '<td class="price" data-prod-idx="' + globalIdx + '">$' + unitPrice.toFixed(2) + '</td>';
        html += '<td><input type="number" class="qty-input" value="0" min="0" id="qty-' + globalIdx + '" ' + (!p.inStock ? 'disabled' : '') + '></td>';
        html += '<td>';
        if (p.inStock) {
            html += '<button class="btn-sm btn-add" id="add-btn-' + globalIdx + '" onclick="addToCartFromList(' + globalIdx + ')">Add</button>';
        } else {
            html += '<button class="btn-sm btn-secondary" style="padding:5px 8px;font-size:11px;width:auto;" onclick="navigatePage(\'Request a Quote\')">Quote</button>';
        }
        html += '</td></tr>';
    });

    html += '</tbody></table></div>';

    // Pagination
    html += '<div class="pagination">';
    html += '<button class="page-btn" onclick="goToPage(' + (currentPage - 1) + ')" ' + (currentPage <= 1 ? 'disabled' : '') + '>&laquo; Prev</button>';
    for (var pg = 1; pg <= totalPages; pg++) {
        if (totalPages <= 7 || pg <= 2 || pg >= totalPages - 1 || Math.abs(pg - currentPage) <= 1) {
            html += '<button class="page-btn ' + (pg === currentPage ? 'active' : '') + '" onclick="goToPage(' + pg + ')">' + pg + '</button>';
        } else if (pg === 3 && currentPage > 4) {
            html += '<span class="page-info">...</span>';
        } else if (pg === totalPages - 2 && currentPage < totalPages - 3) {
            html += '<span class="page-info">...</span>';
        }
    }
    html += '<button class="page-btn" onclick="goToPage(' + (currentPage + 1) + ')" ' + (currentPage >= totalPages ? 'disabled' : '') + '>Next &raquo;</button>';
    html += '<span class="page-info">Page ' + currentPage + ' of ' + totalPages + '</span>';
    html += '</div>';

    main.innerHTML = html;
}

function goToPage(page) {
    currentPage = page;
    if (currentCatName && currentSubcatName) {
        var cat = CATEGORIES.find(function(c) { return c.name === currentCatName; });
        var subcat = cat ? cat.subcats.find(function(s) { return s.name === currentSubcatName; }) : null;
        if (cat && subcat) renderProductList(cat, subcat);
    }
    window.scrollTo(0, 0);
}

function sortProducts(field) {
    if (currentSort.field === field) currentSort.dir = currentSort.dir === 'asc' ? 'desc' : 'asc';
    else { currentSort.field = field; currentSort.dir = 'asc'; }
    currentPage = 1;
    if (currentCatName && currentSubcatName) {
        var cat = CATEGORIES.find(function(c) { return c.name === currentCatName; });
        var subcat = cat ? cat.subcats.find(function(s) { return s.name === currentSubcatName; }) : null;
        if (cat && subcat) renderProductList(cat, subcat);
    }
}

function addToCartFromList(idx) {
    var p = currentProducts[idx];
    if (!p) return;
    var qtyEl = document.getElementById('qty-' + idx);
    var qty = qtyEl ? parseInt(qtyEl.value) || 0 : 0;
    if (qty < 1) { showToast('Please enter a quantity first'); if (qtyEl) qtyEl.focus(); return; }
    var unitPrice = getPriceAtQty(p.priceBreaks, qty);
    addToCart({ partNum: p.partNum, name: p.name, manufacturer: p.manufacturer, price: unitPrice }, idx, qty);
}

// ============================================================
// PRODUCT DETAIL
// ============================================================
function renderProductDetail(product, prodIdx) {
    var main = document.getElementById('main-area');
    var statusCls = product.status === 'Last Time Buy' ? 'status-ltb' : product.status === 'Discontinued' ? 'status-discontinued' : 'status-active';

    var html = '<div class="back-link" onclick="navigateSubcategory(\'' + esc(product.category) + '\',\'' + esc(product.subcategory) + '\')">&#8592; Back to ' + product.subcategory + '</div>';
    html += '<div class="pd-layout">';

    // Product image
    html += '<div><div class="pd-image-box">' + generateProductImage(product.category, product.partNum, 200) + '</div>';
    html += '<div style="margin-top:12px;text-align:center;"><button class="btn-secondary" style="width:auto;padding:8px 16px;font-size:12px;" onclick="showToast(\'Datasheet PDF downloaded!\')">&#128196; Download Datasheet</button></div></div>';

    // Info
    html += '<div>';
    html += '<div style="margin-bottom:8px;"><span class="status-badge ' + statusCls + '">' + product.status + '</span></div>';
    html += '<div class="pd-part-num">Uroldman Part #: ' + product.partNum + '</div>';
    html += '<div class="pd-mfr-part">' + product.mfrPartNum + '</div>';
    html += '<a class="pd-mfr-link" onclick="navigateManufacturer(\'' + esc(product.manufacturer) + '\')">' + product.manufacturer + ' &#8250;</a>';
    html += '<div class="pd-desc">' + product.name + '</div>';
    html += '<div class="pd-badges"><span class="pd-badge">' + product.package + '</span><span class="pd-badge">' + product.packaging + '</span>' + (product.rohs ? '<span class="pd-badge" style="background:#e8f5e9;color:#2e7d32;border-color:#c8e6c9;">RoHS</span>' : '') + '</div>';

    // Stock
    html += '<div style="margin-bottom:12px;">';
    if (product.inStock) html += '<span class="in-stock" style="font-size:16px;">' + product.stock.toLocaleString() + ' In Stock</span>';
    else html += '<span class="out-of-stock" style="font-size:16px;">Out of Stock</span>';
    html += '<span style="color:var(--text-light);font-size:12px;margin-left:12px;">Min Qty: ' + product.minQty + '</span></div>';

    // Price breaks
    html += '<table class="price-break-table"><thead><tr><th>Quantity</th><th>Unit Price</th><th>Extended</th></tr></thead><tbody>';
    product.priceBreaks.forEach(function(pb, idx) {
        html += '<tr class="' + (idx === 0 ? 'active-break' : '') + '"><td>' + pb.qty.toLocaleString() + '</td><td>$' + pb.price.toFixed(2) + '</td><td>$' + (pb.price * pb.qty).toFixed(2) + '</td></tr>';
    });
    html += '</tbody></table>';

    // Add to cart
    html += '<div style="display:flex;align-items:center;gap:12px;margin-top:16px;flex-wrap:wrap;">';
    html += '<label style="font-size:13px;font-weight:600;">Qty:</label>';
    html += '<input type="number" class="qty-input" id="detail-qty" value="0" min="0" style="width:80px;" oninput="updateDetailPrice()" ' + (!product.inStock ? 'disabled' : '') + '>';
    html += '<span id="detail-unit-price" style="font-size:16px;font-weight:700;">$' + product.priceBreaks[0].price.toFixed(2) + '</span>';
    html += '<span id="detail-ext-price" style="font-size:14px;color:var(--text-light);">Ext: $0.00</span>';
    html += '</div><div style="margin-top:12px;">';
    if (product.inStock) html += '<button class="btn-primary" style="max-width:250px;" onclick="addToCartFromDetail()">Add to Cart</button>';
    else html += '<button class="btn-secondary" style="max-width:250px;" onclick="navigatePage(\'Request a Quote\')">Request Quote</button>';
    html += '</div></div></div>';

    // Specs
    html += '<h3 style="font-size:18px;font-weight:700;margin-top:32px;margin-bottom:12px;">Specifications</h3>';
    html += '<div class="table-wrap"><table class="spec-table"><thead><tr><th>Attribute</th><th>Value</th></tr></thead><tbody>';
    Object.keys(product.specs).forEach(function(key) {
        html += '<tr><td style="font-weight:600;width:40%;">' + key + '</td><td>' + product.specs[key] + '</td></tr>';
    });
    html += '</tbody></table></div>';
    main.innerHTML = html;

    window._detailProduct = product;
    window._detailProdIdx = prodIdx;
}

function updateDetailPrice() {
    var qty = parseInt(document.getElementById('detail-qty').value) || 0;
    var product = window._detailProduct;
    if (!product) return;
    var price = getPriceAtQty(product.priceBreaks, Math.max(1, qty));
    document.getElementById('detail-unit-price').textContent = '$' + price.toFixed(2);
    document.getElementById('detail-ext-price').textContent = 'Ext: $' + (price * qty).toFixed(2);

    var rows = document.querySelectorAll('.price-break-table tbody tr');
    rows.forEach(function(r) { r.classList.remove('active-break'); });
    var activeIdx = 0;
    for (var i = 0; i < product.priceBreaks.length; i++) {
        if (qty >= product.priceBreaks[i].qty) activeIdx = i;
    }
    if (rows[activeIdx]) rows[activeIdx].classList.add('active-break');
}

function addToCartFromDetail() {
    var product = window._detailProduct;
    if (!product) return;
    var qtyEl = document.getElementById('detail-qty');
    var qty = parseInt(qtyEl.value) || 0;
    if (qty < 1) { showToast('Please enter a quantity first'); qtyEl.focus(); return; }
    if (qty < product.minQty) { showToast('Minimum order quantity is ' + product.minQty); qtyEl.value = product.minQty; qtyEl.focus(); return; }
    var price = getPriceAtQty(product.priceBreaks, qty);
    addToCart({ partNum: product.partNum, name: product.name, manufacturer: product.manufacturer, price: price }, null, qty);
}

function getCategoryIcon(catName) {
    var cat = CATEGORIES.find(function(c) { return c.name === catName; });
    return cat ? cat.icon : '&#128268;';
}

// ============================================================
// COMPARE
// ============================================================
function toggleCompare(idx, checked) {
    var p = currentProducts[idx];
    if (!p) return;
    if (checked) {
        if (compareList.length >= 4) {
            showToast('Maximum 4 parts for comparison');
            var cbs = document.querySelectorAll('.product-table tbody input[type="checkbox"]');
            var pageIdx = idx - ((currentPage - 1) * ITEMS_PER_PAGE);
            if (cbs[pageIdx]) cbs[pageIdx].checked = false;
            return;
        }
        if (!compareList.some(function(c) { return c.partNum === p.partNum; })) compareList.push(p);
    } else {
        compareList = compareList.filter(function(c) { return c.partNum !== p.partNum; });
    }
    updateCompareBar();
}

function toggleSelectAll(el) {
    var cbs = document.querySelectorAll('.product-table tbody input[type="checkbox"]');
    var start = (currentPage - 1) * ITEMS_PER_PAGE;
    if (!el.checked) {
        // Uncheck all on this page
        cbs.forEach(function(cb, i) { cb.checked = false; toggleCompare(start + i, false); });
        return;
    }
    // Count how many on this page are NOT already in compareList
    var newCount = 0;
    cbs.forEach(function(cb, i) {
        var p = currentProducts[start + i];
        if (p && !compareList.some(function(c) { return c.partNum === p.partNum; })) newCount++;
    });
    var remaining = 4 - compareList.length;
    if (newCount > remaining) {
        showToast('Max 4 parts for comparison. Only ' + remaining + ' slot' + (remaining !== 1 ? 's' : '') + ' left.');
        el.checked = false;
        return;
    }
    cbs.forEach(function(cb, i) { cb.checked = true; toggleCompare(start + i, true); });
}

function updateCompareBar() {
    localStorage.setItem('uro_compare', JSON.stringify(compareList));
    var bar = document.getElementById('compare-bar');
    var tags = document.getElementById('compare-tags');
    if (compareList.length === 0) { bar.classList.remove('visible'); return; }
    bar.classList.add('visible');
    tags.innerHTML = compareList.map(function(p) {
        return '<span class="compare-tag">' + p.mfrPartNum + ' <span class="remove-tag" onclick="removeCompare(\'' + p.partNum + '\')">&times;</span></span>';
    }).join('');
}

function removeCompare(partNum) {
    compareList = compareList.filter(function(c) { return c.partNum !== partNum; });
    // Uncheck the corresponding checkbox in the product table if visible
    var start = (currentPage - 1) * ITEMS_PER_PAGE;
    var cbs = document.querySelectorAll('.product-table tbody input[type="checkbox"]');
    cbs.forEach(function(cb, i) {
        var p = currentProducts[start + i];
        if (p && p.partNum === partNum) cb.checked = false;
    });
    updateCompareBar();
}

function clearCompare() {
    compareList = [];
    updateCompareBar();
    document.querySelectorAll('.product-table input[type="checkbox"]').forEach(function(cb) { cb.checked = false; });
}

function showCompare() {
    if (compareList.length < 2) { showToast('Select at least 2 parts'); return; }
    currentView = 'compare';
    pushHistory({ view: 'compare' });
    var main = document.getElementById('main-area');
    document.getElementById('page-title').innerHTML = 'Compare Parts';
    renderBreadcrumb([{ label: 'Home', action: 'navigateHome()' }, { label: 'Compare Parts' }]);

    var html = '<div class="back-link" onclick="history.back()">&#8592; Back</div>';
    html += '<h2 style="margin-bottom:16px;">Side-by-Side Comparison</h2>';
    html += '<div class="table-wrap"><table class="spec-table" style="margin-top:0;"><thead><tr><th>Attribute</th>';
    compareList.forEach(function(p) { html += '<th style="min-width:150px;">' + p.mfrPartNum + '</th>'; });
    html += '</tr></thead><tbody>';

    var rows = [
        { label: 'Part #', key: 'partNum' }, { label: 'Manufacturer', key: 'manufacturer' },
        { label: 'Status', key: 'status' }, { label: 'Package', key: 'package' },
        { label: 'Stock', fn: function(p) { return p.inStock ? p.stock.toLocaleString() : 'Out of Stock'; } },
        { label: 'Unit Price', fn: function(p) { return '$' + p.priceBreaks[0].price.toFixed(2); } },
        { label: 'RoHS', fn: function(p) { return p.rohs ? 'Yes' : 'No'; } }
    ];
    rows.forEach(function(row) {
        html += '<tr><td style="font-weight:600;">' + row.label + '</td>';
        compareList.forEach(function(p) { html += '<td>' + (row.fn ? row.fn(p) : p[row.key]) + '</td>'; });
        html += '</tr>';
    });

    var allSpecs = {};
    compareList.forEach(function(p) { Object.keys(p.specs).forEach(function(k) { allSpecs[k] = true; }); });
    Object.keys(allSpecs).forEach(function(key) {
        html += '<tr><td style="font-weight:600;">' + key + '</td>';
        compareList.forEach(function(p) { html += '<td>' + (p.specs[key] || '-') + '</td>'; });
        html += '</tr>';
    });

    html += '</tbody></table></div>';
    html += '<div style="margin-top:16px;"><button class="btn-secondary" style="width:auto;padding:8px 20px;" onclick="clearCompare();history.back();">Clear & Go Back</button></div>';
    main.innerHTML = html;
}
