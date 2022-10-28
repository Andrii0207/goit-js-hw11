import axios from 'axios';

async function fetchData(value, page = 1) {
  try {
    const KEY = '30810402-d2272724878c47174b870ed5b';
    const BASE_URL = 'https://pixabay.com/api/';
    const URL = `${BASE_URL}?key=${KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;

    const responce = await axios.get(URL);
    return responce.data;

    // return fetch(URL).then(responce => {
    //   if (!responce.ok) {
    //     throw new Error('error');
    //   }
    //   return responce.json();
    // });
  } catch (error) {
    console.log(error);
  }
}

export default fetchData;
