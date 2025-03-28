const loginForm = document.getElementById('loginForm');
const signUpForm = document.getElementById('signUpForm');
const toggleToSignUp = document.getElementById('toggleToSignUp');
const toggleToLogin = document.getElementById('toggleToLogin');
const formTitle = document.getElementById('formTitle');
const errorMessage = document.getElementById('errorMessage');
const backgroundAnimation = document.getElementById('background-animation');

toggleToSignUp.addEventListener('click', (e) => {
  e.preventDefault();
  loginForm.classList.add('hidden');
  signUpForm.classList.remove('hidden');
  formTitle.textContent = 'Sign Up for an Account';
});

toggleToLogin.addEventListener('click', (e) => {
  e.preventDefault();
  signUpForm.classList.add('hidden');
  loginForm.classList.remove('hidden');
  formTitle.textContent = 'Login to Your Account';
});

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
  }
});

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
  }
});

function createPumpkinIcon() {
  const pumpkinImg = document.createElement('img');
  pumpkinImg.src = '/api/placeholder/100/100?text=🎃';
  pumpkinImg.alt = 'Pumpkin Icon';

  const size = Math.random() * 60 + 30;
  pumpkinImg.style.width = `${size}px`;
  pumpkinImg.style.height = `${size}px`;

  pumpkinImg.classList.add('pumpkin-icon');

  pumpkinImg.style.left = `${Math.random() * 100}%`;
  pumpkinImg.style.top = `${Math.random() * 100}%`;

  pumpkinImg.style.transform = `rotate(${Math.random() * 360}deg)`;

  backgroundAnimation.appendChild(pumpkinImg);
  return pumpkinImg;
}

const iconCount = 40;
const icons = Array.from({ length: iconCount }, createPumpkinIcon);

document.addEventListener('mousemove', (e) => {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  icons.forEach((icon, index) => {
    const multiplier = 1 - index / icons.length;
    const offsetX = (e.clientX - centerX) * 0.05 * multiplier;
    const offsetY = (e.clientY - centerY) * 0.05 * multiplier;
    icon.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${Math.random() * 360}deg)`;
  });
});
