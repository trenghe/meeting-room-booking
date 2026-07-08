// Firebase Configuration
// Updated with real credentials for "trenghe" project
const firebaseConfig = {
  apiKey: "AIzaSyAwDDfeJDVk9drYMG_-5mvhzOpvIGk-RCI",
  authDomain: "trenghe.firebaseapp.com",
  databaseURL: "https://trenghe-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "trenghe",
  storageBucket: "trenghe.firebasestorage.app",
  messagingSenderId: "690293814147",
  appId: "1:690293814147:web:b9905eed2fc11c6bb1bcb6",
  measurementId: "G-ZSKC4Y232P",
};

// Initialize Firebase - with error handling
let app;
let database;
let bookingsRef;
let rulesRef;
let firebaseInitialized = false;

// Initialize booking tracking - MUST be defined before Firebase loads
let bookings = {};
let rules = {};

// Helper function to format date
function formatDate(date) {
  return date.toISOString().split("T")[0];
}

// Helper function to get current date
function getCurrentDate() {
  return new Date();
}

// Initialize Firebase with delay to ensure SDK is loaded
function initializeFirebase() {
  try {
    if (typeof firebase === "undefined") {
      console.warn("Firebase SDK not loaded yet, retrying...");
      setTimeout(initializeFirebase, 100);
      return;
    }

    if (firebaseInitialized) return;

    app = firebase.initializeApp(firebaseConfig);
    database = firebase.database(app);

    // Database References
    bookingsRef = database.ref("bookings");
    rulesRef = database.ref("rules");

    // Load bookings from Firebase on startup
    bookingsRef.on("value", (snapshot) => {
      bookings = snapshot.val() || {};
      console.log("Bookings updated:", bookings);
      // Trigger schedule update
      if (window.updateScheduleDisplay) {
        updateScheduleDisplay();
      }
    });

    // Load rules from Firebase
    rulesRef.on("value", (snapshot) => {
      rules = snapshot.val() || {};
      console.log("Rules loaded:", rules);
    });

    firebaseInitialized = true;
    console.log("Firebase initialized successfully");
  } catch (error) {
    console.error("Firebase initialization error:", error);
    console.warn("Running in demo mode without Firebase");
  }
}

// Try to initialize Firebase when document is ready
document.addEventListener("DOMContentLoaded", initializeFirebase);

// Also try immediately in case DOM is already loaded
if (document.readyState === "loading") {
  setTimeout(initializeFirebase, 100);
} else {
  initializeFirebase();
}

// Helper function to save booking
async function saveBooking(bookingData) {
  try {
    const bookingId = database.ref("bookings").push().key;
    const bookingPath = `bookings/${bookingId}`;

    await database.ref(bookingPath).set({
      ...bookingData,
      id: bookingId,
      createdAt: new Date().toISOString(),
      status: "confirmed",
    });

    console.log("Booking saved:", bookingId);
    return { success: true, bookingId, data: bookingData };
  } catch (error) {
    console.error("Error saving booking:", error);
    return { success: false, error: error.message };
  }
}

// Helper function to get bookings for a specific date and room
function getBookingsForDateAndRoom(date, room) {
  return Object.values(bookings).filter((booking) => booking.date === date && booking.room === room);
}

// Helper function to check if time slot is available
function isTimeSlotAvailable(date, room, startTime, endTime) {
  const dateBookings = getBookingsForDateAndRoom(date, room);

  for (let booking of dateBookings) {
    const bookingStart = parseInt(booking.startTime);
    const bookingEnd = parseInt(booking.endTime);
    const reqStart = parseInt(startTime);
    const reqEnd = parseInt(endTime);

    // Check for overlap
    if (!(reqEnd <= bookingStart || reqStart >= bookingEnd)) {
      return false;
    }
  }

  return true;
}

// Helper function to get available time slots for a date and room
function getAvailableTimeSlots(date, room) {
  const timeSlots = generateTimeSlots();
  const dateBookings = getBookingsForDateAndRoom(date, room);

  return timeSlots.filter((slot) => {
    return !dateBookings.some((booking) => {
      const bookingStart = parseInt(booking.startTime);
      const bookingEnd = parseInt(booking.endTime);
      const slotStart = parseInt(slot);
      const slotEnd = slotStart + 100; // 1 hour

      return !(slotEnd <= bookingStart || slotStart >= bookingEnd);
    });
  });
}

// Generate available time slots (in 24-hour format: 800 = 8:00, 900 = 9:00, etc.)
function generateTimeSlots() {
  const slots = [];
  for (let hour = 8; hour < 18; hour++) {
    slots.push(hour * 100);
  }
  return slots;
}

// Format time from number format (800 = 8:00)
function formatTime(timeNum) {
  const hours = Math.floor(timeNum / 100);
  const minutes = timeNum % 100;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

// Parse time string to number format
function parseTime(timeStr) {
  const [hours, minutes] = timeStr.split(":");
  return parseInt(hours) * 100 + parseInt(minutes);
}

console.log("Firebase configuration loaded");
