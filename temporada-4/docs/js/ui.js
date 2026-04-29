/**
 * UI Module for Mission Tracker
 * Handles all UI rendering and interactions
 */

const UI = {
    // DOM Elements
    elements: {},

    /**
     * Initialize UI elements
     */
    init() {
        this.elements = {
            // Stats
            completedCount: document.getElementById('completedCount'),
            pendingCount: document.getElementById('pendingCount'),
            progressRing: document.getElementById('progressRing'),
            progressPercent: document.getElementById('progressPercent'),
            
            // Filters
            searchInput: document.getElementById('searchInput'),
            clearSearch: document.getElementById('clearSearch'),
            statusFilter: document.getElementById('statusFilter'),
            mapFilter: document.getElementById('mapFilter'),
            difficultyFilter: document.getElementById('difficultyFilter'),
            
            // View options
            viewList: document.getElementById('viewList'),
            viewGrid: document.getElementById('viewGrid'),
            viewCompact: document.getElementById('viewCompact'),
            
            // Quick nav
            quickNavButtons: document.getElementById('quickNavButtons'),
            
            // Missions
            missionsContainer: document.getElementById('missionsContainer'),
            missionsList: document.getElementById('missionsList'),
            emptyState: document.getElementById('emptyState'),
            
            // Mission modal
            missionModal: document.getElementById('missionModal'),
            modalTitle: document.getElementById('modalTitle'),
            modalBody: document.getElementById('modalBody'),
            modalClose: document.getElementById('modalClose'),
            modalCancel: document.getElementById('modalCancel'),
            modalToggle: document.getElementById('modalToggle'),
            
            // Confirm modal
            confirmModal: document.getElementById('confirmModal'),
            confirmMessage: document.getElementById('confirmMessage'),
            confirmCancel: document.getElementById('confirmCancel'),
            confirmOk: document.getElementById('confirmOk'),
            
            // Footer
            resetProgress: document.getElementById('resetProgress'),
            
            // Toast
            toastContainer: document.getElementById('toastContainer')
        };
    },

    /**
     * Update statistics display
     * @param {Object} stats 
     */
    updateStats(stats) {
        this.elements.completedCount.textContent = stats.completed;
        this.elements.pendingCount.textContent = stats.pending;
        this.elements.progressPercent.textContent = `${stats.percentage}%`;
        
        // Update progress ring
        this.elements.progressRing.setAttribute('stroke-dasharray', `${stats.percentage}, 100`);
    },

    /**
     * Render quick navigation buttons
     * @param {Array} missions 
     * @param {Set} completedIds 
     */
    renderQuickNav(missions, completedIds) {
        const container = this.elements.quickNavButtons;
        container.innerHTML = '';

        // Create buttons for every 5 missions
        const step = 5;
        for (let i = 0; i < missions.length; i += step) {
            const end = Math.min(i + step, missions.length);
            const startMission = missions[i];
            const endMission = missions[end - 1];
            
            // Check if all missions in range are completed
            let allCompleted = true;
            for (let j = i; j < end; j++) {
                if (!completedIds.has(missions[j].id)) {
                    allCompleted = false;
                    break;
                }
            }

            const btn = document.createElement('button');
            btn.className = `quick-nav-btn${allCompleted ? ' completed' : ''}`;
            btn.textContent = `#${startMission.id}-${endMission.id}`;
            btn.dataset.startId = startMission.id;
            btn.addEventListener('click', () => {
                const missionCard = document.querySelector(`[data-mission-id="${startMission.id}"]`);
                if (missionCard) {
                    Utils.scrollIntoView(missionCard);
                    missionCard.classList.add('highlight');
                    setTimeout(() => missionCard.classList.remove('highlight'), 1000);
                }
            });
            
            container.appendChild(btn);
        }
    },

    /**
     * Render mission cards
     * @param {Array} missions 
     * @param {Set} completedIds 
     */
    async renderMissions(missions, completedIds) {
        const container = this.elements.missionsList;
        container.innerHTML = '';

        if (missions.length === 0) {
            this.elements.emptyState.style.display = 'block';
            return;
        }

        this.elements.emptyState.style.display = 'none';

        for (const mission of missions) {
            const isCompleted = completedIds.has(mission.id);
            const card = await this.createMissionCard(mission, isCompleted);
            container.appendChild(card);
        }
    },

    /**
     * Create a mission card element
     * @param {Object} mission 
     * @param {boolean} isCompleted 
     * @returns {HTMLElement}
     */
    async createMissionCard(mission, isCompleted) {
        const card = document.createElement('div');
        card.className = `mission-card${isCompleted ? ' completed' : ''}`;
        card.dataset.missionId = mission.id;
        card.tabIndex = 0;

        // Map tags HTML
        const mapTags = mission.map.map(mapId => {
            const mapInfo = Utils.getMapInfo(mapId);
            return `<span class="map-tag ${mapInfo.color}">${mapInfo.name}</span>`;
        }).join('');

        // Difficulty badge
        const diffInfo = Utils.getDifficultyInfo(mission.difficulty);
        const diffBadge = `<span class="difficulty-badge ${diffInfo.color}">${diffInfo.name}</span>`;

        // Required items
        const requiredItemsHtml = mission.requiredItems.length > 0
            ? `<div class="required-items">
                ${mission.requiredItems.map(item => 
                    `<span class="required-item">${Utils.getIcon('item')}${item}</span>`
                ).join('')}
               </div>`
            : '';

        // Check for quantity-based tasks and build progress badges
        let progressBadgesHtml = '';
        const taskNotes = await missionDB.getMissionTaskNotes(mission.id);
        
        for (let i = 0; i < mission.tasks.length; i++) {
            const task = mission.tasks[i];
            const quantityMatch = task.match(/(\d+)\s*(diversos?|itens?|inimigos?|vezes?|minutos?|cofres?|contêineres?|caixas?|malas?|provisões?|armas?|mercenários?|peças?|chefes?)/i);
            
            if (quantityMatch) {
                const targetAmount = parseInt(quantityMatch[1]);
                const savedProgress = taskNotes[i] || '';
                
                // Try to parse current progress from saved note (e.g., "5/20" or just "5")
                let currentAmount = 0;
                const progressMatch = savedProgress.match(/^(\d+)/);
                if (progressMatch) {
                    currentAmount = parseInt(progressMatch[1]);
                }
                
                // Determine badge status
                let badgeClass = 'progress-badge';
                if (currentAmount >= targetAmount) {
                    badgeClass += ' complete';
                } else if (currentAmount > 0) {
                    badgeClass += ' in-progress';
                }
                
                progressBadgesHtml += `<span class="${badgeClass}" title="Tarefa ${i + 1}: ${task.substring(0, 50)}...">${Utils.getIcon('counter')}${currentAmount}/${targetAmount}</span>`;
            }
        }

        // Tasks preview (first task only)
        const tasksPreview = mission.tasks[0] || '';

        card.innerHTML = `
            <div class="mission-header">
                <div class="mission-info">
                    <span class="mission-number">${mission.id}</span>
                    <span class="mission-title">${mission.title}</span>
                </div>
                <button class="mission-checkbox" aria-label="Marcar como ${isCompleted ? 'pendente' : 'completa'}">
                    ${Utils.getIcon('check')}
                </button>
            </div>
            <div class="mission-body">
                <div class="mission-meta">
                    ${mapTags}
                    ${diffBadge}
                    <span class="task-count">${Utils.getIcon('task')}${mission.taskCount} tarefas</span>
                </div>
                ${progressBadgesHtml ? `<div class="progress-badges">${progressBadgesHtml}</div>` : ''}
                ${requiredItemsHtml}
                <p class="tasks-preview">${tasksPreview}</p>
            </div>
        `;

        return card;
    },

    /**
     * Update a single mission card
     * @param {number} missionId 
     * @param {boolean} isCompleted 
     */
    updateMissionCard(missionId, isCompleted) {
        const card = document.querySelector(`[data-mission-id="${missionId}"]`);
        if (!card) return;

        if (isCompleted) {
            card.classList.add('completed');
        } else {
            card.classList.remove('completed');
        }

        const checkbox = card.querySelector('.mission-checkbox');
        if (checkbox) {
            checkbox.setAttribute('aria-label', `Marcar como ${isCompleted ? 'pendente' : 'completa'}`);
        }
    },

    /**
     * Set active view mode
     * @param {string} view - 'list', 'grid', or 'compact'
     */
    setViewMode(view) {
        const { viewList, viewGrid, viewCompact, missionsList } = this.elements;
        
        // Update buttons
        [viewList, viewGrid, viewCompact].forEach(btn => btn.classList.remove('active'));
        
        // Update list class
        missionsList.classList.remove('view-list', 'view-grid', 'view-compact');
        
        switch (view) {
            case 'grid':
                viewGrid.classList.add('active');
                missionsList.classList.add('view-grid');
                break;
            case 'compact':
                viewCompact.classList.add('active');
                missionsList.classList.add('view-compact');
                break;
            default:
                viewList.classList.add('active');
                missionsList.classList.add('view-list');
        }

        // Save preference
        localStorage.setItem('viewMode', view);
    },

    /**
     * Open mission detail modal
     * @param {Object} mission 
     * @param {boolean} isCompleted 
     * @param {Array} allMissions - For finding related missions
     */
    openMissionModal(mission, isCompleted, allMissions) {
        const { missionModal, modalTitle, modalBody, modalToggle } = this.elements;

        modalTitle.textContent = `#${mission.id} - ${mission.title}`;
        
        // Build modal content
        let content = '';

        // Map info
        const mapTags = mission.map.map(mapId => {
            const mapInfo = Utils.getMapInfo(mapId);
            return `<span class="map-tag ${mapInfo.color}">${mapInfo.name}</span>`;
        }).join('');

        const diffInfo = Utils.getDifficultyInfo(mission.difficulty);

        content += `
            <div class="modal-section">
                <div class="modal-section-title">Informações</div>
                <div class="mission-meta" style="margin-bottom: var(--spacing-sm);">
                    ${mapTags}
                    <span class="difficulty-badge ${diffInfo.color}">${diffInfo.name}</span>
                </div>
            </div>
        `;

        // Required items
        if (mission.requiredItems.length > 0) {
            content += `
                <div class="modal-section">
                    <div class="modal-section-title">Itens Obrigatórios</div>
                    <div class="required-items">
                        ${mission.requiredItems.map(item => 
                            `<span class="required-item">${Utils.getIcon('item')}${item}</span>`
                        ).join('')}
                    </div>
                </div>
            `;
        }

        // Tasks
        content += `
            <div class="modal-section">
                <div class="modal-section-title">Tarefas (${mission.taskCount})</div>
                <div class="modal-tasks">
                    ${mission.tasks.map((task, index) => {
                        // Check if task involves collecting/delivering a quantity
                        const quantityMatch = task.match(/(\d+)\s*(diversos?|itens?|inimigos?|vezes?|minutos?|cofres?|contêineres?|caixas?|malas?|provisões?|armas?|mercenários?)/i);
                        const hasQuantity = quantityMatch !== null;
                        
                        return `
                            <div class="modal-task${hasQuantity ? ' has-counter' : ''}">
                                <span class="modal-task-number">${index + 1}</span>
                                <div class="modal-task-content">
                                    <span class="modal-task-text">${task}</span>
                                    ${hasQuantity ? `
                                        <div class="task-counter-wrapper">
                                            <label class="task-counter-label">Progresso:</label>
                                            <input type="text" 
                                                class="task-counter-input" 
                                                data-mission-id="${mission.id}" 
                                                data-task-index="${index}"
                                                placeholder="ex: 5/${quantityMatch[1]}"
                                                maxlength="20"
                                            />
                                            <span class="task-counter-hint">Meta: ${quantityMatch[1]}</span>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;

        // Can do together
        if (mission.canDoTogether.length > 0) {
            const relatedMissions = mission.canDoTogether.map(id => {
                const related = allMissions.find(m => m.id === id);
                return related ? `#${related.id} - ${related.title}` : `#${id}`;
            });

            content += `
                <div class="modal-section">
                    <div class="modal-section-title">Pode fazer junto com</div>
                    <div class="modal-together-list">
                        ${mission.canDoTogether.map(id => {
                            const related = allMissions.find(m => m.id === id);
                            const title = related ? related.title : `Missão ${id}`;
                            return `<button class="modal-together-item" data-mission-id="${id}">#${id} - ${title}</button>`;
                        }).join('')}
                    </div>
                </div>
            `;
        }

        // Notes section
        if (mission.notes) {
            content += `
                <div class="modal-section modal-notes">
                    <div class="modal-section-title">📝 Observações</div>
                    <p class="modal-notes-text">${mission.notes}</p>
                </div>
            `;
        }

        modalBody.innerHTML = content;

        // Load saved task notes/counters
        this.loadTaskNotes(mission.id);

        // Setup task counter event listeners
        this.setupTaskCounterListeners();

        // Update toggle button
        modalToggle.textContent = isCompleted ? 'Marcar como Pendente' : 'Marcar como Completa';
        modalToggle.className = `btn ${isCompleted ? 'btn-secondary' : 'btn-success'}`;
        modalToggle.dataset.missionId = mission.id;

        // Show modal
        missionModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    /**
     * Load task notes from database
     * @param {number} missionId 
     */
    async loadTaskNotes(missionId) {
        try {
            const notes = await missionDB.getMissionTaskNotes(missionId);
            const inputs = document.querySelectorAll('.task-counter-input[data-mission-id="' + missionId + '"]');
            
            inputs.forEach(input => {
                const taskIndex = parseInt(input.dataset.taskIndex);
                if (notes[taskIndex]) {
                    input.value = notes[taskIndex];
                }
            });
        } catch (error) {
            console.error('Failed to load task notes:', error);
        }
    },

    /**
     * Setup event listeners for task counter inputs
     */
    setupTaskCounterListeners() {
        const inputs = document.querySelectorAll('.task-counter-input');
        
        inputs.forEach(input => {
            // Save on blur (when user clicks away)
            input.addEventListener('blur', async (e) => {
                const missionId = parseInt(e.target.dataset.missionId);
                const taskIndex = parseInt(e.target.dataset.taskIndex);
                const value = e.target.value.trim();
                
                try {
                    if (value) {
                        await missionDB.saveTaskNote(missionId, taskIndex, value);
                    } else {
                        await missionDB.deleteTaskNote(missionId, taskIndex);
                    }
                } catch (error) {
                    console.error('Failed to save task note:', error);
                }
            });

            // Save on Enter key
            input.addEventListener('keydown', async (e) => {
                if (e.key === 'Enter') {
                    e.target.blur();
                }
            });
        });
    },

    /**
     * Close mission modal
     */
    closeMissionModal() {
        this.elements.missionModal.classList.remove('active');
        document.body.style.overflow = '';
    },

    /**
     * Open confirmation modal
     * @param {string} message 
     * @param {Function} onConfirm 
     */
    openConfirmModal(message, onConfirm) {
        const { confirmModal, confirmMessage, confirmOk } = this.elements;
        
        confirmMessage.textContent = message;
        confirmOk.onclick = () => {
            this.closeConfirmModal();
            onConfirm();
        };
        
        confirmModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    /**
     * Close confirmation modal
     */
    closeConfirmModal() {
        this.elements.confirmModal.classList.remove('active');
        document.body.style.overflow = '';
    },

    /**
     * Show toast notification
     * @param {string} title 
     * @param {string} message 
     * @param {string} type - 'success', 'error', 'info', 'warning'
     * @param {number} duration - Duration in ms
     */
    showToast(title, message = '', type = 'info', duration = 4000) {
        const container = this.elements.toastContainer;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        toast.innerHTML = `
            <span class="toast-icon">${Utils.getIcon(type)}</span>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                ${message ? `<div class="toast-message">${message}</div>` : ''}
            </div>
            <button class="toast-close" aria-label="Fechar">×</button>
        `;

        // Close button handler
        toast.querySelector('.toast-close').addEventListener('click', () => {
            this.removeToast(toast);
        });

        container.appendChild(toast);

        // Auto remove after duration
        setTimeout(() => {
            this.removeToast(toast);
        }, duration);
    },

    /**
     * Remove toast with animation
     * @param {HTMLElement} toast 
     */
    removeToast(toast) {
        if (!toast || toast.classList.contains('hiding')) return;
        
        toast.classList.add('hiding');
        setTimeout(() => {
            toast.remove();
        }, 300);
    },

    /**
     * Set active status filter
     * @param {string} filter 
     */
    setActiveStatusFilter(filter) {
        const buttons = this.elements.statusFilter.querySelectorAll('.filter-btn');
        buttons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
    },

    /**
     * Get current filters
     * @returns {Object}
     */
    getCurrentFilters() {
        const activeStatusBtn = this.elements.statusFilter.querySelector('.filter-btn.active');
        
        return {
            search: this.elements.searchInput.value.trim(),
            status: activeStatusBtn?.dataset.filter || 'all',
            map: this.elements.mapFilter.value,
            difficulty: this.elements.difficultyFilter.value
        };
    },

    /**
     * Clear all filters
     */
    clearFilters() {
        this.elements.searchInput.value = '';
        this.setActiveStatusFilter('all');
        this.elements.mapFilter.value = 'all';
        this.elements.difficultyFilter.value = 'all';
    }
};
