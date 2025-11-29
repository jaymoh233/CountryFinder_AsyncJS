'use strict';

// ==========================================
// DOM ELEMENTS
// ==========================================
const countriesContainer = document.querySelector('.countries');
const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-input');
const errorMsg = document.querySelector('.error-message');
const btnLocation = document.querySelector('.btn-secondary');
const btnTheme = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const themeText = document.querySelector('.theme-text');
const loadingSpinner = document.querySelector('.loading');

// ==========================================
// THEME TOGGLE
// ==========================================
const initTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeIcon.textContent = '☀️';
    themeText.textContent = 'Light Mode';
  }
};

btnTheme?.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');

  themeIcon.textContent = isDark ? '☀️' : '🌙';
  themeText.textContent = isDark ? 'Light Mode' : 'Dark Mode';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
const showLoading = () => loadingSpinner?.classList.add('visible');
const hideLoading = () => loadingSpinner?.classList.remove('visible');

const renderError = msg => {
  errorMsg.textContent = msg;
  errorMsg.classList.add('visible');
  countriesContainer.classList.remove('visible');
  hideLoading();

  setTimeout(() => {
    errorMsg.classList.remove('visible');
  }, 5000);
};

const clearUI = () => {
  countriesContainer.innerHTML = '';
  errorMsg.classList.remove('visible');
  countriesContainer.classList.remove('visible');
};

const formatPopulation = pop => {
  if (pop >= 1000000) return `${(pop / 1000000).toFixed(1)}M`;
  if (pop >= 1000) return `${(pop / 1000).toFixed(1)}K`;
  return pop.toString();
};

// ==========================================
// RENDER COUNTRY CARD
// ==========================================
const renderCountry = (data, className = '') => {
  const lang = data.languages ? Object.values(data.languages)[0] : 'N/A';
  const curr = data.currencies ? Object.values(data.currencies)[0].name : 'N/A';
  const population = formatPopulation(data.population);

  const html = `
        <article class="country ${className}" style="animation-delay: ${
    className ? '0.3s' : '0s'
  }">
          <div class="country__inner">
            <!-- FRONT SIDE -->
            <div class="country__front">
              <div class="country__img-wrapper">
                <img class="country__img" src="${
                  data.flags.svg || data.flags.png
                }" alt="Flag of ${data.name.common}" loading="lazy" />
                <div class="country__img-overlay"></div>
              </div>
              <div class="country__front-content">
                <div class="country__flag-emoji">${data.flag || '🏳️'}</div>
                <h3 class="country__name">${data.name.common}</h3>
                <span class="country__region">${data.region}</span>
              </div>
              <div class="country__flip-hint">
                <span>Hover to reveal</span>
                <span class="flip-icon">🔄</span>
              </div>
            </div>

            <!-- BACK SIDE -->
            <div class="country__back">
              <div class="country__back-header">
                <h4 class="country__back-title">${data.name.common}</h4>
                <p class="country__back-subtitle">Country Details</p>
              </div>
              <div class="country__stats">
                <div class="country__row">
                  <span class="country__row-label">
                    <span class="country__row-icon">👥</span>
                    Population
                  </span>
                  <span class="country__row-value">${population}</span>
                </div>
                <div class="country__row">
                  <span class="country__row-label">
                    <span class="country__row-icon">🗣️</span>
                    Language
                  </span>
                  <span class="country__row-value">${lang}</span>
                </div>
                <div class="country__row">
                  <span class="country__row-label">
                    <span class="country__row-icon">💰</span>
                    Currency
                  </span>
                  <span class="country__row-value">${curr}</span>
                </div>
              </div>
            </div>
          </div>
        </article>
      `;

  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.classList.add('visible');
};

// ==========================================
// FETCH COUNTRY DATA
// ==========================================
const getCountryData = async country => {
  try {
    clearUI();
    showLoading();

    const res = await fetch(`https://restcountries.com/v3.1/name/${country}`);

    if (!res.ok) throw new Error(`Country not found (${res.status})`);

    const data = await res.json();
    const countryData = data[0];

    hideLoading();
    renderCountry(countryData);

    const neighbour = countryData.borders?.[0];

    if (neighbour) {
      const resNeighbour = await fetch(
        `https://restcountries.com/v3.1/alpha/${neighbour}`
      );
      const dataNeighbour = await resNeighbour.json();
      renderCountry(dataNeighbour[0], 'neighbour');
    }

    searchInput.value = '';
  } catch (err) {
    console.error('Error:', err);
    hideLoading();
    renderError(`${err.message}. Please try again!`);
  }
};

// ==========================================
// GEOLOCATION
// ==========================================
const getPosition = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const whereAmI = async () => {
  try {
    clearUI();
    showLoading();

    const pos = await getPosition();
    const { latitude: lat, longitude: lng } = pos.coords;

    const resGeo = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
    );

    if (!resGeo.ok) throw new Error('Unable to get location data');

    const dataGeo = await resGeo.json();
    await getCountryData(dataGeo.countryName);
  } catch (err) {
    console.error('Location error:', err);
    hideLoading();
    renderError(`Could not determine your location: ${err.message}`);
  }
};

// ==========================================
// EVENT LISTENERS
// ==========================================
searchForm?.addEventListener('submit', e => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (query) getCountryData(query);
});

btnLocation?.addEventListener('click', whereAmI);

// Initialize theme on load
initTheme();
