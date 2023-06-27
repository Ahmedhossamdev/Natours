import '@babel/polyfill';
import { login, logout } from './login';
import { forgotPassword } from './forgotPassword';
import {resetPassword} from './resetPassword';
import { signUp } from './signUp';
import { displayMap } from './mapbox';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';

import {
  enable as enableDarkMode,
  disable as disableDarkMode,
  auto as followSystemColorScheme,
  exportGeneratedCSS as collectCSS,
  isEnabled as isDarkReaderEnabled,
} from 'darkreader';




// DOM ELEMENTS
const mapBox = document.getElementById('map');

const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');

const signupForm = document.querySelector('.form--signup');

const resetPasswordForm = document.querySelector('.form--resetPassword');
const forgotPasswordForm = document.querySelector('.form--forgotPassword');


const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');



const darkModeButton = document.getElementById('dark-mode-button');

// Retrieve user preference from localStorage
const userPreference = localStorage.getItem('darkMode');

if (userPreference === 'enabled') {
  enableDarkMode({
    brightness: 100,
    contrast: 90,
    sepia: 10,
  });
  darkModeButton.classList.add('active');
}

darkModeButton.addEventListener('click', toggleDarkMode);

function toggleDarkMode() {
  if (isDarkReaderEnabled()) {
    disableDarkMode();
    darkModeButton.classList.remove('active');
    // Remove user preference from localStorage
    localStorage.removeItem('darkMode');
  } else {
    enableDarkMode({
      brightness: 100,
      contrast: 90,
      sepia: 10,
    });
    darkModeButton.classList.add('active');
    // Save user preference to localStorage
    localStorage.setItem('darkMode', 'enabled');
  }
}


if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (signupForm) {

  signupForm.addEventListener('submit', async e => {
    e.preventDefault();

    document.querySelector('.btn--green').textContent = 'Loading...';

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const password_confirm = document.getElementById('password-confirm').value;
    await signUp(name, email, password, password_confirm);

    document.querySelector('.btn--green').textContent = 'Signup';
  });
}
if (forgotPasswordForm){

  forgotPasswordForm.addEventListener('submit', async e => {

    e.preventDefault();
    const email = document.getElementById('email').value;
    await forgotPassword(email);

  });
}


if (resetPasswordForm) {
  resetPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const password_confirm = document.getElementById('password-confirm').value;

    const url = window.location.href;
    const regex = /\/resetPassword\/(.+)/;
    const match = url.match(regex);
    const token = match ? match[1] : null;

    console.log(token);

    await resetPassword(password, password_confirm, token);
  });
}


if (loginForm) {
  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    await login(email, password);
  });
}


if (logOutBtn) {
  logOutBtn.addEventListener('click', logout);
}


if (userDataForm) {
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();


    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    console.log(form);
    // const name = document.getElementById('name').value;
    // const email = document.getElementById('email').value;

    updateSettings(form, 'data');
  });
}


if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    await updateSettings({ passwordCurrent, password, passwordConfirm }, 'password');
    document.querySelector('.btn--save-password').textContent = 'Save password';

  });
}

if (bookBtn) {
  bookBtn.addEventListener('click', e => {
    // target -> element which was clicked
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);

  });
}
