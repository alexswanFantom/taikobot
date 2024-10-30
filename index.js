import { Settup } from "./settup.js";
import Core from "./app/src/core/core.js";
import { Helper } from "./app/src/utils/helper.js";
import Twist from "./app/src/utils/twister.js";
const privateKey = Settup.privateKey;

async function sleep(ms) {
  if (ms < 0) throw new Error("Sleep time must be a non-negative number");
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function countdown(core) {
  const delayMs = 3600000 * Settup.DELAYINHOURS;
  const accountIndex =
    Settup.privateKey.indexOf(core.walletInstance.privateKey) + 1;
  const spinnerChars = Settup.animation;
  let elapsedTime = 0;

  return new Promise((resolve) => {
    const countdownInterval = setInterval(() => {
      const timeLeft = delayMs / 1000 - elapsedTime;
      const timeString = Helper.msToTime(timeLeft * 1000);

      // Memperbarui pesan dengan waktu tersisa
      try {
        Twist.log(
          "This account still in countdown ",
          core.acc,
          core,
          `${
            spinnerChars[elapsedTime % spinnerChars.length]
          } Account ${accountIndex} Processing Done, Delaying for ${timeString}`
        );
      } catch (error) {
        console.error("Error logging countdown:", error);
      }

      elapsedTime++;

      // Jika waktu habis, hentikan interval
      if (elapsedTime >= delayMs / 1000) {
        clearInterval(countdownInterval);
        Twist.log(
          "Countdown complete",
          core.acc,
          core,
          "Resuming operations..."
        );
        resolve(); // Selesaikan promise setelah countdown selesai
      }
    }, 1000);
  });
}

async function operateAccount(privateKey) {
  const core = new Core(privateKey);
  try {
    await core.initializeWallet();
    await core.getBalances(true);

    while (true) {
      try {
        if (core.swapCount >= Settup.MAXCOUNT) {
          await countdown(core); // Tunggu hingga countdown selesai
          core.swapCount = 0; // Reset swapCount setelah countdown
        } else {
          await core.performSwap(); // Lakukan swap
        }
        await sleep(1000); // Tunggu sejenak sebelum iterasi berikutnya
      } catch (error) {
        console.error("Error in account operation:", error);
        await core.handleError("Failed to perform swap", error.message);
        await sleep(5000); // Tunggu sebelum mencoba lagi
      }
    }
  } catch (error) {
    await core.handleError(
      "Failed to start bot",
      `on Initial setup error: ${error.message}`
    );
  }
}

(async () => {
  Helper.showLogo();

  if (!Array.isArray(privateKey) || privateKey.length < 1) {
    throw new Error("Please set up accounts.js first");
  }

  // Menggunakan for...of untuk menjalankan setiap akun secara independen
  for (const key of privateKey) {
    operateAccount(key).catch((error) => {
      console.error("Error operating account:", error);
    });
  }
})();
