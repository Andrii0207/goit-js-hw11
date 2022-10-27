import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import markup from '../templates/markup.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('#search-form'),
  input: document.querySelector('.searh-input'),
  // searchBtn: document.querySelector('.search-btn'),
  galleryEl: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};

refs.loadMore.setAttribute('hidden', 'hidden');
refs.form.addEventListener('input', debounce(onClickBtnSubmit, 500));
refs.loadMore.addEventListener('click', onClickAddPage);

function fetchData(value, page = 1) {
  const KEY = '30810402-d2272724878c47174b870ed5b';
  const BASE_URL = 'https://pixabay.com/api/';
  const URL = `${BASE_URL}?key=${KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;

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
  value = refs.input.value.toLowerCase().trim();
  console.log('value:', value);

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

function onClickAddPage() {
  page += 1;
  fetchData(value, page)
    .then(responce => onLoadMoreImages(responce, page))
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
  console.log('createGallery data', images);

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
  <div class="photo-card_wrapper">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" width=320px heith=240px />
  </div>
    <div class="info">
      <p class="info-item">
        <b>Likes </b>${likes}
      </p>
      <p class="info-item">
        <b>Views </b>${views}
      </p>
      <p class="info-item">
        <b>Comments </b>${comments}
      </p>
      <p class="info-item">
        <b>Downloads </b>${downloads}
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

function onLoadMoreImages(responce, page) {
  console.log('onLoadMoreImages data', responce);

  const responceHits = responce.hits;
  const responceTotalHits = responce.totalHits;
  const totalPages = responceTotalHits / 40;

  console.log('onLoadMoreImages responceHits', responceHits);

  if (page > totalPages) {
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    refs.loadMore.setAttribute('hidden', 'hidden');
  }
  createGallery(responceHits);
  smoothScroll();
}

function clearInput() {
  refs.galleryEl.innerHTML = '';
}

function smoothScroll() {
  const { height: cardHeight } = refs.galleryEl.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
