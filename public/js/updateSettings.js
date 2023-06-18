import axios from 'axios';
import { showAlert } from './alerts';


// type is either password or data
export const updateSettings = async (data , type) => {
  try {
    const url = type === 'password' ? '/api/v1/users/updateMyPassword' :'/api/v1/users/updateMe';
    const res = await axios({
      method: 'PATCH',
      url,
      data
    });
    // res from controller
    if (res.data.status === 'success'){
      showAlert('success', `${type.toUpperCase()} updated successfully`);
      window.setTimeout(() =>{
        location.reload();
      } , 1000);
    }
    console.log(res);
  } catch (err) {
    showAlert('error',err.response.data.message);
  }
};



/*


The user submits the form on the client-side, triggering the submit event listener.
Inside the event listener, the updateData function is called with the name and email values from the form inputs.
The updateData function makes an API request using Axios to the
endpoint http://127.0.0.1:3000/api/v1/users/updateMe with the provided name and email data.
If the API request is successful (res.data.status === 'success'),
the showAlert function is called to display a success message to the user.
The updated user data is then rendered in the account view template using the view controller
(exports.updateUserData) with the updatedUser object obtained from the API response.
The rendered account view is sent as the response to the client.
So, the view controller is responsible for rendering the account view template with the updated user data
 after the API request is successfully completed using Axios.
 */