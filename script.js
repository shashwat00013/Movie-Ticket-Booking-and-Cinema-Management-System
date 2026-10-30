(function () {
  const input = document.getElementById('movie-search');
  const results = document.getElementById('search-results');
  if (!input || !results) return;
  const cards = Array.from(document.querySelectorAll('.movie-card'));
  const normalize = value => value.toLowerCase().trim().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ');

  function updateSearch() {
    const query = normalize(input.value);
    const matches = [];
    cards.forEach(card => {
      const title = card.querySelector('.movie-info h3')?.textContent.trim() || card.querySelector('.real-poster')?.alt || '';
      const searchable = normalize(title + ' ' + (card.querySelector('.movie-info p')?.textContent || ''));
      const match = !query || searchable.includes(query);
      card.classList.toggle('search-hidden', !match);
      if (query && match) matches.push({card, title});
    });
    results.replaceChildren();
    if (!query) { results.hidden = true; return; }
    results.hidden = false;
    if (!matches.length) {
      const empty = document.createElement('div'); empty.className = 'search-empty'; empty.textContent = 'No movies found'; results.appendChild(empty); return;
    }
    matches.slice(0, 8).forEach(({card, title}) => {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'search-result'; button.setAttribute('role', 'option');
      button.append(document.createTextNode(title));
      const meta = document.createElement('small'); meta.textContent = card.querySelector('.card-bottom span')?.textContent.trim() || 'Movie'; button.appendChild(meta);
      button.addEventListener('click', () => { results.hidden = true; card.scrollIntoView({behavior:'smooth', block:'center'}); card.classList.add('search-highlight'); setTimeout(() => card.classList.remove('search-highlight'), 1400); });
      results.appendChild(button);
    });
  }
  input.addEventListener('input', updateSearch);
  input.addEventListener('keydown', event => { if (event.key === 'Escape') { input.value = ''; updateSearch(); } if (event.key === 'Enter') { const first = results.querySelector('.search-result'); if (first) first.click(); } });
  document.addEventListener('click', event => { if (!event.target.closest('.search-box')) results.hidden = true; });
})();

(function () {
  const changeButton = document.getElementById('change-location-btn');
  if (!changeButton) return;
  changeButton.addEventListener('click', function () {
    const locationName = window.prompt('Enter your city or location:', document.querySelector('.location-box strong').textContent);
    if (locationName && locationName.trim()) {
      document.querySelector('.location-box strong').textContent = locationName.trim();
      document.querySelector('.location-box p').textContent = 'Movie theaters near your selected location';
    }
  });
})();

(function () {
  const genreSelect = document.getElementById('genre-filter');
  const watchlistToggle = document.getElementById('watchlist-toggle');
  if (!genreSelect || !watchlistToggle) return;
  const cards = Array.from(document.querySelectorAll('.movie-card'));
  const storageKey = 'cinebook-watchlist';
  let saved = [];
  try { saved = JSON.parse(localStorage.getItem(storageKey) || '[]'); } catch (_) { saved = []; }
  if (!Array.isArray(saved)) saved = [];
  let watchlistOnly = false;

  function titleOf(card) {
    return card.querySelector('.movie-info h3')?.textContent.trim() || '';
  }
  function applyFilters() {
    const genre = genreSelect.value.toLowerCase();
    cards.forEach(card => {
      const description = (card.querySelector('.movie-info p')?.textContent || '').toLowerCase();
      const genreMatch = genre === 'all' || description.includes(genre);
      const watchMatch = !watchlistOnly || saved.includes(titleOf(card));
      card.classList.toggle('genre-hidden', !genreMatch);
      card.classList.toggle('watchlist-hidden', !watchMatch);
    });
  }
  cards.forEach(card => {
    const title = titleOf(card);
    const bottom = card.querySelector('.card-bottom');
    if (!bottom) return;
    const heart = document.createElement('button');
    heart.type = 'button';
    heart.className = 'watchlist-heart';
    heart.setAttribute('aria-label', 'Add ' + title + ' to watchlist');
    function paint() {
      const active = saved.includes(title);
      heart.textContent = active ? '♥' : '♡';
      heart.classList.toggle('saved', active);
      heart.setAttribute('aria-pressed', String(active));
      heart.setAttribute('aria-label', (active ? 'Remove ' : 'Add ') + title + ' ' + (active ? 'from' : 'to') + ' watchlist');
    }
    heart.addEventListener('click', () => {
      saved = saved.includes(title) ? saved.filter(item => item !== title) : [...saved, title];
      try { localStorage.setItem(storageKey, JSON.stringify(saved)); } catch (_) {}
      paint();
      applyFilters();
    });
    bottom.appendChild(heart);
    paint();
  });
  genreSelect.addEventListener('change', applyFilters);
  watchlistToggle.addEventListener('click', () => {
    watchlistOnly = !watchlistOnly;
    watchlistToggle.classList.toggle('active', watchlistOnly);
    watchlistToggle.setAttribute('aria-pressed', String(watchlistOnly));
    watchlistToggle.textContent = watchlistOnly ? '♥ Showing Watchlist' : '♡ Watchlist';
    applyFilters();
  });
  applyFilters();
})();

(function () {
  if (!document.getElementById('detail-title')) return;
const movies = {
  "daayra": {title:"Daayra", genre:"Drama • Hindi • 2026", date:"NOW SHOWING", year:"2026", tag:"BOLLYWOOD", status:"Now Showing", description:"A Hindi drama currently listed in CineBook's now-showing collection.", poster:"https://images.filmibeat.com/ph-big/2026/09/daayra1789475662_0.jpg", tags:["Drama","Hindi"]},
  "vibe": {title:"VIBE", genre:"Action • Comedy • Hindi", date:"NOW SHOWING", year:"2026", tag:"BOLLYWOOD", status:"Now Showing", description:"An action-comedy title featured in CineBook's now-showing collection.", poster:"https://images.filmibeat.com/ph-big/2026/09/vibe1789377731_0.jpg", tags:["Action","Comedy","Hindi"]},
  "i-m-game": {title:"I'm Game", genre:"Action • Thriller • 2026", date:"NOW SHOWING", year:"2026", tag:"INDIAN CINEMA", status:"Now Showing", description:"An action-thriller title featured in CineBook's now-showing collection.", poster:"https://i0.wp.com/indiaglitz.com/wp-content/uploads/2025/11/dulqersalman29112025m1.jpg?resize=1200%2C1799&ssl=1", tags:["Action","Thriller"]},
  "supergirl": {title:"Supergirl", genre:"Action • Sci-Fi • English", date:"NOW SHOWING", year:"2026", tag:"HOLLYWOOD", status:"Now Showing", description:"A superhero science-fiction adventure featuring Supergirl.", poster:"https://www.televisionacademy.com/files/assets/posters/screening-supergirl-312x462.jpg", tags:["Action","Sci-Fi","English"]},
  "the-mummy": {title:"The Mummy", genre:"Horror • Thriller • English", date:"NOW SHOWING", year:"2026", tag:"HOLLYWOOD", status:"Now Showing", description:"A horror-thriller title featured in CineBook's now-showing collection.", poster:"https://www.impawards.com/2026/posters/lee_cronins_the_mummy.jpg", tags:["Horror","Thriller","English"]},
  "the-end-of-oak-street": {title:"The End of Oak Street", genre:"Sci-Fi • Mystery • Thriller", date:"NOW SHOWING", year:"2026", tag:"HOLLYWOOD", status:"Now Showing", description:"A science-fiction mystery thriller featured in CineBook's now-showing collection.", poster:"https://cdn.moviefone.com/admin-uploads/posters/the-end-of-oak-street-movie-poster_1774545983.jpg?d=480x720&q=50", tags:["Sci-Fi","Mystery","Thriller"]},
  "the-vvaan": {title:"The Vvaan", genre:"Action • Hindi", date:"25 SEP 2026", year:"2026", tag:"BOLLYWOOD", status:"Upcoming", description:"An upcoming Indian action film listed in CineBook's upcoming collection.", poster:"https://www.jagranimages.com/images/2026/07/09/article/image/vannn-1783596031832_m.webp", tags:["Action","Hindi"]},
  "drishyam-the-conclusion": {title:"Drishyam – The Conclusion", genre:"Crime • Thriller • Hindi", date:"02 OCT 2026", year:"2026", tag:"BOLLYWOOD", status:"Upcoming", description:"The next chapter in the Drishyam crime-thriller story.", poster:"https://www.impawards.com/intl/india/2026/posters/drishyam_the_conclusion.jpg", tags:["Crime","Thriller","Hindi"]},
  "jailer-2": {title:"Jailer 2", genre:"Action • Tamil • 2026", date:"15 OCT 2026", year:"2026", tag:"INDIAN CINEMA", status:"Upcoming", description:"The sequel to Jailer, returning with an action-packed Tamil cinema story.", poster:"https://variety.blr1.cdn.digitaloceanspaces.com/2026/10/Jailer-2-1.jpg", tags:["Action","Tamil"]},
  "the-hunger-games-sunrise-on-the-reaping": {title:"The Hunger Games: Sunrise on the Reaping", genre:"Drama • Thriller • English", date:"20 NOV 2026", year:"2026", tag:"HOLLYWOOD", status:"Upcoming", description:"A new story set in the world of The Hunger Games, centred on the events of the 50th Hunger Games.", poster:"https://www.impawards.com/2026/posters/hunger_games_sunrise_on_the_reaping.jpg", tags:["Drama","Thriller","English"]},
  "avengers-doomsday": {title:"Avengers: Doomsday", genre:"Action • Sci-Fi • English", date:"18 DEC 2026", year:"2026", tag:"HOLLYWOOD", status:"Upcoming", description:"The Avengers return for a major Marvel superhero science-fiction event.", poster:"https://www.impawards.com/2026/posters/avengers_doomsday.jpg", tags:["Action","Sci-Fi","English"]},
  "dune-part-three": {title:"Dune: Part Three", genre:"Sci-Fi • Adventure • English", date:"18 DEC 2026", year:"2026", tag:"HOLLYWOOD", status:"Upcoming", description:"The next instalment in the Dune science-fiction saga.", poster:"https://www.impawards.com/2026/posters/dune_part_three_ver10.jpg", tags:["Sci-Fi","Adventure","English"]}
};
const slug = new URLSearchParams(window.location.search).get('movie');
const movie = movies[slug] || movies['daayra'];
document.title = movie.title + ' | CineBook';
document.getElementById('detail-title').textContent = movie.title;
document.getElementById('detail-poster-title').textContent = movie.title.toUpperCase();
document.getElementById('detail-meta').textContent = movie.genre;
document.getElementById('detail-date').textContent = movie.date;
document.getElementById('detail-status').textContent = movie.status;
document.getElementById('detail-year').textContent = movie.year;
document.getElementById('detail-tag').textContent = movie.tag;
document.getElementById('detail-description').textContent = movie.description;
document.getElementById('detail-tags').innerHTML = movie.tags.map(tag => `<span>${tag}</span>`).join('');
const poster = document.getElementById('detail-poster');
const img = document.createElement('img');
img.className = 'real-poster'; img.src = movie.poster; img.alt = movie.title + ' poster'; img.onerror = () => img.remove();
poster.prepend(img);
})();
