class ShoppingCart {
    constructor() {
        this.cart = this.loadCartFromStorage();
        this.savedItems = this.loadSavedItemsFromStorage();
        this.promoCodes = {
            'SAVE10': { discount: 0.10, description: '10% off your order' },
            'WELCOME20': { discount: 0.20, description: '20% off for new customers' },
            'FREESHIP': { discount: 0, freeShipping: true, description: 'Free shipping' }
        };
        this.appliedPromo = null;
        this.init();
    }

    init() {
        this.updateCartDisplay();
        this.setupEventListeners();
        this.updateCartSummary();
    }

    setupEventListeners() {
        // Select all checkbox functionality
        const selectAllCheckbox = document.querySelector('#selectAll');
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', (e) => {
                this.toggleSelectAll(e.target.checked);
            });
        }

        // Item checkboxes
        document.addEventListener('change', (e) => {
            if (e.target.matches('.cart-item input[type="checkbox"]')) {
                this.updateSelectAllState();
                this.updateCartSummary();
            }
        });

        // Quantity input direct change
        document.addEventListener('change', (e) => {
            if (e.target.matches('.qty-input')) {
                const itemId = this.getItemIdFromElement(e.target);
                const newQuantity = parseInt(e.target.value);
                this.updateQuantity(itemId, 0, newQuantity);
            }
        });

        // Promo code input
        const promoInput = document.querySelector('#promoCode');
        if (promoInput) {
            promoInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.applyPromoCode();
                }
            });
        }
    }

    loadCartFromStorage() {
        const savedCart = localStorage.getItem('shoppingCart');
        return savedCart ? JSON.parse(savedCart) : [
            {
                id: 1,
                name: 'Premium Running Shoes',
                description: 'Comfortable athletic shoes with advanced cushioning technology',
                price: 119.99,
                originalPrice: 149.99,
                quantity: 1,
                image: 'https://via.placeholder.com/100x100/ff7675/ffffff?text=SHOE',
                attributes: { color: 'Black', size: 'US 9' }
            },
            {
                id: 2,
                name: 'Premium Cotton T-Shirt',
                description: 'Soft, breathable cotton t-shirt perfect for everyday wear',
                price: 29.99,
                originalPrice: null,
                quantity: 2,
                image: 'https://via.placeholder.com/100x100/74b9ff/ffffff?text=SHIRT',
                attributes: { color: 'Navy Blue', size: 'Medium' }
            },
            {
                id: 3,
                name: 'Smart Fitness Watch',
                description: 'Advanced fitness tracking with heart rate monitor and GPS',
                price: 249.99,
                originalPrice: 299.99,
                quantity: 1,
                image: 'https://via.placeholder.com/100x100/00b894/ffffff?text=WATCH',
                attributes: { color: 'Space Gray', band: 'Sport Band' }
            }
        ];
    }

    loadSavedItemsFromStorage() {
        const savedItems = localStorage.getItem('savedForLater');
        return savedItems ? JSON.parse(savedItems) : [];
    }

    saveCartToStorage() {
        localStorage.setItem('shoppingCart', JSON.stringify(this.cart));
    }

    saveSavedItemsToStorage() {
        localStorage.setItem('savedForLater', JSON.stringify(this.savedItems));
    }

    getItemIdFromElement(element) {
        return parseInt(element.closest('.cart-item').dataset.id);
    }

    updateQuantity(itemId, change, newQuantity = null) {
        const item = this.cart.find(item => item.id === itemId);
        if (!item) return;

        if (newQuantity !== null) {
            item.quantity = Math.max(1, Math.min(10, newQuantity));
        } else {
            item.quantity = Math.max(1, Math.min(10, item.quantity + change));
        }

        // Update UI
        const quantityInput = document.querySelector(`[data-id="${itemId}"] .qty-input`);
        if (quantityInput) {
            quantityInput.value = item.quantity;
        }

        // Update item total
        const itemTotal = document.querySelector(`[data-id="${itemId}"] .item-total`);
        if (itemTotal) {
            itemTotal.textContent = `$${(item.price * item.quantity).toFixed(2)}`;
        }

        this.updateCartSummary();
        this.saveCartToStorage();
        this.showToast('Quantity updated');
    }

    removeItem(itemId) {
        const itemIndex = this.cart.findIndex(item => item.id === itemId);
        if (itemIndex === -1) return;

        const item = this.cart[itemIndex];
        this.cart.splice(itemIndex, 1);

        // Remove from DOM
        const itemElement = document.querySelector(`[data-id="${itemId}"]`);
        if (itemElement) {
            itemElement.remove();
        }

        this.updateCartDisplay();
        this.updateCartSummary();
        this.saveCartToStorage();
        this.showToast(`${item.name} removed from cart`);
    }

    saveForLater(itemId) {
        const itemIndex = this.cart.findIndex(item => item.id === itemId);
        if (itemIndex === -1) return;

        const item = this.cart[itemIndex];
        this.savedItems.push(item);
        this.cart.splice(itemIndex, 1);

        // Remove from cart DOM
        const itemElement = document.querySelector(`[data-id="${itemId}"]`);
        if (itemElement) {
            itemElement.remove();
        }

        this.updateCartDisplay();
        this.updateCartSummary();
        this.updateSavedItemsDisplay();
        this.saveCartToStorage();
        this.saveSavedItemsToStorage();
        this.showToast(`${item.name} saved for later`);
    }

    moveToCart(itemId) {
        const itemIndex = this.savedItems.findIndex(item => item.id === itemId);
        if (itemIndex === -1) return;

        const item = this.savedItems[itemIndex];
        this.cart.push(item);
        this.savedItems.splice(itemIndex, 1);

        this.updateCartDisplay();
        this.updateCartSummary();
        this.updateSavedItemsDisplay();
        this.saveCartToStorage();
        this.saveSavedItemsToStorage();
        this.showToast(`${item.name} moved to cart`);
    }

    removeSavedItem(itemId) {
        const itemIndex = this.savedItems.findIndex(item => item.id === itemId);
        if (itemIndex === -1) return;

        const item = this.savedItems[itemIndex];
        this.savedItems.splice(itemIndex, 1);

        this.updateSavedItemsDisplay();
        this.saveSavedItemsToStorage();
        this.showToast(`${item.name} removed from saved items`);
    }

    toggleSelectAll(checked) {
        const checkboxes = document.querySelectorAll('.cart-item input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = checked;
        });
        this.updateCartSummary();
    }

    updateSelectAllState() {
        const checkboxes = document.querySelectorAll('.cart-item input[type="checkbox"]');
        const selectAllCheckbox = document.querySelector('#selectAll');
        
        const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
        const someChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
        
        if (selectAllCheckbox) {
            selectAllCheckbox.checked = allChecked;
            selectAllCheckbox.indeterminate = someChecked && !allChecked;
        }
    }

    getSelectedItems() {
        const selectedItems = [];
        const checkboxes = document.querySelectorAll('.cart-item input[type="checkbox"]:checked');
        
        checkboxes.forEach(checkbox => {
            const itemId = parseInt(checkbox.closest('.cart-item').dataset.id);
            const item = this.cart.find(item => item.id === itemId);
            if (item) selectedItems.push(item);
        });
        
        return selectedItems;
    }

    removeSelected() {
        const selectedItems = this.getSelectedItems();
        if (selectedItems.length === 0) {
            this.showToast('No items selected', 'error');
            return;
        }

        if (confirm(`Remove ${selectedItems.length} item(s) from cart?`)) {
            selectedItems.forEach(item => {
                this.removeItem(item.id);
            });
        }
    }

    saveSelectedForLater() {
        const selectedItems = this.getSelectedItems();
        if (selectedItems.length === 0) {
            this.showToast('No items selected', 'error');
            return;
        }

        selectedItems.forEach(item => {
            this.saveForLater(item.id);
        });
    }

    updateCartDisplay() {
        const cartItemsContainer = document.querySelector('#cartItems');
        const emptyCartElement = document.querySelector('#emptyCart');
        const cartContent = document.querySelector('.cart-content');
        const cartHeader = document.querySelector('.cart-header');
        
        if (this.cart.length === 0) {
            if (cartContent) cartContent.style.display = 'none';
            if (cartHeader) cartHeader.style.display = 'none';
            if (emptyCartElement) emptyCartElement.style.display = 'flex';
            return;
        }

        if (cartContent) cartContent.style.display = 'grid';
        if (cartHeader) cartHeader.style.display = 'block';
        if (emptyCartElement) emptyCartElement.style.display = 'none';

        // Update cart counter
        const cartCounter = document.querySelector('#cartItemCount');
        if (cartCounter) {
            cartCounter.textContent = this.cart.length;
        }
    }

    updateSavedItemsDisplay() {
        const savedItemsContainer = document.querySelector('#savedItems');
        const savedItemsGrid = document.querySelector('.saved-items-grid');
        
        if (this.savedItems.length === 0) {
            if (savedItemsContainer) {
                savedItemsContainer.classList.remove('show');
            }
            return;
        }

        if (savedItemsContainer) {
            savedItemsContainer.classList.add('show');
        }

        if (savedItemsGrid) {
            savedItemsGrid.innerHTML = this.savedItems.map(item => `
                <div class="saved-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)}</p>
                    <div class="saved-item-actions">
                        <button class="saved-item-btn primary" onclick="cartManager.moveToCart(${item.id})">
                            Move to Cart
                        </button>
                        <button class="saved-item-btn" onclick="cartManager.removeSavedItem(${item.id})">
                            Remove
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }

    updateCartSummary() {
        const selectedItems = this.getSelectedItems();
        const subtotal = selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = subtotal * 0.08; // 8% tax
        const shipping = subtotal > 50 ? 0 : 9.99;
        
        let discount = 0;
        if (this.appliedPromo) {
            discount = subtotal * this.appliedPromo.discount;
        }

        const total = subtotal + tax + shipping - discount;

        // Update display
        document.querySelector('#subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.querySelector('#tax').textContent = `$${tax.toFixed(2)}`;
        document.querySelector('#discount').textContent = discount > 0 ? `-$${discount.toFixed(2)}` : '$0.00';
        document.querySelector('#total').textContent = `$${total.toFixed(2)}`;

        // Update shipping display
        const shippingElement = document.querySelector('.summary-row:nth-child(2) span:last-child');
        if (shippingElement) {
            if (shipping === 0) {
                shippingElement.textContent = 'FREE';
                shippingElement.className = 'free-shipping';
            } else {
                shippingElement.textContent = `$${shipping.toFixed(2)}`;
                shippingElement.className = '';
            }
        }
    }

    applyPromoCode() {
        const promoInput = document.querySelector('#promoCode');
        const promoMessage = document.querySelector('#promoMessage');
        
        if (!promoInput || !promoMessage) return;

        const code = promoInput.value.trim().toUpperCase();
        
        if (!code) {
            this.showPromoMessage('Please enter a promo code', 'error');
            return;
        }

        if (this.promoCodes[code]) {
            this.appliedPromo = this.promoCodes[code];
            this.showPromoMessage(`Promo code applied: ${this.appliedPromo.description}`, 'success');
            promoInput.value = '';
            this.updateCartSummary();
            this.showToast('Promo code applied successfully!');
        } else {
            this.showPromoMessage('Invalid promo code', 'error');
        }
    }

    showPromoMessage(message, type) {
        const promoMessage = document.querySelector('#promoMessage');
        if (promoMessage) {
            promoMessage.textContent = message;
            promoMessage.className = `promo-message ${type}`;
            
            setTimeout(() => {
                promoMessage.className = 'promo-message';
                promoMessage.textContent = '';
            }, 5000);
        }
    }

    addRecommendedItem(itemId) {
        const recommendedItems = {
            1: {
                id: Date.now(),
                name: 'Travel Backpack',
                description: 'Durable backpack perfect for travel and daily use',
                price: 89.99,
                originalPrice: null,
                quantity: 1,
                image: 'https://via.placeholder.com/100x100/fd79a8/ffffff?text=BAG',
                attributes: { color: 'Black', size: 'One Size' }
            },
            2: {
                id: Date.now() + 1,
                name: 'Phone Case',
                description: 'Protective phone case with wireless charging support',
                price: 24.99,
                originalPrice: null,
                quantity: 1,
                image: 'https://via.placeholder.com/100x100/a29bfe/ffffff?text=CASE',
                attributes: { color: 'Clear', compatibility: 'iPhone 14' }
            }
        };

        const item = recommendedItems[itemId];
        if (item) {
            this.cart.push(item);
            this.updateCartDisplay();
            this.updateCartSummary();
            this.saveCartToStorage();
            this.showToast(`${item.name} added to cart`);
            
            // Add to DOM
            location.reload(); // Simple refresh to show new item
        }
    }

    proceedToCheckout() {
        const selectedItems = this.getSelectedItems();
        if (selectedItems.length === 0) {
            this.showToast('Please select items to checkout', 'error');
            return;
        }

        // Simulate checkout process
        this.showToast('Redirecting to checkout...', 'success');
        setTimeout(() => {
            // In a real app, this would redirect to checkout page
            alert('Checkout functionality would be implemented here');
        }, 1500);
    }

    showToast(message, type = 'success') {
        const toast = document.querySelector('#toast');
        const toastMessage = document.querySelector('#toastMessage');
        
        if (toast && toastMessage) {
            toastMessage.textContent = message;
            
            if (type === 'error') {
                toast.style.background = 'hsl(0, 100%, 70%)';
            } else {
                toast.style.background = 'hsl(152, 51%, 52%)';
            }
            
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    }
}

// Global functions for HTML event handlers
function updateQuantity(itemId, change, newQuantity = null) {
    cartManager.updateQuantity(itemId, change, newQuantity);
}

function removeItem(itemId) {
    cartManager.removeItem(itemId);
}

function saveForLater(itemId) {
    cartManager.saveForLater(itemId);
}

function toggleSelectAll() {
    const selectAllCheckbox = document.querySelector('#selectAll');
    cartManager.toggleSelectAll(selectAllCheckbox.checked);
}

function removeSelected() {
    cartManager.removeSelected();
}

function saveSelectedForLater() {
    cartManager.saveSelectedForLater();
}

function applyPromoCode() {
    cartManager.applyPromoCode();
}

function addRecommendedItem(itemId) {
    cartManager.addRecommendedItem(itemId);
}

function proceedToCheckout() {
    cartManager.proceedToCheckout();
}

function goBack() {
    window.history.back();
}

function continueShopping() {
    window.location.href = '/';
}

// Initialize cart manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cartManager = new ShoppingCart();
});

// Additional utility functions
function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

function calculateSavings(originalPrice, currentPrice) {
    if (!originalPrice || originalPrice <= currentPrice) return 0;
    return ((originalPrice - currentPrice) / originalPrice * 100).toFixed(0);
}

// Auto-save cart state on page unload
window.addEventListener('beforeunload', () => {
    if (window.cartManager) {
        cartManager.saveCartToStorage();
        cartManager.saveSavedItemsToStorage();
    }
});

// Handle quantity input validation
document.addEventListener('input', (e) => {
    if (e.target.matches('.qty-input')) {
        let value = parseInt(e.target.value);
        if (isNaN(value) || value < 1) {
            e.target.value = 1;
        } else if (value > 10) {
            e.target.value = 10;
        }
    }
});

// Handle promo code input formatting
document.addEventListener('input', (e) => {
    if (e.target.matches('#promoCode')) {
        e.target.value = e.target.value.toUpperCase();
    }
});

// Smooth scrolling for internal links
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Delete key removes selected items
    if (e.key === 'Delete' && !e.target.matches('input')) {
        const selectedItems = cartManager.getSelectedItems();
        if (selectedItems.length > 0) {
            cartManager.removeSelected();
        }
    }
    
    // Enter key on checkout button
    if (e.key === 'Enter' && e.target.matches('.checkout-btn')) {
        cartManager.proceedToCheckout();
    }
});

// Handle image loading errors
document.addEventListener('error', (e) => {
    if (e.target.matches('img')) {
        e.target.src = 'https://via.placeholder.com/100x100/cccccc/ffffff?text=IMAGE';
    }
}, true);