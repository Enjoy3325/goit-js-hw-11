// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

import NewsApiService from './new-service';
import './css/styles.css';
// fetch(`${BASE_URL}${BASE_KEY}${OPTIONS}`)
const refs = {
  searchForm: document.querySelector('.search-form'),
  divGallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};
// Делаю экземпляр класса чтобы получить объект с методами и свойствами
const newsApiService = new NewsApiService();
console.log(refs.searchForm);
refs.searchForm.addEventListener('submit', onSearch);
refs.loadMore.addEventListener('click', onLoadMoreClick);

// функция сабмита поисковая строка
async function onSearch(e) {
  e.preventDefault();
  clearCards();
  console.log(e.target.elements.searchQuery.value);
  newsApiService.query = e.target.elements.searchQuery.value;

  if (newsApiService.query === '') {
    return Notiflix.Notify.info('Enter in the field what you want to find!');
  }
  newsApiService.resetPage();
  // пошёл HTTP запрос
  try {
    const resultFetch = await newsApiService.fetchHits();

    if (resultFetch.data.hits.length === 0) {
      refs.loadMore.classList.add('is-hidden');
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    Notiflix.Notify.info(
      `Hooray! We found ${resultFetch.data.totalHits} images.`
    );
    galleryImage(resultFetch.data.hits);
    refs.loadMore.classList.remove('is-hidden');
  } catch (error) {}
}

// Функция кнопка показать больше картинок
async function onLoadMoreClick() {
  try {
    const resultClik = await newsApiService.fetchHits();
    newsApiService.incrementPage();
    if (
      newsApiService.per_page * newsApiService.page >
      resultClik.data.totalHits
    ) {
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      refs.loadMore.classList.add('is-hidden');
      return;
    }

    galleryImage(resultClik.data.hits);
    onScroll();
  } catch (error) {}
}

function clearCards() {
  refs.divGallery.innerHTML = '';
}

// Функция разметки, рендеринг
function galleryImage(search) {
  const gallaryImageResult = search.map(
    ({ webformatURL, tags, likes, views, comments, downloads }) => {
      return ` <div class="photo-card">
   <img src=" ${webformatURL}" alt=" ${tags}" loading="lazy" />
   <div class="info">
     <p class="info-item">
       <b>Likes ${likes}</b>
     </p>
     <p class="info-item">
       <b>Views ${views}</b>
     </p>
     <p class="info-item">
       <b>Comments ${comments}</b>
     </p>
     <p class="info-item">
       <b>Downloads  ${downloads}</b>
     </p>
   </div>
 </div>`;
    }
  );
  refs.divGallery.insertAdjacentHTML('beforeend', gallaryImageResult.join(''));
}
function onScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
