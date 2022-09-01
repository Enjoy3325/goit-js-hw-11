import axios from 'axios';
export default class NewsApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;

    this.per_page = 40;
  }
  // const BASE_URL = 'https://pixabay.com/api/';
  fetchHits() {
    console.log(this);
    const API_KEY = '29387302-2c01c74d3eaaf5cdbdb3e9280';
    const options = `image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.per_page}`;
    const url = `https://pixabay.com/api/?key=${API_KEY}&q=${this.searchQuery}&${options}&page=${this.page}`;

    return axios.get(url);
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
}
