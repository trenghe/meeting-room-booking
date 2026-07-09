// Schedule Functionality
let currentWeekStart = getMonday(new Date());

// Get Monday of current week
function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

// Get week number (ISO 8601)
function getWeekNumber(d) {
  const date = new Date(d.getTime());
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  const week1 = new Date(date.getFullYear(), 0, 4);
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

// Get week range display
function getWeekRangeText(startDate) {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);

  const pad = (n) => String(n).padStart(2, "0");

  const startText = `${pad(startDate.getDate())}/${pad(startDate.getMonth() + 1)}/${startDate.getFullYear()}`;
  const endText = `${pad(endDate.getDate())}/${pad(endDate.getMonth() + 1)}/${endDate.getFullYear()}`;
  
  const weekNum = getWeekNumber(startDate);

  return `Tuần ${weekNum} (${startText} - ${endText})`;
}

// Initialize schedule
function initCalendar() {
  updateWeekDisplay();
  updateScheduleDisplay();
  setupScheduleNavigation();
}

// Update week display
function updateWeekDisplay() {
  const weekRange = document.getElementById("weekRange");
  if (weekRange) {
    weekRange.textContent = getWeekRangeText(currentWeekStart);
  }
}

// Setup schedule navigation buttons
function setupScheduleNavigation() {
  const prevBtn = document.getElementById("prevWeek");
  const nextBtn = document.getElementById("nextWeek");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      currentWeekStart.setDate(currentWeekStart.getDate() - 7);
      updateWeekDisplay();
      updateScheduleDisplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      currentWeekStart.setDate(currentWeekStart.getDate() + 7);
      updateWeekDisplay();
      updateScheduleDisplay();
    });
  }
}

/// Define time slots with specific time ranges
function getScheduleTimeSlots() {
  return [
    { id: "slot1", label: "Slot 1", display: "7:30", hour: 7, min: 30, endHour: 8, endMin: 0, isBreak: false },
    { id: "slot2", label: "Slot 2", display: "8:00", hour: 8, min: 0, endHour: 8, endMin: 30, isBreak: false },
    { id: "slot3", label: "Slot 3", display: "8:30", hour: 8, min: 30, endHour: 9, endMin: 0, isBreak: false },
    { id: "slot4", label: "Slot 4", display: "9:00", hour: 9, min: 0, endHour: 9, endMin: 30, isBreak: false },
    { id: "slot5", label: "Slot 5", display: "9:30", hour: 9, min: 30, endHour: 10, endMin: 0, isBreak: false },
    { id: "slot6", label: "Slot 6", display: "10:00", hour: 10, min: 0, endHour: 10, endMin: 30, isBreak: false },
    { id: "slot7", label: "Slot 7", display: "10:30", hour: 10, min: 30, endHour: 11, endMin: 0, isBreak: false },
    { id: "slot8", label: "Slot 8", display: "11:00", hour: 11, min: 0, endHour: 11, endMin: 30, isBreak: false },
    { id: "slot9", label: "Slot 9", display: "11:30", hour: 11, min: 30, endHour: 12, endMin: 0, isBreak: false },
    { id: "slot10", label: "Slot 10", display: "12:00", hour: 12, min: 0, endHour: 12, endMin: 30, isBreak: false },
    { id: "slot11", label: "Slot 11", display: "12:30", hour: 12, min: 30, endHour: 13, endMin: 0, isBreak: false },
    { id: "slot12", label: "Slot 12", display: "13:00", hour: 13, min: 0, endHour: 13, endMin: 30, isBreak: false },
    { id: "slot13", label: "Slot 13", display: "13:30", hour: 13, min: 30, endHour: 14, endMin: 0, isBreak: false },
    { id: "slot14", label: "Slot 14", display: "14:00", hour: 14, min: 0, endHour: 14, endMin: 30, isBreak: false },
    { id: "slot15", label: "Slot 15", display: "14:30", hour: 14, min: 30, endHour: 15, endMin: 0, isBreak: false },
    { id: "slot16", label: "Slot 16", display: "15:00", hour: 15, min: 0, endHour: 15, endMin: 30, isBreak: false },
    { id: "slot17", label: "Slot 17", display: "15:30", hour: 15, min: 30, endHour: 16, endMin: 0, isBreak: false },
    { id: "slot18", label: "Slot 18", display: "16:00", hour: 16, min: 0, endHour: 16, endMin: 30, isBreak: false },
    { id: "slot19", label: "Slot 19", display: "16:30", hour: 16, min: 30, endHour: 17, endMin: 0, isBreak: false },
    { id: "slot20", label: "Slot 20", display: "17:00", hour: 17, min: 0, endHour: 17, endMin: 30, isBreak: false },    
  ];
}

// Define rooms
function getRooms() {
  return [
    { id: "floor1", name: "Phòng họp Lầu 1", capacity: 15 },
    { id: "floor4", name: "Phòng họp Lầu 4", capacity: 20 },
  ];
}

// Pad a number with leading zero
function pad2(n) {
  return n < 10 ? "0" + n : "" + n;
}

// Update schedule display
// Update schedule display
function updateScheduleDisplay() {
  const scheduleBody = document.getElementById("scheduleBody");
  if (!scheduleBody) return;

  scheduleBody.innerHTML = "";

  const rooms = getRooms();
  const timeSlots = getScheduleTimeSlots();

  rooms.forEach((room, roomIndex) => {
    // Keep track of how many cells to skip for each day column due to rowspan
    let skipCells = [0, 0, 0, 0, 0, 0, 0];

    timeSlots.forEach((slot, slotIdx) => {
      const row = document.createElement("tr");

      // Gắn class riêng cho từng phòng để tô màu phân biệt
      row.classList.add(`room-row-${room.id}`);

      // Đánh dấu hàng đầu tiên của phòng (trừ phòng đầu tiên) để vẽ đường phân cách ngang
      if (slotIdx === 0 && roomIndex > 0) {
        row.classList.add("room-divider");
      }

      // ---- Cột Phòng (rowspan = số tiết) ----
      if (slotIdx === 0) {
        const roomCell = document.createElement("td");
        roomCell.className = "room-cell room-label-cell";
        roomCell.rowSpan = timeSlots.length;
        roomCell.innerHTML = `
                    <div class="room-name">${room.name}</div>
                `;
        row.appendChild(roomCell);
      }

      // ---- Cột Tiết ----
      const tietCell = document.createElement("td");
      tietCell.className = "tiet-cell";
      if (slot.isBreak) {
        tietCell.innerHTML = `<span class="tiet-label">${slot.display.replace(/\n/g, "<br>")}</span>`;
      } else {
        tietCell.innerHTML = `<span class="tiet-label">${slot.display.replace(/\n/g, "<br>")}</span>`;
      }
      row.appendChild(tietCell);

      // ---- Cột Ngày (7 cột) ----
      for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        // If this column is being spanned by a previous row, skip creating td
        if (skipCells[dayOffset] > 0) {
          skipCells[dayOffset]--;
          continue;
        }

        const cellDate = new Date(currentWeekStart);
        cellDate.setDate(cellDate.getDate() + dayOffset);
        const dateStr = formatDate(cellDate);
        const weekday = cellDate.getDay(); // 0=CN,1=T2,...,6=T7

        const cell = document.createElement("td");
        cell.className = "schedule-cell";

        if (slot.isBreak) {
          // Break time cell (only if not spanned over by a booking)
          cell.classList.add("break-cell");
          cell.textContent = "NGHỈ";
          row.appendChild(cell);
        } else {
          const booking = getBookingForSlot(dateStr, room.id, slot);

          if (booking) {
            // Calculate rowspan by checking subsequent slots for the same booking
            let rowspan = 1;
            for (let k = slotIdx + 1; k < timeSlots.length; k++) {
              // If the booking spans across a break, we include the break in the rowspan
              // wait, getBookingForSlot returns null for break.
              // So we check if the booking's endTime is > the next slot's startTime
              const nextSlot = timeSlots[k];
              const bookEnd = Math.floor(parseInt(booking.endTime) / 100) * 60 + (parseInt(booking.endTime) % 100);
              const nextSlotStart = nextSlot.hour * 60 + nextSlot.min;

              if (bookEnd > nextSlotStart) {
                rowspan++;
              } else {
                break;
              }
            }

            if (rowspan > 1) {
              cell.rowSpan = rowspan;
              skipCells[dayOffset] = rowspan - 1;
            }

            cell.classList.add("booked");
            cell.innerHTML = `
                        <div class="booking-info">
                            <div class="booking-purpose">${booking.purpose}</div>
                            <div class="booking-org">${booking.organizerName}</div>
                        </div>
                    `;
            cell.addEventListener("click", () => showBookingDetails(booking));
          } else if (weekday === 0) {
            cell.classList.add("empty");
            cell.innerHTML = "";

            cell.addEventListener("click", () => {
              selectBookingSlot(dateStr, room.id, slot);
            });
          } else {
            cell.classList.add("empty");
            cell.innerHTML = "";
            cell.addEventListener("click", () => selectBookingSlot(dateStr, room.id, slot));
          }
          row.appendChild(cell);
        }
      }

      scheduleBody.appendChild(row);
    });
  });

  updateDayHeaders();
}x

// Update day headers — kiểu: "Thứ 2\n(06-07-2026)"
function updateDayHeaders() {
  const dayNames = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const date = new Date(currentWeekStart);
    date.setDate(date.getDate() + dayOffset);

    const dayHeader = document.getElementById(`day${dayOffset}`);
    if (dayHeader) {
      const name = dayNames[date.getDay()];
      const dd = pad2(date.getDate());
      const mm = pad2(date.getMonth() + 1);
      const yyyy = date.getFullYear();
      dayHeader.innerHTML = `${name}<br><span style="font-size:0.78rem;font-weight:400;">(${dd}-${mm}-${yyyy})</span>`;

      // Highlight chủ nhật
      if (date.getDay() === 0) {
        dayHeader.classList.add("sunday-header");
      } else {
        dayHeader.classList.remove("sunday-header");
      }
    }
  }
}

// Get booking for specific slot
function getBookingForSlot(dateStr, roomId, slot) {
  // Skip special slots (11h-13h, Sau 17h)
  if (slot.isSpecial || slot.isBreak) return null;

  // Guard: bookings might not be initialized yet
  if (typeof bookings === "undefined" || !bookings) return null;

  const slotStart = slot.hour * 60 + slot.min;
  const slotEnd = slot.endHour * 60 + slot.endMin;

  return Object.values(bookings).find((booking) => {
    if (booking.date !== dateStr || booking.room !== roomId) return false;

    const bookStart = Math.floor(parseInt(booking.startTime) / 100) * 60 + (parseInt(booking.startTime) % 100);
    const bookEnd = Math.floor(parseInt(booking.endTime) / 100) * 60 + (parseInt(booking.endTime) % 100);

    return !(slotEnd <= bookStart || slotStart >= bookEnd);
  });
}

// Select booking slot
function selectBookingSlot(dateStr, roomId, slot) {
  // Chuyển sang tab Đặt phòng
  document.querySelector('[data-tab="booking"]').click();

  // Chọn ngày
  const bookingDateInput = document.getElementById("bookingDate");
  if (bookingDateInput._flatpickr) {
    bookingDateInput._flatpickr.setDate(dateStr);
  } else {
    bookingDateInput.value = dateStr;
  }

  // Chọn phòng
  document.getElementById("roomSelect").value = roomId;

  // Cho các sự kiện change chạy trước
  document.getElementById("roomSelect").dispatchEvent(new Event("change"));

  document.getElementById("bookingDate").dispatchEvent(new Event("change"));

  // Đợi DOM cập nhật rồi mới gán giờ
  setTimeout(() => {
    document.getElementById("startTime").value = slot.hour * 100 + slot.min;

    document.getElementById("startTime").dispatchEvent(new Event("change"));
  }, 50);
}

// Show booking details in modal
function showBookingDetails(booking) {
  const modal = document.getElementById("bookingModal");
  const modalBody = document.getElementById("modalBody");

  // Get room name
  const rooms = getRooms();
  const room = rooms.find((r) => r.id === booking.room);
  const roomName = room ? `${room.name} ` : booking.room;

  const dateObj = new Date(booking.date);
  const dateDisplay = dateObj.toLocaleDateString("vi-VN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  let html = `<div class="modal-section">
        <h3>📋 Chi Tiết Lịch Đặt Phòng</h3>
    </div>
    
    <div class="booking-details">
        <div class="booking-detail-item">
            <div class="booking-detail-label">Phòng:</div>
            <div class="booking-detail-value">${roomName}</div>
        </div>
        <div class="booking-detail-item">
            <div class="booking-detail-label">Ngày:</div>
            <div class="booking-detail-value">${dateDisplay}</div>
        </div>
        <div class="booking-detail-item">
            <div class="booking-detail-label">Giờ:</div>
            <div class="booking-detail-value">${formatTime(parseInt(booking.startTime))} - ${formatTime(parseInt(booking.endTime))}</div>
        </div>
        <div class="booking-detail-item">
            <div class="booking-detail-label">Nội Dung:</div>
            <div class="booking-detail-value">${booking.purpose}</div>
        </div>
        <div class="booking-detail-item">
            <div class="booking-detail-label">Người Đặt:</div>
            <div class="booking-detail-value">${booking.organizerName}</div>
        </div>
        
        ${
          booking.notes
            ? `<div class="booking-detail-item">
            <div class="booking-detail-label">Ghi chú:</div>
            <div class="booking-detail-value">${booking.notes}</div>
        </div>`
            : ""
        }
    </div>`;

  // Create Google Calendar Link
  const gcalStartDate = booking.date.replace(/-/g, '') + 'T' + String(Math.floor(parseInt(booking.startTime) / 100)).padStart(2, '0') + String(parseInt(booking.startTime) % 100).padStart(2, '0') + '00';
  const gcalEndDate = booking.date.replace(/-/g, '') + 'T' + String(Math.floor(parseInt(booking.endTime) / 100)).padStart(2, '0') + String(parseInt(booking.endTime) % 100).padStart(2, '0') + '00';
  
  const gcalTitle = encodeURIComponent(booking.purpose || "Họp");
  const gcalDetails = encodeURIComponent(`Người đặt: ${booking.organizerName || ""}\n${booking.notes || ""}`);
  const gcalLocation = encodeURIComponent(roomName || "");
  
  const gcalLink = `https://calendar.google.com/calendar/r/eventedit?text=${gcalTitle}&dates=${gcalStartDate}/${gcalEndDate}&details=${gcalDetails}&location=${gcalLocation}`;

  html += `
    <div style="margin-top: 20px; text-align: center;">
      <a href="${gcalLink}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; background-color: #4285f4; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; transition: background-color 0.3s;" onmouseover="this.style.backgroundColor='#3367d6'" onmouseout="this.style.backgroundColor='#4285f4'">
        📅 Thêm vào Google Calendar
      </a>
    </div>
  `;

  modalBody.innerHTML = html;
  modal.classList.remove("hidden");
}

console.log("Schedule functionality loaded");
