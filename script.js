const modal = document.getElementById('checkoutModal');
const paymentForm = document.getElementById('paymentForm');
const successMessage = document.getElementById('successMessage');
const basketCount = document.getElementById('basketCount');
const checkoutBook = document.getElementById('checkoutBook');
const checkoutPrice = document.getElementById('checkoutPrice');
let basket = 0;
const STRIPE_CHECKOUT_ENDPOINT = '';
let checkoutCurrency = '₹';

function openCheckout(title, price) {
  checkoutBook.textContent = title;
  checkoutPrice.textContent = `${checkoutCurrency}${price}`;
  paymentForm.style.display = 'block';
  successMessage.classList.remove('visible');
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeCheckout() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('.buy-button').forEach((button) => {
  button.addEventListener('click', () => {
    basket += 1;
    basketCount.textContent = basket;
    checkoutCurrency = button.dataset.currency || '₹';
    openCheckout(button.dataset.title, button.dataset.price);
  });
});

document.getElementById('basketButton').addEventListener('click', () => {
  if (basket > 0) openCheckout(checkoutBook.textContent, checkoutPrice.textContent.replace(/[^\d.]/g, ''));
  else document.getElementById('library').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('closeModal').addEventListener('click', closeCheckout);
document.getElementById('doneButton').addEventListener('click', closeCheckout);
modal.addEventListener('click', (event) => { if (event.target === modal) closeCheckout(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeCheckout(); });

paymentForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (STRIPE_CHECKOUT_ENDPOINT) {
    const response = await fetch(STRIPE_CHECKOUT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: checkoutBook.textContent,
        price: checkoutPrice.textContent.replace(/[^\d.]/g, ''),
      }),
    });
    const session = await response.json();
    if (session.url) window.location.href = session.url;
    return;
  }

  paymentForm.style.display = 'none';
  successMessage.classList.add('visible');
});

document.getElementById('newsletterForm').addEventListener('submit', (event) => {
  event.preventDefault();
  document.getElementById('formMessage').textContent = 'You’re on the list. Welcome to eseller.';
  event.target.reset();
});