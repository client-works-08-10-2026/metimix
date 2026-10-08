// Product & Pricing configurations
const BASE_PRODUCT = {
  name: 'কোষ্ঠকিউর- 400gm',
  price: 990
};

const BUMP_PRODUCT = {
  name: 'মেথিমিক্স (৫০% অফার)',
  price: 490
};

let hasBumpOffer = false;

// Convert English digits to Bengali digits
function toBengaliNumerals(num) {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/\d/g, d => bnDigits[d]);
}

// Format currency
function formatCurrency(amount) {
  return '৳' + toBengaliNumerals(amount.toLocaleString('en-US'));
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  initCountdownTimer();
  updateOrderCalculations();
  startFomoPopups();
});

// 1. Countdown Timer (5 hours 43 minutes rolling timer)
function initCountdownTimer() {
  let totalSeconds = 5 * 3600 + 43 * 60 + 20;

  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  setInterval(() => {
    if (totalSeconds <= 0) {
      totalSeconds = 12 * 3600; // Reset
    }
    totalSeconds--;

    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    const pad = (n) => (n < 10 ? '0' + n : '' + n);

    if (hoursEl) hoursEl.textContent = toBengaliNumerals(pad(h));
    if (minutesEl) minutesEl.textContent = toBengaliNumerals(pad(m));
    if (secondsEl) secondsEl.textContent = toBengaliNumerals(pad(s));
  }, 1000);
}

// 2. Order Bump Upsell Handling
function toggleBumpBox() {
  const bumpCheck = document.getElementById('bumpOfferCheck');
  if (bumpCheck) {
    bumpCheck.checked = !bumpCheck.checked;
    onBumpToggle(bumpCheck.checked);
  }
}

function onBumpToggle(isChecked) {
  hasBumpOffer = isChecked;
  const bumpRow = document.getElementById('bumpTableRow');
  const bumpCard = document.getElementById('orderBumpCard');

  if (bumpRow) {
    bumpRow.style.display = isChecked ? 'flex' : 'none';
  }

  if (bumpCard) {
    if (isChecked) {
      bumpCard.classList.add('bump-active');
    } else {
      bumpCard.classList.remove('bump-active');
    }
  }

  updateOrderCalculations();
}

// 3. Calculate Total and Update DOM
function updateOrderCalculations() {
  const basePrice = BASE_PRODUCT.price;
  const bumpPrice = hasBumpOffer ? BUMP_PRODUCT.price : 0;
  const totalPrice = basePrice + bumpPrice;

  const subtotalEl = document.getElementById('subtotalDisplay');
  const totalEl = document.getElementById('totalDisplay');
  const mobileBarPrice = document.getElementById('mobileBarPrice');

  const formattedPriceText = `${totalPrice}.00৳`;

  if (subtotalEl) subtotalEl.textContent = formattedPriceText;
  if (totalEl) totalEl.textContent = formattedPriceText;
  if (mobileBarPrice) mobileBarPrice.textContent = `৳${totalPrice}`;
}

// 4. Order Form Submission Handling
function handleOrderSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('customerName').value.trim();
  const phone = document.getElementById('customerPhone').value.trim();
  const address = document.getElementById('customerAddress').value.trim();

  const basePrice = BASE_PRODUCT.price;
  const bumpPrice = hasBumpOffer ? BUMP_PRODUCT.price : 0;
  const totalPrice = basePrice + bumpPrice;

  let orderItemsSummary = BASE_PRODUCT.name;
  if (hasBumpOffer) {
    orderItemsSummary += ` + ${BUMP_PRODUCT.name}`;
  }

  if (!name || !phone || !address) {
    alert('অনুগ্রহ করে আপনার নাম, মোবাইল নম্বর এবং সম্পূর্ণ ঠিকানা সঠিকভাবে পূরণ করুন।');
    return;
  }

  // Populate Success Modal
  document.getElementById('confirmPhoneDisplay').textContent = phone;
  document.getElementById('confirmPackageDisplay').textContent = orderItemsSummary;
  document.getElementById('confirmTotalDisplay').textContent = `৳${totalPrice} (ডেলিভারি ফ্রি)`;

  // Open Modal
  const successModal = document.getElementById('successModal');
  if (successModal) {
    successModal.classList.add('active');
  }

  // Reset Form
  document.getElementById('orderForm').reset();
  hasBumpOffer = false;
  const bumpRow = document.getElementById('bumpTableRow');
  const bumpCard = document.getElementById('orderBumpCard');
  if (bumpRow) bumpRow.style.display = 'none';
  if (bumpCard) bumpCard.classList.remove('bump-active');
  updateOrderCalculations();
}

function closeSuccessModal() {
  const successModal = document.getElementById('successModal');
  if (successModal) {
    successModal.classList.remove('active');
  }
}

// 6. FAQ Accordion Toggle
function toggleFaq(btn) {
  const item = btn.parentElement;
  const isActive = item.classList.contains('active');

  // Close all other items
  document.querySelectorAll('.faq-item').forEach(el => {
    el.classList.remove('active');
  });

  if (!isActive) {
    item.classList.add('active');
  }
}

// 7. Proof Image Modal
function openProofModal(imgSrc) {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImg');
  if (modal && modalImg) {
    modalImg.src = imgSrc;
    modal.classList.add('active');
  }
}

function closeProofModal() {
  const modal = document.getElementById('imageModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

// 8. Live FOMO Notifications
const FOMO_CUSTOMERS = [
  { name: 'কামরুল হাসান', city: 'মিরপুর, ঢাকা', pkg: '২ মাসের প্যাকেজ (জনপ্রিয়)', time: '১ মিনিট আগে' },
  { name: 'তানভীর আহমেদ', city: 'আগ্রাবাদ, চট্টগ্রাম', pkg: '৩ মাসের ফুল কোর্স', time: '৩ মিনিট আগে' },
  { name: 'মো: জাহিদুল ইসলাম', city: 'বোয়ালিয়া, রাজশাহী', pkg: '২ মাসের প্যাকেজ', time: '৫ মিনিট আগে' },
  { name: 'ফারহানা আক্তার', city: 'উত্তরা, ঢাকা', pkg: '২ মাসের প্যাকেজ', time: '২ মিনিট আগে' },
  { name: 'আব্দুল কাদের', city: 'সোনাডাঙ্গা, খুলনা', pkg: '১ মাসের ট্রায়াল প্যাক', time: '৪ মিনিট আগে' },
  { name: 'নাজমুল হোসেন', city: 'চৌহাট্টা, সিলেট', pkg: '৩ মাসের ফুল কোর্স', time: '৬ মিনিট আগে' }
];

let fomoIndex = 0;

function startFomoPopups() {
  const popup = document.getElementById('livePurchasePopup');
  if (!popup) return;

  function showNextFomo() {
    const customer = FOMO_CUSTOMERS[fomoIndex];
    document.getElementById('popupName').textContent = customer.name;
    document.getElementById('popupCity').textContent = customer.city;
    document.getElementById('popupPackage').textContent = customer.pkg;
    document.getElementById('popupTime').textContent = customer.time;

    popup.classList.add('show');

    setTimeout(() => {
      popup.classList.remove('show');
    }, 4500);

    fomoIndex = (fomoIndex + 1) % FOMO_CUSTOMERS.length;
  }

  // Initial delay then trigger every 14 seconds
  setTimeout(() => {
    showNextFomo();
    setInterval(showNextFomo, 14000);
  }, 4000);
}

function closeLivePopup() {
  const popup = document.getElementById('livePurchasePopup');
  if (popup) popup.classList.remove('show');
}
