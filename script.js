// 'use strict';

// // 1. SELECTORS
// const countriesContainer = document.querySelector('.countries');
// const searchForm = document.querySelector('.search-form');
// const searchInput = document.querySelector('.search-input');
// const errorMsg = document.querySelector('.error-message');
// const btnLocation = document.querySelector('.btn-secondary');
// const btnTheme = document.querySelector('.theme-toggle');
// const themeIcon = document.querySelector('.theme-icon');
// const loadingSpinner = document.querySelector('.loading');

// // Sidebar Selectors
// const sidebar = document.querySelector('.sidebar');
// const overlay = document.querySelector('.overlay');
// const btnOpenSidebar = document.querySelector('.btn-toggle-sidebar');
// const btnCloseSidebar = document.querySelector('.btn-close-sidebar');
// const historyList = document.querySelector('.history-list');
// const btnClearHistory = document.querySelector('.btn-clear-history');
// const emptyMsg = document.querySelector('.empty-msg');

// // Map Selectors (NEW)
// const mapModal = document.querySelector('.map-modal');
// const mapOverlay = document.querySelector('.map-overlay');
// const btnCloseMap = document.querySelector('.btn-close-map');

// // 2. THEME TOGGLE LOGIC
// const initTheme = () => {
//   const savedTheme = localStorage.getItem('theme');
//   if (savedTheme === 'dark') {
//     document.body.classList.add('dark-mode');
//     themeIcon.classList.replace('fa-moon', 'fa-sun');
//   }
// };

// btnTheme?.addEventListener('click', () => {
//   document.body.classList.toggle('dark-mode');
//   const isDark = document.body.classList.contains('dark-mode');

//   if (isDark) {
//     themeIcon.classList.replace('fa-moon', 'fa-sun');
//   } else {
//     themeIcon.classList.replace('fa-sun', 'fa-moon');
//   }

//   localStorage.setItem('theme', isDark ? 'dark' : 'light');
// });

// // 3. FLIP LOGIC
// countriesContainer.addEventListener('click', function (e) {
//   // Don't flip if clicking buttons
//   if (e.target.closest('.neighbour-chip') || e.target.closest('.btn-map'))
//     return;

//   const card = e.target.closest('.country');
//   if (!card) return;
//   card.classList.toggle('flipped');
// });

// // 4. MAP LOGIC (NEW LEAFLET INTEGRATION)
// let map; // Global variable to hold the map instance

// const openMap = (lat, lng, zoom = 6) => {
//   // 1. Show Modal
//   mapModal.classList.remove('hidden');
//   mapOverlay.classList.remove('hidden');

//   // 2. If a map already exists, remove it (Cleanup)
//   if (map) {
//     map.remove();
//   }

//   // 3. Create new map instance
//   // 'map' refers to the ID in the HTML <div id="map">
//   map = L.map('map').setView([lat, lng], zoom);

//   // 4. Add Tile Layer (The visual map)
//   // Using OpenStreetMap (free & open source)
//   L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
//     attribution:
//       '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//   }).addTo(map);

//   // 5. Add Marker
//   L.marker([lat, lng]).addTo(map).bindPopup('Center of Country').openPopup();
// };

// const closeMap = () => {
//   mapModal.classList.add('hidden');
//   mapOverlay.classList.add('hidden');
// };

// // Map Event Listeners
// btnCloseMap.addEventListener('click', closeMap);
// mapOverlay.addEventListener('click', closeMap);
// document.addEventListener('keydown', e => {
//   if (e.key === 'Escape' && !mapModal.classList.contains('hidden')) {
//     closeMap();
//   }
// });

// // 5. UTILITY FUNCTIONS
// const showLoading = () => loadingSpinner?.classList.add('visible');
// const hideLoading = () => loadingSpinner?.classList.remove('visible');

// const renderError = msg => {
//   errorMsg.textContent = msg;
//   errorMsg.classList.add('visible');
//   countriesContainer.classList.remove('visible');
//   hideLoading();

//   setTimeout(() => {
//     errorMsg.classList.remove('visible');
//   }, 5000);
// };

// const clearUI = () => {
//   countriesContainer.innerHTML = '';
//   errorMsg.classList.remove('visible');
//   countriesContainer.classList.remove('visible');
// };

// const formatPopulation = pop => {
//   if (pop >= 1000000) return `${(pop / 1000000).toFixed(1)}M`;
//   if (pop >= 1000) return `${(pop / 1000).toFixed(1)}K`;
//   return pop.toString();
// };

// const checkCommonAliases = input => {
//   const map = {
//     uk: 'United Kingdom',
//     usa: 'United States',
//     uae: 'United Arab Emirates',
//     korea: 'South Korea',
//     russia: 'Russian Federation',
//   };
//   return map[input.toLowerCase()] || input;
// };

// // 6. RENDER COUNTRY CARD
// const renderCountry = (data, className = '') => {
//   const lang = data.languages ? Object.values(data.languages)[0] : 'N/A';

//   let curr = data.currencies ? Object.values(data.currencies)[0].name : 'N/A';
//   if (curr.length > 20) curr = curr.substring(0, 15) + '...';

//   const population = formatPopulation(data.population);
//   const capital = data.capital ? data.capital[0] : 'N/A';
//   const driveSide = data.car.side
//     ? data.car.side.charAt(0).toUpperCase() + data.car.side.slice(1)
//     : 'N/A';

//   // --- NEIGHBOR CHIPS ---
//   let neighboursHTML = '';
//   if (data.borders && data.borders.length > 0) {
//     const chips = data.borders
//       .map(
//         border =>
//           `<button class="neighbour-chip" data-country="${border}">${border}</button>`
//       )
//       .join('');

//     neighboursHTML = `
//         <div class="country__neighbours-container">
//             <span class="country__neighbours-label">Neighbours</span>
//             <div class="country__neighbours-list">${chips}</div>
//         </div>
//       `;
//   } else {
//     neighboursHTML = `<p class="no-borders">🌊 Island Nation (No Borders)</p>`;
//   }

//   // --- HTML GENERATION ---
//   // Notice the button now has data-lat and data-lng attributes!
//   const html = `
//     <article class="country ${className}">
//       <div class="country__inner">
//         <div class="country__front">
//           <div class="country__img-wrapper">
//             <img class="country__img" src="${
//               data.flags.svg || data.flags.png
//             }" alt="Flag of ${data.name.common}" loading="lazy" />
//           </div>
//           <div class="country__front-content">
//              <div style="font-size: 4rem;">${data.flag || '🏳️'}</div>
//             <h3 class="country__name">${data.name.common}</h3>
//             <span class="country__region">${data.region}</span>
//           </div>
//           <div class="country__flip-hint">
//             <span>Tap to flip</span>
//             <i class="fa-solid fa-arrow-rotate-right"></i>
//           </div>
//         </div>

//         <div class="country__back">
//           <div class="country__back-header">
//             <h4 class="country__back-title">${data.name.common}</h4>
//             <p class="country__back-subtitle">Country Details</p>
//           </div>

//           <div class="country__stats">
//             <div class="country__row">
//               <span class="country__row-label"><i class="fa-solid fa-landmark icon-capital"></i> Capital</span>
//               <span class="country__row-value">${capital}</span>
//             </div>
//             <div class="country__row">
//               <span class="country__row-label"><i class="fa-solid fa-users icon-pop"></i> Population</span>
//               <span class="country__row-value">${population}</span>
//             </div>
//             <div class="country__row">
//               <span class="country__row-label"><i class="fa-solid fa-language icon-lang"></i> Language</span>
//               <span class="country__row-value">${lang}</span>
//             </div>
//             <div class="country__row">
//               <span class="country__row-label"><i class="fa-solid fa-coins icon-money"></i> Currency</span>
//               <span class="country__row-value" title="${
//                 data.currencies ? Object.values(data.currencies)[0].name : ''
//               }">${curr}</span>
//             </div>
//             <div class="country__row">
//               <span class="country__row-label"><i class="fa-solid fa-car icon-car"></i> Drives on</span>
//               <span class="country__row-value">${driveSide}</span>
//             </div>
//           </div>

//           ${neighboursHTML}

//           <button class="btn-map" data-lat="${data.latlng[0]}" data-lng="${
//     data.latlng[1]
//   }">
//             <i class="fa-solid fa-map-location-dot"></i> View on Interactive Map
//           </button>

//         </div>
//       </div>
//     </article>
//   `;

//   countriesContainer.insertAdjacentHTML('beforeend', html);
//   countriesContainer.classList.add('visible');
// };

// // 7. HANDLE MAP BUTTON CLICKS
// countriesContainer.addEventListener('click', function (e) {
//   const btn = e.target.closest('.btn-map');
//   if (!btn) return;

//   // Get coordinates from the button
//   const lat = btn.dataset.lat;
//   const lng = btn.dataset.lng;

//   openMap(lat, lng);
// });

// // 8. NEIGHBOR CHIP CLICK LOGIC
// countriesContainer.addEventListener('click', function (e) {
//   const btn = e.target.closest('.neighbour-chip');
//   if (!btn) return;
//   getCountryData(btn.dataset.country);
// });

// // 9. FETCH LOGIC
// const getCountryData = async input => {
//   try {
//     clearUI();
//     if (input.length < 2) throw new Error('Please type at least 2 characters');

//     showLoading();
//     const alias = checkCommonAliases(input);

//     let res = await fetch(`https://restcountries.com/v3.1/name/${alias}`);
//     if (!res.ok) {
//       res = await fetch(`https://restcountries.com/v3.1/alpha/${input}`);
//     }

//     if (!res.ok) throw new Error(`Country not found`);

//     const data = await res.json();
//     let countryData = data[0];

//     if (data.length > 1) {
//       const exactMatch = data.find(
//         c => c.name.common.toLowerCase() === alias.toLowerCase()
//       );
//       const altMatch = data.find(c =>
//         c.altSpellings?.some(alt => alt.toLowerCase() === alias.toLowerCase())
//       );
//       if (exactMatch) countryData = exactMatch;
//       else if (altMatch) countryData = altMatch;
//     }

//     hideLoading();
//     renderCountry(countryData);
//     addToHistory(countryData.name.common); // Add to history

//     searchInput.value = '';
//   } catch (err) {
//     hideLoading();
//     renderError(`${err.message}. Please try again!`);
//   }
// };

// // 10. HISTORY & SIDEBAR LOGIC
// const openSidebar = () => {
//   sidebar.classList.add('open');
//   overlay.classList.add('open');
// };
// const closeSidebar = () => {
//   sidebar.classList.remove('open');
//   overlay.classList.remove('open');
// };

// let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

// const renderHistory = () => {
//   historyList.innerHTML = '';
//   if (searchHistory.length === 0) {
//     emptyMsg.style.display = 'block';
//   } else {
//     emptyMsg.style.display = 'none';
//     searchHistory.forEach(country => {
//       const li = document.createElement('li');
//       li.classList.add('history-item');
//       li.textContent = country;
//       historyList.appendChild(li);
//     });
//   }
// };

// const addToHistory = countryName => {
//   if (searchHistory.includes(countryName)) {
//     searchHistory = searchHistory.filter(c => c !== countryName);
//   }
//   searchHistory.unshift(countryName);
//   if (searchHistory.length > 10) searchHistory.pop();
//   localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
//   renderHistory();
// };

// // Event Listeners
// searchForm?.addEventListener('submit', e => {
//   e.preventDefault();
//   const query = searchInput.value.trim();
//   if (query) getCountryData(query);
// });

// // Location Button Logic
// const getPosition = () =>
//   new Promise((resolve, reject) =>
//     navigator.geolocation.getCurrentPosition(resolve, reject)
//   );

// const whereAmI = async () => {
//   try {
//     clearUI();
//     showLoading();
//     const pos = await getPosition();
//     const { latitude: lat, longitude: lng } = pos.coords;
//     const resGeo = await fetch(
//       `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
//     );
//     if (!resGeo.ok) throw new Error('Unable to get location data');
//     const dataGeo = await resGeo.json();
//     await getCountryData(dataGeo.countryName);
//   } catch (err) {
//     hideLoading();
//     renderError(`Could not determine your location: ${err.message}`);
//   }
// };

// btnLocation?.addEventListener('click', whereAmI);
// btnOpenSidebar?.addEventListener('click', openSidebar);
// btnCloseSidebar?.addEventListener('click', closeSidebar);
// overlay?.addEventListener('click', closeSidebar);
// historyList?.addEventListener('click', e => {
//   if (e.target.classList.contains('history-item')) {
//     getCountryData(e.target.textContent);
//     closeSidebar();
//   }
// });
// btnClearHistory?.addEventListener('click', () => {
//   searchHistory = [];
//   localStorage.removeItem('searchHistory');
//   renderHistory();
// });

// // Initialize
// initTheme();
// renderHistory();

//
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

// Sidebar Selectors
const sidebar = document.querySelector('.sidebar');
const overlay = document.querySelector('.overlay');
const btnOpenSidebar = document.querySelector('.btn-toggle-sidebar');
const btnCloseSidebar = document.querySelector('.btn-close-sidebar');
const historyList = document.querySelector('.history-list');
const btnClearHistory = document.querySelector('.btn-clear-history');
const emptyMsg = document.querySelector('.empty-msg');

// Map Selectors
const mapModal = document.querySelector('.map-modal');
const mapOverlay = document.querySelector('.map-overlay');
const btnCloseMap = document.querySelector('.btn-close-map');

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

// 3. FLIP LOGIC
countriesContainer.addEventListener('click', function (e) {
  // Don't flip if clicking buttons or chips
  if (e.target.closest('.neighbour-chip') || e.target.closest('.btn-map'))
    return;

  const card = e.target.closest('.country');
  if (!card) return;
  card.classList.toggle('flipped');
});

// 4. MAP LOGIC (LEAFLET INTEGRATION)
let map; // Global variable to hold the map instance

const openMap = (lat, lng, zoom = 6) => {
  mapModal.classList.remove('hidden');
  mapOverlay.classList.remove('hidden');

  if (map) {
    map.remove();
  }

  map = L.map('map').setView([lat, lng], zoom);

  L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  L.marker([lat, lng]).addTo(map).bindPopup('Center of Country').openPopup();
};

const closeMap = () => {
  mapModal.classList.add('hidden');
  mapOverlay.classList.add('hidden');
};

// Map Event Listeners
btnCloseMap.addEventListener('click', closeMap);
mapOverlay.addEventListener('click', closeMap);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !mapModal.classList.contains('hidden')) {
    closeMap();
  }
});

// 5. WEATHER API LOGIC (NEW)
const getWeatherIcon = code => {
  if (code === 0) return '☀️'; // Clear sky
  if (code >= 1 && code <= 3) return '⛅'; // Partly cloudy
  if (code >= 45 && code <= 48) return '🌫️'; // Fog
  if (code >= 51 && code <= 67) return '🌧️'; // Rain
  if (code >= 71 && code <= 77) return '❄️'; // Snow
  if (code >= 80 && code <= 82) return '🌦️'; // Rain showers
  if (code >= 95) return '⚡'; // Thunderstorm
  return '🌡️'; // Default
};

const getWeather = async (lat, lng) => {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`
    );
    const data = await res.json();
    return {
      temp: data.current_weather.temperature,
      code: data.current_weather.weathercode,
      icon: getWeatherIcon(data.current_weather.weathercode),
    };
  } catch (err) {
    console.error('Weather fetch failed', err);
    return null; // Fail gracefully
  }
};

// 6. UTILITY FUNCTIONS
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

// 7. RENDER COUNTRY CARD (Updated with Weather Badge)
const renderCountry = (data, weather = null, className = '') => {
  const lang = data.languages ? Object.values(data.languages)[0] : 'N/A';

  let curr = data.currencies ? Object.values(data.currencies)[0].name : 'N/A';
  if (curr.length > 20) curr = curr.substring(0, 15) + '...';

  const population = formatPopulation(data.population);
  const capital = data.capital ? data.capital[0] : 'N/A';
  const driveSide = data.car.side
    ? data.car.side.charAt(0).toUpperCase() + data.car.side.slice(1)
    : 'N/A';

  // --- WEATHER HTML GENERATION ---
  let weatherHTML = '';
  if (weather) {
    weatherHTML = `
        <div class="weather-badge">
            <span class="weather-icon">${weather.icon}</span>
            <span class="weather-temp">${weather.temp}°C</span>
        </div>
      `;
  }

  // --- NEIGHBOR CHIPS ---
  let neighboursHTML = '';
  if (data.borders && data.borders.length > 0) {
    const chips = data.borders
      .map(
        border =>
          `<button class="neighbour-chip" data-country="${border}">${border}</button>`
      )
      .join('');

    neighboursHTML = `
        <div class="country__neighbours-container">
            <span class="country__neighbours-label">Neighbours</span>
            <div class="country__neighbours-list">${chips}</div>
        </div>
      `;
  } else {
    neighboursHTML = `<p class="no-borders">🌊 Island Nation (No Borders)</p>`;
  }

  // --- HTML GENERATION ---
  const html = `
    <article class="country ${className}">
      <div class="country__inner">
        <div class="country__front">
          <div class="country__img-wrapper">
            <img class="country__img" src="${
              data.flags.svg || data.flags.png
            }" alt="Flag of ${data.name.common}" loading="lazy" />
            
            ${weatherHTML}

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
              <span class="country__row-label"><i class="fa-solid fa-landmark icon-capital"></i> Capital</span>
              <span class="country__row-value">${capital}</span>
            </div>
            <div class="country__row">
              <span class="country__row-label"><i class="fa-solid fa-users icon-pop"></i> Population</span>
              <span class="country__row-value">${population}</span>
            </div>
            <div class="country__row">
              <span class="country__row-label"><i class="fa-solid fa-language icon-lang"></i> Language</span>
              <span class="country__row-value">${lang}</span>
            </div>
            <div class="country__row">
              <span class="country__row-label"><i class="fa-solid fa-coins icon-money"></i> Currency</span>
              <span class="country__row-value" title="${
                data.currencies ? Object.values(data.currencies)[0].name : ''
              }">${curr}</span>
            </div>
            <div class="country__row">
              <span class="country__row-label"><i class="fa-solid fa-car icon-car"></i> Drives on</span>
              <span class="country__row-value">${driveSide}</span>
            </div>
          </div>

          ${neighboursHTML}

          <button class="btn-map" data-lat="${data.latlng[0]}" data-lng="${
    data.latlng[1]
  }">
            <i class="fa-solid fa-map-location-dot"></i> View on Interactive Map
          </button>
          
        </div>
      </div>
    </article>
  `;

  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.classList.add('visible');
};

// 8. HANDLE MAP BUTTON CLICKS
countriesContainer.addEventListener('click', function (e) {
  const btn = e.target.closest('.btn-map');
  if (!btn) return;

  const lat = btn.dataset.lat;
  const lng = btn.dataset.lng;

  openMap(lat, lng);
});

// 9. NEIGHBOR CHIP CLICK LOGIC
countriesContainer.addEventListener('click', function (e) {
  const btn = e.target.closest('.neighbour-chip');
  if (!btn) return;
  getCountryData(btn.dataset.country);
});

// 10. FETCH LOGIC (With Weather Chaining)
const getCountryData = async input => {
  try {
    clearUI();
    if (input.length < 2) throw new Error('Please type at least 2 characters');

    showLoading();
    const alias = checkCommonAliases(input);

    let res = await fetch(`https://restcountries.com/v3.1/name/${alias}`);
    if (!res.ok) {
      res = await fetch(`https://restcountries.com/v3.1/alpha/${input}`);
    }

    if (!res.ok) throw new Error(`Country not found`);

    const data = await res.json();
    let countryData = data[0];

    // Smart Selection Logic
    if (data.length > 1) {
      const exactMatch = data.find(
        c => c.name.common.toLowerCase() === alias.toLowerCase()
      );
      const altMatch = data.find(c =>
        c.altSpellings?.some(alt => alt.toLowerCase() === alias.toLowerCase())
      );
      if (exactMatch) countryData = exactMatch;
      else if (altMatch) countryData = altMatch;
    }

    // --- API CHAINING: GET WEATHER ---
    const [lat, lng] = countryData.latlng;
    const weatherData = await getWeather(lat, lng);

    hideLoading();
    // Render with weather data
    renderCountry(countryData, weatherData);

    addToHistory(countryData.name.common); // Add to history

    searchInput.value = '';
  } catch (err) {
    hideLoading();
    renderError(`${err.message}. Please try again!`);
  }
};

// 11. HISTORY & SIDEBAR LOGIC
const openSidebar = () => {
  sidebar.classList.add('open');
  overlay.classList.add('open');
};
const closeSidebar = () => {
  sidebar.classList.remove('open');
  overlay.classList.remove('open');
};

let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

const renderHistory = () => {
  historyList.innerHTML = '';
  if (searchHistory.length === 0) {
    emptyMsg.style.display = 'block';
  } else {
    emptyMsg.style.display = 'none';
    searchHistory.forEach(country => {
      const li = document.createElement('li');
      li.classList.add('history-item');
      li.textContent = country;
      historyList.appendChild(li);
    });
  }
};

const addToHistory = countryName => {
  if (searchHistory.includes(countryName)) {
    searchHistory = searchHistory.filter(c => c !== countryName);
  }
  searchHistory.unshift(countryName);
  if (searchHistory.length > 10) searchHistory.pop();
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  renderHistory();
};

// Event Listeners
searchForm?.addEventListener('submit', e => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (query) getCountryData(query);
});

// Location Button Logic
const getPosition = () =>
  new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject)
  );

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
    hideLoading();
    renderError(`Could not determine your location: ${err.message}`);
  }
};

btnLocation?.addEventListener('click', whereAmI);
btnOpenSidebar?.addEventListener('click', openSidebar);
btnCloseSidebar?.addEventListener('click', closeSidebar);
overlay?.addEventListener('click', closeSidebar);

// History Click
historyList?.addEventListener('click', e => {
  if (e.target.classList.contains('history-item')) {
    getCountryData(e.target.textContent);
    closeSidebar();
  }
});

btnClearHistory?.addEventListener('click', () => {
  searchHistory = [];
  localStorage.removeItem('searchHistory');
  renderHistory();
});

// ==========================================
// 12. VOICE SEARCH LOGIC
// ==========================================
const btnVoice = document.querySelector('.btn-voice');

// Check if browser supports Speech Recognition
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.continuous = false; // Stop after one sentence
  recognition.lang = 'en-US';
  recognition.interimResults = false;

  // Start Listening
  btnVoice.addEventListener('click', () => {
    recognition.start();
  });

  // visual feedback: Microphone turns red/pulses
  recognition.onstart = () => {
    btnVoice.classList.add('listening');
    searchInput.placeholder = 'Listening... Speak now';
  };

  // When speech ends
  recognition.onend = () => {
    btnVoice.classList.remove('listening');
    searchInput.placeholder = 'Search for any country...';
  };

  // Capture result
  recognition.onresult = e => {
    const transcript = e.results[0][0].transcript;

    // Clean up the text (remove periods, trim)
    const cleanQuery = transcript.replace('.', '').trim();

    // Put text in input and trigger search
    searchInput.value = cleanQuery;
    getCountryData(cleanQuery);
  };

  // Error handling
  recognition.onerror = e => {
    console.error('Voice error', e.error);
    btnVoice.classList.remove('listening');
    searchInput.placeholder = 'Error. Please type instead.';
  };
} else {
  // Hide button if browser doesn't support it (e.g. Firefox desktop)
  if (btnVoice) btnVoice.style.display = 'none';
}

// Initialize
initTheme();
renderHistory();
