// MODALS
// ============================================================
function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

document.getElementById('login-trigger').addEventListener('click', function() {
    var user = JSON.parse(localStorage.getItem('uro_user') || 'null');
    if (user) { doLogout(); return; }
    showLoginForm(); openModal('login-modal');
});

function showLoginForm() {
    document.getElementById('auth-title').textContent = 'Sign In';
    document.getElementById('auth-body').innerHTML =
        '<div class="form-group"><label>Email</label><input type="email" id="login-email" placeholder="you@example.com"></div>' +
        '<div class="form-group"><label>Password</label><input type="password" id="login-pass" placeholder="Enter password"></div>' +
        '<button class="btn-primary" onclick="doLogin()">Sign In</button>' +
        '<div class="form-divider">or</div>' +
        '<button class="btn-secondary" onclick="showRegisterForm()">Create an Account</button>';
}

function showRegisterForm() {
    document.getElementById('auth-title').textContent = 'Create Account';
    document.getElementById('auth-body').innerHTML =
        '<div class="form-group"><label>Full Name</label><input type="text" id="reg-name" placeholder="Your full name"></div>' +
        '<div class="form-group"><label>Email</label><input type="email" id="reg-email" placeholder="you@example.com"></div>' +
        '<div class="form-group"><label>Password</label><input type="password" id="reg-pass" placeholder="Create a password"></div>' +
        '<button class="btn-primary" onclick="doRegister()">Create Account</button>' +
        '<div class="form-divider">or</div>' +
        '<button class="btn-secondary" onclick="showLoginForm()">Back to Sign In</button>';
}

function doLogin() {
    var email = document.getElementById('login-email').value.trim();
    var pass = document.getElementById('login-pass').value;
    if (!email) { showToast('Please enter your email'); return; }
    if (!pass) { showToast('Please enter your password'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { showToast('Please enter a valid email'); return; }
    var displayName = email.split('@')[0];
    localStorage.setItem('uro_user', JSON.stringify({ name: displayName, email: email }));
    showToast('Welcome back! Signed in as ' + email);
    document.getElementById('login-trigger').textContent = displayName;
    closeModal('login-modal');
}

function doRegister() {
    var name = document.getElementById('reg-name').value.trim();
    var email = document.getElementById('reg-email').value.trim();
    var pass = document.getElementById('reg-pass').value;
    if (!name) { showToast('Please enter your name'); return; }
    if (!email) { showToast('Please enter your email'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { showToast('Please enter a valid email'); return; }
    if (!pass || pass.length < 6) { showToast('Password must be at least 6 characters'); return; }
    localStorage.setItem('uro_user', JSON.stringify({ name: name, email: email }));
    showToast('Account created! Welcome, ' + name);
    document.getElementById('login-trigger').textContent = name;
    closeModal('login-modal');
}

function doLogout() {
    localStorage.removeItem('uro_user');
    document.getElementById('login-trigger').textContent = 'Login / Register';
    showToast('Signed out successfully');
}

document.getElementById('cart-trigger').addEventListener('click', openCart);

// Close modal on overlay click
document.getElementById('login-modal').addEventListener('click', function(e) {
    if (e.target === this) closeModal('login-modal');
});
