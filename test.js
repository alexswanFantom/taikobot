import axios from "axios";

const fetchIPAddress = async () => {
  console.log("Fetching IP address...");
  try {
    const response = await axios.get("https://api.ipify.org?format=json");
    console.log("Your IP address is:", response.data.ip);
  } catch (error) {
    console.error("Error fetching IP address:", error.message);
    if (error.response) {
      // Jika ada respons dari server
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    } else if (error.request) {
      // Jika permintaan dibuat tetapi tidak ada respons yang diterima
      console.error("Request data:", error.request);
    } else {
      // Jika ada kesalahan dalam pengaturan permintaan
      console.error("Error message:", error.message);
    }
  }
};

// Memanggil fungsi untuk mengambil alamat IP
fetchIPAddress();
