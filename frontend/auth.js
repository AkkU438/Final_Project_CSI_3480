const API_URL = 'http://localhost:5000/api/auth';

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Check if we're on login or register page by looking for the forms
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  
  // Only proceed if we're on a page with an auth form
  if (!loginForm && !registerForm) {
    // Not on an auth page, silently exit
    return;
  }

  // Redirect to main page if already logged in
  if (localStorage.getItem('authToken')) {
    window.location.href = 'index.html';
    return;
  }

  // Determine which form we're using
  const isLoginPage = !!loginForm;
  const form = loginForm || registerForm;
  const errorMessage = document.getElementById('errorMessage');

  // Handle form submission
  form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorMessage.textContent = '';

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !password) {
    errorMessage.textContent = 'Please fill in all fields';
    return;
  }

  try {
    const endpoint = isLoginPage ? '/login' : '/register';
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
      errorMessage.textContent = data.msg || 'An error occurred';
      return;
    }

    // Store the token in localStorage
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      // Redirect to the main password manager page
      window.location.href = 'index.html';
    } else {
      errorMessage.textContent = 'No token received from server';
    }
  } catch (err) {
    console.error('Auth error:', err);
    errorMessage.textContent = 'Failed to connect to server. Make sure the backend is running.';
  }
  });
});

