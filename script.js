'use strict';

// 1. SELECTORS
const countriesContainer = document.querySelector('.countries');
const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-input');
const errorMsg = document.querySelector('.error-message');
const btnLocation = document.querySelector('.btn-secondary');
const btnTheme = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const loadingSpinner = document.querySelector('.loading');

// 2. THEME TOGGLE LOGIC
const initTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
  }
};

btnTheme?.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');

  if (isDark) {
    themeIcon.classList.replace('fa-moon', 'fa-sun');
  } else {
    themeIcon.classList.replace('fa-sun', 'fa-moon');
  }

  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// 3. FLIP LOGIC (INDEPENDENT ANIMATION)
countriesContainer.addEventListener('click', function (e) {
  const card = e.target.closest('.country');
  if (!card) return;
  card.classList.toggle('flipped');
});

// 4. UTILITY FUNCTIONS
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

// 5. HELPER: SMART ALIAS CHECKER (NEW)
const checkCommonAliases = input => {
  const map = {
    uk: 'United Kingdom',
    usa: 'United States',
    uae: 'United Arab Emirates',
    korea: 'South Korea',
    russia: 'Russian Federation',
  };
  return map[input.toLowerCase()] || input;
};

// 5. RENDER COUNTRY CARD (Updated: Shortened Currency)
const renderCountry = (data, className = '') => {
  const lang = data.languages ? Object.values(data.languages)[0] : 'N/A';

  // --- CURRENCY LOGIC UPDATE ---
  let curr = data.currencies ? Object.values(data.currencies)[0].name : 'N/A';
  // If currency name is longer than 20 characters, shorten it
  if (curr.length > 20) {
    curr = curr.substring(0, 15) + '...';
  }

  const population = formatPopulation(data.population);
  const capital = data.capital ? data.capital[0] : 'N/A';

  // Driving Side
  const driveSide = data.car.side
    ? data.car.side.charAt(0).toUpperCase() + data.car.side.slice(1)
    : 'N/A';

  // Google Maps Link
  const mapLink = data.maps.googleMaps || '#';

  const html = `
    <article class="country ${className}">
      <div class="country__inner">
        <div class="country__front">
          <div class="country__img-wrapper">
            <img class="country__img" src="${
              data.flags.svg || data.flags.png
            }" alt="Flag of ${data.name.common}" loading="lazy" />
          </div>
          <div class="country__front-content">
             <div style="font-size: 4rem;">${data.flag || '🏳️'}</div>
            <h3 class="country__name">${data.name.common}</h3>
            <span class="country__region">${data.region}</span>
          </div>
          <div class="country__flip-hint">
            <span>Tap to flip</span>
            <i class="fa-solid fa-arrow-rotate-right"></i>
          </div>
        </div>

        <div class="country__back">
          <div class="country__back-header">
            <h4 class="country__back-title">${data.name.common}</h4>
            <p class="country__back-subtitle">Country Details</p>
          </div>
          
          <div class="country__stats">
            <div class="country__row">
              <span class="country__row-label">
                <i class="fa-solid fa-landmark icon-capital"></i> Capital
              </span>
              <span class="country__row-value">${capital}</span>
            </div>

            <div class="country__row">
              <span class="country__row-label">
                <i class="fa-solid fa-users icon-pop"></i> Population
              </span>
              <span class="country__row-value">${population}</span>
            </div>

            <div class="country__row">
              <span class="country__row-label">
                <i class="fa-solid fa-language icon-lang"></i> Language
              </span>
              <span class="country__row-value">${lang}</span>
            </div>

            <div class="country__row">
              <span class="country__row-label">
                <i class="fa-solid fa-coins icon-money"></i> Currency
              </span>
              <span class="country__row-value" title="${
                data.currencies ? Object.values(data.currencies)[0].name : ''
              }">${curr}</span>
            </div>
            
            <div class="country__row">
              <span class="country__row-label">
                <i class="fa-solid fa-car icon-car"></i> Drives on
              </span>
              <span class="country__row-value">${driveSide}</span>
            </div>
            <a href="${mapLink}" target="_blank" class="btn-map">
            <i class="fa-solid fa-map-location-dot"></i> See on Google Maps
            </a>

          </div>

          
        </div>
      </div>
    </article>
  `;

  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.classList.add('visible');
};
// 7. FETCH LOGIC (UPDATED WITH SMART SEARCH)
const getCountryData = async input => {
  try {
    clearUI();

    // A. Validation: Prevent single letter searches
    if (input.length < 2) {
      throw new Error('Please type at least 2 characters');
    }

    showLoading();

    // B. Handle Aliases (e.g. UK -> United Kingdom)
    const query = checkCommonAliases(input);

    const res = await fetch(`https://restcountries.com/v3.1/name/${query}`);
    if (!res.ok) throw new Error(`Country not found (${res.status})`);

    const data = await res.json();

    // C. Smart Selection Logic
    // Default to the first result
    let countryData = data[0];

    // Try to find an EXACT match to the query (e.g., 'India' vs 'British Indian Ocean Territory')
    const exactMatch = data.find(
      c => c.name.common.toLowerCase() === query.toLowerCase()
    );

    // Try to find an EXACT match in alternate spellings
    const altMatch = data.find(c =>
      c.altSpellings?.some(alt => alt.toLowerCase() === query.toLowerCase())
    );

    // Prioritize exact matches
    if (exactMatch) {
      countryData = exactMatch;
    } else if (altMatch) {
      countryData = altMatch;
    }

    hideLoading();
    renderCountry(countryData);

    // D. Fetch Neighbor
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
    // console.error('Error:', err);
    hideLoading();
    renderError(`${err.message}. Please try again!`);
  }
};

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
    // console.error('Location error:', err);
    hideLoading();
    renderError(`Could not determine your location: ${err.message}`);
  }
};

// 8. EVENT LISTENERS
searchForm?.addEventListener('submit', e => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (query) getCountryData(query);
});

btnLocation?.addEventListener('click', whereAmI);

// Initialize
initTheme();
