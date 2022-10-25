import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import markup from '../templates/markup.hbs';

const refs = {
  form: document.querySelector('#search-form'),
  input: document.querySelector('.searh-input'),
  searchBtn: document.querySelector('.search-btn'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};
let page = 1;
const searchImages = refs.input.value.toLowerCase().trim();

refs.input.addEventListener('input', debounce(onSearchImg, 500));
refs.loadMore.addEventListener('click', onLoadMoreImages);

function fetchImages(searchData, page = 1) {
  const KEY = '30810402-d2272724878c47174b870ed5b';
  const BASE_URL = 'https://pixabay.com/api/';
  const URL = `${BASE_URL}?key=${KEY}&q=${searchData}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=3`;

  return fetch(URL).then(responce => {
    if (!responce.ok) {
      throw new Error('error');
    }
    return responce.json();
  });
}

function onSearchImg(event) {
  event.preventDefault();

  // const searchImages = refs.input.value.toLowerCase().trim();

  fetchImages(searchImages)
    // .then(responce => console.log(responce))
    .then(createGallery)
    .catch(error => console.log(error));
}

function createGallery(responceAPI) {
  const response = responceAPI.hits;
  const totalHits = responceAPI.totalHits;
  console.log('responceAPI', responceAPI);

  if (response.length !== 0) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images`);
  } else {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  }
  const galleryList = response.map(image => renderGalleryCard(image)).join('');
  refs.gallery.insertAdjacentHTML('beforeend', galleryList);
}

function renderGalleryCard(array) {
  const { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = array;

  return `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width=320px heith=240px/>
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

function clearInput() {
  refs.gallery.innerHTML = '';
}

function onLoadMoreImages() {
  page += 1;

  fetchImages(searchImages, page).then(responce => {
    createGallery(responce);
  });
}

// webformatURL - ссылка на маленькое изображение для списка карточек.
// largeImageURL - ссылка на большое изображение.
// tags - строка с описанием изображения. Подойдет для атрибута alt.
// likes - количество лайков.
// views - количество просмотров.
// comments - количество комментариев.
// downloads - количество загрузок.
