// Main Application Logic
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Content Loaded - Initializing application");

  // Handle routing for Admin view
  if (window.location.hash === '#admin' || window.location.search.includes('admin') || window.location.pathname.endsWith('/admin')) {
    document.querySelector('.nav-tabs').style.display = 'none';
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
    document.getElementById('adminView').classList.remove('hidden');
    document.getElementById('adminView').style.display = 'block';
    
    // Back to main button
    document.getElementById('backToMainLink').addEventListener('click', (e) => {
      e.preventDefault();
      window.history.pushState('', document.title, window.location.pathname.replace('/admin', ''));
      window.location.hash = '';
      window.location.search = '';
      window.location.reload();
    });
  } else {
    // Normal flow
    initCalendar();
    initBookingForm();
    setupTabNavigation();
    setupModalClosing();
  }

  console.log("Application initialized");
});

// Setup tab navigation
function setupTabNavigation() {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tabName = button.getAttribute("data-tab");

      // Remove active class from all tabs
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      // Add active class to clicked tab
      button.classList.add("active");
      document.getElementById(tabName).classList.add("active");
    });
  });
}

// Setup modal closing
function setupModalClosing() {
  const modal = document.getElementById("bookingModal");
  const closeBtn = modal?.querySelector(".modal-close");

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  }

  // Close modal when clicking outside (on the modal itself, not content)
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.add("hidden");
      }
    });

    // Prevent closing when clicking inside modal content
    const modalContent = modal.querySelector(".modal-content");
    if (modalContent) {
      modalContent.addEventListener("click", (e) => {
        e.stopPropagation();
      });
    }
  }
}

// Handle online/offline status
window.addEventListener("online", () => {
  console.log("Connection restored");
  showNotification("✅ Kết nối đã được khôi phục", "success");
});

window.addEventListener("offline", () => {
  console.log("Connection lost");
  showNotification("⚠️ Mất kết nối internet. Hãy kiểm tra lại kết nối.", "error");
});

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

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 5000);
}

// Global error handler
window.addEventListener("error", (event) => {
  console.error("Unhandled error:", event.error);
  showNotification("❌ Có lỗi xảy ra. Vui lòng thử lại.", "error");
});

console.log("Main application logic loaded");
