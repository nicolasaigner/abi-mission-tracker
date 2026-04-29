/**
 * Utility functions for Mission Tracker
 */

const Utils = {
    /**
     * Debounce function to limit execution rate
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {Function}
     */
    debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Get map display info
     * @param {string} mapId 
     * @returns {Object}
     */
    getMapInfo(mapId) {
        const maps = {
            fazenda: { name: 'Fazenda', color: 'fazenda' },
            vale: { name: 'Vale', color: 'vale' },
            northridge: { name: 'Northridge', color: 'northridge' },
            arsenal: { name: 'Arsenal', color: 'arsenal' },
            tvstation: { name: 'Estação de TV', color: 'tvstation' },
            aeroporto: { name: 'Aeroporto', color: 'aeroporto' }
        };
        return maps[mapId] || { name: mapId, color: 'default' };
    },

    /**
     * Get difficulty display info
     * @param {string} difficulty 
     * @returns {Object}
     */
    getDifficultyInfo(difficulty) {
        const difficulties = {
            easy: { name: 'Fácil', color: 'easy' },
            normal: { name: 'Normal', color: 'normal' },
            hard: { name: 'Difícil', color: 'hard' }
        };
        return difficulties[difficulty] || { name: difficulty, color: 'normal' };
    },

    /**
     * Format date to locale string
     * @param {string} dateString 
     * @returns {string}
     */
    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    /**
     * Create element with attributes and children
     * @param {string} tag 
     * @param {Object} attrs 
     * @param {Array|string} children 
     * @returns {HTMLElement}
     */
    createElement(tag, attrs = {}, children = []) {
        const element = document.createElement(tag);
        
        Object.entries(attrs).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'dataset') {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue;
                });
            } else if (key.startsWith('on') && typeof value === 'function') {
                element.addEventListener(key.slice(2).toLowerCase(), value);
            } else {
                element.setAttribute(key, value);
            }
        });

        if (typeof children === 'string') {
            element.textContent = children;
        } else if (Array.isArray(children)) {
            children.forEach(child => {
                if (typeof child === 'string') {
                    element.appendChild(document.createTextNode(child));
                } else if (child instanceof HTMLElement) {
                    element.appendChild(child);
                }
            });
        }

        return element;
    },

    /**
     * Sanitize string for HTML display
     * @param {string} str 
     * @returns {string}
     */
    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    /**
     * Check if element is in viewport
     * @param {HTMLElement} element 
     * @returns {boolean}
     */
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    /**
     * Scroll element into view smoothly
     * @param {HTMLElement} element 
     * @param {Object} options 
     */
    scrollIntoView(element, options = {}) {
        const defaultOptions = {
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
        };
        element.scrollIntoView({ ...defaultOptions, ...options });
    },

    /**
     * Generate unique ID
     * @returns {string}
     */
    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    },

    /**
     * Load JSON file
     * @param {string} url 
     * @returns {Promise<Object>}
     */
    async loadJSON(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to load ${url}: ${response.status}`);
        }
        return response.json();
    },

    /**
     * Filter missions based on criteria
     * @param {Array} missions 
     * @param {Object} filters 
     * @param {Set} completedIds 
     * @returns {Array}
     */
    filterMissions(missions, filters, completedIds) {
        return missions.filter(mission => {
            // Search filter
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                const titleMatch = mission.title.toLowerCase().includes(searchLower);
                const titleEnMatch = mission.titleEn?.toLowerCase().includes(searchLower);
                const taskMatch = mission.tasks.some(task => 
                    task.toLowerCase().includes(searchLower)
                );
                const idMatch = mission.id.toString() === filters.search;
                
                if (!titleMatch && !titleEnMatch && !taskMatch && !idMatch) {
                    return false;
                }
            }

            // Status filter
            const isCompleted = completedIds.has(mission.id);
            if (filters.status === 'completed' && !isCompleted) return false;
            if (filters.status === 'pending' && isCompleted) return false;

            // Map filter
            if (filters.map && filters.map !== 'all') {
                if (!mission.map.includes(filters.map)) return false;
            }

            // Difficulty filter
            if (filters.difficulty && filters.difficulty !== 'all') {
                if (mission.difficulty !== filters.difficulty) return false;
            }

            return true;
        });
    },

    /**
     * Sort missions
     * @param {Array} missions 
     * @param {string} sortBy 
     * @returns {Array}
     */
    sortMissions(missions, sortBy = 'id') {
        return [...missions].sort((a, b) => {
            switch (sortBy) {
                case 'id':
                    return a.id - b.id;
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'map':
                    return a.map[0].localeCompare(b.map[0]);
                case 'difficulty':
                    const diffOrder = { easy: 0, normal: 1, hard: 2 };
                    return diffOrder[a.difficulty] - diffOrder[b.difficulty];
                default:
                    return 0;
            }
        });
    },

    /**
     * Get SVG icon
     * @param {string} name 
     * @returns {string}
     */
    getIcon(name) {
        const icons = {
            check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
            task: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>',
            item: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>',
            link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>',
            success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
            error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
            info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
            warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
            counter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line><text x="12" y="12" text-anchor="middle" font-size="8" fill="currentColor" stroke="none">#</text></svg>'
        };
        return icons[name] || '';
    }
};
