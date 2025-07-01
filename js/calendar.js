// Calendar Component for Booking System

class BookingCalendar {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.currentDate = new Date();
        this.selectedDate = null;
        this.selectedTime = null;
        this.minDate = new Date();
        this.maxDate = new Date();
        this.maxDate.setMonth(this.maxDate.getMonth() + 3);
        
        // Options
        this.options = {
            disabledDays: [0], // Sunday disabled by default
            timeSlots: this.generateTimeSlots(),
            onDateSelect: options.onDateSelect || (() => {}),
            onTimeSelect: options.onTimeSelect || (() => {})
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.render();
    }
    
    bindEvents() {
        const prevBtn = document.getElementById('prevMonth');
        const nextBtn = document.getElementById('nextMonth');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousMonth());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextMonth());
        }
    }
    
    previousMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.render();
    }
    
    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.render();
    }
    
    render() {
        this.renderHeader();
        this.renderDays();
    }
    
    renderHeader() {
        const titleElement = document.getElementById('calendarTitle');
        if (titleElement) {
            const monthNames = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];
            
            titleElement.textContent = `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
        }
    }
    
    renderDays() {
        const calendarGrid = this.container.querySelector('.calendar-grid');
        if (!calendarGrid) return;
        
        // Clear existing days (keep headers)
        const dayHeaders = calendarGrid.querySelectorAll('.calendar-day-header');
        calendarGrid.innerHTML = '';
        dayHeaders.forEach(header => calendarGrid.appendChild(header));
        
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        for (let d = new Date(startDate); d <= lastDay || d.getDay() !== 0; d.setDate(d.getDate() + 1)) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = d.getDate();
            
            const dayClone = new Date(d);
            dayClone.setHours(0, 0, 0, 0);
            
            // Add classes based on day status
            if (d.getMonth() !== this.currentDate.getMonth()) {
                dayElement.classList.add('disabled');
            } else if (dayClone < today) {
                dayElement.classList.add('disabled');
            } else if (dayClone.getTime() === today.getTime()) {
                dayElement.classList.add('today');
            } else if (this.options.disabledDays.includes(d.getDay())) {
                dayElement.classList.add('disabled');
            }
            
            // Check if day is selected
            if (this.selectedDate && this.isSameDay(dayClone, this.selectedDate)) {
                dayElement.classList.add('selected');
            }
            
            // Add click handler
            if (!dayElement.classList.contains('disabled')) {
                dayElement.addEventListener('click', () => this.selectDate(dayClone));
                dayElement.setAttribute('tabindex', '0');
                dayElement.setAttribute('role', 'button');
                dayElement.setAttribute('aria-label', `Select ${this.formatDate(dayClone)}`);
                
                // Keyboard support
                dayElement.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.selectDate(dayClone);
                    }
                });
            }
            
            calendarGrid.appendChild(dayElement);
        }
    }
    
    selectDate(date) {
        this.selectedDate = new Date(date);
        this.selectedTime = null; // Reset time selection
        this.render();
        this.renderTimeSlots();
        this.options.onDateSelect(this.selectedDate);
        
        // Update selected date display
        const selectedDateDisplay = document.getElementById('selectedDateDisplay');
        if (selectedDateDisplay) {
            selectedDateDisplay.textContent = this.formatDate(this.selectedDate);
        }
    }
    
    renderTimeSlots() {
        const timeSlotsContainer = document.getElementById('timeSlots');
        if (!timeSlotsContainer || !this.selectedDate) return;
        
        timeSlotsContainer.innerHTML = '';
        
        const dayOfWeek = this.selectedDate.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        
        // Generate time slots based on day
        let availableSlots = [];
        if (isWeekend) {
            availableSlots = this.options.timeSlots.weekend;
        } else {
            availableSlots = this.options.timeSlots.weekday;
        }
        
        // Check if it's today and filter past times
        const now = new Date();
        const isToday = this.isSameDay(this.selectedDate, now);
        
        availableSlots.forEach(slot => {
            const timeElement = document.createElement('div');
            timeElement.className = 'time-slot';
            timeElement.textContent = slot.display;
            
            // Check if slot is in the past (for today only)
            if (isToday) {
                const slotTime = this.parseTimeSlot(slot.value);
                if (slotTime <= now) {
                    timeElement.classList.add('unavailable');
                }
            }
            
            // Random unavailable slots for demo
            if (Math.random() < 0.2 && !timeElement.classList.contains('unavailable')) {
                timeElement.classList.add('unavailable');
            }
            
            // Add click handler
            if (!timeElement.classList.contains('unavailable')) {
                timeElement.addEventListener('click', () => this.selectTime(slot));
                timeElement.setAttribute('tabindex', '0');
                timeElement.setAttribute('role', 'button');
                timeElement.setAttribute('aria-label', `Select ${slot.display}`);
                
                // Keyboard support
                timeElement.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.selectTime(slot);
                    }
                });
            }
            
            timeSlotsContainer.appendChild(timeElement);
        });
    }
    
    selectTime(timeSlot) {
        // Remove previous selection
        document.querySelectorAll('.time-slot.selected').forEach(slot => {
            slot.classList.remove('selected');
        });
        
        // Add selection to clicked slot
        event.target.classList.add('selected');
        
        this.selectedTime = timeSlot;
        this.options.onTimeSelect(timeSlot);
        
        // Enable continue button
        const continueBtn = document.getElementById('continueToInfo');
        if (continueBtn) {
            continueBtn.disabled = false;
        }
    }
    
    generateTimeSlots() {
        const weekdaySlots = [];
        const weekendSlots = [];
        
        // Weekday slots (9 AM - 6 PM)
        for (let hour = 9; hour <= 18; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                if (hour === 18 && minute > 0) break; // End at 6:00 PM
                
                const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
                const ampm = hour >= 12 ? 'PM' : 'AM';
                const display = `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
                
                weekdaySlots.push({ value: time24, display });
            }
        }
        
        // Weekend slots (10 AM - 4 PM)
        for (let hour = 10; hour <= 16; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                if (hour === 16 && minute > 0) break; // End at 4:00 PM
                
                const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
                const ampm = hour >= 12 ? 'PM' : 'AM';
                const display = `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
                
                weekendSlots.push({ value: time24, display });
            }
        }
        
        return { weekday: weekdaySlots, weekend: weekendSlots };
    }
    
    parseTimeSlot(timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        const slotDate = new Date(this.selectedDate);
        slotDate.setHours(hours, minutes, 0, 0);
        return slotDate;
    }
    
    isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }
    
    formatDate(date) {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return date.toLocaleDateString('en-US', options);
    }
    
    getSelectedDateTime() {
        if (!this.selectedDate || !this.selectedTime) return null;
        
        const [hours, minutes] = this.selectedTime.value.split(':').map(Number);
        const dateTime = new Date(this.selectedDate);
        dateTime.setHours(hours, minutes, 0, 0);
        
        return {
            date: this.selectedDate,
            time: this.selectedTime,
            dateTime: dateTime,
            formatted: {
                date: this.formatDate(this.selectedDate),
                time: this.selectedTime.display,
                dateTime: dateTime.toLocaleString()
            }
        };
    }
}

// Initialize calendar when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('bookingCalendar')) {
        window.bookingCalendar = new BookingCalendar('bookingCalendar', {
            onDateSelect: (date) => {
                console.log('Date selected:', date);
            },
            onTimeSelect: (time) => {
                console.log('Time selected:', time);
            }
        });
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BookingCalendar;
}