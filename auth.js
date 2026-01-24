// Form switching
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const toSignup = document.getElementById('to-signup');
const toLogin = document.getElementById('to-login');

toSignup.onclick = (e) => {
  e.preventDefault();
  loginForm.style.display = 'none';
  signupForm.style.display = 'flex';
};
toLogin.onclick = (e) => {
  e.preventDefault();
  signupForm.style.display = 'none';
  loginForm.style.display = 'flex';
};

// Show/hide password toggle
function setupShowHide(btnId, inputId) {
  const btn = document.getElementById(btnId);
  const input = document.getElementById(inputId);
  btn.addEventListener('click', () => {
    input.type = input.type === 'password' ? 'text' : 'password';
    btn.style.color = input.type === 'password' ? '#9da5b4' : '#2361ff';
  });
}
setupShowHide('toggle-login-pw', 'login-password');
setupShowHide('toggle-signup-pw', 'signup-password');
setupShowHide('toggle-signup-cpw', 'signup-confirm');

// Helper validations
function validateEmail(email) {
  return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/.test(email);
}
function validatePassword(pw) {
  return pw.length >= 6;
}

// Dummy user data (replace with MongoDB later)
let dummyUser = {
  email: "admin@example.com",
  password: "1234"
};

// Clear errors while typing
document.getElementById('login-email').addEventListener('input', () => {
  document.getElementById('login-password-error').innerText = "";
});
document.getElementById('login-password').addEventListener('input', () => {
  document.getElementById('login-password-error').innerText = "";
});
document.getElementById('signup-email').addEventListener('input', () => {
  document.getElementById('signup-email-error').innerText = "";
});
document.getElementById('signup-password').addEventListener('input', () => {
  document.getElementById('signup-password-error').innerText = "";
});
document.getElementById('signup-confirm').addEventListener('input', () => {
  document.getElementById('signup-confirm-error').innerText = "";
});

// ✅ LOGIN VALIDATION
loginForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const pw = document.getElementById('login-password').value;

  let valid = true;

  if (!validateEmail(email)) {
    document.getElementById('login-email-error').textContent = "Enter a valid email";
    valid = false;
  } else {
    document.getElementById('login-email-error').textContent = "";
  }

  if (!validatePassword(pw)) {
    document.getElementById('login-password-error').textContent = "Password must be at least 6 characters";
    valid = false;
  } else {
    document.getElementById('login-password-error').textContent = "";
  }

  if (valid) {
    // Check against dummy user
    if (email === dummyUser.email && pw === dummyUser.password) {
      window.location.href = "index.html"; // ✅ redirect to home
    } else {
      document.getElementById('login-password-error').textContent = "Invalid email or password";
    }
  }
});

// ✅ SIGNUP VALIDATION
signupForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('signup-email').value.trim();
  const pw = document.getElementById('signup-password').value;
  const cpw = document.getElementById('signup-confirm').value;

  let valid = true;

  if (!validateEmail(email)) {
    document.getElementById('signup-email-error').textContent = "Enter a valid email";
    valid = false;
  } else {
    document.getElementById('signup-email-error').textContent = "";
  }

  if (!validatePassword(pw)) {
    document.getElementById('signup-password-error').textContent = "At least 6 characters";
    valid = false;
  } else {
    document.getElementById('signup-password-error').textContent = "";
  }

  if (pw !== cpw || cpw === '') {
    document.getElementById('signup-confirm-error').textContent = "Passwords do not match";
    valid = false;
  } else {
    document.getElementById('signup-confirm-error').textContent = "";
  }

  if (valid) {
    // Save dummy user (you can later connect to backend here)
    dummyUser.email = email;
    dummyUser.password = pw;

    alert("Signup successful! Please login.");
    signupForm.reset();
    signupForm.style.display = 'none';
    loginForm.style.display = 'flex';
  }
});
