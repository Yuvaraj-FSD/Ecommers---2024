// Profile Page JavaScript with Validation
class ProfileManager {
    constructor() {
        this.currentSection = 'personal';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupFormValidation();
        this.setupPasswordStrength();
        this.setupAvatarUpload();
        this.setupModalHandlers();
    }

    // Navigation between sections
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.switchSection(section);
            });
        });
    }

    switchSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionName).classList.add('active');

        this.currentSection = sectionName;
    }

    // Form validation setup
    setupFormValidation() {
        const forms = document.querySelectorAll('.profile-form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.validateForm(form);
            });

            // Real-time validation
            const inputs = form.querySelectorAll('input, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
                input.addEventListener('input', () => {
                    this.clearError(input);
                });
            });
        });
    }

    validateForm(form) {
        const formId = form.id;
        let isValid = true;

        switch (formId) {
            case 'personalForm':
                isValid = this.validatePersonalForm(form);
                break;
            case 'securityForm':
                isValid = this.validateSecurityForm(form);
                break;
            case 'addressForm':
                isValid = this.validateAddressForm(form);
                break;
            case 'preferencesForm':
                isValid = this.validatePreferencesForm(form);
                break;
        }

        if (isValid) {
            this.submitForm(form);
        }
    }

    validatePersonalForm(form) {
        const firstName = form.querySelector('#firstName');
        const lastName = form.querySelector('#lastName');
        const email = form.querySelector('#email');
        const phone = form.querySelector('#phone');
        const birthDate = form.querySelector('#birthDate');

        let isValid = true;

        // First Name validation
        if (!firstName.value.trim()) {
            this.showError(firstName, 'First name is required');
            isValid = false;
        } else if (firstName.value.trim().length < 2) {
            this.showError(firstName, 'First name must be at least 2 characters');
            isValid = false;
        } else if (!/^[a-zA-Z\s]+$/.test(firstName.value.trim())) {
            this.showError(firstName, 'First name can only contain letters and spaces');
            isValid = false;
        }

        // Last Name validation
        if (!lastName.value.trim()) {
            this.showError(lastName, 'Last name is required');
            isValid = false;
        } else if (lastName.value.trim().length < 2) {
            this.showError(lastName, 'Last name must be at least 2 characters');
            isValid = false;
        } else if (!/^[a-zA-Z\s]+$/.test(lastName.value.trim())) {
            this.showError(lastName, 'Last name can only contain letters and spaces');
            isValid = false;
        }

        // Email validation
        if (!email.value.trim()) {
            this.showError(email, 'Email is required');
            isValid = false;
        } else if (!this.isValidEmail(email.value.trim())) {
            this.showError(email, 'Please enter a valid email address');
            isValid = false;
        }

        // Phone validation (optional but must be valid if provided)
        if (phone.value.trim() && !this.isValidPhone(phone.value.trim())) {
            this.showError(phone, 'Please enter a valid phone number');
            isValid = false;
        }

        // Birth date validation (optional but must be valid if provided)
        if (birthDate.value) {
            const today = new Date();
            const birth = new Date(birthDate.value);
            const age = today.getFullYear() - birth.getFullYear();
            
            if (birth > today) {
                this.showError(birthDate, 'Birth date cannot be in the future');
                isValid = false;
            } else if (age < 13) {
                this.showError(birthDate, 'You must be at least 13 years old');
                isValid = false;
            } else if (age > 120) {
                this.showError(birthDate, 'Please enter a valid birth date');
                isValid = false;
            }
        }

        return isValid;
    }

    validateSecurityForm(form) {
        const currentPassword = form.querySelector('#currentPassword');
        const newPassword = form.querySelector('#newPassword');
        const confirmPassword = form.querySelector('#confirmPassword');

        let isValid = true;

        // Current password validation
        if (!currentPassword.value) {
            this.showError(currentPassword, 'Current password is required');
            isValid = false;
        }

        // New password validation
        if (!newPassword.value) {
            this.showError(newPassword, 'New password is required');
            isValid = false;
        } else if (newPassword.value.length < 8) {
            this.showError(newPassword, 'Password must be at least 8 characters long');
            isValid = false;
        } else if (!this.isStrongPassword(newPassword.value)) {
            this.showError(newPassword, 'Password must contain uppercase, lowercase, number, and special character');
            isValid = false;
        }

        // Confirm password validation
        if (!confirmPassword.value) {
            this.showError(confirmPassword, 'Please confirm your password');
            isValid = false;
        } else if (newPassword.value !== confirmPassword.value) {
            this.showError(confirmPassword, 'Passwords do not match');
            isValid = false;
        }

        // Check if new password is different from current
        if (currentPassword.value && newPassword.value && currentPassword.value === newPassword.value) {
            this.showError(newPassword, 'New password must be different from current password');
            isValid = false;
        }

        return isValid;
    }

    validateAddressForm(form) {
        const requiredFields = ['addressName', 'fullName', 'street', 'city', 'state', 'zipCode', 'country'];
        let isValid = true;

        requiredFields.forEach(fieldName => {
            const field = form.querySelector(`#${fieldName}`);
            if (!field.value.trim()) {
                this.showError(field, `${this.formatFieldName(fieldName)} is required`);
                isValid = false;
            }
        });

        // ZIP code validation
        const zipCode = form.querySelector('#zipCode');
        if (zipCode.value.trim() && !this.isValidZipCode(zipCode.value.trim())) {
            this.showError(zipCode, 'Please enter a valid ZIP code');
            isValid = false;
        }

        return isValid;
    }

    validatePreferencesForm(form) {
        // Preferences form doesn't need validation as it's all checkboxes
        return true;
    }

    validateField(field) {
        const fieldName = field.name;
        const value = field.value.trim();

        switch (fieldName) {
            case 'firstName':
            case 'lastName':
                if (!value) {
                    this.showError(field, `${this.formatFieldName(fieldName)} is required`);
                } else if (value.length < 2) {
                    this.showError(field, `${this.formatFieldName(fieldName)} must be at least 2 characters`);
                } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                    this.showError(field, `${this.formatFieldName(fieldName)} can only contain letters and spaces`);
                }
                break;
            case 'email':
                if (!value) {
                    this.showError(field, 'Email is required');
                } else if (!this.isValidEmail(value)) {
                    this.showError(field, 'Please enter a valid email address');
                }
                break;
            case 'phone':
                if (value && !this.isValidPhone(value)) {
                    this.showError(field, 'Please enter a valid phone number');
                }
                break;
        }
    }

    // Password strength checker
    setupPasswordStrength() {
        const passwordInput = document.querySelector('#newPassword');
        if (passwordInput) {
            passwordInput.addEventListener('input', (e) => {
                this.updatePasswordStrength(e.target.value);
            });
        }
    }

    updatePasswordStrength(password) {
        const strengthFill = document.querySelector('#strengthFill');
        const strengthText = document.querySelector('#strengthText');
        
        if (!password) {
            strengthFill.style.width = '0%';
            strengthText.textContent = 'Password strength';
            return;
        }

        let strength = 0;
        let feedback = [];

        // Length check
        if (password.length >= 8) strength += 20;
        else feedback.push('at least 8 characters');

        // Uppercase check
        if (/[A-Z]/.test(password)) strength += 20;
        else feedback.push('uppercase letter');

        // Lowercase check
        if (/[a-z]/.test(password)) strength += 20;
        else feedback.push('lowercase letter');

        // Number check
        if (/\d/.test(password)) strength += 20;
        else feedback.push('number');

        // Special character check
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 20;
        else feedback.push('special character');

        // Update visual indicator
        strengthFill.style.width = `${strength}%`;
        
        let color, text;
        if (strength < 40) {
            color = 'hsl(0, 100%, 70%)'; // Red
            text = 'Weak';
        } else if (strength < 60) {
            color = 'hsl(29, 90%, 65%)'; // Orange
            text = 'Fair';
        } else if (strength < 80) {
            color = 'hsl(45, 100%, 55%)'; // Yellow
            text = 'Good';
        } else {
            color = 'hsl(152, 51%, 52%)'; // Green
            text = 'Strong';
        }

        strengthFill.style.backgroundColor = color;
        strengthText.textContent = feedback.length > 0 ? 
            `${text} - Add: ${feedback.join(', ')}` : 
            `${text} password`;
    }

    // Avatar upload handler
    setupAvatarUpload() {
        const avatarInput = document.querySelector('#avatarInput');
        const avatarImage = document.querySelector('#avatarImage');

        if (avatarInput) {
            avatarInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    if (file.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            avatarImage.src = e.target.result;
                            this.showToast('Profile picture updated successfully!');
                        };
                        reader.readAsDataURL(file);
                    } else {
                        this.showToast('Please select a valid image file', 'error');
                    }
                }
            });
        }
    }

    // Modal handlers
    setupModalHandlers() {
        const modal = document.querySelector('#addressModal');
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeAddressModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                this.closeAddressModal();
            }
        });
    }

    showAddressForm() {
        document.querySelector('#addressModal').classList.add('show');
        document.querySelector('#addressName').focus();
    }

    closeAddressModal() {
        document.querySelector('#addressModal').classList.remove('show');
        this.resetForm('addressForm');
    }

    editAddress(addressId) {
        this.showToast('Edit address functionality would be implemented here');
    }

    deleteAddress(addressId) {
        if (confirm('Are you sure you want to delete this address?')) {
            this.showToast('Address deleted successfully!');
        }
    }

    // Form submission
    submitForm(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Simulate API call
        setTimeout(() => {
            this.showToast('Changes saved successfully!');
            
            // Update profile name if personal form
            if (form.id === 'personalForm') {
                const profileName = document.querySelector('.profile-name');
                profileName.textContent = `${data.firstName} ${data.lastName}`;
            }
            
            // Close modal if address form
            if (form.id === 'addressForm') {
                this.closeAddressModal();
            }
        }, 1000);
    }

    resetForm(formId) {
        const form = document.querySelector(`#${formId}`);
        form.reset();
        this.clearAllErrors(form);
    }

    // Utility functions
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    isValidZipCode(zipCode) {
        const zipRegex = /^[0-9]{5}(?:-[0-9]{4})?$/;
        return zipRegex.test(zipCode);
    }

    isStrongPassword(password) {
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        return hasUppercase && hasLowercase && hasNumbers && hasSpecial && password.length >= 8;
    }

    formatFieldName(fieldName) {
        return fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    }

    showError(field, message) {
        field.classList.add('error');
        const errorElement = document.querySelector(`#${field.id}Error`);
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    clearError(field) {
        field.classList.remove('error');
        const errorElement = document.querySelector(`#${field.id}Error`);
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    clearAllErrors(form) {
        const errorInputs = form.querySelectorAll('.error');
        errorInputs.forEach(input => input.classList.remove('error'));
        
        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(message => message.textContent = '');
    }

    showToast(message, type = 'success') {
        const toast = document.querySelector('#successToast');
        const toastMessage = document.querySelector('#toastMessage');
        
        toastMessage.textContent = message;
        toast.classList.add('show');
        
        if (type === 'error') {
            toast.style.background = 'hsl(0, 100%, 70%)';
        } else {
            toast.style.background = 'hsl(152, 51%, 52%)';
        }
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Global functions for HTML event handlers
function showAddressForm() {
    profileManager.showAddressForm();
}

function closeAddressModal() {
    profileManager.closeAddressModal();
}

function editAddress(id) {
    profileManager.editAddress(id);
}

function deleteAddress(id) {
    profileManager.deleteAddress(id);
}

function resetForm(formId) {
    profileManager.resetForm(formId);
}

// Initialize the profile manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.profileManager = new ProfileManager();
});

// Additional utility functions
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 6) {
        value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    } else if (value.length >= 3) {
        value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
    }
    input.value = value;
}

// Auto-format phone number on input
document.addEventListener('DOMContentLoaded', () => {
    const phoneInput = document.querySelector('#phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            formatPhoneNumber(e.target);
        });
    }
});

// Form auto-save functionality (saves to localStorage)
function setupAutoSave() {
    const forms = document.querySelectorAll('.profile-form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select');
        
        inputs.forEach(input => {
            // Load saved data
            const savedValue = localStorage.getItem(`profile_${input.id}`);
            if (savedValue && input.type !== 'password') {
                input.value = savedValue;
            }
            
            // Save data on change
            input.addEventListener('change', () => {
                if (input.type !== 'password') {
                    localStorage.setItem(`profile_${input.id}`, input.value);
                }
            });
        });
    });
}

// Initialize auto-save
document.addEventListener('DOMContentLoaded', setupAutoSave);