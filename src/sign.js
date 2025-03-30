const body = document.querySelector('body');
const loginForm = document.getElementById('loginForm');
const signUpForm = document.getElementById('signUpForm');
const toggleToSignUp = document.getElementById('toggleToSignUp');
const formTitle = document.getElementById('formTitle');
const errorMessage = document.getElementById('errorMessage');

body.innerHTML = `
 <div class="flex flex-col items-center w-full max-w-md bg-bg-light p-8 rounded-lg shadow-lg">
        <img src="/images/logo-desktop.png" alt="Logo" class="w-45 h-auto pb-7 items-center">

        <h2 id="formTitle" class="text-2xl text-gray-400 font-semibold text-center mb-6">Sign Up for Your Account</h2>

        <form id="signUpForm" class="space-y-6 w-full">

            <div>
                <label for="newUsername" class="block text-m font-medium text-gray-400">Username</label>
                <input type="text" id="newUsername" name="newUsername"
                    class="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500"
                    placeholder="Choose a username" required>
            </div>


            <div>
                <label for="email" class="block text-m font-medium text-gray-400">Email</label>
                <input type="email" id="email" name="email"
                    class="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500"
                    placeholder="Enter your email" required>
            </div>


            <div>
                <label for="newPassword" class="block text-m font-medium text-gray-400">Password</label>
                <input type="password" id="newPassword" name="newPassword"
                    class="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500"
                    placeholder="Create a password" required>
            </div>


            <div>
                <button type="submit"
                    class="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                    Sign Up
                </button>
            </div>


            <div class="text-center text-sm text-gray-500 mt-4">
                Already have an account? <a href="/index.html" id="toggleToLogin"
                    class="text-blue-500 hover:text-blue-600">Login</a>
            </div>
        </form>

    </div>
`;

toggleToSignUp.addEventListener('click', (e) => {
  e.preventDefault();
  loginForm.classList.add('hidden');
  signUpForm.classList.remove('hidden');
  formTitle.textContent = 'Sign Up for an Account';
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
