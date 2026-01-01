// Text Utility Web App - JavaScript Logic

class TextUtilityApp {
    constructor() {
        this.textInput = document.getElementById('textInput');
        this.wordCountEl = document.getElementById('wordCount');
        this.charCountNoSpacesEl = document.getElementById('charCountNoSpaces');
        this.charCountWithSpacesEl = document.getElementById('charCountWithSpaces');
        this.readingTimeEl = document.getElementById('readingTime');
        this.toastEl = document.getElementById('toast');
        this.mobileStatsBtn = document.getElementById('mobileStatsBtn');
        this.statsSection = document.querySelector('.stats-section');

        this.init();
    }

    init() {
        // Event Listeners
        this.textInput.addEventListener('input', () => this.updateStats());
        this.textInput.addEventListener('paste', (e) => this.handlePaste(e));
        
        // Utility buttons
        document.querySelectorAll('.utility-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleUtilityAction(e));
        });

        // Action buttons
        document.getElementById('clearBtn').addEventListener('click', () => this.clearText());
        document.getElementById('pasteBtn').addEventListener('click', () => this.pasteFromClipboard());

        // Mobile stats toggle
        this.mobileStatsBtn.addEventListener('click', () => this.toggleMobileStats());

        // Theme switching
        this.initThemeSwitcher();

        // Initialize stats
        this.updateStats();
    }

    initThemeSwitcher() {
        const themeButtons = document.querySelectorAll('.theme-btn');
        const savedTheme = localStorage.getItem('app-theme') || 'default';
        
        // Set initial theme
        document.body.setAttribute('data-theme', savedTheme);
        
        // Update active button
        themeButtons.forEach(btn => {
            if (btn.dataset.theme === savedTheme) {
                btn.classList.add('active');
            }
        });

        // Add event listeners
        themeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const theme = e.currentTarget.dataset.theme;
                
                // Update body attribute
                document.body.setAttribute('data-theme', theme);
                
                // Update active state
                themeButtons.forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                
                // Save to localStorage
                localStorage.setItem('app-theme', theme);
                
                // Show theme change notification
                this.showToast(`Switched to ${theme} theme!`, 'success');
            });
        });
    }

    // Core Text Processing Functions
    getWordCount(text) {
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    }

    getCharCount(text, includeSpaces = true) {
        if (includeSpaces) {
            return text.length;
        } else {
            return text.replace(/\s/g, '').length;
        }
    }

    getReadingTime(text) {
        const words = this.getWordCount(text);
        const wordsPerMinute = 200; // Average reading speed
        const minutes = words / wordsPerMinute;
        
        if (minutes < 1) {
            return 'Less than 1 min';
        } else if (minutes < 2) {
            return '1 min';
        } else {
            return `${Math.ceil(minutes)} min`;
        }
    }

    updateStats() {
        const text = this.textInput.value;
        
        // Add loading animation
        this.addLoadingAnimation();
        
        // Use requestAnimationFrame for smooth updates
        requestAnimationFrame(() => {
            this.wordCountEl.textContent = this.getWordCount(text);
            this.charCountNoSpacesEl.textContent = this.getCharCount(text, false);
            this.charCountWithSpacesEl.textContent = this.getCharCount(text, true);
            this.readingTimeEl.textContent = this.getReadingTime(text);
            
            // Remove loading animation after a small delay
            setTimeout(() => {
                this.removeLoadingAnimation();
            }, 100);
        });
    }

    addLoadingAnimation() {
        document.querySelectorAll('.stat-value').forEach(el => {
            el.classList.add('loading');
        });
    }

    removeLoadingAnimation() {
        document.querySelectorAll('.stat-value').forEach(el => {
            el.classList.remove('loading');
        });
    }

    // Utility Actions
    handleUtilityAction(e) {
        const action = e.currentTarget.dataset.action;
        const text = this.textInput.value;

        let result = text;

        switch (action) {
            case 'uppercase':
                result = text.toUpperCase();
                break;
            case 'lowercase':
                result = text.toLowerCase();
                break;
            case 'capitalize':
                result = text.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
                break;
            case 'removeSpaces':
                result = text.replace(/\s+/g, ' ').trim();
                break;
            case 'removeLineBreaks':
                result = text.replace(/\r?\n|\r/g, ' ').replace(/\s+/g, ' ').trim();
                break;
            case 'reverse':
                result = text.split('').reverse().join('');
                break;
            case 'copy':
                this.copyToClipboard(text);
                return; // Don't update text
            case 'clearAll':
                this.clearText();
                return; // Don't update text
        }

        this.textInput.value = result;
        this.updateStats();
        this.showToast(`${action.charAt(0).toUpperCase() + action.slice(1)} applied!`);
    }

    // Clipboard Operations
    async copyToClipboard(text) {
        if (!text) {
            this.showToast('Nothing to copy!', 'error');
            return;
        }

        try {
            await navigator.clipboard.writeText(text);
            this.showToast('Copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy: ', err);
            this.showToast('Copy failed. Try manual copy.', 'error');
        }
    }

    async pasteFromClipboard() {
        try {
            const text = await navigator.clipboard.readText();
            if (text) {
                this.textInput.value = text;
                this.updateStats();
                this.showToast('Pasted from clipboard!');
            } else {
                this.showToast('Clipboard is empty!', 'error');
            }
        } catch (err) {
            console.error('Failed to read clipboard: ', err);
            this.showToast('Paste failed. Check permissions.', 'error');
        }
    }

    handlePaste(e) {
        // Allow normal paste behavior
        setTimeout(() => {
            this.updateStats();
        }, 0);
    }

    // Text Management
    clearText() {
        this.textInput.value = '';
        this.updateStats();
        this.textInput.focus();
        this.showToast('Text cleared!');
    }

    // UI Interactions
    showToast(message, type = 'success') {
        this.toastEl.textContent = message;
        this.toastEl.className = `toast ${type}`;
        this.toastEl.classList.add('show');

        setTimeout(() => {
            this.toastEl.classList.remove('show');
        }, 2000);
    }

    toggleMobileStats() {
        this.statsSection.classList.toggle('show');
        const isVisible = this.statsSection.classList.contains('show');
        this.mobileStatsBtn.textContent = isVisible ? '✕' : '📊';
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    new TextUtilityApp();
});

// Add some keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to clear
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        document.getElementById('clearBtn').click();
    }
    
    // Ctrl/Cmd + K to clear all
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        document.querySelector('[data-action="clearAll"]').click();
    }
    
    // Ctrl/Cmd + U for uppercase
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u') {
        e.preventDefault();
        document.querySelector('[data-action="uppercase"]').click();
    }
    
    // Ctrl/Cmd + L for lowercase
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        document.querySelector('[data-action="lowercase"]').click();
    }
    
    // Ctrl/Cmd + C for copy
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        // Only trigger if no text is selected
        if (window.getSelection().toString() === '') {
            e.preventDefault();
            document.querySelector('[data-action="copy"]').click();
        }
    }
});