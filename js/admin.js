// ===============================
// Admin / Management Functionality
// ===============================

function initAdmin() {
  renderAdminBookings();
}

document.addEventListener("DOMContentLoaded", () => {
  // Khi Firebase cập nhật dữ liệu sẽ tự render lại bảng
  window.updateScheduleDisplay = renderAdminBookings;

  // Render lần đầu
  setTimeout(renderAdminBookings, 1000);
});

// ===============================
// Format Date
// yyyy-MM-dd -> dd/MM/yyyy
// ===============================
function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString("vi-VN");
}

// ===============================
// Render Admin Table
// ===============================
function renderAdminBookings() {
  const tbody = document.getElementById("adminBookingsBody");

  if (!tbody) return;

  tbody.innerHTML = "";

  if (!bookings || Object.keys(bookings).length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center;padding:20px;">
          Không có lịch họp nào.
        </td>
      </tr>
    `;
    return;
  }

  // Lọc lịch từ hôm nay trở đi
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredBookings = Object.values(bookings).filter(booking => {
    const bookingDate = new Date(booking.date);
    bookingDate.setHours(0, 0, 0, 0);
    return bookingDate.getTime() >= today.getTime();
  });

  // Sắp xếp theo ngày mới nhất
  const sortedBookings = filteredBookings.sort((a, b) => {
    // Sắp xếp ngày tăng dần
    const dateCompare = new Date(a.date) - new Date(b.date);
    if (dateCompare !== 0) return dateCompare;

    // Nếu cùng ngày thì sắp xếp theo giờ bắt đầu
    const timeCompare = Number(a.startTime) - Number(b.startTime);
    if (timeCompare !== 0) return timeCompare;

    // Nếu cùng giờ thì sắp xếp theo phòng
    return (a.room || "").localeCompare(b.room || "");
  });
  sortedBookings.forEach((booking, index) => {
    const tr = document.createElement("tr");

    const roomName = booking.room === "floor1" ? "Phòng họp tầng 2" : "Phòng họp tầng 4";

    const startTime = parseInt(booking.startTime) || 0;
    const endTime = parseInt(booking.endTime) || 0;

    const timeStr = `${formatTime(startTime)} - ${formatTime(endTime)}`;

    tr.innerHTML = `
      <td><strong>${index + 1}</strong></td>
      <td style="white-space: nowrap;">${formatDate(booking.date)}</td>
      <td style="white-space: nowrap;">${roomName}</td>
      <td style="white-space: nowrap;">${timeStr}</td>
      <td style="white-space: nowrap;">${booking.organizerName || ""}</td>
      <td>${booking.purpose || ""}</td>
      <td>
        <div style="display: flex; gap: 5px;">
          <button
            class="action-btn edit"
            onclick="editBookingHandler('${booking.id}')">
            Sửa
          </button>
          <button
            class="action-btn delete"
            onclick="deleteBookingHandler('${booking.id}')">
            Xóa
          </button>
        </div>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

// ===============================
// Delete Booking
// ===============================
function deleteBookingHandler(id) {
  if (!confirm("Bạn có chắc chắn muốn xóa lịch họp này không?")) return;

  deleteBooking(id).then((res) => {
    if (res.success) {
      showNotification("✅ Đã xóa lịch họp thành công", "success");

      renderAdminBookings();

      if (window.updateScheduleDisplay) {
        updateScheduleDisplay();
      }
    } else {
      showNotification("❌ Lỗi khi xóa: " + res.error, "error");
    }
  });
}

// ===============================
// Edit Booking Modal
// ===============================

// Populate time options
function populateTimeOptions(selectId, selectedValue = "") {
  const select = document.getElementById(selectId);
  if (!select) return;
  select.innerHTML = '<option value="">-- Chọn giờ --</option>';
  
  const slots = [];
  for (let hour = 8; hour <= 17; hour++) {
    slots.push(hour * 100);       // HH:00
    slots.push(hour * 100 + 30);  // HH:30
  }
  slots.push(1800); // 18:00
  
  slots.forEach(slot => {
    const option = document.createElement("option");
    option.value = slot;
    option.textContent = formatTime(slot);
    if (String(slot) === String(selectedValue)) {
      option.selected = true;
    }
    select.appendChild(option);
  });
}

function editBookingHandler(id) {
  const booking = bookings[id];
  if (!booking) return;

  // Populate fields
  document.getElementById("editBookingId").value = id;
  document.getElementById("editRoomSelect").value = booking.room || "floor1";
  
  // Format date for input type="date" (YYYY-MM-DD)
  const d = new Date(booking.date);
  const dateString = isNaN(d.getTime()) ? booking.date : d.toISOString().split('T')[0];
  document.getElementById("editBookingDate").value = dateString;

  populateTimeOptions("editStartTime", booking.startTime);
  populateTimeOptions("editEndTime", booking.endTime);

  document.getElementById("editPurpose").value = booking.purpose || "";
  document.getElementById("editOrganizerName").value = booking.organizerName || "";
  document.getElementById("editNotes").value = booking.notes || "";

  // Show modal
  const modal = document.getElementById("editBookingModal");
  if (modal) {
    modal.classList.remove("hidden");
  }
}

function closeEditModal() {
  const modal = document.getElementById("editBookingModal");
  if (modal) {
    modal.classList.add("hidden");
  }
}

// Handle Edit Form Submission
document.addEventListener("DOMContentLoaded", () => {
  const editForm = document.getElementById("editBookingForm");
  if (editForm) {
    editForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const id = document.getElementById("editBookingId").value;
      if (!id) return;

      const updatedData = {
        room: document.getElementById("editRoomSelect").value,
        date: document.getElementById("editBookingDate").value,
        startTime: parseInt(document.getElementById("editStartTime").value),
        endTime: parseInt(document.getElementById("editEndTime").value),
        purpose: document.getElementById("editPurpose").value,
        organizerName: document.getElementById("editOrganizerName").value,
        notes: document.getElementById("editNotes").value,
      };

      if (updatedData.startTime >= updatedData.endTime) {
        alert("Giờ kết thúc phải lớn hơn giờ bắt đầu!");
        return;
      }

      // Check overlapping
      if (!isTimeSlotAvailable(updatedData.date, updatedData.room, updatedData.startTime, updatedData.endTime, id)) {
        alert("Phòng đã được đặt trong khoảng thời gian này. Vui lòng chọn giờ khác.");
        return;
      }
      
      updateBooking(id, updatedData).then(res => {
        if (res.success) {
          showNotification("✅ Đã cập nhật lịch họp thành công", "success");
          closeEditModal();
          renderAdminBookings();
        } else {
          showNotification("❌ Lỗi khi cập nhật: " + res.error, "error");
        }
      });
    });
  }
});

// ===============================
// Notification
// ===============================
function showNotification(message, type = "info") {
  const notification = document.createElement("div");

  notification.className = `booking-status ${type}`;

  notification.textContent = message;

  notification.style.position = "fixed";
  notification.style.top = "20px";
  notification.style.right = "20px";
  notification.style.zIndex = "9999";
  notification.style.maxWidth = "400px";
  notification.style.padding = "15px 20px";
  notification.style.borderRadius = "8px";
  notification.style.boxShadow = "0 8px 20px rgba(0,0,0,.2)";
  notification.style.fontWeight = "600";

  switch (type) {
    case "success":
      notification.style.background = "#4caf50";
      notification.style.color = "#fff";
      break;

    case "error":
      notification.style.background = "#f44336";
      notification.style.color = "#fff";
      break;

    default:
      notification.style.background = "#2196f3";
      notification.style.color = "#fff";
  }

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 4000);
}

// ===============================
// Export
// ===============================
window.initAdmin = initAdmin;
window.editBookingHandler = editBookingHandler;
window.closeEditModal = closeEditModal;
