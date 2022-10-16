import { refs } from './refs';
import { ImgApiService } from './js/fetchimages';

const options = {
  root: null,
  rootMargin: '100px',
  threshold: 1.0,
};

const imgApi = new ImgApiService();

const callback = async function (entries, observer) {
  entries.forEach(async entry => {
    // if (entry.isIntersecting && entry.intersectionRect.bottom > 550) {
    if (entry.isIntersecting) {
      imgApi.incrementPage();
      observer.unobserve(entry.target);

      try {
        const { results } = await imgApi.getPhotos();

        const markup = createMarkup(results);

        refs.imagesContainer.insertAdjacentHTML('beforeend', markup);
        if (unsplash.isShowLoadMore) {
          const target = document.querySelector('.gallery__item:last-child');
          io.observe(target);
        }
      } catch (error) {
        Notify.failure(error.message, 'Щось пішло не так!');
        clearPage();
      }
    }
  });
};
const io = new IntersectionObserver(callback, options);
