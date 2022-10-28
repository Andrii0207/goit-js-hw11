import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import refs from './refs';
import galleryMarkup from '/templates/galleryMarkup.hbs';
// console.log('markup', markup);

function createGallery(images) {
  //   console.log('createGallery images', images);
  refs.galleryEl.insertAdjacentHTML('beforeend', galleryMarkup(images));

  const lightbox = new SimpleLightbox('.gallery a', {
    captionDelay: 250,
    captionsData: 'alt',
    close: false,
  });
  lightbox.refresh();
}

export default createGallery;

// images
//     .map(
//       ({
//         webformatURL,
//         largeImageURL,
//         tags,
//         likes,
//         views,
//         comments,
//         downloads,
//       }) => `<a class="gallery_link link" href="${largeImageURL}">
//   <div class="photo-card">
//   <div class="photo-card_wrapper">
//     <img class="gallery__img" src="${webformatURL}" alt="${tags}" loading="lazy" width=320 heigth=240/>
//   </div>
//     <div class="gallery-info__box">
//       <p class="info-item">
//         <b>Likes:</b>${likes}
//       </p>
//       <p class="info-item">
//         <b>Views:</b>${views}
//       </p>
//       <p class="info-item">
//         <b>Comments:</b>${comments}
//       </p>
//       <p class="info-item">
//         <b>Downloads:</b>${downloads}
//       </p>
//     </div>
//   </div>
// </a>`
