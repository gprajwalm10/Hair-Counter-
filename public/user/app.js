// Hair Analysis Application with Secret Admin Control
class HairAnalysisSystem {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.adminCanvas = null;
        this.adminCtx = null;
        this.currentImage = null;
        this.isProcessing = false;
        this.cameraStream = null;
        this.videoElement = null;
        this.isAdminMode = false;
        this.resultCheckInterval = null;
        this.processingStartTime = null;
        
        // Communication system
        this.resultKey = 'hairAnalysisResult';
        this.statusKey = 'hairAnalysisStatus';
        
        // Processing steps for realistic AI simulation
        this.processingSteps = [
            "Initializing computer vision algorithms...",
            "Preprocessing image data...",
            "Detecting hair follicle patterns...",
            "Analyzing hair strand thickness...",
            "Calculating spatial hair density...",
            "Processing pattern recognition...",
            "Generating confidence metrics...",
            "Finalizing analysis results..."
        ];
        
        // Recommendation categories
        this.recommendations = {
            low: {
                threshold: 50000,
                title: "Low Hair Density Detected",
                message: "Consider consulting a dermatologist. Early intervention can be very effective.",
                icon: "⚠️",
                status: "needs-attention",
                tips: [
                    "Schedule professional consultation",
                    "Consider proven hair loss treatments", 
                    "Maintain healthy diet with proteins",
                    "Avoid harsh chemical treatments",
                    "Use gentle, sulfate-free products"
                ]
            },
            medium: {
                threshold: 100000,
                title: "Moderate Hair Density",
                message: "Your hair shows some thinning. A good hair care routine can help maintain and improve density.",
                icon: "⚡",
                status: "moderate",
                tips: [
                    "Start comprehensive hair care routine",
                    "Use strengthening shampoos with biotin",
                    "Apply weekly conditioning treatments",
                    "Consider hair growth supplements",
                    "Minimize heat styling damage"
                ]
            },
            good: {
                threshold: 999999,
                title: "Good Hair Health",
                message: "Your hair density is in a healthy range. Focus on maintenance to keep it this way.",
                icon: "✅",
                status: "excellent",
                tips: [
                    "Continue current hair care routine",
                    "Use UV protection when outdoors",
                    "Schedule regular trims every 6-8 weeks",
                    "Maintain balanced, nutritious diet",
                    "Monitor any changes over time"
                ]
            }
        };
        
        this.init();
    }
    
    init() {
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
        this.setupCanvases();
        this.updateReportDate();
        this.setupAdminCommunication();
        this.setupAdminAccess();
        this.addExitAdminButton();
        
        console.log('Hair Analysis System initialized');
    }
    
    setupElements() {
        this.elements = {
            // Main sections
            mainContainer: document.getElementById('mainContainer'),
            captureSection: document.getElementById('captureSection'),
            cameraSection: document.getElementById('cameraSection'),
            processingSection: document.getElementById('processingSection'),
            resultsSection: document.getElementById('resultsSection'),
            
            // Admin sections
            adminContainer: document.getElementById('adminContainer'),
            adminImageSection: document.getElementById('adminImageSection'),
            adminControls: document.getElementById('adminControls'),
            adminStatus: document.getElementById('adminStatus'),
            statusTime: document.getElementById('statusTime'),
            
            // Camera elements
            startCameraBtn: document.getElementById('startCameraBtn'),
            cameraVideo: document.getElementById('cameraVideo'),
            captureBtn: document.getElementById('captureBtn'),
            cancelCameraBtn: document.getElementById('cancelCameraBtn'),
            cameraError: document.getElementById('cameraError'),
            retryCamera: document.getElementById('retryCamera'),
            
            // Upload elements
            uploadArea: document.getElementById('uploadArea'),
            imageInput: document.getElementById('imageInput'),
            
            // Processing elements
            progressFill: document.getElementById('progressFill'),
            progressText: document.getElementById('progressText'),
            processingOverlay: document.getElementById('processingOverlay'),
            processingDescription: document.getElementById('processingDescription'),
            
            // Results elements
            reportDate: document.getElementById('reportDate'),
            hairCount: document.getElementById('hairCount'),
            confidenceScore: document.getElementById('confidenceScore'),
            processingTime: document.getElementById('processingTime'),
            imageQuality: document.getElementById('imageQuality'),
            hairDensity: document.getElementById('hairDensity'),
            
            // Recommendation elements
            recommendationIcon: document.getElementById('recommendationIcon'),
            recommendationTitle: document.getElementById('recommendationTitle'),
            healthStatus: document.getElementById('healthStatus'),
            recommendationMessage: document.getElementById('recommendationMessage'),
            recommendationTips: document.getElementById('recommendationTips'),
            
            // Action buttons
            newAnalysisBtn: document.getElementById('newAnalysisBtn'),
            downloadReportBtn: document.getElementById('downloadReportBtn'),
            
            // Admin controls
            adminTrigger: document.getElementById('adminTrigger'),
            adminHairCount: document.getElementById('adminHairCount'),
            adminConfidence: document.getElementById('adminConfidence'),
            adminCategory: document.getElementById('adminCategory'),
            adminImageQuality: document.getElementById('adminImageQuality'),
            sendResultsBtn: document.getElementById('sendResultsBtn'),
            refreshAdminBtn: document.getElementById('refreshAdminBtn')
        };
    }
    
    addExitAdminButton() {
        // Add exit admin button to admin header
        const adminHeader = document.querySelector('.admin-header');
        if (adminHeader) {
            const exitBtn = document.createElement('button');
            exitBtn.className = 'btn btn--outline';
            exitBtn.textContent = 'Exit Admin Mode';
            exitBtn.style.cssText = 'position: absolute; top: 20px; right: 20px;';
            exitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.exitAdminMode();
            });
            adminHeader.style.position = 'relative';
            adminHeader.appendChild(exitBtn);
        }
    }
    
    setupEventListeners() {
        // Main interface events
        if (this.elements.startCameraBtn) {
            this.elements.startCameraBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Start camera clicked');
                this.startCamera();
            });
        }
        
        if (this.elements.captureBtn) {
            this.elements.captureBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.capturePhoto();
            });
        }
        
        if (this.elements.cancelCameraBtn) {
            this.elements.cancelCameraBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.cancelCamera();
            });
        }
        
        if (this.elements.retryCamera) {
            this.elements.retryCamera.addEventListener('click', (e) => {
                e.preventDefault();
                this.startCamera();
            });
        }
        
        // File upload events - Fixed implementation
        if (this.elements.uploadArea && this.elements.imageInput) {
            // Click event for upload area
            this.elements.uploadArea.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Upload area clicked - triggering file input');
                this.elements.imageInput.click();
            });
            
            // File input change event
            this.elements.imageInput.addEventListener('change', (e) => {
                console.log('File input changed', e.target.files);
                if (e.target.files && e.target.files[0]) {
                    this.handleFileSelect(e.target.files[0]);
                }
            });
            
            // Drag and drop events
            this.elements.uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.elements.uploadArea.classList.add('dragover');
            });
            
            this.elements.uploadArea.addEventListener('dragleave', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.elements.uploadArea.classList.remove('dragover');
            });
            
            this.elements.uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.elements.uploadArea.classList.remove('dragover');
                const files = e.dataTransfer.files;
                if (files && files[0]) {
                    this.handleFileSelect(files[0]);
                }
            });
        }
        
        // Action buttons
        if (this.elements.newAnalysisBtn) {
            this.elements.newAnalysisBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.resetApplication();
            });
        }
        
        if (this.elements.downloadReportBtn) {
            this.elements.downloadReportBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.downloadReport();
            });
        }
        
        // Admin events
        if (this.elements.sendResultsBtn) {
            this.elements.sendResultsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.sendAdminResults();
            });
        }
        
        if (this.elements.refreshAdminBtn) {
            this.elements.refreshAdminBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.refreshAdminStatus();
            });
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Admin toggle (Ctrl+Shift+A)
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                e.preventDefault();
                this.toggleAdminMode();
            }
            // Quick exit admin (Escape key when in admin mode)
            if (e.key === 'Escape' && this.isAdminMode) {
                e.preventDefault();
                this.exitAdminMode();
            }
        });
    }
    
    setupAdminAccess() {
        // Create a more reliable admin trigger
        let clickCount = 0;
        let resetTimeout = null;
        
        // Admin access via bottom-right corner
        if (this.elements.adminTrigger) {
            this.elements.adminTrigger.addEventListener('click', (e) => {
                e.preventDefault();
                clickCount++;
                console.log(`Admin trigger click ${clickCount}/5`);
                
                if (resetTimeout) {
                    clearTimeout(resetTimeout);
                }
                
                if (clickCount >= 5) {
                    console.log('Admin mode activated via trigger');
                    this.enterAdminMode();
                    clickCount = 0;
                } else {
                    resetTimeout = setTimeout(() => {
                        clickCount = 0;
                    }, 3000);
                }
            });
        }
        
        // Alternative admin access - triple click on header
        const header = document.querySelector('.header');
        if (header) {
            let headerClickCount = 0;
            let headerResetTimeout = null;
            
            header.addEventListener('click', (e) => {
                headerClickCount++;
                console.log(`Header click ${headerClickCount}/3`);
                
                if (headerResetTimeout) {
                    clearTimeout(headerResetTimeout);
                }
                
                if (headerClickCount >= 3) {
                    console.log('Admin mode activated via header');
                    this.enterAdminMode();
                    headerClickCount = 0;
                } else {
                    headerResetTimeout = setTimeout(() => {
                        headerClickCount = 0;
                    }, 2000);
                }
            });
        }
    }
    
    setupCanvases() {
        this.canvas = document.getElementById('imageCanvas');
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
        }
        
        this.adminCanvas = document.getElementById('adminImageCanvas');
        if (this.adminCanvas) {
            this.adminCtx = this.adminCanvas.getContext('2d');
        }
        
        this.videoElement = document.getElementById('cameraVideo');
    }
    
    updateReportDate() {
        if (this.elements.reportDate) {
            const now = new Date();
            const options = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
            };
            this.elements.reportDate.textContent = `Generated on ${now.toLocaleDateString('en-US', options)}`;
        }
    }
    
    setupAdminCommunication() {
        // Clear any existing results
        localStorage.removeItem(this.resultKey);
        
        // Set initial status
        this.updateAdminStatus('System ready - waiting for analysis');
    }
    
    toggleAdminMode() {
        if (this.isAdminMode) {
            this.exitAdminMode();
        } else {
            this.enterAdminMode();
        }
    }
    
    enterAdminMode() {
        this.isAdminMode = true;
        this.elements.mainContainer?.classList.add('hidden');
        this.elements.adminContainer?.classList.remove('hidden');
        this.refreshAdminStatus();
        console.log('Admin mode activated');
        this.showMessage('Admin mode activated', 'success');
    }
    
    exitAdminMode() {
        this.isAdminMode = false;
        this.elements.adminContainer?.classList.add('hidden');
        this.elements.mainContainer?.classList.remove('hidden');
        console.log('Admin mode deactivated');
        this.showMessage('Returned to user interface', 'info');
    }
    
    updateAdminStatus(message, isReady = false) {
        if (this.elements.adminStatus) {
            this.elements.adminStatus.textContent = message;
            this.elements.adminStatus.className = `status-indicator ${isReady ? 'ready' : 'waiting'}`;
        }
        
        if (this.elements.statusTime) {
            const now = new Date();
            this.elements.statusTime.textContent = `Last updated: ${now.toLocaleTimeString()}`;
        }
        
        // Store status for admin interface
        localStorage.setItem(this.statusKey, JSON.stringify({
            message,
            isReady,
            timestamp: Date.now()
        }));
    }
    
    refreshAdminStatus() {
        try {
            const status = localStorage.getItem(this.statusKey);
            if (status) {
                const statusData = JSON.parse(status);
                this.updateAdminStatus(statusData.message, statusData.isReady);
            }
            
            // Check if there's a pending image
            const imageData = localStorage.getItem('pendingAnalysisImage');
            if (imageData && this.adminCanvas) {
                const img = new Image();
                img.onload = () => {
                    this.adminCanvas.width = img.width;
                    this.adminCanvas.height = img.height;
                    this.adminCtx.drawImage(img, 0, 0);
                };
                img.src = imageData;
            }
        } catch (error) {
            console.error('Error refreshing admin status:', error);
        }
    }
    
    async startCamera() {
        console.log('Starting camera...');
        
        try {
            this.elements.cameraError?.classList.add('hidden');
            
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('Camera access not supported by this browser');
            }
            
            this.cameraStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: "user"
                },
                audio: false
            });
            
            console.log('Camera access granted');
            
            this.elements.captureSection?.classList.add('hidden');
            this.elements.cameraSection?.classList.remove('hidden');
            
            if (this.elements.cameraVideo) {
                this.elements.cameraVideo.srcObject = this.cameraStream;
                await new Promise((resolve) => {
                    this.elements.cameraVideo.onloadedmetadata = resolve;
                });
            }
            
        } catch (error) {
            console.error('Camera access error:', error);
            this.showCameraError(error.message);
        }
    }
    
    showCameraError(errorMessage = 'Camera access denied') {
        if (this.elements.cameraError) {
            this.elements.cameraError.classList.remove('hidden');
            const errorText = this.elements.cameraError.querySelector('p');
            if (errorText) {
                errorText.textContent = `${errorMessage}. Please allow camera access to take a photo for analysis.`;
            }
        }
    }
    
    capturePhoto() {
        if (!this.cameraStream || !this.elements.cameraVideo) {
            console.error('Camera not available');
            return;
        }
        
        console.log('Capturing photo...');
        
        const captureCanvas = document.createElement('canvas');
        const captureCtx = captureCanvas.getContext('2d');
        
        const video = this.elements.cameraVideo;
        captureCanvas.width = video.videoWidth || 640;
        captureCanvas.height = video.videoHeight || 480;
        
        captureCtx.drawImage(video, 0, 0, captureCanvas.width, captureCanvas.height);
        
        captureCanvas.toBlob((blob) => {
            if (blob) {
                this.handleCapturedImage(blob);
            }
        }, 'image/jpeg', 0.9);
        
        this.stopCamera();
    }
    
    handleCapturedImage(blob) {
        console.log('Processing captured image...');
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.currentImage = img;
                this.startProcessing();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(blob);
    }
    
    cancelCamera() {
        this.stopCamera();
        this.elements.captureSection?.classList.remove('hidden');
        this.elements.cameraSection?.classList.add('hidden');
    }
    
    stopCamera() {
        if (this.cameraStream) {
            this.cameraStream.getTracks().forEach(track => {
                track.stop();
            });
            this.cameraStream = null;
        }
        
        if (this.elements.cameraVideo) {
            this.elements.cameraVideo.srcObject = null;
        }
    }
    
    handleFileSelect(file) {
        if (!file) {
            console.log('No file provided');
            return;
        }
        
        console.log('File selected:', file.name, file.type, file.size);
        
        if (!file.type.startsWith('image/')) {
            this.showMessage('Please select a valid image file (JPG, PNG, WEBP)', 'error');
            return;
        }
        
        if (file.size > 10 * 1024 * 1024) {
            this.showMessage('File size must be less than 10MB', 'error');
            return;
        }
        
        this.loadImage(file);
    }
    
    loadImage(file) {
        console.log('Loading image...');
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                console.log('Image loaded successfully');
                this.currentImage = img;
                this.startProcessing();
            };
            img.onerror = () => {
                this.showMessage('Failed to load image', 'error');
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    startProcessing() {
        if (this.isProcessing) return;
        
        console.log('Starting processing...');
        this.isProcessing = true;
        this.processingStartTime = Date.now();
        
        // Hide other sections, show processing
        this.elements.captureSection?.classList.add('hidden');
        this.elements.cameraSection?.classList.add('hidden');
        this.elements.processingSection?.classList.remove('hidden');
        this.elements.resultsSection?.classList.add('hidden');
        
        // Setup canvas with the image
        this.setupCanvas();
        
        // Store image for admin
        this.storeImageForAdmin();
        
        // Update admin status
        this.updateAdminStatus('New analysis started - ready for admin input', true);
        
        // Start processing animation
        this.processImage();
    }
    
    setupCanvas() {
        if (!this.canvas || !this.currentImage) return;
        
        const img = this.currentImage;
        const maxWidth = 400;
        const maxHeight = 400;
        
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
        }
        
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx.drawImage(img, 0, 0, width, height);
    }
    
    storeImageForAdmin() {
        if (this.canvas) {
            const imageData = this.canvas.toDataURL('image/jpeg', 0.8);
            localStorage.setItem('pendingAnalysisImage', imageData);
        }
    }
    
    processImage() {
        console.log('Processing image...');
        let currentStep = 0;
        
        const processStep = () => {
            if (currentStep >= this.processingSteps.length) {
                // Start waiting for admin results
                this.waitForAdminResults();
                return;
            }
            
            // Update progress
            const progress = ((currentStep + 1) / this.processingSteps.length) * 85; // Keep some room for final step
            if (this.elements.progressFill) {
                this.elements.progressFill.style.width = `${progress}%`;
            }
            if (this.elements.progressText) {
                this.elements.progressText.textContent = this.processingSteps[currentStep];
            }
            
            // Update step status
            const steps = document.querySelectorAll('.step');
            if (steps[currentStep]) {
                steps[currentStep].classList.add('active');
            }
            if (currentStep > 0 && steps[currentStep - 1]) {
                steps[currentStep - 1].classList.remove('active');
                steps[currentStep - 1].classList.add('completed');
            }
            
            currentStep++;
            
            // Continue to next step
            setTimeout(processStep, 1200 + Math.random() * 800);
        };
        
        processStep();
    }
    
    waitForAdminResults() {
        console.log('Waiting for admin results (from backend)...');

        // Update UI to show finalizing
        if (this.elements.progressText) {
            this.elements.progressText.textContent = "Finalizing analysis results...";
        }
        if (this.elements.processingDescription) {
            this.elements.processingDescription.textContent = "Generating comprehensive hair health report...";
        }

        // Show that we're in the final step
        const lastStep = document.querySelector('#step6');
        if (lastStep) {
            lastStep.classList.add('active');
        }

        // Start checking for results every 2 seconds from backend
        this.resultCheckInterval = setInterval(() => {
            this.checkForResultsFromBackend();
        }, 2000);

        // Fallback timeout after 30 seconds for demo purposes
        setTimeout(() => {
            if (this.isProcessing) {
                console.log('No admin results received from backend, generating fallback');
                this.generateFallbackResults();
            }
        }, 30000);
    }

    async checkForResultsFromBackend() {
        try {
            const response = await fetch('http://localhost:3000/api/data');
            if (!response.ok) return;
            const results = await response.json();
            // Check if results have expected fields
            if (results && results.hairCount && results.confidence) {
                // Stop checking
                if (this.resultCheckInterval) {
                    clearInterval(this.resultCheckInterval);
                    this.resultCheckInterval = null;
                }
                // Complete processing
                this.completeProcessing(results);
            }
        } catch (error) {
            console.error('Error fetching results from backend:', error);
        }
    }
    
    checkForResults() {
        try {
            const resultData = localStorage.getItem(this.resultKey);
            if (resultData) {
                console.log('Admin results received');
                const results = JSON.parse(resultData);
                
                // Clear the results
                localStorage.removeItem(this.resultKey);
                
                // Stop checking
                if (this.resultCheckInterval) {
                    clearInterval(this.resultCheckInterval);
                    this.resultCheckInterval = null;
                }
                
                // Complete processing
                this.completeProcessing(results);
            }
        } catch (error) {
            console.error('Error checking for results:', error);
        }
    }
    
    generateFallbackResults() {
        console.log('Generating fallback results');
        const results = {
            hairCount: 85000 + Math.floor(Math.random() * 40000),
            confidence: 75 + Math.floor(Math.random() * 15),
            category: 'medium',
            imageQuality: 'Good'
        };
        this.completeProcessing(results);
    }
    
    completeProcessing(results) {
        console.log('Completing processing with results:', results);
        
        // Complete progress bar
        if (this.elements.progressFill) {
            this.elements.progressFill.style.width = '100%';
        }
        if (this.elements.progressText) {
            this.elements.progressText.textContent = "Analysis complete!";
        }
        
        // Complete all steps
        const steps = document.querySelectorAll('.step');
        steps.forEach(step => {
            step.classList.remove('active');
            step.classList.add('completed');
        });
        
        // Calculate processing time
        const processingTime = Date.now() - this.processingStartTime;
        
        // Wait a moment then show results
        setTimeout(() => {
            this.showResults(results, processingTime);
        }, 1500);
        
        // Update admin status
        this.updateAdminStatus('Analysis completed - waiting for new analysis');
        
        // Clear pending image
        localStorage.removeItem('pendingAnalysisImage');
    }
    
    showResults(results, processingTime) {
        console.log('Showing results...');
        
        // Hide processing, show results
        this.elements.processingSection?.classList.add('hidden');
        this.elements.resultsSection?.classList.remove('hidden');
        
        // Update report date
        this.updateReportDate();
        
        // Animate hair count
        if (this.elements.hairCount) {
            this.animateNumber(this.elements.hairCount, 0, results.hairCount, 2500, (num) => {
                return num.toLocaleString() + ' hairs';
            });
        }
        
        // Update other results with delay
        setTimeout(() => {
            if (this.elements.confidenceScore) {
                this.elements.confidenceScore.textContent = `${results.confidence}%`;
            }
            if (this.elements.processingTime) {
                this.elements.processingTime.textContent = `${processingTime}ms`;
            }
            if (this.elements.imageQuality) {
                this.elements.imageQuality.textContent = results.imageQuality;
            }
            if (this.elements.hairDensity) {
                const density = Math.round(results.hairCount / 100);
                this.elements.hairDensity.textContent = `${density} hairs/cm²`;
            }
        }, 1500);
        
        // Show recommendations
        setTimeout(() => {
            this.showRecommendations(results.hairCount, results.category);
        }, 3000);
        
        this.isProcessing = false;
    }
    
    showRecommendations(hairCount, category) {
        let recommendation;
        
        // Use admin category if provided, otherwise determine by count
        if (category && this.recommendations[category]) {
            recommendation = this.recommendations[category];
        } else if (hairCount < this.recommendations.low.threshold) {
            recommendation = this.recommendations.low;
        } else if (hairCount < this.recommendations.medium.threshold) {
            recommendation = this.recommendations.medium;
        } else {
            recommendation = this.recommendations.good;
        }
        
        // Update recommendation UI
        if (this.elements.recommendationIcon) {
            this.elements.recommendationIcon.textContent = recommendation.icon;
        }
        
        if (this.elements.recommendationTitle) {
            this.elements.recommendationTitle.textContent = recommendation.title;
        }
        
        if (this.elements.healthStatus) {
            this.elements.healthStatus.textContent = recommendation.status.replace('-', ' ').toUpperCase();
            this.elements.healthStatus.className = `health-status ${recommendation.status}`;
        }
        
        if (this.elements.recommendationMessage) {
            this.elements.recommendationMessage.textContent = recommendation.message;
        }
        
        if (this.elements.recommendationTips) {
            this.elements.recommendationTips.innerHTML = '';
            recommendation.tips.forEach(tip => {
                const li = document.createElement('li');
                li.textContent = tip;
                this.elements.recommendationTips.appendChild(li);
            });
        }
    }
    
    sendAdminResults() {
        const results = {
            hairCount: parseInt(this.elements.adminHairCount.value) || 85000,
            confidence: parseInt(this.elements.adminConfidence.value) || 87,
            category: this.elements.adminCategory.value || 'medium',
            imageQuality: this.elements.adminImageQuality.value || 'Good'
        };
        
        console.log('Sending admin results:', results);
        
        // Store results for main interface to pick up
        localStorage.setItem(this.resultKey, JSON.stringify(results));
        
        // Update admin status
        this.updateAdminStatus('Results sent to user successfully');
        
        this.showMessage('Results sent successfully! Switch back to user interface to see them applied.', 'success');
    }
    
    animateNumber(element, start, end, duration, formatter) {
        const startTime = Date.now();
        
        const updateNumber = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (end - start) * easeOut);
            
            element.textContent = formatter ? formatter(current) : current;
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        };
        
        updateNumber();
    }
    
    resetApplication() {
        console.log('Resetting application...');
        
        this.isProcessing = false;
        this.currentImage = null;
        this.stopCamera();
        
        // Clear intervals
        if (this.resultCheckInterval) {
            clearInterval(this.resultCheckInterval);
            this.resultCheckInterval = null;
        }
        
        // Reset UI to initial state
        this.elements.captureSection?.classList.remove('hidden');
        this.elements.cameraSection?.classList.add('hidden');
        this.elements.processingSection?.classList.add('hidden');
        this.elements.resultsSection?.classList.add('hidden');
        this.elements.cameraError?.classList.add('hidden');
        
        // Reset progress
        if (this.elements.progressFill) {
            this.elements.progressFill.style.width = '0%';
        }
        if (this.elements.progressText) {
            this.elements.progressText.textContent = 'Initializing analysis...';
        }
        
        // Reset processing steps
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active', 'completed');
        });
        
        // Clear canvas
        if (this.ctx && this.canvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        
        // Reset file input
        if (this.elements.imageInput) {
            this.elements.imageInput.value = '';
        }
        
        // Clear stored data
        localStorage.removeItem('pendingAnalysisImage');
        localStorage.removeItem(this.resultKey);
        
        // Update admin status
        this.updateAdminStatus('System ready - waiting for analysis');
    }
    
    downloadReport() {
        const reportData = {
            title: "Hair Analysis Report",
            date: new Date().toISOString(),
            results: {
                hairCount: this.elements.hairCount?.textContent || 'N/A',
                confidence: this.elements.confidenceScore?.textContent || 'N/A',
                processingTime: this.elements.processingTime?.textContent || 'N/A',
                imageQuality: this.elements.imageQuality?.textContent || 'N/A',
                hairDensity: this.elements.hairDensity?.textContent || 'N/A'
            },
            recommendations: {
                title: this.elements.recommendationTitle?.textContent || 'N/A',
                status: this.elements.healthStatus?.textContent || 'N/A',
                message: this.elements.recommendationMessage?.textContent || 'N/A',
                tips: Array.from(this.elements.recommendationTips?.children || []).map(li => li.textContent)
            },
            disclaimer: "This analysis is for educational purposes only. Consult a healthcare professional for medical advice.",
            algorithm: "Advanced CV-2024 v2.1"
        };
        
        const dataStr = JSON.stringify(reportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `hair-analysis-report-${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        
        this.showMessage('Report downloaded successfully!', 'success');
    }
    
    showMessage(message, type = 'info') {
        const messageEl = document.createElement('div');
        messageEl.className = `message message--${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-surface);
            color: var(--color-text);
            padding: var(--space-16);
            border-radius: var(--radius-base);
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            border-left: 4px solid var(--color-${type === 'error' ? 'error' : type === 'success' ? 'success' : 'primary'});
            max-width: 300px;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(messageEl)) {
                    document.body.removeChild(messageEl);
                }
            }, 300);
        }, 4000);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Hair Analysis System...');
    window.hairAnalysisSystem = new HairAnalysisSystem();
});

// Add CSS animations for messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Prevent default drag behaviors
document.addEventListener('dragover', (e) => e.preventDefault());
document.addEventListener('drop', (e) => e.preventDefault());