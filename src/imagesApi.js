import axios from 'axios';
import { notificationServerError } from './notification';

axios.defaults.baseURL = 'https://pixabay.com/api/';

export async function imagesApi({ search, page }) {
  try {
    const response = await axios.get('', {
      params: {
        key: 'AhhLj0dRDONF-RtR1JFfEMLloinwC9DISjhJf-DsIL4',
        q: search,
        image_type: 'photo',
        orientation: 'horizontal',
        per_page: '12',
        page: page,
      },
    });
    if (response.status !== 200) {
      // console.log('in if not200 in imagesApi');
      notificationServerError();
      return;
    }
    return response;
  } catch (error) {
    // console.log('error in imagesApi', error);
    notificationServerError();
    return;
  }
}