// Favorites Page JavaScript with Advanced Features
class FavoritesManager {
    constructor() {
        this.favorites = [];
        this.selectedItems = new Set();
        this.sortBy = 'newest';
        this.filterBy = 'all';
        this.sampleProducts = [
            {
                id: 1,
                name: 'Premium Running Shoes',
                price: 119.99,
                originalPrice: 149.99,
                image: 'https://via.placeholder.com/300x200/ff7675/ffffff?text=PREMIUM+SHOES',
                rating: 4.5,
                reviewCount: 324,
                color: 'Black',
                size: 'US 9',
                category: 'shoes',
                inStock: true,
                isNew: false,
                onSale: true,
                addedDate: new Date('2024-03-15').toISOString()
            },
            {
                id: 2,
                name: 'Athletic Sports Wear',
                price: 49.99,
                originalPrice: null,
                image: 'https://via.placeholder.com/300x200/74b9ff/ffffff?text=SPORTS+WEAR',
                rating: 4.2,
                reviewCount: 156,
                color: 'Blue',
                size: 'M',
                category: 'clothing',
                inStock: true,
                isNew: true,
                onSale: false,
                addedDate: new Date('2024-03-10').toISOString()
            },
            {
                id: 3,
                name: 'Premium Accessories',
                price: 29.99,
                originalPrice: 39.99,
                image: 'https://via.placeholder.com/300x200/00b894/ffffff?text=ACCESSORIES',
                rating: 4.8,
                reviewCount: 89,
                color: 'Green',
                size: 'One Size',
                category: 'accessories',
                inStock: false,
                isNew: false,
                onSale: true,
                addedDate: new Date('2024-03-08').toISOString()
            },
            {
                id: 4,
                name: 'Classic Sneakers',
                price: 79.99,
                originalPrice: null,
                image: 'https://via.placeholder.com/300x200/a29bfe/ffffff?text=SNEAKERS',
                rating: 4.6,
                reviewCount: 234,
                color: 'Purple',
                size: 'US 10',
                category: 'shoes',
                inStock: true,
                isNew: false,
                onSale: false,
                addedDate: new Date('2024-03-05').toISOString()
            }
        ];
        this.init();
    }

    init() {
        this.loadFavorites();
        this.loadRecentlyViewed();
        this.updateStats();
        this.renderFavorites();
        this.renderRecentlyViewed();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Handle select all checkbox
        const selectAllCheckbox = document.querySelector('#selectAll');
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', (e) => {
                this.toggleSelectAll(e.target.checked);
            });
        }

        // Handle sort and filter changes
        const sortSelect = document.querySelector('#sortBy');
        const filterSelect = document.querySelector('#filterBy');
        
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortBy = e.target.value;
                this.sortFavorites();
            });
        }

        if (filterSelect) {
            filterSelect.addEventListener('change', (e) => {
                this.filterBy = e.target.value;
                this.filterFavorites();
            });
        }

        // Handle individual item checkboxes
        document.addEventListener('change', (e) => {
            if (e.target.matches('.item-checkbox')) {
                const itemId = parseInt(e.target.dataset.itemId);
                this.toggleItemSelection(itemId, e.target.checked);
            }
        });
    }

    loadFavorites() {
        // Load from localStorage (in real app, this would be an API call)
        const savedFavorites = localStorage.getItem('favorites');
        if (savedFavorites) {
            this.favorites = JSON.parse(savedFavorites);
        } else {
            // For demo purposes, add some sample favorites
            this.favorites = this.sampleProducts.map(product => ({
                ...product,
                addedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
            }));
            this.saveFavorites();
        }
    }

    saveFavorites() {
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
    }

    loadRecentlyViewed() {
        const recentlyViewed = localStorage.getItem('viewedProducts');
        if (recentlyViewed) {
            this.recentlyViewed = JSON.parse(recentlyViewed).slice(0, 6);
        } else {
            this.recentlyViewed = [];
        }
    }

    updateStats() {
        const totalFavorites = this.favorites.length;
        const totalValue = this.favorites.reduce((sum, item) => sum + item.price, 0);
        const availableItems = this.favorites.filter(item => item.inStock).length;

        document.getElementById('totalFavorites').textContent = totalFavorites;
        document.getElementById('totalValue').textContent = `$${totalValue.toFixed(2)}`;
        document.getElementById('availableItems').textContent = availableItems;
    }

    renderFavorites() {
        const favoritesList = document.getElementById('favoritesList');
        const emptyState = document.getElementById('emptyState');

        if (this.favorites.length === 0) {
            favoritesList.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        favoritesList.style.display = 'block';
        emptyState.style.display = 'none';

        favoritesList.innerHTML = this.favorites.map(item => this.createFavoriteItemHTML(item)).join('');
        this.updateSelectAllState();
    }

    createFavoriteItemHTML(item) {
        const discount = item.originalPrice ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : 0;
        const addedDate = new Date(item.addedDate).toLocaleDateString();
        const isSelected = this.selectedItems.has(item.id);

        return `
            <div class="favorite-item ${isSelected ? 'selected' : ''}" data-item-id="${item.id}">
                <div class="item-header">
                    <div class="item-select">
                        <input type="checkbox" class="item-checkbox" data-item-id="${item.id}" ${isSelected ? 'checked' : ''}>
                        <span class="item-date">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                <line x1="16" y1="2" x2="16" y2="6"/>
                                <line x1="8" y1="2" x2="8" y2="6"/>
                                <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                            Added ${addedDate}
                        </span>
                    </div>
                </div>
                <div class="item-content">
                    <div class="item-image">
                        <img src="${item.image}" alt="${item.name}" loading="lazy">
                        <div class="item-badges">
                            ${item.onSale ? '<span class="badge sale">SALE</span>' : ''}
                            ${item.isNew ? '<span class="badge new">NEW</span>' : ''}
                            ${!item.inStock ? '<span class="badge out-of-stock">OUT OF STOCK</span>' : ''}
                        </div>
                    </div>
                    <div class="item-details">
                        <h3 class="item-name">${item.name}</h3>
                        <div class="item-attributes">
                            <span>Color: ${item.color}</span>
                            <span>Size: ${item.size}</span>
                        </div>
                        <div class="item-rating">
                            ${this.generateStars(item.rating)}
                            <span class="rating-count">(${item.reviewCount})</span>
                        </div>
                        <div class="item-price">
                            <span class="current-price">$${item.price.toFixed(2)}</span>
                            ${item.originalPrice ? `<span class="original-price">$${item.originalPrice.toFixed(2)}</span>` : ''}
                            ${discount > 0 ? `<span class="discount">${discount}% OFF</span>` : ''}
                        </div>
                    </div>
                    <div class="item-actions">
                        <button class="btn btn-primary" onclick="addToCart(${item.id})" ${!item.inStock ? 'disabled' : ''}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="9" cy="21" r="1"/>
                                <circle cx="20" cy="21" r="1"/>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                            </svg>
                            ${item.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                        <button class="btn remove-btn" onclick="removeFromFavorites(${item.id})">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M3 6h18"/>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                            </svg>
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let starsHTML = '';

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                starsHTML += '<span class="star active">★</span>';
            } else if (i === fullStars && hasHalfStar) {
                starsHTML += '<span class="star active">★</span>';
            } else {
                starsHTML += '<span class="star">★</span>';
            }
        }

        return starsHTML;
    }

    renderRecentlyViewed() {
        const recentlyViewedList = document.getElementById('recentlyViewedList');
        
        if (this.recentlyViewed.length === 0) {
            recentlyViewedList.innerHTML = '<p style="text-align: center; color: var(--sonic-silver); padding: 40px;">No recently viewed items</p>';
            return;
        }

        recentlyViewedList.innerHTML = this.recentlyViewed.map(item => `
            <div class="recently-viewed-item" onclick="viewProduct(${item.id})">
                <img src="https://via.placeholder.com/200x120/fd79a8/ffffff?text=${encodeURIComponent(item.name.split(' ')[0])}" alt="${item.name}" loading="lazy">
                <h4>${item.name}</h4>
                <span class="price">$${item.price.toFixed(2)}</span>
            </div>
        `).join('');
    }

    toggleSelectAll(checked) {
        const checkboxes = document.querySelectorAll('.item-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = checked;
            const itemId = parseInt(checkbox.dataset.itemId);
            this.toggleItemSelection(itemId, checked);
        });
    }

    toggleItemSelection(itemId, selected) {
        if (selected) {
            this.selectedItems.add(itemId);
        } else {
            this.selectedItems.delete(itemId);
        }

        // Update item visual state
        const itemElement = document.querySelector(`[data-item-id="${itemId}"]`);
        if (itemElement) {
            itemElement.classList.toggle('selected', selected);
        }

        // Update bulk action buttons
        this.updateBulkActionButtons();
        this.updateSelectAllState();
    }

    updateBulkActionButtons() {
        const addSelectedBtn = document.getElementById('addSelectedBtn');
        const removeSelectedBtn = document.getElementById('removeSelectedBtn');
        const hasSelected = this.selectedItems.size > 0;

        if (addSelectedBtn) {
            addSelectedBtn.disabled = !hasSelected;
        }
        if (removeSelectedBtn) {
            removeSelectedBtn.disabled = !hasSelected;
        }
    }

    updateSelectAllState() {
        const selectAllCheckbox = document.querySelector('#selectAll');
        const totalItems = this.favorites.length;
        const selectedCount = this.selectedItems.size;

        if (selectAllCheckbox) {
            selectAllCheckbox.checked = selectedCount === totalItems && totalItems > 0;
            selectAllCheckbox.indeterminate = selectedCount > 0 && selectedCount < totalItems;
        }
    }

    sortFavorites() {
        const sortedFavorites = [...this.favorites];
        
        switch (this.sortBy) {
            case 'newest':
                sortedFavorites.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));
                break;
            case 'oldest':
                sortedFavorites.sort((a, b) => new Date(a.addedDate) - new Date(b.addedDate));
                break;
            case 'price-low':
                sortedFavorites.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                sortedFavorites.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                sortedFavorites.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }

        this.favorites = sortedFavorites;
        this.renderFavorites();
        this.showToast('Favorites sorted successfully');
    }

    filterFavorites() {
        this.loadFavorites(); // Reset to original data
        
        switch (this.filterBy) {
            case 'available':
                this.favorites = this.favorites.filter(item => item.inStock);
                break;
            case 'sale':
                this.favorites = this.favorites.filter(item => item.onSale);
                break;
            case 'new':
                this.favorites = this.favorites.filter(item => item.isNew);
                break;
            case 'all':
            default:
                // Show all items
                break;
        }

        this.renderFavorites();
        this.updateStats();
        this.showToast('Favorites filtered successfully');
    }

    addToCart(itemId) {
        const item = this.favorites.find(f => f.id === itemId);
        if (!item || !item.inStock) {
            this.showToast('Item is out of stock', 'error');
            return;
        }

        // Get existing cart
        let cart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
        
        // Check if item exists in cart
        const existingItemIndex = cart.findIndex(cartItem => 
            cartItem.id === item.id && 
            cartItem.color === item.color && 
            cartItem.size === item.size
        );

        const cartItem = {
            id: item.id,
            name: item.name,
            price: item.price,
            originalPrice: item.originalPrice,
            quantity: 1,
            color: item.color,
            size: item.size,
            image: item.image
        };

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push(cartItem);
        }

        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        this.showToast(`${item.name} added to cart`);
    }

    addSelectedToCart() {
        const selectedItems = Array.from(this.selectedItems);
        const availableItems = selectedItems.filter(id => {
            const item = this.favorites.find(f => f.id === id);
            return item && item.inStock;
        });

        if (availableItems.length === 0) {
            this.showToast('No available items selected', 'error');
            return;
        }

        availableItems.forEach(itemId => {
            this.addToCart(itemId);
        });

        this.showToast(`${availableItems.length} items added to cart`);
    }

    removeFromFavorites(itemId) {
        this.favorites = this.favorites.filter(item => item.id !== itemId);
        this.selectedItems.delete(itemId);
        this.saveFavorites();
        this.updateStats();
        this.renderFavorites();
        this.updateBulkActionButtons();
        this.showToast('Item removed from favorites');
    }

    removeSelected() {
        const selectedItems = Array.from(this.selectedItems);
        selectedItems.forEach(itemId => {
            this.favorites = this.favorites.filter(item => item.id !== itemId);
        });
        
        this.selectedItems.clear();
        this.saveFavorites();
        this.updateStats();
        this.renderFavorites();
        this.updateBulkActionButtons();
        this.showToast(`${selectedItems.length} items removed from favorites`);
    }

    quickAddToWishlist(itemId) {
        // This would typically call an API to add to wishlist
        this.showToast('Added to wishlist');
    }

    quickAddToCart(itemId) {
        // This would typically call an API to add to cart
        this.showToast('Added to cart');
    }

    showToast(message, type = 'success') {
        const toast = document.querySelector('#toast');
        const toastMessage = document.querySelector('#toastMessage');
        
        if (toast && toastMessage) {
            toastMessage.textContent = message;
            
            toast.className = `toast ${type === 'error' ? 'error' : ''}`;
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    }

    // Navigation functions
    goHome() {
        window.location.href = 'index.html';
    }

    goToCart() {
        window.location.href = 'cart.html';
    }

    continueShopping() {
        window.location.href = 'product.html';
    }

    viewProduct(productId) {
        window.location.href = `product.html?id=${productId}`;
    }
}

// Global functions for HTML event handlers
function toggleSelectAll() {
    const selectAllCheckbox = document.querySelector('#selectAll');
    favoritesManager.toggleSelectAll(selectAllCheckbox.checked);
}

function addSelectedToCart() {
    favoritesManager.addSelectedToCart();
}

function removeSelected() {
    favoritesManager.removeSelected();
}

function sortFavorites() {
    favoritesManager.sortFavorites();
}

function filterFavorites() {
    favoritesManager.filterFavorites();
}

function addToCart(itemId) {
    favoritesManager.addToCart(itemId);
}

function removeFromFavorites(itemId) {
    favoritesManager.removeFromFavorites(itemId);
}

function quickAddToWishlist(itemId) {
    favoritesManager.quickAddToWishlist(itemId);
}

function quickAddToCart(itemId) {
    favoritesManager.quickAddToCart(itemId);
}

function continueShopping() {
    favoritesManager.continueShopping();
}

function goToCart() {
    favoritesManager.goToCart();
}

function goHome() {
    favoritesManager.goHome();
}

function viewProduct(productId) {
    favoritesManager.viewProduct(productId);
}

// Initialize favorites manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.favoritesManager = new FavoritesManager();
});

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + A to select all
    if ((e.ctrlKey || e.metaKey) && e.key === 'a' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        const selectAllCheckbox = document.querySelector('#selectAll');
        if (selectAllCheckbox) {
            selectAllCheckbox.checked = !selectAllCheckbox.checked;
            favoritesManager.toggleSelectAll(selectAllCheckbox.checked);
        }
    }
    
    // Delete key to remove selected items
    if (e.key === 'Delete' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        if (favoritesManager.selectedItems.size > 0) {
            favoritesManager.removeSelected();
        }
    }
    
    // Ctrl/Cmd + D to add selected to cart
    if ((e.ctrlKey || e.metaKey) && e.key === 'd' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        if (favoritesManager.selectedItems.size > 0) {
            favoritesManager.addSelectedToCart();
        }
    }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Refresh data when page becomes visible
        favoritesManager.loadFavorites();
        favoritesManager.updateStats();
        favoritesManager.renderFavorites();
    }
});

// Handle online/offline status
window.addEventListener('online', () => {
    favoritesManager.showToast('Connection restored');
});

window.addEventListener('offline', () => {
    favoritesManager.showToast('Connection lost - some features may not work', 'error');
});

// Auto-save scroll position
let scrollTimer;
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
        sessionStorage.setItem('favoritesScrollPosition', window.pageYOffset);
    }, 100);
});

// Restore scroll position
window.addEventListener('load', () => {
    const scrollPosition = sessionStorage.getItem('favoritesScrollPosition');
    if (scrollPosition) {
        window.scrollTo(0, parseInt(scrollPosition));
    }
});

// Performance monitoring
const pageLoadStart = performance.now();
window.addEventListener('load', () => {
    const loadTime = performance.now() - pageLoadStart;
    console.log(`Favorites page loaded in ${loadTime.toFixed(2)}ms`);
});

// Handle search functionality (if search input exists)
document.addEventListener('input', (e) => {
    if (e.target.matches('[data-search]')) {
        const searchTerm = e.target.value.toLowerCase();
        const items = document.querySelectorAll('.favorite-item');
        
        items.forEach(item => {
            const itemName = item.querySelector('.item-name').textContent.toLowerCase();
            const shouldShow = itemName.includes(searchTerm);
            item.style.display = shouldShow ? 'block' : 'none';
        });
    }
});

// Handle infinite scroll (if needed for large lists)
let isLoading = false;
window.addEventListener('scroll', () => {
    if (isLoading) return;
    
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    if (scrollTop + windowHeight >= documentHeight - 100) {
        // Load more items if needed
        // isLoading = true;
        // loadMoreFavorites();
    }
});

// Handle drag and drop for reordering (future feature)
let draggedElement = null;

document.addEventListener('dragstart', (e) => {
    if (e.target.matches('.favorite-item')) {
        draggedElement = e.target;
        e.target.style.opacity = '0.5';
    }
});

document.addEventListener('dragend', (e) => {
    if (e.target.matches('.favorite-item')) {
        e.target.style.opacity = '1';
        draggedElement = null;
    }
});

document.addEventListener('dragover', (e) => {
    e.preventDefault();
});

document.addEventListener('drop', (e) => {
    e.preventDefault();
    if (draggedElement && e.target.matches('.favorite-item')) {
        // Handle reordering logic here
        favoritesManager.showToast('Reordering feature coming soon!');
    }
});

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        FavoritesManager,
        toggleSelectAll,
        addSelectedToCart,
        removeSelected,
        sortFavorites,
        filterFavorites
    };
}