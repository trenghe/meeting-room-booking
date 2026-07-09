// Booking Form Functionality
let bookingFormData = {
  room: "",
  date: "",
  startTime: "",
  endTime: "",
  purpose: "",
  organizerName: "",
  notes: "",
};

// Initialize booking form
function initBookingForm() {
  const form = document.getElementById("bookingForm");
  const roomSelect = document.getElementById("roomSelect");
  const bookingDate = document.getElementById("bookingDate");
  const startTimeSelect = document.getElementById("startTime");
  const endTimeSelect = document.getElementById("endTime");

  // Set minimum date to today
  const today = new Date();
  
  // Initialize flatpickr on bookingDate
  flatpickr(bookingDate, {
    dateFormat: "Y-m-d",
    altInput: true,
    altFormat: "d/m/Y",
    minDate: "today",
    defaultDate: today,
    onChange: function(selectedDates, dateStr, instance) {
       // Trigger change event to update available times
       bookingDate.dispatchEvent(new Event("change"));
    }
  });

  // Populate time slots (30-minute intervals from 7:00 to 17:00)
  populateTimeSlots(startTimeSelect);
  populateTimeSlots(endTimeSelect);

  // Update available times when room or date changes
  roomSelect.addEventListener("change", updateAvailableTimes);
  bookingDate.addEventListener("change", updateAvailableTimes);
  startTimeSelect.addEventListener("change", updateEndTimes);

  // Form submission
  form.addEventListener("submit", handleBookingSubmit);
}

// Populate time slot dropdowns
function populateTimeSlots(selectElement) {
  selectElement.innerHTML = '<option value="">-- Chọn giờ --</option>';

  // Guard: getScheduleTimeSlots might not be defined yet
  if (typeof getScheduleTimeSlots === "undefined") {
    console.warn("getScheduleTimeSlots not defined yet");
    return;
  }

  // Create time slot options based on the predefined slots
  const slots = getScheduleTimeSlots();

  slots.forEach((slot) => {
    if (!slot.isBreak) {
      const startTimeNum = slot.hour * 100 + slot.min;
      const endTimeNum = slot.endHour * 100 + slot.endMin;
      const option = document.createElement("option");
      option.value = startTimeNum;
      option.textContent = `${slot.display.replace(/\n/g, " ")}`;
      selectElement.appendChild(option);
    }
  });
}

// Update available times based on selected room and date
function updateAvailableTimes() {
  const roomSelect = document.getElementById("roomSelect");
  const bookingDate = document.getElementById("bookingDate");
  const startTimeSelect = document.getElementById("startTime");
  const endTimeSelect = document.getElementById("endTime");

  const room = roomSelect.value;
  const date = bookingDate.value;

  if (!room || !date) {
    populateTimeSlots(startTimeSelect);
    populateTimeSlots(endTimeSelect);
    return;
  }

  // Guard: getBookingsForDateAndRoom might not be defined yet
  if (typeof getBookingsForDateAndRoom === "undefined" || typeof getScheduleTimeSlots === "undefined") {
    populateTimeSlots(startTimeSelect);
    return;
  }

  // Get all bookings for this date and room
  const dateBookings = getBookingsForDateAndRoom(date, room);

  startTimeSelect.innerHTML = '<option value="">-- Chọn giờ --</option>';

  // Get all available slots
  const slots = getScheduleTimeSlots();

  slots.forEach((slot) => {
    if (slot.isBreak) return; // Skip break time

    const slotStart = slot.hour * 60 + slot.min;
    const slotEnd = slot.endHour * 60 + slot.endMin;

    // Check if this slot conflicts with any booking
    let isAvailable = true;
    for (let booking of dateBookings) {
      const bookStart = Math.floor(parseInt(booking.startTime) / 100) * 60 + (parseInt(booking.startTime) % 100);
      const bookEnd = Math.floor(parseInt(booking.endTime) / 100) * 60 + (parseInt(booking.endTime) % 100);

      // Check overlap
      if (!(slotEnd <= bookStart || slotStart >= bookEnd)) {
        isAvailable = false;
        break;
      }
    }

    if (isAvailable) {
      const startTimeNum = slot.hour * 100 + slot.min;
      const option = document.createElement("option");
      option.value = startTimeNum;
      option.textContent = slot.display.replace(/\n/g, " ");
      startTimeSelect.appendChild(option);
    }
  });

  // Reset end time
  endTimeSelect.innerHTML = '<option value="">-- Chọn giờ --</option>';
}

// Update end times based on start time
function updateEndTimes() {
  const startTimeSelect = document.getElementById("startTime");
  const endTimeSelect = document.getElementById("endTime");
  const startTimeNum = parseInt(startTimeSelect.value);

  endTimeSelect.innerHTML = '<option value="">-- Chọn giờ --</option>';

  if (!startTimeNum) return;

  // Guard: functions might not be defined yet
  if (typeof getScheduleTimeSlots === "undefined" || typeof getBookingsForDateAndRoom === "undefined") {
    return;
  }

  const roomSelect = document.getElementById("roomSelect");
  const bookingDate = document.getElementById("bookingDate");
  const room = roomSelect.value;
  const date = bookingDate.value;

  // Get all bookings for this date and room
  const dateBookings = getBookingsForDateAndRoom(date, room);

  // Find matching slot and get its end time
  const slots = getScheduleTimeSlots();
  let startIndex = slots.findIndex((s) => !s.isBreak && s.hour * 100 + s.min === startTimeNum);

  if (startIndex !== -1) {
    let firstEndTimeNum = null;
    
    for (let i = startIndex; i < slots.length; i++) {
      const slot = slots[i];
      if (slot.isBreak) break; // Dừng nếu qua giờ nghỉ trưa

      const slotStart = slot.hour * 60 + slot.min;
      const slotEnd = slot.endHour * 60 + slot.endMin;

      // Check if this slot conflicts with any booking
      let isAvailable = true;
      for (let booking of dateBookings) {
        const bookStart = Math.floor(parseInt(booking.startTime) / 100) * 60 + (parseInt(booking.startTime) % 100);
        const bookEnd = Math.floor(parseInt(booking.endTime) / 100) * 60 + (parseInt(booking.endTime) % 100);

        // Check overlap
        if (!(slotEnd <= bookStart || slotStart >= bookEnd)) {
          isAvailable = false;
          break;
        }
      }
      
      if (!isAvailable) break; // Dừng thêm giờ nếu gặp slot đã được đặt

      const endTimeNum = slot.endHour * 100 + slot.endMin;
      const option = document.createElement("option");
      const timeStr = `${String(slot.endHour).padStart(2, "0")}:${String(slot.endMin).padStart(2, "0")}`;
      option.value = endTimeNum;
      option.textContent = timeStr;
      endTimeSelect.appendChild(option);
      
      if (!firstEndTimeNum) firstEndTimeNum = endTimeNum;
    }

    // Auto-select the first available end time
    if (firstEndTimeNum) {
      endTimeSelect.value = firstEndTimeNum;
    }
  }
}

// Handle booking form submission
async function handleBookingSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const submitBtn = form.querySelector(".submit-btn");
  const statusDiv = document.getElementById("bookingStatus");

  // Disable submit button
  submitBtn.disabled = true;
  submitBtn.textContent = "⏳ Đang xử lý...";

  try {
    // Collect form data
    const bookingData = {
      room: document.getElementById("roomSelect").value,
      date: document.getElementById("bookingDate").value,
      startTime: String(parseInt(document.getElementById("startTime").value)), // Convert to string
      endTime: String(parseInt(document.getElementById("endTime").value)), // Convert to string
      purpose: document.getElementById("purpose").value,
      organizerName: document.getElementById("organizerName").value,
      notes: document.getElementById("notes").value,
    };

    // Validate data
    if (!bookingData.room || !bookingData.date || !bookingData.startTime || !bookingData.endTime) {
      throw new Error("Vui lòng điền đầy đủ thông tin phòng, ngày và giờ");
    }

    // Validate start time is before end time
    const startNum = parseInt(bookingData.startTime);
    const endNum = parseInt(bookingData.endTime);
    if (startNum >= endNum) {
      throw new Error("Giờ kết thúc phải sau giờ bắt đầu");
    }

    // Get room capacity based on room ID
    let maxCapacity = 20;
    if (bookingData.room === "floor1") maxCapacity = 15;
    else if (bookingData.room === "floor4") maxCapacity = 20;

    if (bookingData.attendeesCount > maxCapacity) {
      throw new Error(`Số người vượt quá sức chứa phòng (tối đa ${maxCapacity} người)`);
    }

    // Check minimum duration (30 minutes)
    const startMins = Math.floor(startNum / 100) * 60 + (startNum % 100);
    const endMins = Math.floor(endNum / 100) * 60 + (endNum % 100);
    const duration = endMins - startMins;
    
    if (duration < 30) {
      throw new Error("Thời gian họp tối thiểu là 30 phút");
    }

    // Check maximum duration (3 hours = 180 minutes)
    if (duration > 180) {
      throw new Error("Thời gian họp tối đa là 3 giờ");
    }

    // Check if time slot is available
    if (!isTimeSlotAvailable(bookingData.date, bookingData.room, bookingData.startTime, bookingData.endTime)) {
      throw new Error("Khung giờ này đã được đặt, vui lòng chọn khung giờ khác");
    }

    // Save booking to Firebase
    const result = await saveBooking(bookingData);

    if (result.success) {
      // Show success message
      statusDiv.className = "booking-status success";
      statusDiv.textContent = `✅ Đặt phòng thành công! Mã đặt phòng: ${result.bookingId}`;
      statusDiv.classList.remove("hidden");

      // Reset form
      form.reset();

      // Update schedule and switch to calendar tab
      setTimeout(() => {
        updateScheduleDisplay();

        // Switch to calendar tab
        const calendarTab = document.querySelector('[data-tab="calendar"]');
        if (calendarTab) calendarTab.click();
      }, 1500);
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    // Show error message
    statusDiv.className = "booking-status error";
    statusDiv.textContent = `❌ Lỗi: ${error.message}`;
    statusDiv.classList.remove("hidden");
    console.error("Booking error:", error);
  } finally {
    // Re-enable submit button
    submitBtn.disabled = false;
    submitBtn.textContent = "🔒 Đăng Ký Phòng";
  }
}

console.log("Booking form functionality loaded");
