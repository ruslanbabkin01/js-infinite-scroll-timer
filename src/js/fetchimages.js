import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '29966506-3ac2aa6cf44b4238878b6f625';

export class ImgApiService {
  #totalPages = 0;
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
  }

  async fetchImages() {
    const urlAXIOS = `${BASE_URL}?key=${API_KEY}`;

    const params = {
      q: `${this.searchQuery}`,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: `${this.page}`,
      per_page: `${this.per_page}`,
    };

    const { data } = await axios.get(urlAXIOS, { params });
    this.incrementPage();
    return data;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  // calculateTotalPages(total) {
  //   this.#totalPages = Math.ceil(total / this.per_page);
  // }
}
