/**
 * Main Application for Mission Tracker
 * Entry point that ties all modules together
 */

class MissionTrackerApp {
    constructor() {
        this.missions = [];
        this.completedIds = new Set();
        this.currentMission = null;
        this.isInitialized = false;
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            // Initialize database
            await missionDB.init();

            // Initialize UI
            UI.init();

            // Load missions data
            await this.loadMissions();

            // Load user progress
            await this.loadProgress();

            // Setup event listeners
            this.setupEventListeners();

            // Initial render
            this.render();

            // Restore view mode preference
            const savedView = localStorage.getItem('viewMode') || 'list';
            UI.setViewMode(savedView);

            this.isInitialized = true;
            console.log('Application initialized successfully');

        } catch (error) {
            console.error('Failed to initialize application:', error);
            UI.showToast('Erro', 'Falha ao inicializar a aplicação', 'error');
        }
    }

    /**
     * Load missions from embedded data
     */
    async loadMissions() {
        try {
            // Use embedded data to avoid CORS issues with file:// protocol
            if (typeof MISSIONS_DATA === 'undefined') {
                throw new Error('MISSIONS_DATA not found. Make sure missions-data.js is loaded.');
            }
            this.missions = MISSIONS_DATA.missions || [];
            console.log(`Loaded ${this.missions.length} missions`);
        } catch (error) {
            console.error('Failed to load missions:', error);
            throw error;
        }
    }

    /**
     * Load user progress from IndexedDB
     */
    async loadProgress() {
        try {
            this.completedIds = await missionDB.getCompletedMissionIds();
            console.log(`Loaded ${this.completedIds.size} completed missions`);
        } catch (error) {
            console.error('Failed to load progress:', error);
            throw error;
        }
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Search input
        UI.elements.searchInput.addEventListener('input', 
            Utils.debounce(() => this.render(), 200)
        );

        // Clear search
        UI.elements.clearSearch.addEventListener('click', () => {
            UI.elements.searchInput.value = '';
            this.render();
        });

        // Status filter buttons
        UI.elements.statusFilter.addEventListener('click', (e) => {
            const btn = e.target.closest('.filter-btn');
            if (!btn) return;
            UI.setActiveStatusFilter(btn.dataset.filter);
            this.render();
        });

        // Map filter
        UI.elements.mapFilter.addEventListener('change', () => this.render());

        // Difficulty filter
        UI.elements.difficultyFilter.addEventListener('change', () => this.render());

        // View mode buttons
        UI.elements.viewList.addEventListener('click', () => UI.setViewMode('list'));
        UI.elements.viewGrid.addEventListener('click', () => UI.setViewMode('grid'));
        UI.elements.viewCompact.addEventListener('click', () => UI.setViewMode('compact'));

        // Mission list click handler (event delegation)
        UI.elements.missionsList.addEventListener('click', (e) => {
            const card = e.target.closest('.mission-card');
            if (!card) return;

            const missionId = parseInt(card.dataset.missionId);
            const mission = this.missions.find(m => m.id === missionId);
            if (!mission) return;

            // Check if checkbox was clicked
            const checkbox = e.target.closest('.mission-checkbox');
            if (checkbox) {
                this.toggleMission(missionId);
                return;
            }

            // Open modal for details
            this.openMissionDetail(mission);
        });

        // Mission list keyboard handler
        UI.elements.missionsList.addEventListener('keydown', (e) => {
            const card = e.target.closest('.mission-card');
            if (!card) return;

            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const missionId = parseInt(card.dataset.missionId);
                const mission = this.missions.find(m => m.id === missionId);
                if (mission) {
                    if (e.key === ' ') {
                        this.toggleMission(missionId);
                    } else {
                        this.openMissionDetail(mission);
                    }
                }
            }
        });

        // Modal close handlers
        UI.elements.modalClose.addEventListener('click', () => UI.closeMissionModal());
        UI.elements.modalCancel.addEventListener('click', () => UI.closeMissionModal());
        UI.elements.missionModal.addEventListener('click', (e) => {
            if (e.target === UI.elements.missionModal) {
                UI.closeMissionModal();
            }
        });

        // Modal toggle button
        UI.elements.modalToggle.addEventListener('click', async () => {
            const missionId = parseInt(UI.elements.modalToggle.dataset.missionId);
            if (missionId) {
                await this.toggleMission(missionId);
                UI.closeMissionModal();
            }
        });

        // Modal body click handler for related missions
        UI.elements.modalBody.addEventListener('click', (e) => {
            const togetherItem = e.target.closest('.modal-together-item');
            if (togetherItem) {
                const missionId = parseInt(togetherItem.dataset.missionId);
                const mission = this.missions.find(m => m.id === missionId);
                if (mission) {
                    UI.closeMissionModal();
                    setTimeout(() => this.openMissionDetail(mission), 300);
                }
            }
        });

        // Confirm modal handlers
        UI.elements.confirmCancel.addEventListener('click', () => UI.closeConfirmModal());
        UI.elements.confirmModal.addEventListener('click', (e) => {
            if (e.target === UI.elements.confirmModal) {
                UI.closeConfirmModal();
            }
        });

        // Reset progress button
        UI.elements.resetProgress.addEventListener('click', () => {
            UI.openConfirmModal(
                'Tem certeza que deseja resetar todo o progresso? Esta ação não pode ser desfeita.',
                () => this.resetProgress()
            );
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Escape to close modals
            if (e.key === 'Escape') {
                if (UI.elements.missionModal.classList.contains('active')) {
                    UI.closeMissionModal();
                } else if (UI.elements.confirmModal.classList.contains('active')) {
                    UI.closeConfirmModal();
                }
            }

            // Ctrl+F to focus search
            if (e.ctrlKey && e.key === 'f') {
                e.preventDefault();
                UI.elements.searchInput.focus();
            }
        });
    }

    /**
     * Toggle mission completion status
     * @param {number} missionId 
     */
    async toggleMission(missionId) {
        try {
            const mission = this.missions.find(m => m.id === missionId);
            const newStatus = await missionDB.toggleMission(missionId);
            
            if (newStatus) {
                this.completedIds.add(missionId);
                
                // Auto-fill progress counters when marking as complete
                if (mission) {
                    await this.autoFillProgressCounters(mission);
                }
            } else {
                this.completedIds.delete(missionId);
                
                // Restore previous progress counters when uncompleting
                if (mission) {
                    await this.restoreProgressCounters(mission);
                }
            }

            // Update UI - need to re-render card to show updated badges
            await this.render();
            UI.renderQuickNav(this.missions, this.completedIds);

            // Show toast
            const missionName = mission ? mission.title : `Missão #${missionId}`;
            
            if (newStatus) {
                UI.showToast('Missão Completa!', missionName, 'success');
            } else {
                UI.showToast('Missão Desmarcada', missionName, 'info');
            }

        } catch (error) {
            console.error('Failed to toggle mission:', error);
            UI.showToast('Erro', 'Falha ao atualizar missão', 'error');
        }
    }

    /**
     * Auto-fill progress counters when mission is marked complete
     * @param {Object} mission 
     */
    async autoFillProgressCounters(mission) {
        // Backup current notes before auto-filling
        const currentNotes = await missionDB.getMissionTaskNotes(mission.id);
        await missionDB.savePreviousNotes(mission.id, currentNotes);

        // Regex to find quantity-based tasks
        const quantityRegex = /(\d+)\s*(diversos?|itens?|inimigos?|vezes?|minutos?|cofres?|contêineres?|caixas?|malas?|provisões?|armas?|mercenários?|peças?|chefes?)/i;

        for (let i = 0; i < mission.tasks.length; i++) {
            const task = mission.tasks[i];
            const match = task.match(quantityRegex);
            
            if (match) {
                const targetAmount = parseInt(match[1]);
                // Auto-fill with max value (e.g., "20/20")
                await missionDB.saveTaskNote(mission.id, i, `${targetAmount}/${targetAmount}`);
            }
        }
    }

    /**
     * Restore progress counters when mission is unmarked
     * @param {Object} mission 
     */
    async restoreProgressCounters(mission) {
        const previousNotes = missionDB.getPreviousNotes(mission.id);
        
        if (previousNotes) {
            // Restore each saved note
            for (const [taskIndex, note] of Object.entries(previousNotes)) {
                await missionDB.saveTaskNote(mission.id, parseInt(taskIndex), note);
            }
            
            // Clear the backup
            missionDB.clearPreviousNotes(mission.id);
        } else {
            // No backup exists, clear the auto-filled values
            const quantityRegex = /(\d+)\s*(diversos?|itens?|inimigos?|vezes?|minutos?|cofres?|contêineres?|caixas?|malas?|provisões?|armas?|mercenários?|peças?|chefes?)/i;
            
            for (let i = 0; i < mission.tasks.length; i++) {
                const task = mission.tasks[i];
                if (task.match(quantityRegex)) {
                    await missionDB.deleteTaskNote(mission.id, i);
                }
            }
        }
    }

    /**
     * Open mission detail modal
     * @param {Object} mission 
     */
    openMissionDetail(mission) {
        this.currentMission = mission;
        const isCompleted = this.completedIds.has(mission.id);
        UI.openMissionModal(mission, isCompleted, this.missions);
    }

    /**
     * Reset all progress
     */
    async resetProgress() {
        try {
            await missionDB.resetAllProgress();
            this.completedIds.clear();
            this.render();
            UI.showToast('Progresso Resetado', 'Todo o progresso foi removido', 'warning');
        } catch (error) {
            console.error('Failed to reset progress:', error);
            UI.showToast('Erro', 'Falha ao resetar progresso', 'error');
        }
    }

    /**
     * Update statistics display
     */
    async updateStats() {
        const stats = await missionDB.getStats(this.missions.length);
        UI.updateStats(stats);
    }

    /**
     * Render the application
     */
    async render() {
        // Get current filters
        const filters = UI.getCurrentFilters();

        // Filter missions
        const filteredMissions = Utils.filterMissions(
            this.missions,
            filters,
            this.completedIds
        );

        // Sort missions
        const sortedMissions = Utils.sortMissions(filteredMissions, 'id');

        // Render missions (async due to progress badges loading from IndexedDB)
        await UI.renderMissions(sortedMissions, this.completedIds);

        // Update stats
        await this.updateStats();

        // Update quick nav
        UI.renderQuickNav(this.missions, this.completedIds);
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new MissionTrackerApp();
    app.init();

    // Make app accessible globally for debugging
    window.missionTracker = app;
});
