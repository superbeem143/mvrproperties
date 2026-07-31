/*=====================================
MVR PROPERTIES
script.js (module)
Preserves existing Firebase + modal + publish logic; adds filter support
=====================================*/

import { getProperties } from './firebase.js';

// =============================
// Global Variables
// =============================

const propertyList = document.getElementById('propertyList');
const latestProperties = document.getElementById('latestProperties'); // may be null on some pages

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

// NEW filters (added for advanced search)
const filterLocation = document.getElementById('filterLocation');
const filterType = document.getElementById('filterType');
const filterBudget = document.getElementById('filterBudget');

const propertyModal = document.getElementById('propertyModal');
const closeModal = document.querySelector('.close-modal');

const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalPrice = document.getElementById('modalPrice');
const modalLocation = document.getElementById('modalLocation');
const modalDescription = document.getElementById('modalDescription');

const callBtn = document.getElementById('callBtn');
const whatsappBtn = document.getElementById('whatsappBtn');
const mapBtn = document.getElementById('mapBtn');

// =============================
// Local Storage
// =============================

let properties = [];
let filteredProperties = [];
let currentProperty = null;

// =============================
// Event wiring: Search + Filters
// =============================

if (searchBtn) searchBtn.addEventListener('click', searchProperties);
if (searchInput) {
  searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') searchProperties();
  });
}

// run search on select change for instant feedback
if (filterLocation) filterLocation.addEventListener('change', searchProperties);
if (filterType) filterType.addEventListener('change', searchProperties);
if (filterBudget) filterBudget.addEventListener('change', searchProperties);

// keep "search while typing" behavior for the keyword input
if (searchInput) searchInput.addEventListener('input', () => { searchProperties(); });

// =============================
// Search (updated to respect filters)
// =============================
function searchProperties() {
  const keyword = (searchInput?.value || '').toLowerCase().trim();
  const loc = (filterLocation?.value || '').toLowerCase();
  const type = (filterType?.value || '').toLowerCase();
  const budget = (filterBudget?.value || '').toLowerCase();

  // Start from master list
  let list = Array.isArray(properties) ? properties.slice() : [];

  // Keyword filter (title/location/type/description)
  if (keyword) {
    list = list.filter(p => {
      return (p.title || '').toLowerCase().includes(keyword) ||
             (p.location || '').toLowerCase().includes(keyword) ||
             (p.type || '').toLowerCase().includes(type) ||
             (p.description || '').toLowerCase().includes(keyword);
    });
  }

  // Location filter (contains)
  if (loc) {
    list = list.filter(p => (p.location || '').toLowerCase().includes(loc));
  }

  // Type filter (contains)
  if (type) {
    list = list.filter(p => (p.type || '').toLowerCase().includes(type));
  }

  // Budget filter (simple numeric ranges)
  if (budget) {
    list = list.filter(p => {
      const price = Number(p.price || 0);
      if (budget === '0-100000') return price <= 100000;
      if (budget === '100000-300000') return price >= 100000 && price <= 300000;
      if (budget === '300000-600000') return price >= 300000 && price <= 600000;
      if (budget === '600000+') return price >= 600000;
      return true;
    });
  }

  filteredProperties = list;
  renderProperties(filteredProperties);
}

// =============================
// Render Properties
// =============================

function renderProperties(list) {
  if (!propertyList) return;
  propertyList.innerHTML = '';
  if (latestProperties) latestProperties.innerHTML = '';

  list.forEach(property => {
    const card = createPropertyCard(property);
    propertyList.appendChild(card);
    if (latestProperties) latestProperties.appendChild(card.cloneNode(true));
  });
}

// =============================
// Create Card
// =============================

function createPropertyCard(property) {
  const card = document.createElement('div');
  card.className = 'property-card';

  const imageWrap = document.createElement('div');
  imageWrap.className = 'property-image';
  const img = document.createElement('img');
  img.src = property.images?.[0] || 'images/sample-property.jpg';
  img.alt = property.title || 'Property';
  img.loading = 'lazy';
  imageWrap.appendChild(img);

  const badge = document.createElement('span');
  badge.className = 'featured-badge';
  badge.textContent = property.featured ? 'Featured' : 'Property';
  imageWrap.appendChild(badge);

  const content = document.createElement('div');
  content.className = 'property-content';
  const h3 = document.createElement('h3');
  h3.textContent = property.title || '';
  const pLoc = document.createElement('p');
  pLoc.className = 'meta';
  pLoc.textContent = `📍 ${property.location || ''}`;
  const h2 = document.createElement('h2');
  h2.textContent = `₹ ${property.price || ''}`;
  const btnWrap = document.createElement('div');
  btnWrap.className = 'property-buttons';

  const viewBtn = document.createElement('button');
  viewBtn.className = 'gold-btn viewBtn';
  viewBtn.type = 'button';
  viewBtn.textContent = 'View Details';
  viewBtn.addEventListener('click', () => openModal(property));

  const callA = document.createElement('a');
  callA.href = `tel:${property.phone || ''}`;
  callA.className = 'outline-btn';
  callA.textContent = 'Call';

  btnWrap.appendChild(viewBtn);
  btnWrap.appendChild(callA);

  content.appendChild(h3);
  content.appendChild(pLoc);
  content.appendChild(h2);
  content.appendChild(btnWrap);

  card.appendChild(imageWrap);
  card.appendChild(content);

  return card;
}

// =============================
// Open Modal
// =============================

function openModal(property) {
  currentProperty = property;
  if (modalImage) modalImage.src = property.images?.[0] || '';
  if (modalTitle) modalTitle.textContent = property.title || '';
  if (modalPrice) modalPrice.textContent = `₹ ${property.price || ''}`;
  if (modalLocation) modalLocation.textContent = property.location || '';
  if (modalDescription) modalDescription.textContent = property.description || '';

  if (callBtn) callBtn.href = `tel:${property.phone || ''}`;
  if (whatsappBtn) whatsappBtn.href = `https://wa.me/${property.phone || ''}?text=${encodeURIComponent('Hi, I am interested in ' + (property.title || ''))}`;
  if (mapBtn) mapBtn.href = property.map || '';

  if (propertyModal) propertyModal.style.display = 'flex';
  currentImage = 0;
}

// =============================
// Close Modal and controls
// =============================

if (closeModal) {
  closeModal.addEventListener('click', () => { if (propertyModal) propertyModal.style.display = 'none'; });
}

window.addEventListener('click', (e) => {
  if (e.target === propertyModal) { if (propertyModal) propertyModal.style.display = 'none'; }
});

// =============================
// Image Slider
// =============================
let currentImage = 0;
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');

if (nextBtn) nextBtn.addEventListener('click', () => {
  if (!currentProperty) return;
  currentImage = (currentImage + 1) % (currentProperty.images?.length || 1);
  if (modalImage) modalImage.src = currentProperty.images?.[currentImage] || '';
});
if (prevBtn) prevBtn.addEventListener('click', () => {
  if (!currentProperty) return;
  const len = (currentProperty.images?.length || 1);
  currentImage = (currentImage - 1 + len) % len;
  if (modalImage) modalImage.src = currentProperty.images?.[currentImage] || '';
});

// =============================
// Share Property
// =============================
function shareProperty() {
  if (!currentProperty) return;
  if (navigator.share) {
    navigator.share({ title: currentProperty.title, text: currentProperty.description, url: window.location.href });
  } else {
    alert('Sharing is not supported on this device.');
  }
}

// =============================
// Favorites
// =============================
function toggleFavorite(id) {
  const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
  const updated = favs.includes(id) ? favs.filter(item => item !== id) : [...favs, id];
  localStorage.setItem('favorites', JSON.stringify(updated));
}

// =============================
// Floating AI Button
// =============================
const aiButton = document.getElementById('floatingAI');
if (aiButton) aiButton.addEventListener('click', () => alert('🤖 SUPER BEEM AI is coming soon!'));

// =============================
// Lazy-load helper for hero background (lightweight, non-invasive)
// - Uses IntersectionObserver when available, falls back to immediate load
// - Only touches elements with data-src / data-srcset to avoid changing existing IDs or classes
// =============================
function initHeroLazyLoad() {
  const heroImg = document.querySelector('img.hero-bg[data-src]');
  const heroSources = Array.from(document.querySelectorAll('source[data-srcset]'));

  function loadHero() {
    if (heroImg && heroImg.dataset.src) {
      heroImg.src = heroImg.dataset.src;
      heroImg.removeAttribute('data-src');
    }
    heroSources.forEach(s => {
      if (s.dataset.srcset) {
        s.srcset = s.dataset.srcset;
        s.removeAttribute('data-srcset');
      }
    });
  }

  if (!heroImg && heroSources.length === 0) return;

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadHero();
          observer.disconnect();
        }
      });
    });
    obs.observe(document.querySelector('.hero'));
  } else {
    // fallback
    window.addEventListener('load', loadHero);
  }
}

// =============================
// Load Properties from Firestore (modular)
// =============================
async function loadProperties() {
  try {
    const docs = await getProperties();
    properties = Array.isArray(docs) ? docs : [];
    // initial default render shows all or featured as before
    renderProperties(properties);
  } catch (error) {
    console.error('Property Loading Error:', error);
  }
}

// =============================
// Login & Navigation
// =============================
const loginBtn = document.getElementById('loginBtn');
if (loginBtn) loginBtn.addEventListener('click', () => { window.location.href = 'login.html'; });
const addPropertyBtn = document.getElementById('addPropertyBtn');
if (addPropertyBtn) addPropertyBtn.addEventListener('click', () => { window.location.href = 'admin.html'; });

// =============================
// Escape key closes modal
// =============================
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && propertyModal) propertyModal.style.display = 'none'; });

// =============================
// Scroll behavior
// =============================
window.addEventListener('scroll', () => {
  const header = document.querySelector('.header');
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 60);
});

// =============================
// Initialize on DOMContentLoaded
// =============================
window.addEventListener('DOMContentLoaded', () => {
  console.log('✅ MVR Properties Loaded');
  // init lightweight hero lazy loading (non-invasive)
  initHeroLazyLoad();
  loadProperties();
});
