import '@babel/polyfill';
import { login, logout } from './login';
import {resetPassword} from './resetPassword';
import { signUp } from './signUp';
import { displayMap } from './mapbox';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';


// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const signupForm = document.querySelector('.form--signup');
const resetPasswordForm = document.querySelector('.form--signup');


const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');

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


  });
}

if (resetPasswordForm){

    signupForm.addEventListener('submit', async e => {
      e.preventDefault();

      document.querySelector('.btn--green').textContent = 'Loading...';

      const password = document.getElementById('password').value;
      const password_confirm = document.getElementById('password-confirm').value;

      const url = window.location.href;
      const token = url.split('/').pop(); // Extract the token from the URL
      await resetPassword(password, password_confirm , token);

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
