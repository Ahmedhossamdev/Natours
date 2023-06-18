import axios from 'axios';
import Stripe from 'stripe';
import { showAlert } from './alerts';



export const bookTour = async tourId => {
  try {
    const stripe = new Stripe('pk_test_51NFrrJEYpHjuu9ZWnbjq2066vJzeI6DCSc76wV03fKXzA9A5wIop96KnTM4iXmf3Qqg2VctogoKm89MP8KIi86k600RnZVMA0G');

    // 1) Get Checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    console.log(session);
    // 2) Create checkout form + charge credit card
    // await stripe.redirectToCheckout({
    //   sessionId: session.data.id,
    // });

    window.location.replace(session.data.session.url);
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
