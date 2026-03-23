// SEARCH
// ============================================================
var searchInput = document.getElementById('search-input');
var searchResults = document.getElementById('search-results');

searchInput.addEventListener('input', function() {
    var q = this.value.trim().toLowerCase();
    if (q.length < 2) { searchResults.classList.remove('active'); return; }

    var html = '';
    var matchedCats = CATEGORIES.filter(function(c) { return c.name.toLowerCase().includes(q); });
    if (matchedCats.length > 0) {
        html += '<div class="search-group-label">Categories</div>';
        matchedCats.slice(0, 5).forEach(function(c) {
            html += '<div class="search-result-item" data-action="cat" data-cat="' + c.name + '">';
            html += '<div class="sr-info"><div class="sr-name">' + c.name + '</div><div class="sr-detail">' + c.count.toLocaleString() + ' items</div></div></div>';
        });
    }

    var matchedSubs = [];
    CATEGORIES.forEach(function(c) {
        c.subcats.forEach(function(sc) {
            if (sc.name.toLowerCase().includes(q)) matchedSubs.push({ name: sc.name, parent: c.name, count: sc.count });
        });
    });
    if (matchedSubs.length > 0) {
        html += '<div class="search-group-label">Subcategories</div>';
        matchedSubs.slice(0, 8).forEach(function(sc) {
            html += '<div class="search-result-item" data-action="subcat" data-cat="' + sc.parent + '" data-subcat="' + sc.name + '">';
            html += '<div class="sr-info"><div class="sr-name">' + sc.name + '</div><div class="sr-detail">in ' + sc.parent + ' &middot; ' + sc.count.toLocaleString() + ' items</div></div></div>';
        });
    }

    var matchedMfrs = MANUFACTURERS.filter(function(m) { return m.toLowerCase().includes(q); });
    if (matchedMfrs.length > 0) {
        html += '<div class="search-group-label">Manufacturers</div>';
        matchedMfrs.slice(0, 5).forEach(function(m) {
            html += '<div class="search-result-item" data-action="mfr" data-mfr="' + m + '">';
            html += '<div class="sr-info"><div class="sr-name">' + m + '</div><div class="sr-detail">Manufacturer</div></div></div>';
        });
    }

    // Search products by part number or mfr part number
    if (q.length >= 3) {
        var matchedProducts = [];
        CATEGORIES.forEach(function(cat) {
            cat.subcats.forEach(function(sc) {
                if (matchedProducts.length >= 5) return;
                var prods = generateProducts(sc, cat.name, false);
                prods.forEach(function(p) {
                    if (matchedProducts.length >= 5) return;
                    if (p.partNum.toLowerCase().includes(q) || p.mfrPartNum.toLowerCase().includes(q)) {
                        matchedProducts.push({ prod: p, cat: cat.name, subcat: sc.name });
                    }
                });
            });
        });
        if (matchedProducts.length > 0) {
            html += '<div class="search-group-label">Products</div>';
            matchedProducts.forEach(function(m) {
                html += '<div class="search-result-item" data-action="product" data-cat="' + m.cat + '" data-subcat="' + m.subcat + '" data-part="' + m.prod.partNum + '">';
                html += '<div class="sr-info"><div class="sr-name">' + m.prod.mfrPartNum + ' (' + m.prod.partNum + ')</div><div class="sr-detail">' + m.prod.manufacturer + ' &middot; $' + m.prod.price.toFixed(2) + '</div></div></div>';
            });
        }
    }

    if (html) {
        searchResults.innerHTML = html;
        searchResults.classList.add('active');
        searchResults.querySelectorAll('.search-result-item').forEach(function(item) {
            item.addEventListener('click', function() {
                var action = this.getAttribute('data-action');
                if (action === 'cat') navigateCategory(this.getAttribute('data-cat'));
                else if (action === 'subcat') navigateSubcategory(this.getAttribute('data-cat'), this.getAttribute('data-subcat'));
                else if (action === 'mfr') navigateManufacturer(this.getAttribute('data-mfr'));
                else if (action === 'product') navigateProduct(this.getAttribute('data-cat'), this.getAttribute('data-subcat'), this.getAttribute('data-part'));
                searchResults.classList.remove('active');
                searchInput.value = '';
            });
        });
    } else {
        searchResults.innerHTML = '<div style="padding:16px;color:#999;text-align:center;">No results found</div>';
        searchResults.classList.add('active');
    }
});

searchInput.addEventListener('keydown', function(e) { if (e.key === 'Enter') executeSearch(); });

function executeSearch() {
    var q = searchInput.value.trim().toLowerCase();
    if (!q) return;
    searchResults.classList.remove('active');

    var matchedCat = CATEGORIES.find(function(c) { return c.name.toLowerCase().includes(q); });
    if (matchedCat) { navigateCategory(matchedCat.name); searchInput.value = ''; return; }

    for (var ci = 0; ci < CATEGORIES.length; ci++) {
        var sc = CATEGORIES[ci].subcats.find(function(s) { return s.name.toLowerCase().includes(q); });
        if (sc) { navigateSubcategory(CATEGORIES[ci].name, sc.name); searchInput.value = ''; return; }
    }

    var matchedMfr = MANUFACTURERS.find(function(m) { return m.toLowerCase().includes(q); });
    if (matchedMfr) { navigateManufacturer(matchedMfr); searchInput.value = ''; return; }

    showToast('No results for "' + q + '"');
}

document.addEventListener('click', function(e) {
    if (!e.target.closest('.search-container')) searchResults.classList.remove('active');
});
