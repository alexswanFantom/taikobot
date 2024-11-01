import Twist from "./twister.js";
import bip39 from "bip39";
import moment from "moment-timezone";
import { Setup } from "../../setup.js";
import wcwidth from "wcwidth";

export class Helper {
  static COLORS = {
    BLACK: "\x1b[90m",
    RED: "\x1b[31m",
    GREEN: "\x1b[32m",
    YELLOW: "\x1b[33m",
    BLUE: "\x1b[34m",
    MAGENTA: "\x1b[35m",
    CYAN: "\x1b[36m",
    WHITE: "\x1b[37m",
    RESET: "\x1b[0m",
    DIM: "\x1b[37m",
    BOLD: "\x1b[1m",
  };

  static delay(
    ms,
    accountKey = "",
    accountData = {},
    action = "",
    status = ""
  ) {
    return new Promise((resolve) => {
      let loading;
      const spinnerChars = Setup.animation;
      let spinnerIndex = 0;
      let elapsedTime = 0;

      if (accountKey) {
        Twist.log(action, accountKey, accountData, status);
      }

      loading = setInterval(() => {
        const seconds = Math.floor(elapsedTime % 60);
        Twist.log(
          action,
          accountKey,
          accountData,
          `${spinnerChars[spinnerIndex]} ${seconds}s ${status}...`
        );
        spinnerIndex = (spinnerIndex + 1) % spinnerChars.length;
        elapsedTime++;
      }, 1000);

      setTimeout(() => {
        clearInterval(loading);
        resolve();
      }, ms);
    });
  }

  static logTransactionError(error, action, accountKey = "", accountData = {}) {
    const errorMessage =
      error.reason || error.message || "Transaction reverted without reason.";
    const timestamp = this.getCurrentTimestamp();
    const logMessage = `Transaction failed during action: ${action} - Error: ${errorMessage} at ${timestamp}`;
    Twist.log(action, accountKey, accountData, logMessage, "");
    if (accountKey) {
      const formattedMessage = `Error during action: ${action} Message: ${errorMessage} Timestamp: ${timestamp}`;
      Twist.log(action, accountKey, accountData, formattedMessage, "");
    }
  }

  static randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static randomFloat(min, max, decimals = 4) {
    const minValue = parseFloat(min);
    const maxValue = parseFloat(max);
    return (Math.random() * (maxValue - minValue) + minValue).toFixed(decimals);
  }

  static getCurrentTimestamp(timezone = "Asia/Singapore") {
    return moment().tz(timezone).unix().toString();
  }

  static msToTime(ms) {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.round((ms % 60000) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  static serializeBigInt(obj) {
    return JSON.parse(
      JSON.stringify(obj, (_, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );
  }

  static validateInput(input) {
    const isValidMnemonic = bip39.validateMnemonic(input);
    if (isValidMnemonic) return "Secret Phrase";

    const isValidPrivateKey = /^(0x)?[a-fA-F0-9]{64}$/.test(input);
    return isValidPrivateKey ? "Private Key" : "Unknown";
  }

  static isToday(date) {
    const today = new Date();
    const compareDate = new Date(date);
    return today.toDateString() === compareDate.toDateString();
  }

  static showLogo() {
    const ConsoleColors = {
      RED: "\x1b[31m",
      GREEN: "\x1b[32m",
      WHITE: "\x1b[37m",
      BLACK: "\x1b[30m",
      RESET: "\x1b[0m",
      boldStart: "\x1b[1m",
    };

    const centerLog = (message) => {
      const width = process.stdout.columns || 80;
      const messageWidth = wcwidth(message);
      const padding = Math.max(Math.floor((width - messageWidth) / 2), 0);

      console.log(" ".repeat(padding) + message);
    };

    let banner = "  ";
    ("");
    ("");
    ("");
    ("");
    ("");

    const logoLines = [
      `${ConsoleColors.RED}   █████╗ ██╗██████╗ ██████╗ ██████╗  ██████╗ ██████╗      █████╗ ███████╗ ██████╗`,
      `${ConsoleColors.RED}  ██╔══██╗██║██╔══██╗██╔══██╗██╔══██╗██╔═══██╗██╔══██╗    ██╔══██╗██╔════╝██╔════╝`,
      `${ConsoleColors.RED}  ███████║██║██████╔╝██║  ██║██████╔╝██║   ██║██████╔╝    ███████║███████╗██║     `,
      `${ConsoleColors.WHITE}  ██╔══██║██║██╔══██╗██║  ██║██╔══██╗██║   ██║██╔═══╝     ██╔══██║╚════██║██║      `,
      `${ConsoleColors.WHITE}   ██║  ██║██║██║  ██║██████╔╝██║  ██║╚██████╔╝██║         ██║  ██║███████║╚██████╗  `,
      `${ConsoleColors.WHITE}   ╚═╝  ╚═╝╚═╝╚═╝  ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝            ╚═╝  ╚═╝╚══════╝ ╚═════╝ `,
    ];

    logoLines.forEach(centerLog);

    centerLog(` `);
    centerLog(
      `Auto transaction on ${ConsoleColors.GREEN}TAIKO mainnet ${ConsoleColors.RESET}`
    );
    centerLog(
      `Join to my Group : ${ConsoleColors.GREEN}@autosultan_group${ConsoleColors.RESET}`
    );
    centerLog(
      `Join to my Channel : ${ConsoleColors.GREEN}@airdropasc${ConsoleColors.RESET}`
    );
    centerLog(` `);
    centerLog(
      `Tip me for buying coffee : ${ConsoleColors.GREEN}0xbfA6c7bF6dD515B5200d6aD65d729838dD20aBBE${ConsoleColors.RESET}`
    );
    centerLog(` `);
    centerLog(` `);
  }
}
