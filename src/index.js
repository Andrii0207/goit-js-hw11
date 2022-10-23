import Notiflix from 'notiflix';

const refs = {
  form: document.querySelector('#search-form'),
  input: document.querySelector('.searh-input'),
  searchBtn: document.querySelector('.search-btn'),
};

refs.searchBtn.addEventListener('input', onSearchImg);

function onSearchImg(searchData) {
  const KEY = '30810402-d2272724878c47174b870ed5b';
  const BASE_URL = 'https://pixabay.com/api/';
  const URL = `${BASE_URL}?key=${KEY}&q=${searchData}&image_type=photo&orientation=horizontal&safesearch=true`;

  fetch('URL')
    .then(resp => resp.json())
    .then(data => console.log(data));
}
