import axios from 'axios';

const stripe = Stripe('pk_test_51NFrrJEYpHjuu9ZWnbjq2066vJzeI6DCSc76wV03fKXzA9A5wIop96KnTM4iXmf3Qqg2VctogoKm89MP8KIi86k600RnZVMA0G');


export const bookTour = async tourId => {
  // 1) Get Checkout session from API
  const session = await axios(`http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`);
  console.log(session);
  // 2) Create checkout form + charage credit card



}