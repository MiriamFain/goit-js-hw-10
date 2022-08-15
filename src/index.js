import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import fetchCountries from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const markupCard = () => {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
};

const createCard = country => {
  const countryValue = country
    .map(({ name, flags }) => {
      return `<li class="country_item"><img src="${flags.svg}" alt="${name.official}" width="40" height="40">
          <h1 class="country_name">${name.official}</h1>         
        </li>`;
    })
    .join('');
  countryList.innerHTML = countryValue;
};

const createCardValue = country => {
  const countryValue = country.map(
    ({
      flags,
      name,
      capital,
      population,
      languages,
    }) => `<div class="country_card">
          <img src="${flags.svg}" alt="${name.official}" width="40" height="40">
          <h1 class="country_name">Country: <span>${name.official}</span></h1>
          <p class="country_info">Capital: <span>${capital}</span></p>
          <p class="country_info">Population: <span>${population}</span></p>
          <p class="country_info">Languages: <span>${Object.values(
            languages
          )}</span>
          </p></div>`
  );
  countryInfo.innerHTML = countryValue;
};

const getSearchValue = () => {
  let value = searchBox.value.trim();

  if (value.length === 0) {
    markupCard();
    return;
  } else {
    fetchCountries(value)
      .then(res => {
        if (res.length > 10) {
          markupCard();
          return Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        }
        if (res.length >= 2 && res.length <= 10) {
          markupCard();
          return createCard(res);
        }
        if (res.length === 1) {
          markupCard();
          return createCardValue(res);
        }
      })
      .catch(error => {
        markupCard();
        Notify.failure('Oops, there is no country with that name');
      });
  }
};

searchBox.addEventListener('input', debounce(getSearchValue, DEBOUNCE_DELAY));
