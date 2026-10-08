/**
 * METHIMIX LANDING PAGE JAVASCRIPT
 * Real-time Order Calculator, Package Sync, Live FOMO Popups, FAQ Accordion, Proof Modal
 */

// Package configurations
const PACKAGES = {
  pkg1: {
    name: '১ মাসের প্যাকেজ (১টি কৌটো)',
    price: 590,
    freeDelivery: false
  },
  pkg2: {
    name: '২ মাসের প্যাকেজ (২টি কৌটো)',
    price: 990,
    freeDelivery: true
  },
  pkg3: {
    name: '৩ মাসের ফুল কোর্স (৩টি কৌটো)',
    price: 1390,
    freeDelivery: true
  }
};

let currentSelectedPkg = 'pkg2'; // Default selected

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

// 2. Package Selection from Offer Cards with Smooth Scroll
function selectPackageAndScroll(pkgKey) {
  currentSelectedPkg = pkgKey;

  // Check radio button in the order form
  const radio = document.querySelector(`input[name="selectedPackage"][value="${pkgKey}"]`);
  if (radio) {
    radio.checked = true;
  }

  // Highlight card inside order form
  document.querySelectorAll('.pkg-choice-item').forEach(item => item.classList.remove('selected'));
  const activeItem = document.getElementById(`opt-${pkgKey}`);
  if (activeItem) activeItem.classList.add('selected');

  updateOrderCalculations();

  // Smooth scroll to order form
  const orderSection = document.getElementById('order-form-section');
  if (orderSection) {
    orderSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// 3. Package selection from inside the Order Form
function onPackageChange(pkgKey) {
  currentSelectedPkg = pkgKey;
  
  document.querySelectorAll('.pkg-choice-item').forEach(item => item.classList.remove('selected'));
  const activeItem = document.getElementById(`opt-${pkgKey}`);
  if (activeItem) activeItem.classList.add('selected');

  updateOrderCalculations();
}

// 4. Calculate Total and Update DOM
function updateOrderCalculations() {
  const pkg = PACKAGES[currentSelectedPkg];
  const deliveryLocEl = document.querySelector('input[name="deliveryLocation"]:checked');
  const deliveryLoc = deliveryLocEl ? deliveryLocEl.value : 'inside';

  let deliveryFee = 0;
  if (pkg.freeDelivery) {
    deliveryFee = 0;
  } else {
    deliveryFee = (deliveryLoc === 'inside') ? 60 : 120;
  }

  const totalPrice = pkg.price + deliveryFee;

  // Update Summary elements
  const summaryPackagePrice = document.getElementById('summaryPackagePrice');
  const summaryDeliveryCharge = document.getElementById('summaryDeliveryCharge');
  const summaryTotalPrice = document.getElementById('summaryTotalPrice');
  const mobileBarPrice = document.getElementById('mobileBarPrice');

  if (summaryPackagePrice) {
    summaryPackagePrice.textContent = formatCurrency(pkg.price);
  }

  if (summaryDeliveryCharge) {
    if (deliveryFee === 0) {
      summaryDeliveryCharge.textContent = 'ফ্রি (০ টাকা)';
      summaryDeliveryCharge.className = 'text-green font-bold';
    } else {
      summaryDeliveryCharge.textContent = formatCurrency(deliveryFee);
      summaryDeliveryCharge.className = 'font-bold';
    }
  }

  if (summaryTotalPrice) {
    summaryTotalPrice.textContent = formatCurrency(totalPrice);
  }

  if (mobileBarPrice) {
    mobileBarPrice.textContent = formatCurrency(totalPrice);
  }
}

// 5. Order Form Submission Handling
function handleOrderSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('customerName').value.trim();
  const phone = document.getElementById('customerPhone').value.trim();
  const address = document.getElementById('customerAddress').value.trim();
  const pkg = PACKAGES[currentSelectedPkg];

  const deliveryLocEl = document.querySelector('input[name="deliveryLocation"]:checked');
  const deliveryLoc = deliveryLocEl ? deliveryLocEl.value : 'inside';
  let deliveryFee = pkg.freeDelivery ? 0 : (deliveryLoc === 'inside' ? 60 : 120);
  const total = pkg.price + deliveryFee;

  if (!name || !phone || !address) {
    alert('অনুগ্রহ করে আপনার নাম, মোবাইল নম্বর এবং সম্পূর্ণ ঠিকানা সঠিকভাবে পূরণ করুন।');
    return;
  }

  // Populate Success Modal
  document.getElementById('confirmPhoneDisplay').textContent = phone;
  document.getElementById('confirmPackageDisplay').textContent = pkg.name;
  document.getElementById('confirmTotalDisplay').textContent = formatCurrency(total);

  // Open Modal
  const successModal = document.getElementById('successModal');
  if (successModal) {
    successModal.classList.add('active');
  }

  // Reset Form
  document.getElementById('orderForm').reset();
  // Restore selected package radio
  const defaultRadio = document.querySelector(`input[name="selectedPackage"][value="${currentSelectedPkg}"]`);
  if (defaultRadio) defaultRadio.checked = true;
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
