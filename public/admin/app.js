// Hair Diagnostic Calibration Tool - Professional Interface
class HairDiagnosticCalibrator {
    constructor() {
        this.selectedHairCount = null;
        this.selectedConfidence = 85;
        this.customMessage = '';
        this.isTransmitting = false;
        
        this.init();
    }
    
    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupApplication();
            });
        } else {
            this.setupApplication();
        }
    }
    
    setupApplication() {
        this.setupElements();
        this.setupEventListeners();
        this.updateLastSync();
        this.loadSavedSettings();
        
        console.log('Hair Diagnostic Calibrator initialized');
    }
    
    setupElements() {
        this.elements = {
            // Scenario buttons
            scenarioBtns: document.querySelectorAll('.scenario-btn'),
            
            // Form elements
            hairCountInput: document.getElementById('hairCountInput'),
            confidenceSlider: document.getElementById('confidenceSlider'),
            confidenceValue: document.getElementById('confidenceValue'),
            customMessage: document.getElementById('customMessage'),
            
            // Display elements
            displayCount: document.getElementById('displayCount'),
            displayConfidence: document.getElementById('displayConfidence'),
            
            // Control elements
            sendDataBtn: document.getElementById('sendDataBtn'),
            transmissionStatus: document.getElementById('transmissionStatus'),
            transmissionTime: document.getElementById('transmissionTime'),
            
            // Info elements
            lastSync: document.getElementById('lastSync'),
            statusIndicator: document.getElementById('statusIndicator')
        };
    }
    
    setupEventListeners() {
        // Scenario button events
        this.elements.scenarioBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.selectScenario(btn);
            });
        });
        
        // Manual input events - Fix for bug #1
        if (this.elements.hairCountInput) {
            this.elements.hairCountInput.addEventListener('input', (e) => {
                this.handleManualInput(e.target.value);
            });
            
            // Also handle paste events
            this.elements.hairCountInput.addEventListener('paste', (e) => {
                setTimeout(() => {
                    this.handleManualInput(e.target.value);
                }, 10);
            });
        }
        
        if (this.elements.confidenceSlider) {
            this.elements.confidenceSlider.addEventListener('input', (e) => {
                this.updateConfidenceDisplay(e.target.value);
                this.selectedConfidence = parseInt(e.target.value);
                this.updateDisplay();
            });
        }
        
        if (this.elements.customMessage) {
            this.elements.customMessage.addEventListener('input', (e) => {
                this.customMessage = e.target.value;
            });
        }
        
        // Send button event
        if (this.elements.sendDataBtn) {
            this.elements.sendDataBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.transmitCalibrationData();
            });
        }
        
        // Auto-save settings
        setInterval(() => {
            this.saveSettings();
        }, 5000);
        
        console.log('Event listeners setup complete');
    }
    
    selectScenario(btn) {
        // Clear previous selections
        this.elements.scenarioBtns.forEach(b => b.classList.remove('selected'));
        
        // Select current button
        btn.classList.add('selected');
        
        // Get scenario data
        const count = parseInt(btn.dataset.count);
        const confidence = parseInt(btn.dataset.confidence);
        
        // Update internal state
        this.selectedHairCount = count;
        this.selectedConfidence = confidence;
        
        // Clear manual input when selecting scenario
        if (this.elements.hairCountInput) {
            this.elements.hairCountInput.value = '';
        }
        
        // Update confidence slider
        if (this.elements.confidenceSlider) {
            this.elements.confidenceSlider.value = confidence;
            this.updateConfidenceDisplay(confidence);
        }
        
        // Update display
        this.updateDisplay();
        
        console.log('Selected scenario:', { count, confidence });
    }
    
    // Fixed handleManualInput function for bug #1
    handleManualInput(inputValue) {
        // Always clear scenario selections when typing in manual input
        this.elements.scenarioBtns.forEach(btn => btn.classList.remove('selected'));
        
        if (inputValue && inputValue.toString().trim() !== '') {
            // Parse and validate the input
            const parsedValue = parseInt(inputValue);
            
            if (!isNaN(parsedValue) && parsedValue >= 5000 && parsedValue <= 200000) {
                // Use valid manual input
                this.selectedHairCount = parsedValue;
                console.log('Manual input set:', this.selectedHairCount);
            } else {
                // Invalid input - clear selection
                this.selectedHairCount = null;
            }
        } else {
            // Empty input - clear selection
            this.selectedHairCount = null;
        }
        
        this.updateDisplay();
    }
    
    updateConfidenceDisplay(value) {
        if (this.elements.confidenceValue) {
            this.elements.confidenceValue.textContent = value;
        }
    }
    
    updateDisplay() {
        // Update hair count display
        if (this.elements.displayCount) {
            if (this.selectedHairCount !== null) {
                this.elements.displayCount.textContent = this.selectedHairCount.toLocaleString();
            } else {
                this.elements.displayCount.textContent = '--';
            }
        }
        
        // Update confidence display
        if (this.elements.displayConfidence) {
            this.elements.displayConfidence.textContent = `${this.selectedConfidence}%`;
        }
        
        // Update send button state
        if (this.elements.sendDataBtn) {
            const canSend = this.selectedHairCount !== null && !this.isTransmitting;
            this.elements.sendDataBtn.disabled = !canSend;
            
            if (canSend) {
                this.elements.sendDataBtn.classList.remove('disabled');
            } else {
                this.elements.sendDataBtn.classList.add('disabled');
            }
        }
    }
    
    async transmitCalibrationData() {
        if (this.selectedHairCount === null || this.isTransmitting) {
            return;
        }
        
        console.log('Transmitting calibration data...');
        this.isTransmitting = true;
        
        // Update button state
        const originalText = this.elements.sendDataBtn.querySelector('.btn-text').textContent;
        this.elements.sendDataBtn.querySelector('.btn-text').textContent = 'Transmitting...';
        this.elements.sendDataBtn.querySelector('.btn-icon').textContent = '⏳';
        this.elements.sendDataBtn.disabled = true;
        
        // Hide previous status - Fix for bug #2
        if (this.elements.transmissionStatus) {
            this.elements.transmissionStatus.classList.add('hidden');
        }
        
        // Prepare calibration data
        const calibrationData = {
            hairCount: this.selectedHairCount,
            confidence: this.selectedConfidence,
            customMessage: this.customMessage,
            timestamp: Date.now(),
            deviceId: 'HD-CAL-2024',
            firmwareVersion: 'v2.4.1'
        };
        
        try {
            // Simulate transmission delay
            await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

            // Send calibration data to backend API
            const response = await fetch('https://hair-counter.onrender.com/api/data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(calibrationData)
            });

            if (!response.ok) {
                throw new Error('Failed to transmit data to backend');
            }

            // Show success status - Enhanced for bug #2
            this.showTransmissionSuccess();

            // Update last sync time
            this.updateLastSync();

            console.log('Calibration data transmitted successfully to backend:', calibrationData);

        } catch (error) {
            console.error('Transmission error:', error);
            this.showTransmissionError();
        } finally {
            // Reset button state
            this.elements.sendDataBtn.querySelector('.btn-text').textContent = originalText;
            this.elements.sendDataBtn.querySelector('.btn-icon').textContent = '📤';
            this.elements.sendDataBtn.disabled = false;
            this.isTransmitting = false;
            this.updateDisplay(); // Refresh button state
        }
    }
    
    // Enhanced showTransmissionSuccess function for bug #2
    showTransmissionSuccess() {
        if (!this.elements.transmissionStatus) return;
        
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        // Reset any error styling
        const statusText = this.elements.transmissionStatus.querySelector('.status-text');
        if (statusText) {
            statusText.style.color = 'var(--color-success)';
        }
        
        // Update status content with clear success message
        this.elements.transmissionStatus.querySelector('.status-icon').textContent = '✅';
        this.elements.transmissionStatus.querySelector('.status-text').textContent = 'Calibration data transmitted successfully';
        
        if (this.elements.transmissionTime) {
            this.elements.transmissionTime.textContent = `Sent at ${timeString}`;
        }
        
        // Show status with animation
        this.elements.transmissionStatus.classList.remove('hidden');
        
        // Add emphasis animation
        this.elements.transmissionStatus.style.animation = 'fadeInUp 0.5s ease';
        
        // Update system status
        this.updateSystemStatus('Data transmission complete');
        
        // Auto-hide after 8 seconds (increased for better visibility)
        setTimeout(() => {
            if (this.elements.transmissionStatus && !this.elements.transmissionStatus.classList.contains('hidden')) {
                this.elements.transmissionStatus.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    this.elements.transmissionStatus.classList.add('hidden');
                    this.elements.transmissionStatus.style.animation = '';
                }, 300);
            }
        }, 8000);
        
        console.log('Success status displayed clearly');
    }
    
    showTransmissionError() {
        if (!this.elements.transmissionStatus) return;
        
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        // Update status content for error
        this.elements.transmissionStatus.querySelector('.status-icon').textContent = '❌';
        this.elements.transmissionStatus.querySelector('.status-text').textContent = 'Transmission failed - please retry';
        this.elements.transmissionStatus.querySelector('.status-text').style.color = 'var(--color-error)';
        
        if (this.elements.transmissionTime) {
            this.elements.transmissionTime.textContent = `Failed at ${timeString}`;
        }
        
        // Show status
        this.elements.transmissionStatus.classList.remove('hidden');
        
        // Update system status
        this.updateSystemStatus('Transmission error');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (this.elements.transmissionStatus) {
                this.elements.transmissionStatus.classList.add('hidden');
            }
        }, 5000);
    }
    
    updateLastSync() {
        if (this.elements.lastSync) {
            const now = new Date();
            const timeString = now.toLocaleString('en-US', {
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
            this.elements.lastSync.textContent = timeString;
        }
    }
    
    saveSettings() {
        try {
            const settings = {
                selectedHairCount: this.selectedHairCount,
                selectedConfidence: this.selectedConfidence,
                customMessage: this.customMessage,
                lastSaved: Date.now()
            };
            
            localStorage.setItem('calibratorSettings', JSON.stringify(settings));
        } catch (error) {
            console.log('Could not save settings:', error);
        }
    }
    
    loadSavedSettings() {
        try {
            const saved = localStorage.getItem('calibratorSettings');
            if (saved) {
                const settings = JSON.parse(saved);
                
                // Restore confidence if saved recently (within 1 hour)
                if (settings.lastSaved && (Date.now() - settings.lastSaved < 3600000)) {
                    if (settings.selectedConfidence) {
                        this.selectedConfidence = settings.selectedConfidence;
                        if (this.elements.confidenceSlider) {
                            this.elements.confidenceSlider.value = settings.selectedConfidence;
                            this.updateConfidenceDisplay(settings.selectedConfidence);
                        }
                    }
                    
                    if (settings.customMessage && this.elements.customMessage) {
                        this.elements.customMessage.value = settings.customMessage;
                        this.customMessage = settings.customMessage;
                    }
                }
            }
        } catch (error) {
            console.log('Could not load saved settings:', error);
        }
        
        // Always update display after loading
        this.updateDisplay();
    }
    
    // Diagnostic functions for professional appearance
    runDiagnostic() {
        console.log('Running system diagnostic...');
        
        // Simulate diagnostic check
        setTimeout(() => {
            this.updateSystemStatus('System diagnostic complete');
        }, 2000);
    }
    
    updateSystemStatus(message) {
        if (this.elements.statusIndicator) {
            const statusText = this.elements.statusIndicator.querySelector('span');
            if (statusText) {
                const originalMessage = statusText.textContent;
                statusText.textContent = message;
                
                // Revert to original after 3 seconds
                setTimeout(() => {
                    statusText.textContent = originalMessage;
                }, 3000);
            }
        }
    }
    
    // Check for existing results to maintain sync
    checkResultsSync() {
        try {
            const existingResult = localStorage.getItem('hairAnalysisResult');
            if (existingResult) {
                const data = JSON.parse(existingResult);
                console.log('Found existing calibration data:', data);
                
                // Update display if data is recent (within 10 minutes)
                if (data.timestamp && (Date.now() - data.timestamp < 600000)) {
                    this.selectedHairCount = data.hairCount;
                    this.selectedConfidence = data.confidence || 85;
                    this.customMessage = data.customMessage || '';
                    
                    // Update UI
                    if (this.elements.hairCountInput) {
                        this.elements.hairCountInput.value = data.hairCount;
                    }
                    if (this.elements.confidenceSlider) {
                        this.elements.confidenceSlider.value = this.selectedConfidence;
                        this.updateConfidenceDisplay(this.selectedConfidence);
                    }
                    if (this.elements.customMessage) {
                        this.elements.customMessage.value = this.customMessage;
                    }
                    
                    this.updateDisplay();
                }
            }
        } catch (error) {
            console.log('Could not check results sync:', error);
        }
    }
    
    // Monitor for external changes (cross-device sync)
    startSyncMonitoring() {
        setInterval(() => {
            this.checkResultsSync();
        }, 30000); // Check every 30 seconds
    }
}

// Initialize the calibrator
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Hair Diagnostic Calibrator...');
    window.hairCalibrator = new HairDiagnosticCalibrator();
    
    // Start sync monitoring after a short delay
    setTimeout(() => {
        window.hairCalibrator.startSyncMonitoring();
    }, 5000);
});

// Add keyboard shortcuts for quick access (professional tool behavior)
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + number keys for quick scenario selection
    if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '6') {
        e.preventDefault();
        const scenarioIndex = parseInt(e.key) - 1;
        const scenarioBtn = document.querySelectorAll('.scenario-btn')[scenarioIndex];
        if (scenarioBtn) {
            scenarioBtn.click();
        }
    }
    
    // Ctrl/Cmd + Enter to send data
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        const sendBtn = document.getElementById('sendDataBtn');
        if (sendBtn && !sendBtn.disabled) {
            sendBtn.click();
        }
    }
});

// Storage event listener for cross-tab synchronization
window.addEventListener('storage', (e) => {
    if (e.key === 'hairAnalysisResult' && window.hairCalibrator) {
        console.log('Detected external calibration data change');
        window.hairCalibrator.updateSystemStatus('External sync detected');
        
        // Brief status update
        setTimeout(() => {
            window.hairCalibrator.updateSystemStatus('System Ready');
        }, 2000);
    }
});

// Add professional tool behaviors
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && window.hairCalibrator) {
        // Check for updates when returning to tab
        window.hairCalibrator.checkResultsSync();
        window.hairCalibrator.updateLastSync();
    }
});

// Prevent accidental page navigation
window.addEventListener('beforeunload', (e) => {
    if (window.hairCalibrator && window.hairCalibrator.isTransmitting) {
        e.preventDefault();
        e.returnValue = 'Calibration transmission in progress. Are you sure you want to leave?';
    }
});