import { ImgApiService } from './js/fetchimages';
import { refs } from './js/refs';
import { smoothScroll } from './js/smooth-scroll';
import { spinerPlay, spinerStop } from './js/spiner';
import { imagesTpl } from './js/createMarkup';

import { Notify } from 'notiflix/build/notiflix-notify-aio';

refs.searchForm.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', fetchImages);

const imgApi = new ImgApiService();

async function onFormSubmit(e) {
  e.preventDefault();
  clearImagesContainer();
  imgApi.resetPage();
  refs.loadMoreBtn.classList.add('is-hidden');

  imgApi.query = e.currentTarget.elements.searchQuery.value;

  if (imgApi.query === '') {
    Notify.failure('Sorry, enter a valid query. Please try again.');
    return;
  }

  refs.loadMoreBtn.classList.remove('is-hidden');
  await fetchImages();
}

async function fetchImages() {
  spinerPlay();
  try {
    const { totalHits, hits } = await imgApi.fetchImages();
    const totalPages = totalHits / imgApi.per_page;

    if (hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      refs.loadMoreBtn.classList.add('is-hidden');
      return;
    }

    if (imgApi.page === 2) {
      Notify.success(`Hooray! We found ${totalHits} images.`);
    }

    if (imgApi.page > totalPages + 1) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      refs.loadMoreBtn.classList.add('is-hidden');
    }

    imagesTpl(hits);
    smoothScroll();
  } catch (error) {
    onFetchError(error);
  } finally {
    spinerStop();
  }
}

function clearImagesContainer() {
  refs.imagesContainer.innerHTML = '';
}

function onFetchError(error) {
  Notify.failure(error.message);
  refs.loadMoreBtn.classList.add('is-hidden');
  clearImagesContainer();
}
