// Get DOM elements
const loginForm = document.getElementById('loginForm');
const signUpForm = document.getElementById('signUpForm');
const toggleToSignUp = document.getElementById('toggleToSignUp');
const toggleToLogin = document.getElementById('toggleToLogin');
const formTitle = document.getElementById('formTitle');
const errorMessage = document.getElementById('errorMessage');

// Switch to Sign Up Form
toggleToSignUp.addEventListener('click', (e) => {
  e.preventDefault();
  loginForm.classList.add('hidden');
  signUpForm.classList.remove('hidden');
  formTitle.textContent = 'Sign Up for an Account';
});

// Switch to Login Form
toggleToLogin.addEventListener('click', (e) => {
  e.preventDefault();
  signUpForm.classList.add('hidden');
  loginForm.classList.remove('hidden');
  formTitle.textContent = 'Login to Your Account';
});

// Login Form Validation & Submission
loginForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (username === '' || password === '') {
    errorMessage.classList.remove('hidden');
  } else {
    errorMessage.classList.add('hidden');
    console.log('Logged in with Username:', username);
    console.log('Password:', password);
    // Further login logic (API calls, redirects, etc.)
  }
});

// Sign Up Form Validation & Submission
signUpForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const newUsername = document.getElementById('newUsername').value.trim();
  const email = document.getElementById('email').value.trim();
  const newPassword = document.getElementById('newPassword').value.trim();

  if (newUsername === '' || email === '' || newPassword === '') {
    alert('Please fill in all fields.');
  } else {
    console.log('Signed up with Username:', newUsername);
    console.log('Email:', email);
    console.log('Password:', newPassword);
    // Further sign-up logic (API calls, redirects, etc.)
  }
});
