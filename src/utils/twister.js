import { Twisters } from "twisters";
import Core from "../core/core.js";
import { Settup } from "../../settup.js";

const COLORS = {
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

class Twist {
  constructor() {
    this.twisters = new Twisters();
  }

  log(action = "", accountKey = "", accountData = new Core(), status = "") {
    const accountIndex = Settup.privateKey.indexOf(accountKey);

    const { eth, weth, taiko, usdc, usdt } = this.formatBalances(
      accountData.balance
    );
    const address = this.formatAddress(accountData.address);

    // Tentukan warna berdasarkan status
    let statusColor = COLORS.GREEN; // Default color

    if (status.toLowerCase().includes("error")) {
      statusColor = COLORS.RED; // Warna merah untuk error
    } else if (status.toLowerCase().includes("success")) {
      statusColor = COLORS.GREEN; // Warna hijau untuk sukses
    } else if (status.toLowerCase().includes("done")) {
      statusColor = COLORS.GREEN; // Warna hijau untuk sukses
    } else {
      statusColor = COLORS.YELLOW;
    }

    const template = `${COLORS.RESET}======================= Account ${
      accountIndex + 1
    } ====================
  ┌> Address        ┌> ${address}
  └> Balance        ├> 💰 ${eth}
                    ├> 💰 ${weth}
                    ├> 💰 ${usdc}
                    ├> 💰 ${usdt}
                    └> 💰 ${taiko}

  ├> Tx Count       ├> ${this.formatCount(
    accountData.swapCount,
    Settup.MAXCOUNT
  )}

  ├> Current Rank   ├> ${accountData.rank} 
  ├> Current Score  ├> ${accountData.score}
                
  ┌> Info           ├> ${action}
  └> Status         └> ${statusColor}${status}${COLORS.RESET}
=========================================================\n\n${COLORS.YELLOW}`;

    this.twisters.put(accountKey, {
      spinner: "dots",
      color: "cyan",
      text: template,
    });
  }
  //MAXCOUNT
  formatCount(current, max) {
    return `${current ?? 0} / ${max} ${
      (current ?? 0) === max ? "Finished" : ""
    }`;
  }

  formatAddress(address) {
    if (!address || address === "-") return "-";
    const start = address.substring(0, 12);
    const end = address.slice(-12).split("").reverse().join("");
    return `${start}...${end}`;
  }

  formatBalances(balances = []) {
    try {
      return {
        eth: `${balances[0] ? Number(balances[0]).toFixed(8) : "?"} ETH`,
        weth: `${balances[1] ? Number(balances[1]).toFixed(8) : "?"} WETH`,
        taiko: `${balances[2] ? Number(balances[2]).toFixed(8) : "?"} TAIKO`,
        usdc: `${balances[2] ? Number(balances[3]).toFixed(6) : "?"} USDC`,
        usdt: `${balances[2] ? Number(balances[4]).toFixed(6) : "?"} USDT`,
      };
    } catch (error) {
      return {
        eth: `? ETH`,
        weth: `? WETH`,
        taiko: `? TAIKO`,
        usdc: `? USDC`,
        usdt: `? USDT`,
      };
    }
  }

  info(message = "") {
    this.twisters.put(2, {
      spinner: "dots",
      color: "cyan",
      text: `\n==============================================\nInfo : ${message}\n==============================================\n`,
    });
  }

  clearInfo() {
    this.twisters.remove(2);
  }

  clear(key) {
    this.twisters.remove(key);
  }
}

export default new Twist();
