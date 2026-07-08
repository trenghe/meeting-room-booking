// Admin / Management Functionality

function initAdmin() {
  renderAdminBookings();
}

document.addEventListener("DOMContentLoaded", () => {
  // If firebase is initialized asynchronously, we might need to wait for it.
  // Actually, bookings are loaded from Firebase in firebase-config.js.
  // When bookings are loaded, they call updateScheduleDisplay if it exists.
  // We can override updateScheduleDisplay to update our admin table.
  window.updateScheduleDisplay = renderAdminBookings;
  
  // Also try to render initially
  setTimeout(renderAdminBookings, 1000);
});

function renderAdminBookings() {
  const tbody = document.getElementById('adminBookingsBody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  if (!bookings || Object.keys(bookings).length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 20px;">Không có lịch họp nào.</td></tr>';
    return;
  }
  
  // Sort bookings by date descending
  const sortedBookings = Object.values(bookings).sort((a, b) => new Date(b.date) - new Date(a.date));
  
  sortedBookings.forEach(booking => {
    const tr = document.createElement('tr');
    
    // Style alternating rows
    tr.style.borderBottom = '1px solid #eee';
    
    const roomName = booking.room === 'floor1' ? 'Phòng họp Lầu 1' : 'Phòng họp Lầu 4';
    
    // Safety check for missing properties
    const startTime = parseInt(booking.startTime) || 0;
    const endTime = parseInt(booking.endTime) || 0;
    const timeStr = `${formatTime(startTime)} - ${formatTime(endTime)}`;
    
    tr.innerHTML = `
      <td style="padding: 12px;">${booking.date}</td>
      <td style="padding: 12px;">${roomName}</td>
      <td style="padding: 12px;">${timeStr}</td>
      <td style="padding: 12px;">${booking.organizerName || ''}</td>
      <td style="padding: 12px;">${booking.purpose || ''}</td>
      <td style="padding: 12px;">
        <button onclick="deleteBookingHandler('${booking.id}')" style="background-color: #ff4d4f; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">
          Xóa
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function deleteBookingHandler(id) {
  if (confirm('Bạn có chắc chắn muốn xóa lịch họp này không?')) {
    deleteBooking(id).then(res => {
      if (res.success) {
        showNotification('✅ Đã xóa lịch họp thành công', 'success');
        // Re-render both admin table and calendar
        renderAdminBookings();
        if (window.updateScheduleDisplay) {
            updateScheduleDisplay();
        }
      } else {
        showNotification('❌ Lỗi khi xóa: ' + res.error, 'error');
      }
    });
  }
}

// Helper function to show notifications
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `booking-status ${type}`;
  notification.textContent = message;
  notification.style.position = "fixed";
  notification.style.top = "20px";
  notification.style.right = "20px";
  notification.style.zIndex = "9999";
  notification.style.maxWidth = "400px";
  notification.style.padding = "15px";
  notification.style.borderRadius = "8px";
  notification.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
  
  if (type === 'success') {
      notification.style.backgroundColor = "#4caf50";
      notification.style.color = "white";
  } else if (type === 'error') {
      notification.style.backgroundColor = "#f44336";
      notification.style.color = "white";
  }

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 5000);
}

// Attach initAdmin to window so it can be called from main.js
window.initAdmin = initAdmin;
