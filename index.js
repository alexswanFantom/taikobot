import { Setup } from "./setup.js";
import Core from "./src/core/core.js";
import { Helper } from "./src/utils/helper.js";
import Twist from "./src/utils/twister.js";
const privateKey = Setup.privateKey;

async function sleep(ms) {
  if (ms < 0) throw new Error("Sleep time must be a non-negative number");
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function countdown(core) {
  const delayMs = 3600000 * Setup.DELAYINHOURS;
  const accountIndex =
    Setup.privateKey.indexOf(core.walletInstance.privateKey) + 1;
  const spinnerChars = Setup.animation;
  let elapsedTime = 0;

  return new Promise((resolve) => {
    const countdownInterval = setInterval(() => {
      const timeLeft = delayMs / 1000 - elapsedTime;
      const timeString = Helper.msToTime(timeLeft * 1000);
      try {
        Twist.log(
          "This account still in countdown ",
          core.acc,
          core,
          `${
            spinnerChars[elapsedTime % spinnerChars.length]
          } Account ${accountIndex} Processing Done, Daily Max Reached, Delaying for ${timeString}`
        );
      } catch (error) {
        console.error("Error logging countdown:", error);
      }

      elapsedTime++;
      if (elapsedTime >= delayMs / 1000) {
        clearInterval(countdownInterval);
        Twist.log(
          "Countdown complete",
          core.acc,
          core,
          "Resuming operations..."
        );
        resolve();
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
        if (core.runCount >= Setup.RUNCOUNT) {
          await countdown(core);
          core.runCount = 0;
        } else {
          await core.performSwap();
        }
        await sleep(1000);
      } catch (error) {
        console.error("Error in account operation:", error);
        await core.handleError("Failed to perform swap", error.message);
        await sleep(5000);
      }
    }
  } catch (error) {
    await core.handleError(
      "Failed to start bot",
      `on Initial Setup error: ${error.message}`
    );
  }
}

(async () => {
  Helper.showLogo();

  if (!Array.isArray(privateKey) || privateKey.length < 1) {
    throw new Error("Please set up Setup.js first");
  }

  for (const key of privateKey) {
    operateAccount(key).catch((error) => {
      console.error("Error operating account:", error);
    });
  }
})();
