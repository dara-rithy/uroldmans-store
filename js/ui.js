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
// PRODUCT IMAGE - Real photos per category
// ============================================================
var CAT_IMAGES = {
    "Capacitors": ["img/capacitors.jpg", "img/ceramic-capacitor.jpg"],
    "Resistors": ["img/resistors.jpg", "img/resistor-array.png"],
    "Semiconductors": ["img/transistor.jpg"],
    "Integrated Circuits": ["img/ic-chips.jpg", "img/ic-ne555.jpg"],
    "Connectors": ["img/connector-usbc.jpg", "img/dip-socket.jpg"],
    "LEDs & Optoelectronics": ["img/led-red.jpg", "img/led-rgb.jpg"],
    "Inductors & Coils": ["img/inductors.jpg", "img/inductor-axial.jpg"],
    "Circuit Protection": ["img/fuse.jpg", "img/varistor.jpg"],
    "Development Boards": ["img/arduino.jpg", "img/raspberry-pi.jpg"],
    "Sensors": ["img/thermistor.jpg", "img/photodiode.jpg"]
};

function generateProductImage(catName, seed, size) {
    size = size || 100;
    var images = CAT_IMAGES[catName] || CAT_IMAGES["Connectors"];
    var rng = seededRandom(seed || catName);
    var imgIdx = Math.floor(rng() * images.length);
    return '<img src="' + images[imgIdx] + '" alt="' + catName + '" width="' + size + '" height="' + size + '" style="object-fit:contain;border-radius:6px;background:#fff;" loading="lazy">';
}

function generateProductImageURI(catName, seed, size) {
    var images = CAT_IMAGES[catName] || CAT_IMAGES["Connectors"];
    var rng = seededRandom(seed || catName);
    var imgIdx = Math.floor(rng() * images.length);
    return images[imgIdx];
}


// ============================================================
// SIDEBAR
// ============================================================
function openMobileFilters() {
    var sb = document.getElementById('sidebar');
    var overlay = document.getElementById('mobile-filter-overlay');
    sb.classList.add('mobile-open');
    overlay.classList.add('active');
}

function closeMobileFilters() {
    var sb = document.getElementById('sidebar');
    var overlay = document.getElementById('mobile-filter-overlay');
    sb.classList.remove('mobile-open');
    overlay.classList.remove('active');
}

document.getElementById('mobile-filter-overlay').addEventListener('click', closeMobileFilters);

function renderSidebar(activeCat, activeSubcat) {
    var sb = document.getElementById('sidebar');
    var html = '<button class="mobile-filter-close" onclick="closeMobileFilters()" title="Close filters">&times;</button>';

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

