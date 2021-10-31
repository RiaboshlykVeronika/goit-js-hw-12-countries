import API from './fetchCountries.js';
import countryCard from '../templates/countryCard.hbs';
import countriesList from '../templates/countriesList.hbs';
import '@pnotify/core/dist/Pnotify.css';
import '@pnotify/core/dist/BrightTheme.css';
const { error } = require('@pnotify/core');

var debounce = require('lodash.debounce');

const containerForCard = document.querySelector('.js-container');
const inputEl = document.querySelector('.input');

inputEl.addEventListener('input', debounce(onInputEvent, 800));
inputEl.addEventListener('click', onInputCkick);

function onInputCkick() {
  inputEl.value = '';
  containerForCard.innerHTML = '';
}
containerForCard.addEventListener('click', onListOfCountryClick);

function onListOfCountryClick(event) {
  if (event.target.classList.contains('js-country-item')) {
    inputEl.value = event.target.textContent;
    containerForCard.innerHTML = '';
    onInputEvent();
  }
}

function onInputEvent() {
  if (inputEl.value.trim()) {
    API.fetchCountries(inputEl.value)
      .then(data => {
        if (data.length === 1) {
          renderCountryCard(data);
        }
        return data;
      })
      .then(data => {
        if (data.length < 10 && data.length > 1) {
          renderListOfCountries(data);
        }

        return data;
      })
      .then(data => {
        if (data.length > 10) {
          error({
            text: 'To many matches found. Please enter a more specific query!',
          });
        }
        return data;
      })
      .then(data => {
        if (data.status === 404) {
          error({
            text: 'Not matches found!',
          });
        }
      });
  } else {
    containerForCard.innerHTML = '';
  }
}

function renderCountryCard(country) {
  const markUp = countryCard(country);
  containerForCard.innerHTML = markUp;
}

function renderListOfCountries(arr) {
  const markUpListOfCountries = countriesList(arr);
  containerForCard.innerHTML = markUpListOfCountries;
}