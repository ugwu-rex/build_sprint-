// Store wallet addresses for each cryptocurrency
const walletAddresses = {
    'BTC': 'rexqxy2kgdygjrsqtzq2n0ycf2493p83kkfjhx0wlh',
    'ETH': '0x71C7656EC7ab88b098rexB751B7401B5d2e3f4a',
    'USDT': 'T9yD14Nj9j7GzV2h4uQm1e3R2pK9n1arexx'
};

// When user clicks a payment method, update the page
function selectPaymentMethod(clickedCard, paymentType) {
    // Remove active style from all payment cards
    const allCards = document.querySelectorAll('.payment-card');
    allCards.forEach(card => card.classList.remove('active'));

    // Add active style to the clicked card
    clickedCard.classList.add('active');

    // Hide all payment detail sections
    const allSections = document.querySelectorAll('.payment-details-section, .crypto-details-section');
    allSections.forEach(section => section.style.display = 'none');

    // Show the correct payment detail section (if exists)
    const detailsToShow = document.getElementById(paymentType + '-details');
    if (detailsToShow) detailsToShow.style.display = 'block';

    // Update price and banners using explicit IDs to avoid brittle DOM queries
    const banner = document.querySelector('.discount-banner');
    const discountRow = document.getElementById('discount-row');
    const totalPrice = document.querySelector('.total-price');
    const savedText = document.querySelector('.saved-amount');
    const payBtn = document.querySelector('.pay-button');
    const taxText = document.getElementById('tax-amount');

    if (paymentType === 'crypto') {
        // Show discount for crypto payment
        if (banner) banner.style.display = 'flex';
        if (discountRow) discountRow.style.display = 'flex';
        if (savedText) savedText.style.display = 'inline';
        if (taxText) taxText.textContent = '$16.92';
        if (totalPrice) totalPrice.textContent = '$186.06';
        if (payBtn) payBtn.textContent = 'Pay $186.06';

        // ensure the currently-active crypto button drives the wallet address
        const activeCryptoBtn = document.querySelector('.crypto-btn.active');
        if (activeCryptoBtn) {
            const cryptoType = activeCryptoBtn.textContent.trim().split('\n')[0];
            const short = cryptoType.replace(/\s+/g, '');
            if (walletAddresses[short]) {
                document.getElementById('wallet-address').textContent = walletAddresses[short];
            }
        }
    } else {
        // Hide discount for other payment methods
        if (banner) banner.style.display = 'none';
        if (discountRow) discountRow.style.display = 'none';
        if (savedText) savedText.style.display = 'none';
        if (taxText) taxText.textContent = '$19.90';
        if (totalPrice) totalPrice.textContent = '$218.90';
        if (payBtn) payBtn.textContent = 'Pay $218.90';
    }
}

// When user clicks a cryptocurrency button, change the wallet address
function selectCrypto(clickedButton, cryptoType) {
    // Remove active style from all crypto buttons
    const allButtons = document.querySelectorAll('.crypto-btn');
    allButtons.forEach(btn => btn.classList.remove('active'));

    // Add active style to clicked button
    clickedButton.classList.add('active');

    // Update wallet address with the selected crypto's address
    const addressDisplay = document.getElementById('wallet-address');
    if (addressDisplay && walletAddresses[cryptoType]) {
        addressDisplay.textContent = walletAddresses[cryptoType];
    }
}

// Copy wallet address to clipboard when user clicks copy button
function copyAddress() {
    const addressText = document.getElementById('wallet-address').textContent;
    const copyBtn = document.querySelector('.copy-btn');
    if (!copyBtn) return;
    const originalButtonText = copyBtn.textContent;

    // Copy address to clipboard
    navigator.clipboard.writeText(addressText);

    // Change button text to "Copied!"
    copyBtn.textContent = 'Copied!';

    setTimeout(() => {
        copyBtn.textContent = originalButtonText;
    }, 2000);
}

// When page loads, set up the pay button
document.addEventListener('DOMContentLoaded', function() {
    const payBtn = document.querySelector('.pay-button');

    // Make payment-card elements keyboard accessible
    const paymentCards = document.querySelectorAll('.payment-card');
    paymentCards.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });

    // Determine initially active card and show its details
    const initialActive = document.querySelector('.payment-card.active');
    if (initialActive) {
        // infer payment type from onclick attribute if present
        const attr = initialActive.getAttribute('onclick') || '';
        const match = attr.match(/selectPaymentMethod\(this, '\\'(.*)\\'\)/) || attr.match(/selectPaymentMethod\(this, '(.*)'\)/);
        const paymentType = match ? match[1] : 'crypto';
        selectPaymentMethod(initialActive, paymentType);
    }

    if (payBtn) {
        payBtn.addEventListener('click', function() {
            // Check if bank transfer is selected
            const bankSection = document.getElementById('bank-details');
            if (bankSection && window.getComputedStyle(bankSection).display !== 'none') {
                // Get all input boxes in the bank section
                const inputBoxes = bankSection.querySelectorAll('.input-group input');
                let allInputsHaveText = true;

                // Check each input box
                inputBoxes.forEach(input => {
                    if (input.value.trim() === '') {
                        allInputsHaveText = false;
                        input.style.borderColor = 'red';
                    } else {
                        input.style.borderColor = '';
                    }
                });

                // If any box is empty, show error message and stop
                if (!allInputsHaveText) {
                    alert('Please fill in all required bank details.');
                    return;
                }
            }

            // Show processing message
            payBtn.textContent = 'Processing...';
        });
    }
});

