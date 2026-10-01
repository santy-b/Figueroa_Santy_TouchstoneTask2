document.addEventListener('DOMContentLoaded', () => {
  // --- 1. FAVORITES SYSTEM ---
  const favButtons = document.querySelectorAll('.fav-btn');
  const favCountDisplay = document.getElementById('fav-count');

  let favorites = JSON.parse(localStorage.getItem('northstar_favorites')) || [];

  function saveFavorites() {
    localStorage.setItem('northstar_favorites', JSON.stringify(favorites));
  }

  function updateFavoritesUI() {
    if (favCountDisplay) {
      favCountDisplay.textContent = `Favorites: ${favorites.length}`;
    }

    favButtons.forEach(button => {
      const productId = button.getAttribute('data-id');
      if (favorites.includes(productId)) {
        button.classList.add('active');
        button.textContent = '❤️ Favorited';
      } else {
        button.classList.remove('active');
        button.textContent = '🤍 Favorite';
      }
    });
  }

  function toggleFavorite(button) {
    const productId = button.getAttribute('data-id');
    if (favorites.includes(productId)) {
      favorites = favorites.filter(id => id !== productId);
    } else {
      favorites.push(productId);
    }
    saveFavorites();
    updateFavoritesUI();
  }

  favButtons.forEach(button => {
    button.addEventListener('click', () => toggleFavorite(button));
  });

  updateFavoritesUI();


  // --- 2. PICKUP DATE-picker MIN CONSTRAINT ---
  const pickupDateInput = document.getElementById('pickup-date');

  if (pickupDateInput) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const minDate = `${year}-${month}-${day}`;

    pickupDateInput.setAttribute('min', minDate);
  }


  // --- 3. FORM SUBMISSION & VALIDATION ---
  const form = document.querySelector('form');
  const formFeedback = document.getElementById('form-feedback');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault(); // Prevent standard page refresh

      // Get values matching the exact HTML IDs from contact.html
      const name = document.getElementById('full-name')?.value.trim();
      const email = document.getElementById('email')?.value.trim();
      const message = document.getElementById('item-details')?.value.trim();
      const selectedDate = pickupDateInput?.value;

      // Basic field presence check
      if (!name || !email || !message) {
        if (formFeedback) {
          formFeedback.textContent = 'Please complete all required fields.';
          formFeedback.style.color = '#d9534f';
        }
        return;
      }

      // Past date validation safety net
      if (selectedDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const userDate = new Date(`${selectedDate}T00:00:00`);

        if (userDate < today) {
          if (formFeedback) {
            formFeedback.textContent = 'Please select today or a future date for pickup.';
            formFeedback.style.color = '#d9534f';
          }
          pickupDateInput.focus();
          return;
        }
      }

      // Success feedback
      if (formFeedback) {
        formFeedback.textContent = `Thank you, ${name}! Your request has been submitted successfully.`;
        formFeedback.style.color = '#2e7d32';
      }

      form.reset();
    });
  }
});