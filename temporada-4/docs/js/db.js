/**
 * IndexedDB Module for Mission Tracker
 * Handles all database operations for storing user progress
 */

const DB_NAME = 'MissionTrackerDB';
const DB_VERSION = 2;
const STORE_NAME = 'missions';
const NOTES_STORE = 'taskNotes';

class MissionDatabase {
    constructor() {
        this.db = null;
        this.isReady = false;
    }

    /**
     * Initialize the database connection
     * @returns {Promise<void>}
     */
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => {
                console.error('Failed to open database:', request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                this.isReady = true;
                console.log('Database initialized successfully');
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create object store for mission progress
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                    store.createIndex('completed', 'completed', { unique: false });
                    store.createIndex('completedAt', 'completedAt', { unique: false });
                    console.log('Object store created');
                }

                // Create object store for task notes/progress counters
                if (!db.objectStoreNames.contains(NOTES_STORE)) {
                    const notesStore = db.createObjectStore(NOTES_STORE, { keyPath: 'taskKey' });
                    notesStore.createIndex('missionId', 'missionId', { unique: false });
                    console.log('Task notes store created');
                }
            };
        });
    }

    /**
     * Get a transaction for a store
     * @param {string} storeName - Store name
     * @param {string} mode - 'readonly' or 'readwrite'
     * @returns {IDBObjectStore}
     */
    getStoreByName(storeName, mode = 'readonly') {
        const transaction = this.db.transaction([storeName], mode);
        return transaction.objectStore(storeName);
    }

    /**
     * Get a transaction for the missions store
     * @param {string} mode - 'readonly' or 'readwrite'
     * @returns {IDBObjectStore}
     */
    getStore(mode = 'readonly') {
        const transaction = this.db.transaction([STORE_NAME], mode);
        return transaction.objectStore(STORE_NAME);
    }

    /**
     * Get the completion status of a mission
     * @param {number} missionId 
     * @returns {Promise<Object|null>}
     */
    async getMissionStatus(missionId) {
        return new Promise((resolve, reject) => {
            const store = this.getStore('readonly');
            const request = store.get(missionId);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result || null);
        });
    }

    /**
     * Get all completed missions
     * @returns {Promise<Object[]>}
     */
    async getAllMissions() {
        return new Promise((resolve, reject) => {
            const store = this.getStore('readonly');
            const request = store.getAll();

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result || []);
        });
    }

    /**
     * Get completed mission IDs
     * @returns {Promise<Set<number>>}
     */
    async getCompletedMissionIds() {
        const missions = await this.getAllMissions();
        return new Set(
            missions
                .filter(m => m.completed)
                .map(m => m.id)
        );
    }

    /**
     * Mark a mission as completed
     * @param {number} missionId 
     * @returns {Promise<void>}
     */
    async completeMission(missionId) {
        return new Promise((resolve, reject) => {
            const store = this.getStore('readwrite');
            const data = {
                id: missionId,
                completed: true,
                completedAt: new Date().toISOString()
            };
            const request = store.put(data);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }

    /**
     * Mark a mission as not completed
     * @param {number} missionId 
     * @returns {Promise<void>}
     */
    async uncompleteMission(missionId) {
        return new Promise((resolve, reject) => {
            const store = this.getStore('readwrite');
            const data = {
                id: missionId,
                completed: false,
                completedAt: null
            };
            const request = store.put(data);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }

    /**
     * Toggle mission completion status
     * @param {number} missionId 
     * @returns {Promise<boolean>} - Returns new completion status
     */
    async toggleMission(missionId) {
        const current = await this.getMissionStatus(missionId);
        const newStatus = !(current?.completed);
        
        if (newStatus) {
            await this.completeMission(missionId);
        } else {
            await this.uncompleteMission(missionId);
        }
        
        return newStatus;
    }

    /**
     * Reset all progress
     * @returns {Promise<void>}
     */
    async resetAllProgress() {
        return new Promise((resolve, reject) => {
            const store = this.getStore('readwrite');
            const request = store.clear();

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }

    /**
     * Get completion statistics
     * @param {number} totalMissions - Total number of missions
     * @returns {Promise<Object>}
     */
    async getStats(totalMissions) {
        const completedIds = await this.getCompletedMissionIds();
        const completed = completedIds.size;
        const pending = totalMissions - completed;
        const percentage = totalMissions > 0 
            ? Math.round((completed / totalMissions) * 100) 
            : 0;

        return {
            completed,
            pending,
            total: totalMissions,
            percentage
        };
    }

    /**
     * Export progress data
     * @returns {Promise<string>} - JSON string of progress data
     */
    async exportProgress() {
        const missions = await this.getAllMissions();
        return JSON.stringify({
            exportedAt: new Date().toISOString(),
            missions
        }, null, 2);
    }

    /**
     * Import progress data
     * @param {string} jsonData - JSON string of progress data
     * @returns {Promise<number>} - Number of missions imported
     */
    async importProgress(jsonData) {
        const data = JSON.parse(jsonData);
        const missions = data.missions || [];
        
        const store = this.getStore('readwrite');
        let count = 0;

        for (const mission of missions) {
            await new Promise((resolve, reject) => {
                const request = store.put(mission);
                request.onerror = () => reject(request.error);
                request.onsuccess = () => {
                    count++;
                    resolve();
                };
            });
        }

        return count;
    }

    // ==========================================
    // Task Notes / Progress Counter Methods
    // ==========================================

    /**
     * Save a task note/counter
     * @param {number} missionId - Mission ID
     * @param {number} taskIndex - Task index (0-based)
     * @param {string} note - The note or counter value
     * @returns {Promise<void>}
     */
    async saveTaskNote(missionId, taskIndex, note) {
        return new Promise((resolve, reject) => {
            const store = this.getStoreByName(NOTES_STORE, 'readwrite');
            const taskKey = `${missionId}_${taskIndex}`;
            const data = {
                taskKey,
                missionId,
                taskIndex,
                note,
                updatedAt: new Date().toISOString()
            };
            const request = store.put(data);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }

    /**
     * Get a task note/counter
     * @param {number} missionId - Mission ID
     * @param {number} taskIndex - Task index (0-based)
     * @returns {Promise<string|null>}
     */
    async getTaskNote(missionId, taskIndex) {
        return new Promise((resolve, reject) => {
            const store = this.getStoreByName(NOTES_STORE, 'readonly');
            const taskKey = `${missionId}_${taskIndex}`;
            const request = store.get(taskKey);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                const result = request.result;
                resolve(result ? result.note : null);
            };
        });
    }

    /**
     * Get all task notes for a mission
     * @param {number} missionId - Mission ID
     * @returns {Promise<Object>} - Object with taskIndex as key and note as value
     */
    async getMissionTaskNotes(missionId) {
        return new Promise((resolve, reject) => {
            const store = this.getStoreByName(NOTES_STORE, 'readonly');
            const index = store.index('missionId');
            const request = index.getAll(missionId);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                const notes = {};
                (request.result || []).forEach(item => {
                    notes[item.taskIndex] = item.note;
                });
                resolve(notes);
            };
        });
    }

    /**
     * Delete a task note
     * @param {number} missionId - Mission ID
     * @param {number} taskIndex - Task index (0-based)
     * @returns {Promise<void>}
     */
    async deleteTaskNote(missionId, taskIndex) {
        return new Promise((resolve, reject) => {
            const store = this.getStoreByName(NOTES_STORE, 'readwrite');
            const taskKey = `${missionId}_${taskIndex}`;
            const request = store.delete(taskKey);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }

    /**
     * Clear all task notes for a mission
     * @param {number} missionId - Mission ID
     * @returns {Promise<void>}
     */
    async clearMissionTaskNotes(missionId) {
        const notes = await this.getMissionTaskNotes(missionId);
        const store = this.getStoreByName(NOTES_STORE, 'readwrite');
        
        for (const taskIndex of Object.keys(notes)) {
            const taskKey = `${missionId}_${taskIndex}`;
            await new Promise((resolve, reject) => {
                const request = store.delete(taskKey);
                request.onerror = () => reject(request.error);
                request.onsuccess = () => resolve();
            });
        }
    }

    /**
     * Save previous task notes (backup before auto-fill)
     * @param {number} missionId - Mission ID
     * @param {Object} notes - Object with taskIndex as key and note as value
     * @returns {Promise<void>}
     */
    async savePreviousNotes(missionId, notes) {
        localStorage.setItem(`mission_backup_${missionId}`, JSON.stringify(notes));
    }

    /**
     * Get previous task notes (restore after uncomplete)
     * @param {number} missionId - Mission ID
     * @returns {Object|null}
     */
    getPreviousNotes(missionId) {
        const backup = localStorage.getItem(`mission_backup_${missionId}`);
        return backup ? JSON.parse(backup) : null;
    }

    /**
     * Clear previous task notes backup
     * @param {number} missionId - Mission ID
     */
    clearPreviousNotes(missionId) {
        localStorage.removeItem(`mission_backup_${missionId}`);
    }
}

// Export singleton instance
const missionDB = new MissionDatabase();
