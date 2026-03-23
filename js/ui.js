// ============================================================
// UTILITY
// ============================================================
function seededRandom(seed) {
    var h = 0;
    for (var i = 0; i < seed.length; i++) { h = ((h << 5) - h) + seed.charCodeAt(i); h |= 0; }
    if (h <= 0) h += 2147483646;
    return function() { h = (h * 16807) % 2147483647; if (h <= 0) h += 2147483646; return (h - 1) / 2147483646; };
}

function generateProducts(subcat, parentCat, showOutOfStock) {
    var products = [];
    var inStockCount = Math.min(subcat.count, 10);
    var totalCount = showOutOfStock ? inStockCount + 3 : inStockCount;
    var rng = seededRandom(parentCat + subcat.name);
    var breakQtys = [1, 10, 25, 100, 500, 1000];

    for (var i = 0; i < totalCount; i++) {
        var mfr = MANUFACTURERS[Math.floor(rng() * MANUFACTURERS.length)];
        var pkg = PACKAGES[Math.floor(rng() * PACKAGES.length)];
        var packaging = PACKAGINGS[Math.floor(rng() * PACKAGINGS.length)];
        var status = STATUSES[Math.floor(rng() * STATUSES.length)];
        var basePrice = rng() * 15 + 0.05;
        var isOutOfStock = i >= inStockCount;
        var stock = isOutOfStock ? 0 : Math.floor(rng() * 50000) + 100;
        var partNum = (parentCat.substring(0,3) + '-' + subcat.name.substring(0,3) + '-' + (1000 + i)).toUpperCase();
        var mfrPartNum = mfr.substring(0,3).toUpperCase() + Math.floor(rng()*9000+1000) + String.fromCharCode(65 + Math.floor(rng()*26));
        var minQty = [1,1,1,10,25][Math.floor(rng() * 5)];
        var rohs = rng() > 0.15;

        var priceBreaks = [];
        var p = basePrice;
        for (var b = 0; b < breakQtys.length; b++) {
            priceBreaks.push({ qty: breakQtys[b], price: parseFloat(p.toFixed(2)) });
            p *= (0.85 + rng() * 0.1);
        }

        var specs = {};
        var catSpecs = CATEGORY_SPECS[parentCat];
        if (catSpecs) {
            catSpecs.forEach(function(spec) {
                specs[spec.name] = spec.values[Math.floor(rng() * spec.values.length)];
            });
        }
        specs["Package / Case"] = pkg;
        specs["Operating Temp"] = "-" + (Math.floor(rng()*3)+2) + "0C ~ " + (Math.floor(rng()*4)+8) + "5C";
        specs["RoHS"] = rohs ? "Compliant" : "Non-Compliant";

        products.push({
            partNum: partNum, mfrPartNum: mfrPartNum,
            name: subcat.name + " - " + mfr + " " + pkg,
            manufacturer: mfr, package: pkg, packaging: packaging,
            status: status, price: priceBreaks[0].price, priceBreaks: priceBreaks,
            stock: stock, minQty: minQty, rohs: rohs, specs: specs,
            category: parentCat, subcategory: subcat.name, inStock: !isOutOfStock
        });
    }
    return products;
}

function getPriceAtQty(priceBreaks, qty) {
    var price = priceBreaks[0].price;
    for (var i = 0; i < priceBreaks.length; i++) {
        if (qty >= priceBreaks[i].qty) price = priceBreaks[i].price;
    }
    return price;
}

function esc(s) { return s.replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/</g,'\\x3c').replace(/>/g,'\\x3e'); }

// ============================================================
// PRODUCT IMAGE GENERATOR
// ============================================================
var CAT_COLORS = {
    "Capacitors": { bg: "#1a237e", accent: "#5c6bc0", light: "#e8eaf6" },
    "Resistors": { bg: "#b71c1c", accent: "#ef5350", light: "#ffebee" },
    "Semiconductors": { bg: "#1b5e20", accent: "#66bb6a", light: "#e8f5e9" },
    "Integrated Circuits": { bg: "#4a148c", accent: "#ab47bc", light: "#f3e5f5" },
    "Connectors": { bg: "#e65100", accent: "#ff9800", light: "#fff3e0" },
    "LEDs & Optoelectronics": { bg: "#006064", accent: "#26c6da", light: "#e0f7fa" },
    "Inductors & Coils": { bg: "#263238", accent: "#78909c", light: "#eceff1" },
    "Circuit Protection": { bg: "#880e4f", accent: "#ec407a", light: "#fce4ec" },
    "Development Boards": { bg: "#33691e", accent: "#8bc34a", light: "#f1f8e9" },
    "Sensors": { bg: "#0d47a1", accent: "#42a5f5", light: "#e3f2fd" }
};

var CAT_SVG_PATHS = {
    "Capacitors": '<rect x="38" y="20" width="8" height="60" rx="2" fill="FG"/><rect x="54" y="20" width="8" height="60" rx="2" fill="FG"/><line x1="42" y1="10" x2="42" y2="20" stroke="FG" stroke-width="3"/><line x1="58" y1="10" x2="58" y2="20" stroke="FG" stroke-width="3"/><line x1="42" y1="80" x2="42" y2="90" stroke="FG" stroke-width="3"/><line x1="58" y1="80" x2="58" y2="90" stroke="FG" stroke-width="3"/>',
    "Resistors": '<rect x="30" y="30" width="40" height="40" rx="4" fill="FG"/><line x1="10" y1="50" x2="30" y2="50" stroke="FG" stroke-width="3"/><line x1="70" y1="50" x2="90" y2="50" stroke="FG" stroke-width="3"/><rect x="34" y="36" width="32" height="6" rx="1" fill="BG" opacity="0.6"/><rect x="34" y="46" width="32" height="6" rx="1" fill="BG" opacity="0.4"/><rect x="34" y="56" width="32" height="6" rx="1" fill="BG" opacity="0.6"/>',
    "Semiconductors": '<polygon points="50,15 85,75 15,75" fill="FG" stroke="FG" stroke-width="2"/><line x1="50" y1="5" x2="50" y2="15" stroke="FG" stroke-width="3"/><line x1="35" y1="75" x2="35" y2="90" stroke="FG" stroke-width="3"/><line x1="65" y1="75" x2="65" y2="90" stroke="FG" stroke-width="3"/><line x1="25" y1="55" x2="75" y2="55" stroke="BG" stroke-width="2"/>',
    "Integrated Circuits": '<rect x="25" y="25" width="50" height="50" rx="4" fill="FG"/><circle cx="35" cy="35" r="4" fill="BG" opacity="0.5"/><line x1="15" y1="35" x2="25" y2="35" stroke="FG" stroke-width="2"/><line x1="15" y1="45" x2="25" y2="45" stroke="FG" stroke-width="2"/><line x1="15" y1="55" x2="25" y2="55" stroke="FG" stroke-width="2"/><line x1="15" y1="65" x2="25" y2="65" stroke="FG" stroke-width="2"/><line x1="75" y1="35" x2="85" y2="35" stroke="FG" stroke-width="2"/><line x1="75" y1="45" x2="85" y2="45" stroke="FG" stroke-width="2"/><line x1="75" y1="55" x2="85" y2="55" stroke="FG" stroke-width="2"/><line x1="75" y1="65" x2="85" y2="65" stroke="FG" stroke-width="2"/>',
    "Connectors": '<rect x="30" y="20" width="40" height="55" rx="4" fill="FG"/><rect x="36" y="26" width="8" height="12" rx="2" fill="BG" opacity="0.5"/><rect x="56" y="26" width="8" height="12" rx="2" fill="BG" opacity="0.5"/><rect x="36" y="44" width="8" height="12" rx="2" fill="BG" opacity="0.5"/><rect x="56" y="44" width="8" height="12" rx="2" fill="BG" opacity="0.5"/><line x1="40" y1="75" x2="40" y2="90" stroke="FG" stroke-width="2"/><line x1="50" y1="75" x2="50" y2="90" stroke="FG" stroke-width="2"/><line x1="60" y1="75" x2="60" y2="90" stroke="FG" stroke-width="2"/>',
    "LEDs & Optoelectronics": '<circle cx="50" cy="45" r="22" fill="FG"/><circle cx="50" cy="45" r="14" fill="BG" opacity="0.3"/><circle cx="50" cy="45" r="6" fill="BG" opacity="0.5"/><line x1="42" y1="67" x2="42" y2="85" stroke="FG" stroke-width="3"/><line x1="58" y1="67" x2="58" y2="85" stroke="FG" stroke-width="3"/><path d="M36 20 L44 28" stroke="FG" stroke-width="2" fill="none"/><polygon points="44,24 44,28 40,28" fill="FG"/><path d="M30 28 L38 36" stroke="FG" stroke-width="2" fill="none"/><polygon points="38,32 38,36 34,36" fill="FG"/>',
    "Inductors & Coils": '<path d="M15 50 Q25 25, 35 50 Q45 75, 55 50 Q65 25, 75 50 Q85 75, 90 50" fill="none" stroke="FG" stroke-width="4"/><line x1="5" y1="50" x2="15" y2="50" stroke="FG" stroke-width="3"/><line x1="90" y1="50" x2="95" y2="50" stroke="FG" stroke-width="3"/>',
    "Circuit Protection": '<rect x="25" y="35" width="50" height="30" rx="15" fill="FG"/><line x1="10" y1="50" x2="25" y2="50" stroke="FG" stroke-width="3"/><line x1="75" y1="50" x2="90" y2="50" stroke="FG" stroke-width="3"/><line x1="40" y1="42" x2="60" y2="42" stroke="BG" stroke-width="2" opacity="0.5"/><path d="M45 50 L55 50" stroke="BG" stroke-width="3" opacity="0.6"/>',
    "Development Boards": '<rect x="15" y="20" width="70" height="55" rx="4" fill="FG"/><rect x="20" y="25" width="15" height="12" rx="2" fill="BG" opacity="0.4"/><rect x="20" y="42" width="10" height="10" rx="1" fill="BG" opacity="0.3"/><circle cx="70" cy="60" r="8" fill="BG" opacity="0.3"/><rect x="55" y="28" width="24" height="3" rx="1" fill="BG" opacity="0.3"/><rect x="55" y="34" width="18" height="3" rx="1" fill="BG" opacity="0.3"/><circle cx="22" cy="72" r="2" fill="FG"/><circle cx="78" cy="72" r="2" fill="FG"/><circle cx="22" cy="22" r="2" fill="BG" opacity="0.4"/><circle cx="78" cy="22" r="2" fill="BG" opacity="0.4"/>',
    "Sensors": '<rect x="30" y="25" width="40" height="50" rx="6" fill="FG"/><circle cx="50" cy="42" r="12" fill="BG" opacity="0.4"/><circle cx="50" cy="42" r="6" fill="BG" opacity="0.3"/><line x1="38" y1="75" x2="38" y2="88" stroke="FG" stroke-width="2"/><line x1="50" y1="75" x2="50" y2="88" stroke="FG" stroke-width="2"/><line x1="62" y1="75" x2="62" y2="88" stroke="FG" stroke-width="2"/><rect x="36" y="60" width="28" height="4" rx="1" fill="BG" opacity="0.3"/>'
};

function generateProductImage(catName, seed, size) {
    size = size || 100;
    var colors = CAT_COLORS[catName] || CAT_COLORS["Connectors"];
    var rng = seededRandom(seed || catName);
    var rotation = Math.floor(rng() * 8) - 4;
    var svgPath = (CAT_SVG_PATHS[catName] || CAT_SVG_PATHS["Connectors"])
        .replace(/FG/g, colors.accent)
        .replace(/BG/g, colors.bg);

    return '<svg viewBox="0 0 100 100" width="' + size + '" height="' + size + '" xmlns="http://www.w3.org/2000/svg">' +
        '<rect width="100" height="100" fill="' + colors.light + '" rx="8"/>' +
        '<g transform="rotate(' + rotation + ' 50 50)">' + svgPath + '</g>' +
        '</svg>';
}

function generateProductImageURI(catName, seed, size) {
    size = size || 100;
    var colors = CAT_COLORS[catName] || CAT_COLORS["Connectors"];
    var rng = seededRandom(seed || catName);
    var rotation = Math.floor(rng() * 8) - 4;
    var svgPath = (CAT_SVG_PATHS[catName] || CAT_SVG_PATHS["Connectors"])
        .replace(/FG/g, colors.accent)
        .replace(/BG/g, colors.bg);

    var svg = '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' +
        '<rect width="100" height="100" fill="' + colors.light + '" rx="8"/>' +
        '<g transform="rotate(' + rotation + ' 50 50)">' + svgPath + '</g>' +
        '</svg>';
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
}


// ============================================================
// SIDEBAR
// ============================================================
function renderSidebar(activeCat, activeSubcat) {
    var sb = document.getElementById('sidebar');
    var html = '';

    if (activeSubcat) {
        html += '<div class="price-at-qty-box"><label>PRICE AT QUANTITY</label>';
        html += '<input type="number" class="price-at-qty-input" value="' + priceAtQty + '" min="1" onchange="updatePriceAtQty(this.value)"></div>';
    }

    html += '<div class="filter-section"><div class="filter-title">Filters</div>';
    html += '<div class="checkbox-group"><label class="checkbox-item"><input type="checkbox" id="filter-in-stock" ' + (inStockOnly ? 'checked' : '') + ' onchange="toggleInStock()"> In Stock Only</label></div>';
    html += '<p style="font-size:11px;color:var(--text-light);margin:8px 0;">' + (inStockOnly ? 'Showing in-stock items only' : 'Showing all items') + '</p></div>';

    // Parametric filters
    if (activeSubcat && activeCat) {
        var catSpecs = CATEGORY_SPECS[activeCat];
        if (catSpecs) {
            html += '<div class="filter-section"><div class="filter-title">Specifications</div>';
            catSpecs.forEach(function(spec, idx) {
                var isOpen = idx < 2;
                var checkedVals = activeFilters[spec.name] || [];
                html += '<div class="param-section"><div class="param-header" onclick="toggleParam(this)">' + spec.name + ' <span class="param-arrow ' + (isOpen ? 'open' : '') + '">&#9660;</span></div>';
                html += '<div class="param-body ' + (isOpen ? 'open' : '') + '"><div class="checkbox-group">';
                spec.values.forEach(function(v) {
                    var isChecked = checkedVals.indexOf(v) >= 0;
                    html += '<label class="checkbox-item"><input type="checkbox" data-filter-spec="' + spec.name + '" data-filter-val="' + v + '" ' + (isChecked ? 'checked' : '') + ' onchange="applyFilter(\'' + esc(spec.name) + '\',\'' + esc(v) + '\',this.checked)"> ' + v + '</label>';
                });
                html += '</div></div></div>';
            });
            html += '</div>';
        }

        var checkedMfrs = activeFilters['manufacturer'] || [];
        html += '<div class="filter-section"><div class="filter-title">Manufacturer</div><div class="checkbox-group">';
        MANUFACTURERS.slice(0, 8).forEach(function(m) {
            var isChecked = checkedMfrs.indexOf(m) >= 0;
            html += '<label class="checkbox-item"><input type="checkbox" data-filter-spec="manufacturer" data-filter-val="' + m + '" ' + (isChecked ? 'checked' : '') + ' onchange="applyFilter(\'manufacturer\',\'' + esc(m) + '\',this.checked)"> ' + m + '</label>';
        });
        html += '</div></div>';
    }

    html += '<div class="filter-section"><div class="filter-title">Categories</div><ul class="categories-list">';
    CATEGORIES.forEach(function(c) {
        html += '<li class="' + (c.name === activeCat ? 'active-cat' : '') + '"><a onclick="navigateCategory(\'' + esc(c.name) + '\')">' + c.name + '</a></li>';
    });
    html += '</ul></div>';
    sb.innerHTML = html;
}

function toggleParam(el) {
    el.querySelector('.param-arrow').classList.toggle('open');
    el.nextElementSibling.classList.toggle('open');
}

function updatePriceAtQty(val) {
    priceAtQty = Math.max(1, parseInt(val) || 1);
    document.querySelectorAll('[data-prod-idx]').forEach(function(cell) {
        var idx = parseInt(cell.getAttribute('data-prod-idx'));
        var breaks = priceBreaksMap[idx];
        if (breaks) cell.textContent = '$' + getPriceAtQty(breaks, priceAtQty).toFixed(2);
    });
}

function applyFilter(specName, value, checked) {
    if (!activeFilters[specName]) activeFilters[specName] = [];
    if (checked) {
        if (activeFilters[specName].indexOf(value) < 0) activeFilters[specName].push(value);
    } else {
        activeFilters[specName] = activeFilters[specName].filter(function(v) { return v !== value; });
        if (activeFilters[specName].length === 0) delete activeFilters[specName];
    }
    currentPage = 1;
    if (currentView === 'subcategory' && currentCatName && currentSubcatName) {
        var cat = CATEGORIES.find(function(c) { return c.name === currentCatName; });
        var subcat = cat ? cat.subcats.find(function(s) { return s.name === currentSubcatName; }) : null;
        if (cat && subcat) renderProductList(cat, subcat);
    }
}

function toggleInStock() {
    inStockOnly = document.getElementById('filter-in-stock').checked;
    if (currentView === 'subcategory' && currentCatName && currentSubcatName) {
        var cat = CATEGORIES.find(function(c) { return c.name === currentCatName; });
        var subcat = cat ? cat.subcats.find(function(s) { return s.name === currentSubcatName; }) : null;
        if (cat && subcat) { renderSidebar(cat.name, subcat.name); renderProductList(cat, subcat); }
    }
    showToast(inStockOnly ? 'Showing in-stock items only' : 'Showing all items');
}

// ============================================================

// ============================================================
// DARK MODE
// ============================================================
document.getElementById('dark-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    var isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('uro_darkmode', isDark ? '1' : '0');
    showToast(isDark ? 'Dark mode enabled' : 'Light mode enabled');
});

// ============================================================
// TOAST
// ============================================================
function showToast(msg) {
    var toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('visible');
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(function() { toast.classList.remove('visible'); }, 2500);
}

