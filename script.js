let doctors = [];

async function fetchDoctors() {
    const response = await fetch('/api/doctors');
    doctors = await response.json();
    return doctors;
}

document.addEventListener('DOMContentLoaded', function() {
    // 1. Initialize App State
    updateNavbar();
    
    // 2. Setup Global Event Listeners (Navigation, Modals, Forms)
    setupGlobalListeners();

    // 3. Load Page Specific Content
    const path = window.location.pathname;
    
    if (path.includes('index.html') || path === '/' || path.endsWith('/')) {
        loadFeaturedDoctors();
        setupFAQListeners();
    } 
    else if (path.includes('find-doctor.html')) {
        loadAllDoctors();
        setupSearchListener();
    }
    else if (path.includes('doctor-details.html')) {
        loadDoctorDetails();
    }
    else if (path.includes('my-bookings.html')) {
        loadBookings();
    }
});

// ==================== EVENT LISTENERS SETUP ====================

function setupGlobalListeners() {
    // Navigation Logo
    const logo = document.querySelector('.nav-logo');
    if (logo) logo.addEventListener('click', () => window.location.href = 'index.html');

    // Login Button (Open Modal)
    const loginBtns = document.querySelectorAll('.btn-login'); // querySelectorAll in case multiple exist
    loginBtns.forEach(btn => {
        btn.addEventListener('click', openLoginModal);
    });

    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    if (mobileBtn) mobileBtn.addEventListener('click', toggleMobileMenu);

    // Modal Close Buttons
    const modalClose = document.querySelector('.modal-close');
    if (modalClose) modalClose.addEventListener('click', closeLoginModal);


    // Click outside Modal to close
    // window.addEventListener('click', (event) => {
    //     const modal = document.getElementById('loginModal');
    //     if (event.target === modal) closeLoginModal();
    // });

    // Login Form Submit
    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);

    // User Dropdown Toggle (Delegation for dynamic avatar)
    document.body.addEventListener('click', (event) => {
        if (event.target.matches('.user-avatar')) {
            toggleDropdown();
        } else if (!event.target.closest('.user-menu')) {
            const dropdown = document.getElementById('dropdownMenu');
            if (dropdown) dropdown.classList.remove('show');
        }
    });

    // Logout (Delegation)
    document.body.addEventListener('click', (event) => {
        if (event.target.closest('.logout')) {
            handleLogout();
        }
    });
}

function setupSearchListener() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', searchDoctors);
    }
}

function setupFAQListeners() {
    // Delegation for FAQs
    const faqList = document.querySelector('.faq-list');
    if (faqList) {
        faqList.addEventListener('click', (e) => {
            const btn = e.target.closest('.faq-question');
            if (btn) toggleFAQ(btn);
        });
    }
}

// ==================== USER AUTHENTICATION ====================


function saveUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

function clearUser() {
    localStorage.removeItem('currentUser');
}

// Add this new helper
async function fetchCurrentUser() {
    try {
        const response = await fetch('/api/current_user');
        return await response.json(); // Returns user object or null
    } catch (e) { return null; }
}

// Update updateNavbar to be async
async function updateNavbar() {
    const user = await fetchCurrentUser(); // Fetch from backend
    const navAuth = document.getElementById('navAuth');
    
    if (user && navAuth) {
        navAuth.innerHTML = `
            <div class="user-menu">
                <img src="${user.photo}" alt="${user.name}" class="user-avatar">
                <div class="dropdown-menu" id="dropdownMenu">
                    <div class="dropdown-header">
                        <p>${user.name}</p>
                        <p>${user.email}</p>
                    </div>
                    <a href="my-bookings.html" class="dropdown-item">
                        <span>📅</span>
                        <span>My Bookings</span>
                    </a>
                    <button class="dropdown-item logout">
                        <span>🚪</span>
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        `;
    }
}

function toggleDropdown() {
    const dropdown = document.getElementById('dropdownMenu');
    if (dropdown) dropdown.classList.toggle('show');
}

// REPLACE the existing handleLogin function with this:
async function handleLogin(event) {
    event.preventDefault(); 
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // We don't save to localStorage anymore, backend handles session
            closeLoginModal();
            updateNavbar(); // You might need to update this to fetch from API too
            alert('Login successful!');
            location.reload();
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function handleLogout() {
    await fetch('/api/logout', { method: 'POST' });
    alert('Logged out successfully!');
    window.location.href = 'index.html';
}

// ==================== MODAL FUNCTIONS ====================

function openLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.classList.add('show');
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.remove('show');
        document.getElementById('loginForm').reset();
    }
}

// ==================== BOOKINGS MANAGEMENT ====================

// REPLACE your old loadBookings with this:
async function loadBookings() {
    // 1. Check if user is logged in
    const user = await fetchCurrentUser();
    if (!user) {
        window.location.href = 'index.html';
        return;
    }
    
    // 2. FETCH data from your new Python Backend (Replaces getBookings)
    const response = await fetch('/api/bookings');
    const bookings = await response.json();
    
    // 3. UPDATE the HTML (Same as before)
    const bookingsList = document.getElementById('bookingsList');
    const noBookings = document.getElementById('noBookings');
    const statsCard = document.getElementById('bookingsStats');
    const statsText = document.getElementById('statsText');
    
    if (bookings.length === 0) {
        if (bookingsList) bookingsList.style.display = 'none';
        if (noBookings) noBookings.style.display = 'block';
        if (statsCard) statsCard.style.display = 'none';
    } else {
        if (bookingsList) bookingsList.style.display = 'block';
        if (noBookings) noBookings.style.display = 'none';
        if (statsCard) statsCard.style.display = 'block';
        if (statsText) statsText.textContent = `You have ${bookings.length} appointment${bookings.length === 1 ? '' : 's'} scheduled`;
        
        bookingsList.innerHTML = `
            <div class="bookings-list">
                ${bookings.map(booking => `
                    <div class="booking-card">
                        <div class="booking-header">
                            <div class="booking-content">
                                <div class="booking-icon">👤</div>
                                <div class="booking-details">
                                    <div class="booking-top">
                                        <div>
                                            <h3 style="margin-bottom: 4px;">${booking.doctorName}</h3>
                                            <p style="color: #6b7280; margin: 0;">${booking.specialty}</p>
                                        </div>
                                        <span class="status-badge status-${booking.status}">${booking.status}</span>
                                    </div>
                                    <div class="booking-meta">
                                        <div class="meta-item"><span>📅</span><span>${booking.date}</span></div>
                                        <div class="meta-item"><span>🕐</span><span>${booking.time}</span></div>
                                    </div>
                                </div>
                            </div>
                            <button class="btn-cancel" data-id="${booking.id}" title="Cancel appointment">✕</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        // 4. Re-attach the Cancel Listener (UPDATED for backend)
        bookingsList.addEventListener('click', async (e) => {
            if (e.target.classList.contains('btn-cancel')) {
                if (confirm('Are you sure you want to cancel?')) {
                    const id = e.target.dataset.id;
                    // Delete from database
                    await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
                    // Refresh the page data
                    loadBookings(); 
                }
            }
        });
    }
}

function saveBookings(bookings) {
    localStorage.setItem('bookings', JSON.stringify(bookings));
}

async function addBooking(doctorId, doctorName, specialty, date, time) {
    const user = await fetchCurrentUser();
    if (!user) {
        alert('Please login to book an appointment');
        openLoginModal();
        return false;
    }
    
    try {
        const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ doctorId, date, time })
        });
        const result = await response.json();
        return result.success;
    } catch (error) {
        console.error("Booking failed", error);
        return false;
    }
}

function cancelBooking(bookingId) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
        let bookings = getBookings();
        bookings = bookings.filter(b => b.id !== bookingId);
        saveBookings(bookings);
        loadBookings();
    }
}


function createDoctorCard(doctor) {
    return `
        <div class="doctor-card" data-id="${doctor.id}">
            <div style="position: relative; overflow: hidden; border-radius: 12px 12px 0 0;">
                <img src="${doctor.photo}" alt="${doctor.name}" class="doctor-image">
                <div style="position: absolute; top: 16px; right: 16px; background: white; padding: 4px 12px; border-radius: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <div class="rating">
                        <span class="star">⭐</span>
                        <span>${doctor.rating}</span>
                    </div>
                </div>
            </div>
            <div class="doctor-info">
                <p class="doctor-name">${doctor.name}</p>
                <p class="doctor-specialty">${doctor.specialty}</p>
                <div class="doctor-meta">
                    <div>
                        <span style="color: #6b7280; font-size: 0.875rem;">Experience</span>
                        <p style="color: #1f2937; margin: 0;">${doctor.experience} years</p>
                    </div>
                    <div>
                        <span style="color: #6b7280; font-size: 0.875rem;">Reviews</span>
                        <p style="color: #1f2937; margin: 0;">${doctor.reviews} patients</p>
                    </div>
                </div>
                <button class="btn-view-profile">
                    <span>View Profile</span>
                    <span>→</span>
                </button>
            </div>
        </div>
    `;
}

async function loadFeaturedDoctors() {
    const container = document.getElementById('featuredDoctors');
    if (!container) return;
    
    await fetchDoctors();
    const featuredDoctors = doctors.slice(0, 4);
    
    container.innerHTML = featuredDoctors.map(doctor => createDoctorCard(doctor)).join('');
    container.addEventListener('click', handleDoctorCardClick);
}

async function loadAllDoctors() {
    const container = document.getElementById('doctorsGrid');
    if (!container) return;
    
    // Fetch from Backend
    await fetchDoctors();
    
    container.innerHTML = doctors.map(doctor => createDoctorCard(doctor)).join('');
    container.addEventListener('click', handleDoctorCardClick);
}
// Handler for doctor card clicks (Delegation)
function handleDoctorCardClick(e) {
    const card = e.target.closest('.doctor-card');
    if (card) {
        const doctorId = card.dataset.id;
        viewDoctor(doctorId);
    }
}

function searchDoctors() {
    const searchInput = document.getElementById('searchInput');
    const container = document.getElementById('doctorsGrid');
    const resultsCount = document.getElementById('resultsCount');
    const noResults = document.getElementById('noResults');
    
    if (!searchInput || !container) return;
    
    const searchTerm = searchInput.value.toLowerCase();
    const filteredDoctors = doctors.filter(doctor => 
        doctor.name.toLowerCase().includes(searchTerm) ||
        doctor.specialty.toLowerCase().includes(searchTerm)
    );
    
    // if (resultsCount) {
    //     resultsCount.textContent = `${filteredDoctors.length} ${filteredDoctors.length === 1 ? 'doctor' : 'doctors'} found`;
    // }
    
    if (filteredDoctors.length === 0) {
        container.style.display = 'none';
        if (noResults) noResults.style.display = 'block';
    } else {
        container.style.display = 'grid';
        if (noResults) noResults.style.display = 'none';
        container.innerHTML = filteredDoctors.map(doctor => createDoctorCard(doctor)).join('');
    }
}

function viewDoctor(doctorId) {
    localStorage.setItem('selectedDoctorId', doctorId);
    window.location.href = 'doctor-details.html';
}

// ==================== DOCTOR DETAILS ====================

// REPLACE your old loadDoctorDetails with this new version:
async function loadDoctorDetails() {
    const container = document.getElementById('doctorDetailsCard');
    if (!container) return;
    
    // --- NEW STEP: Fetch data from database first! ---
    if (doctors.length === 0) {
        await fetchDoctors();
    }
    // ------------------------------------------------
    
    const doctorId = localStorage.getItem('selectedDoctorId');
    const doctor = doctors.find(d => d.id === doctorId);

    if (!doctorId || !doctor) {
        container.innerHTML = '<p>Doctor not found. Please go back and select a doctor again.</p>';
        return;
    }
    
    // Group times logic (Same as before)
    const timesByDate = {};
    if (doctor.availableTimes) {
        doctor.availableTimes.forEach(slot => {
            const [date, time] = slot.split(' ');
            if (!timesByDate[date]) timesByDate[date] = [];
            timesByDate[date].push(time);
        });
    }
    
    // Render the Card
    container.innerHTML = `
        <div class="doctor-header">
            <img src="${doctor.photo}" alt="${doctor.name}" class="doctor-photo">
            <div class="doctor-info-section">
                <div class="doctor-title">
                    <div>
                        <h1 style="margin-bottom: 8px;">${doctor.name}</h1>
                        <p class="doctor-specialty" style="font-size: 1.125rem; margin-bottom: 0;">${doctor.specialty}</p>
                    </div>
                    <div class="rating-badge">
                        <span class="star">⭐</span>
                        <span style="font-weight: 600;">${doctor.rating}</span>
                        <span style="color: #6b7280;">(${doctor.reviews})</span>
                    </div>
                </div>
                
                <div class="doctor-details-grid">
                    <div class="detail-item">
                        <span class="detail-icon">🏆</span>
                        <div>
                            <p class="detail-label">Experience</p>
                            <p class="detail-value">${doctor.experience} years</p>
                        </div>
                    </div>
                    <div class="detail-item">
                        <span class="detail-icon">📞</span>
                        <div>
                            <p class="detail-label">Phone</p>
                            <p class="detail-value">${doctor.phone}</p>
                        </div>
                    </div>
                    <div class="detail-item" style="grid-column: 1 / -1;">
                        <span class="detail-icon">✉️</span>
                        <div>
                            <p class="detail-label">Email</p>
                            <p class="detail-value">${doctor.email}</p>
                        </div>
                    </div>
                </div>
                
                <div class="about-section">
                    <h3>About</h3>
                    <p>${doctor.about}</p>
                </div>
            </div>
        </div>
        
        <div class="booking-section">
            <div class="section-title">
                <span class="section-icon">📅</span>
                <h2 style="margin: 0;">Available Appointment Times</h2>
            </div>
            
            <div class="dates-list" id="timeSlotsContainer">
                ${Object.entries(timesByDate).map(([date, times]) => `
                    <div class="date-group">
                        <p class="date-label">${formatDate(date)}</p>
                        <div class="time-slots">
                            ${times.map(time => `
                                <button class="time-slot" data-date="${date}" data-time="${time}">
                                    <span>🕐</span>
                                    <span>${time}</span>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <button class="btn-book" id="bookBtn" disabled>
                Select a time slot to book
            </button>
            
            <div id="alertContainer"></div>
        </div>
    `;

    // Re-attach Listeners
    const timeSlotsContainer = document.getElementById('timeSlotsContainer');
    if (timeSlotsContainer) {
        timeSlotsContainer.addEventListener('click', (e) => {
            const slotBtn = e.target.closest('.time-slot');
            if (slotBtn) {
                selectTimeSlot(slotBtn, slotBtn.dataset.date, slotBtn.dataset.time);
            }
        });
    }

    const bookBtn = document.getElementById('bookBtn');
    if (bookBtn) {
        bookBtn.addEventListener('click', bookAppointment);
    }
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Select time slot
let selectedSlot = null;

function selectTimeSlot(button, date, time) {
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    
    button.classList.add('selected');
    selectedSlot = { date, time };
    
    const bookBtn = document.getElementById('bookBtn');
    bookBtn.disabled = false;
    bookBtn.textContent = 'Confirm Booking';
}

// REPLACE your old bookAppointment with this new version:
async function bookAppointment() {
    const alertContainer = document.getElementById('alertContainer');
    
    // 1. Check if logged in (using the new API check)
    const user = await fetchCurrentUser(); 
    
    if (!user) {
        alertContainer.innerHTML = `
            <div class="alert alert-warning">
                <p>Please log in to book an appointment. Click the Login button in the navigation bar.</p>
            </div>
        `;
        return;
    }
    
    if (!selectedSlot) return;
    
    // 2. Get Doctor Info
    const doctorId = localStorage.getItem('selectedDoctorId');
    const doctor = doctors.find(d => d.id === doctorId);
    
    // 3. Send to Backend (We must use 'await' here!)
    // This calls the addBooking function we updated earlier
    const success = await addBooking(doctor.id, doctor.name, doctor.specialty, selectedSlot.date, selectedSlot.time);
    
    if (success) {
        // 4. Show Success Message
        alertContainer.innerHTML = `
            <div class="alert alert-success">
                <p>✓ Appointment booked successfully! Check "My Bookings" to view your appointments.</p>
            </div>
        `;
        
        // Reset the UI
        document.querySelectorAll('.time-slot').forEach(slot => slot.classList.remove('selected'));
        selectedSlot = null;
        
        const bookBtn = document.getElementById('bookBtn');
        bookBtn.disabled = true;
        bookBtn.textContent = 'Select a time slot to book';
        
        // Clear message after 3 seconds
        setTimeout(() => {
            alertContainer.innerHTML = '';
        }, 3000);
    } else {
        alert('Failed to book appointment. Please try again.');
    }
}

// ==================== MY BOOKINGS PAGE ====================

function loadBookings() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'index.html';
        return;
    }
    
    const bookings = getUserBookings();
    const bookingsList = document.getElementById('bookingsList');
    const noBookings = document.getElementById('noBookings');
    const statsCard = document.getElementById('bookingsStats');
    const statsText = document.getElementById('statsText');
    
    if (bookings.length === 0) {
        if (bookingsList) bookingsList.style.display = 'none';
        if (noBookings) noBookings.style.display = 'block';
        if (statsCard) statsCard.style.display = 'none';
    } else {
        if (bookingsList) bookingsList.style.display = 'block';
        if (noBookings) noBookings.style.display = 'none';
        if (statsCard) statsCard.style.display = 'block';
        if (statsText) statsText.textContent = `You have ${bookings.length} ${bookings.length === 1 ? 'appointment' : 'appointments'} scheduled`;
        
        bookingsList.innerHTML = `
            <div class="bookings-list">
                ${bookings.map(booking => `
                    <div class="booking-card">
                        <div class="booking-header">
                            <div class="booking-content">
                                <div class="booking-icon">👤</div>
                                <div class="booking-details">
                                    <div class="booking-top">
                                        <div>
                                            <h3 style="margin-bottom: 4px;">${booking.doctorName}</h3>
                                            <p style="color: #6b7280; margin: 0;">${booking.specialty}</p>
                                        </div>
                                        <span class="status-badge status-${booking.status}">${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
                                    </div>
                                    <div class="booking-meta">
                                        <div class="meta-item">
                                            <span>📅</span>
                                            <span>${formatDate(booking.date)}</span>
                                        </div>
                                        <div class="meta-item">
                                            <span>🕐</span>
                                            <span>${booking.time}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button class="btn-cancel" data-id="${booking.id}" title="Cancel appointment">✕</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // Delegation for Cancel Buttons
        bookingsList.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-cancel')) {
                cancelBooking(e.target.dataset.id);
            }
        });
    }
}

function toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    if (navMenu) navMenu.classList.toggle('show');
}

function toggleFAQ(button) {
    const faqItem = button.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    if (!isActive) {
        faqItem.classList.add('active');
    }
}