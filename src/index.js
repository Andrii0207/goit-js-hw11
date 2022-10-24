import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const refs = {
  form: document.querySelector('#search-form'),
  input: document.querySelector('.searh-input'),
  searchBtn: document.querySelector('.search-btn'),
  gallery: document.querySelector('.gallery'),
};

refs.input.addEventListener('input', debounce(onSearchImg, 500));

function fetchImages(searchData) {
  const KEY = '30810402-d2272724878c47174b870ed5b';
  const BASE_URL = 'https://pixabay.com/api/';
  const URL = `${BASE_URL}?key=${KEY}&q=${searchData}&image_type=photo&orientation=horizontal&safesearch=true`;

  return fetch(URL).then(resp => resp.json());
}

function onSearchImg(event) {
  event.preventDefault();

  const searchImages = refs.input.value.toLowerCase().trim();

  fetchImages(searchImages)
    .then(responce => responce.hits)
    .then(createGallery)
    .catch(error => console.log(error));
}

function createGallery(responceAPI) {
  // const responce = responceAPI.hits;
  console.log(responceAPI);

  const galleryList = responceAPI.map(image => renderGalleryCard(image)).join('');
  refs.gallery.insertAdjacentHTML('beforeend', galleryList);
}

function renderGalleryCard(array) {
  const { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = array;

  return `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</div>`;
}

// webformatURL - ссылка на маленькое изображение для списка карточек.
// largeImageURL - ссылка на большое изображение.
// tags - строка с описанием изображения. Подойдет для атрибута alt.
// likes - количество лайков.
// views - количество просмотров.
// comments - количество комментариев.
// downloads - количество загрузок.
