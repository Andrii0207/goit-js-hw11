import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import markup from '../templates/markup.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('#search-form'),
  input: document.querySelector('.searh-input'),
  searchBtn: document.querySelector('.search-btn'),
  galleryEl: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};
refs.loadMore.setAttribute('hidden', 'hidden');

refs.form.addEventListener('input', debounce(onClickBtnSubmit, 500));
refs.loadMore.addEventListener('click', onLoadMoreImages);

function fetchData(value, page = 1) {
  const KEY = '30810402-d2272724878c47174b870ed5b';
  const BASE_URL = 'https://pixabay.com/api/';
  const URL = `${BASE_URL}?key=${KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=3`;

  return fetch(URL).then(responce => {
    if (!responce.ok) {
      throw new Error('error');
    }
    return responce.json();
  });
}

let value = null;
let page = 1;

function onClickBtnSubmit(event) {
  event.preventDefault();
  const value = refs.input.value.toLowerCase().trim();

  if (!value) {
    clearInput();
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
    return;
  } else {
    clearInput();
    refs.loadMore.removeAttribute('hidden');
    fetchData(value, page)
      .then(checkResponce)
      .catch(error => console.log(error));
  }
}

function onLoadMoreImages() {
  page += 1;
  fetchData(value, page)
    .then(responce => createGallery(responce, page))
    .then(responce => console.log('page +1', responce))
    .catch(error => console.log(error));
}

function checkResponce(responce) {
  const responceHits = responce.hits;
  const responceTotalHits = responce.totalHits;

  if (responceTotalHits.length !== 0) {
    Notiflix.Notify.success(`Hooray! We found ${responceTotalHits} images`);
    createGallery(responceHits);
  } else {
    clearInput();
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  }
}

function createGallery(images) {
  console.log('responceAPI', images);

  const galleryList = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<a class="gallery_link" href="${largeImageURL}">
  <div class="photo-card">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" width=320px heith=240px />
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
  </div>
</a>`,
    )
    .join('');
  refs.galleryEl.insertAdjacentHTML('beforeend', galleryList);

  const lightbox = new SimpleLightbox('.gallery a', {
    captionDelay: 250,
    captionsData: 'alt',
    close: false,
  });
  lightbox.refresh();
}

function clearInput() {
  refs.galleryEl.innerHTML = '';
}

// webformatURL - ссылка на маленькое изображение для списка карточек.
// largeImageURL - ссылка на большое изображение.
// tags - строка с описанием изображения. Подойдет для атрибута alt.
// likes - количество лайков.
// views - количество просмотров.
// comments - количество комментариев.
// downloads - количество загрузок.
