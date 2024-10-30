import { ethers } from "ethers";
import { Helper } from "../utils/helper.js";
import { rpc } from "./network/rpc.js";
import { IZUMIABI, WETHABI, ERC20_ABI, poolABI } from "./abi/abi.js";
import Twist from "../utils/twister.js";
import {
  validateAddress,
  getContract,
  tokenDecimals,
} from "./constant/constant.js";
import { Settup } from "../../../settup.js";
import axios from "axios";

import { tokenPath } from "./path/path.js";

export default class Core {
  constructor(accounts) {
    if (!accounts) throw new Error("Accounts are required");
    this.acc = accounts;
    this.UINT256MAX = ethers.MaxUint256;
    this.setupProvider()
      .then(() => this.initializeConstants())
      .then(() => this.initializeWallet())
      .catch((error) => {
        Twist.log(
          `Failed to setup provider`,
          this.acc,
          this,
          `${error.message}`
        );
        return null;
      });
  }

  async setupProvider() {
    const providers = rpc.map((url) =>
      url.startsWith("wss")
        ? new ethers.WebSocketProvider(url)
        : new ethers.JsonRpcProvider(url)
    );

    for (const provider of providers) {
      try {
        this.provider = provider;
        await this.provider.getNetwork();
        this.client = this.provider;
        return;
      } catch (error) {
        this.handleError(
          `Failed connecting to provider`,
          `${provider.connection?.url || "unknown URL"}, error: ${
            error.message
          }`
        );
      }
    }
  }

  async initializeConstants() {
    this.FIXED_GAS_PRICE = ethers.parseUnits(Settup.GASPRICE, "gwei");
    this.WETH = validateAddress(getContract("weth"));
    this.TAIKO = validateAddress(getContract("taiko"));
    this.USDC = validateAddress(getContract("usdc"));
    this.USDT = validateAddress(getContract("usdt"));
    this.ROUTER_ADDRESS = validateAddress(getContract("izumi-swap"));
    this.WETH_ABI = WETHABI;
    this.ERC20_ABI = ERC20_ABI;
    this.ROUTER_ABI = IZUMIABI;

    // Inisialisasi variabel dalam satu objek
    this.txCount = this.swapCount = 0;
    this.walletInstance = null;
    this.balance = [];
    this.address = null;
    this.lastNonce = -1;
    this.rank = this.score = 0;
    this.pendingTransactions = new Map();
  }

  async initializeWallet() {
    try {
      const inputType = Helper.validateInput(this.acc);
      this.walletInstance =
        inputType === "Private Key"
          ? new ethers.Wallet(this.acc, this.provider)
          : ethers.Wallet.fromPhrase(this.acc).connect(this.provider);

      this.address = validateAddress(this.walletInstance.address);
      this.lastNonce = await this.provider.getTransactionCount(this.address);
      this.initializeContracts();
      await Helper.delay(
        2000,
        this.acc,
        this,
        "",
        "Please wait while we set up your wallet."
      );
      await this.getBalances(true);
    } catch (error) {
      await this.handleError(`Failed initializing wallet`, `${error.message}`);
    }
  }

  initializeContracts() {
    const contracts = {
      weth: { address: this.WETH, abi: WETHABI },
      taiko: { address: this.TAIKO, abi: this.ERC20_ABI },
      usdc: { address: this.USDC, abi: this.ERC20_ABI },
      usdt: { address: this.USDT, abi: this.ERC20_ABI },
      swapRouter: { address: this.ROUTER_ADDRESS, abi: this.ROUTER_ABI },
    };

    for (const [key, { address, abi }] of Object.entries(contracts)) {
      this[`${key}Contract`] = new ethers.Contract(
        address,
        abi,
        this.walletInstance
      );
    }
  }

  async encodedPath(path, fees) {
    if (path.length !== fees.length + 1) {
      Twist.log(
        `encodedPath error`,
        this.acc,
        this,
        `path/fee lengths do not match`
      );
      return null; // Mengembalikan null jika ada kesalahan
    }

    return (
      "0x" +
      fees.reduce(
        (encoded, fee, i) =>
          encoded + path[i].slice(2) + fee.toString(16).padStart(6, "0"),
        ""
      ) +
      path[path.length - 1].slice(2)
    );
  }

  async getBalances(update = false) {
    try {
      await this.getUserData(this.address);

      const balances = await Promise.all([
        this.provider.getBalance(this.address),
        this.wethContract.balanceOf(this.address),
        this.taikoContract.balanceOf(this.address),
        this.usdcContract.balanceOf(this.address),
        this.usdtContract.balanceOf(this.address),
      ]);

      this.balance = balances.map((balance, index) =>
        index === 0
          ? Number(ethers.formatEther(balance)).toFixed(8)
          : Number(
              ethers.formatUnits(
                balance.toString(),
                index === 1 || index === 2 ? 18 : 6
              )
            ).toFixed(8)
      );

      if (update) {
        Twist.log(
          "Balance updated!",
          this.acc,
          this,
          "✅ Successfully update Balance"
        );
      }
      return this.balance;
    } catch (error) {
      this.handleError(`Failed update balance`, error);
      return null;
    }
  }

  async checkAndApprove(tokenName) {
    const validTokens = ["usdc", "usdt", "taiko", "weth"];
    if (!validTokens.includes(tokenName.toLowerCase())) {
      return this.handleError(`Token name is not recognized`);
    }

    const tokenAddress = validateAddress(getContract(tokenName));
    if (!tokenAddress) {
      return this.handleError(
        `Invalid token address for ${tokenName}`,
        `Invalid token address`
      );
    }

    const allowance = await this.checkAllowance(
      tokenAddress,
      this.ROUTER_ADDRESS,
      this.address
    );
    let formattedAllowance =
      Number(allowance.toString()) === 0
        ? "0"
        : Number(allowance.toString()) === Number(this.UINT256MAX.toString())
        ? "uint256max"
        : Number(allowance.toString());

    Twist.log(
      `Checking allowance`,
      this.acc,
      this,
      `Allowance for ${tokenName.toUpperCase()}: ${formattedAllowance}`
    );

    if (Number(allowance.toString()) < Number(this.UINT256MAX.toString())) {
      await this.approveToken(
        tokenAddress,
        this.UINT256MAX,
        this.ROUTER_ADDRESS
      );
    }
  }

  async checkAndUnapprove(tokenName) {
    const validTokens = ["usdc", "usdt", "taiko", "weth"];
    if (!validTokens.includes(tokenName.toLowerCase())) {
      return this.handleError(`Token name is not recognized`);
    }

    const tokenAddress = validateAddress(getContract(tokenName));
    if (!tokenAddress) {
      return this.handleError(
        `Invalid token address for ${tokenName}`,
        `Invalid token address`
      );
    }

    const allowance = await this.checkAllowance(
      tokenAddress,
      this.ROUTER_ADDRESS,
      this.address
    );
    let formattedAllowance =
      Number(allowance.toString()) === 0
        ? "0"
        : Number(allowance.toString()) === Number(this.UINT256MAX.toString())
        ? "uint max"
        : Number(allowance.toString());

    Twist.log(
      `Checking allowance`,
      this.acc,
      this,
      `Allowance for ${tokenName.toUpperCase()}: ${formattedAllowance}`
    );
    await this.sleep(2000);
    if (Number(allowance.toString()) === Number(this.UINT256MAX.toString())) {
      await this.approveToken(tokenAddress, 0, this.ROUTER_ADDRESS);
    }
  }

  async checkAllowance(tokenAddress, spender, owner) {
    const smartContract = new ethers.Contract(
      tokenAddress,
      this.ERC20_ABI,
      this.walletInstance
    );
    return await smartContract.allowance(owner, spender);
  }

  async approveToken(tokenAddress, amount, spender) {
    try {
      const smartContract = new ethers.Contract(
        tokenAddress,
        this.ERC20_ABI,
        this.walletInstance
      );
      const tokenName = await smartContract.symbol();

      const formattedAmount =
        amount === 0
          ? "0"
          : amount === this.UINT256MAX
          ? "uint max"
          : amount.toString();
      let action = amount === 0 ? "Unapprove" : "Approve";
      Twist.log(
        `Executing: ${action} ${formattedAmount} ${tokenName} to ${spender}`,
        this.acc,
        this,
        `Starting approval...`
      );
      await this.sleep(1000);
      const tx = await this.handleTransaction(
        () =>
          smartContract.approve(spender, amount, {
            gasLimit: 175000,
            gasPrice: this.FIXED_GAS_PRICE,
          }),
        `${action} ${tokenName}`
      );
      if (!tx) {
        return this.handleError(action, `Transaction failed to send.`);
      }

      await this.waitForTransactionConfirmation(tx.hash, action);
      Twist.log(
        `📋 Transaction executed at tx: ${tx.hash}`,
        this.acc,
        this,
        `✅ ${action} success`
      );
      this.swapCount++;
      await this.sleep(1000);
    } catch (error) {
      console.error(error);
      this.handleError(`Spending Token ${tokenAddress}`, `${error.message}`);
      return null;
    }
  }

  async performSwap() {
    try {
      const balanceEther = Number(
        ethers.formatEther(await this.provider.getBalance(this.address))
      );
      if (balanceEther < Number(Settup.MINIMUMBUY)) {
        return this.handleError(
          `performTransaction failed`,
          `Insufficient balance ETH for swap`
        );
      }

      const tokensToSwap = ["USDT", "USDC", "TAIKO"];

      for (const token of tokensToSwap) {
        let amountIn = await Helper.randomFloat(
          Settup.MINIMUMBUY,
          Settup.MAXBUY,
          8
        ).toString();
        await Helper.delay(
          2000,
          this.acc,
          this,
          `Prepare swapping ${amountIn} ETH into ${token}`,
          ""
        );
        await this.swapEthToToken(
          await this.encodedPath(
            tokenPath[`eth-${token.toLowerCase()}`][0],
            tokenPath[`eth-${token.toLowerCase()}`][1]
          ),
          amountIn,
          "ETH",
          token
        );
      }

      await this.swapAllTokensToWeth();
    } catch (err) {
      console.error(err);
    }
  }

  async swapAllTokensToWeth() {
    try {
      const tokens = ["usdc", "usdt", "taiko"];
      for (const token of tokens) {
        const balance = await this[`${token}Contract`].balanceOf(this.address);
        const formattedBalance = Number(
          ethers.formatUnits(balance, token === "taiko" ? 18 : 6)
        ).toFixed(token === "taiko" ? 8 : 6);
        if (formattedBalance > 0) {
          await Helper.delay(
            2000,
            this.acc,
            this,
            `Prepare swapping ${formattedBalance} ${token.toUpperCase()} into WETH`,
            ""
          );
          await this.swapTokensToWeth(
            await this.encodedPath(
              tokenPath[`${token}-weth`][0],
              tokenPath[`${token}-weth`][1]
            ),
            balance,
            token,
            "WETH"
          );
          await this.checkAndUnapprove(token);
        }
      }

      const wethBalance = await this.wethContract.balanceOf(this.address);
      if (Number(ethers.formatUnits(wethBalance, 18)).toFixed(8) > 0) {
        await Helper.delay(
          2000,
          this.acc,
          this,
          `Prepare unwrapping ${Number(ethers.formatEther(wethBalance)).toFixed(
            8
          )} WETH into ETH`,
          ""
        );
        await this.unwrap(wethBalance);
      }
    } catch (error) {
      console.error(error);
      await this.handleError("Failed swapAllTokensToWeth", error.message);
      return null;
    }
  }

  async swapTokensToWeth(path, amountIn, fromToken, toToken) {
    try {
      await this.checkAndApprove(fromToken.toLowerCase());

      const params = {
        path: path,
        recipient: this.address,
        amount: amountIn,
        minAcquired: 0, // Anda bisa mengganti ini sesuai dengan logika minimum yang diinginkan
        deadline: Math.floor(Date.now() / 1000) + 1800, // Deadline 30 menit dari sekarang
      };

      const data = this.swapRouterContract.interface.encodeFunctionData(
        "swapAmount",
        [params]
      );
      const transaction = {
        to: this.ROUTER_ADDRESS,
        from: this.address,
        value: 0,
        data: data,
        gasLimit: Settup.GASLIMIT,
        gasPrice: this.FIXED_GAS_PRICE,
        nonce: await this.provider.getTransactionCount(this.address),
      };

      const formattedBalance = Number(
        ethers.formatUnits(
          amountIn,
          fromToken.toLowerCase() === "taiko" ? 18 : 6
        )
      ).toFixed(fromToken.toLowerCase() === "taiko" ? 8 : 6);

      try {
        let action = `🔄 Swapping ${formattedBalance} ${fromToken.toUpperCase()} into ${toToken.toUpperCase()}`;
        const tx = await this.retryTransaction(async () => {
          return await this.handleTransaction(
            async () => await this.walletInstance.sendTransaction(transaction),
            action
          );
        });

        if (!tx) {
          this.handleError(action, `Transaction failed to send.`);
          this.swapCount++;
          await this.getBalances(true);
          return;
        }

        const transactionHash = tx.hash || "N/A";
        await this.waitForTransactionConfirmation(transactionHash, action);

        Twist.log(
          `📋 Transaction executed at tx: ${transactionHash}`,
          this.acc,
          this,
          `✅ Swapping ${formattedBalance} ${fromToken.toUpperCase()} to ${toToken.toUpperCase()} success`
        );

        this.swapCount++;
        await this.sleep(1000);
        await this.getBalances(true);
      } catch (error) {
        const errorMessage = error.message || "Unknown error";
        const transactionHash = error.transactionHash || (tx ? tx.hash : "N/A");
        const reason =
          transactionHash !== "N/A"
            ? await this.getTransactionError(transactionHash)
            : "Invalid transaction hash";

        this.handleError(
          `Swapping ${formattedBalance} ETH into USDC`,
          `Error : ${errorMessage} | Transaction Hash: ${transactionHash} | Reason: ${reason}`
        );

        await this.sleep(5000);
        this.handleError(
          `Transaction failed with error: ${errorMessage} | Hash: ${transactionHash} | Reason: ${reason}`,
          `Transaction failed`
        );

        return null;
      }
    } catch (error) {
      console.error(error);
      this.handleError(
        `Failed to swap ${fromToken} to ${toToken}`,
        `${error.message}`
      );
    }
  }

  async swapEthToToken(path, amountIn, fromToken, toToken) {
    try {
      const params = {
        path: path,
        recipient: this.address,
        amount: ethers.parseEther(amountIn),
        minAcquired: 0,
        deadline: Math.floor(Date.now() / 1000) + 1800,
      };

      let encode = this.swapRouterContract.interface.encodeFunctionData(
        "swapAmount",
        [params]
      );
      let call_args = this.swapRouterContract.interface.encodeFunctionData(
        "multicall",
        [[encode, "0x12210e8a"]]
      );

      const transaction = {
        to: this.ROUTER_ADDRESS,
        from: this.address,
        value: ethers.parseEther(amountIn),
        data: call_args,
        gasLimit: Settup.GASLIMIT,
        gasPrice: this.FIXED_GAS_PRICE,
        nonce: await this.provider.getTransactionCount(this.address),
      };
      try {
        let action = `🔄 Swapping ${amountIn} ${fromToken} into ${toToken}`;
        const tx = await this.retryTransaction(async () => {
          return await this.handleTransaction(
            async () => await this.walletInstance.sendTransaction(transaction),
            action
          );
        });

        if (!tx) {
          this.handleError(action, `Transaction failed to send.`);
          this.swapCount++;
          await this.getBalances(true);
          return;
        }

        const transactionHash = tx.hash || "N/A";
        await this.waitForTransactionConfirmation(transactionHash, action);

        Twist.log(
          `📋 Transaction executed at tx: ${transactionHash}`,
          this.acc,
          this,
          `✅ Swapping ${
            Settup.MINIMUMBUY
          } ${fromToken.toUpperCase()} to ${toToken.toUpperCase()} success`
        );

        this.swapCount++;
        await this.sleep(1000);
        await this.getBalances(true);
      } catch (error) {
        const errorMessage = error.message || "Unknown error";
        const transactionHash = error.transactionHash || (tx ? tx.hash : "N/A");
        const reason =
          transactionHash !== "N/A"
            ? await this.getTransactionError(transactionHash)
            : "Invalid transaction hash";

        this.handleError(
          `Swapping ${Settup.MINIMUMBUY} ETH into USDC`,
          `${errorMessage} | Transaction Hash: ${transactionHash} | Reason: ${reason}`
        );

        await this.sleep(5000);
        this.handleError(
          `Transaction failed with error: ${errorMessage} | Hash: ${transactionHash} | Reason: ${reason}`,
          `Transaction failed`
        );

        return null;
      }
    } catch (error) {
      console.error(error);
      await this.handleError("Failed swapTokensToWeth", error.message);
      return null;
    }
  }

  async unwrap(amount) {
    try {
      let encode = await this.wethContract.interface.encodeFunctionData(
        "withdraw",
        [amount.toString()] // Pastikan argumen dibungkus dalam array
      );

      const transaction = {
        to: this.WETH,
        from: this.address,
        value: 0,
        data: encode,
        gasLimit: 155000,
        gasPrice: this.FIXED_GAS_PRICE,
        nonce: await this.provider.getTransactionCount(this.address),
      };

      try {
        let action = `🔄 Unwraping ${Number(
          ethers.formatUnits(amount, 18)
        ).toFixed(8)} WETH into ETH`;
        const tx = await this.retryTransaction(async () => {
          return await this.handleTransaction(
            async () => await this.walletInstance.sendTransaction(transaction),
            action
          );
        });

        if (!tx) {
          this.handleError(action, `Transaction failed to send.`);
          this.swapCount++;
          await this.getBalances(true);
          return;
        }

        const transactionHash = tx.hash || "N/A";
        await this.waitForTransactionConfirmation(transactionHash, action);

        Twist.log(
          `📋 Transaction executed at tx: ${transactionHash}`,
          this.acc,
          this,
          `✅ Unwraping ${Number(ethers.formatUnits(amount, 18)).toFixed(
            8
          )} WETH to ETH success`
        );

        this.swapCount++;
        await this.sleep(1000);
        await this.getBalances(true);
      } catch (error) {
        const errorMessage = error.message || "Unknown error";
        const transactionHash = error.transactionHash || (tx ? tx.hash : "N/A");
        const reason =
          transactionHash !== "N/A"
            ? await this.getTransactionError(transactionHash)
            : "Invalid transaction hash";

        this.handleError(
          `Unwraping ${Number(ethers.formatUnits(amount, 18)).toFixed(
            8
          )} WETH into ETH`,
          `${errorMessage} | Transaction Hash: ${transactionHash} | Reason: ${reason}`
        );

        await this.sleep(5000);
        this.handleError(
          `Transaction failed with error: ${errorMessage} | Hash: ${transactionHash} | Reason: ${reason}`,
          `Transaction failed`
        );

        return null;
      }
    } catch (error) {
      console.error(error);
      this.handleError(`Failed to unwrap WETH`, `❌ Error: ${error.message}`);
    }
  }

  async waitForTransactionConfirmation(txHash, action) {
    // Validasi hash transaksi
    if (!txHash || !/^0x[a-fA-F0-9]{64}$/.test(txHash)) {
      this.handleError(action, "Invalid transaction hash");
      return null;
    }

    let loading;
    const spinnerChars = Settup.animation;
    let elapsedTime = 0;

    try {
      loading = this.startLoadingSpinner(
        spinnerChars,
        elapsedTime,
        action,
        `Waiting for transaction confirmation ${this.formatTxHash(txHash)}`
      );

      const receipt = await this.provider.waitForTransaction(txHash);
      clearInterval(loading);
      process.stdout.write("\r\x1b[K");

      if (receipt.status === 0) {
        const reason = await this.getTransactionError(txHash);
        this.handleError(
          action,
          `Transaction failed: ${reason || "Unknown error"}`
        );
        return null;
      }

      Twist.log(
        action,
        this.acc,
        this,
        `✅ Transaction ${this.formatTxHash(txHash)} confirmed.`
      );
      return receipt;
    } catch (error) {
      console.error(error);
      clearInterval(loading);
      process.stdout.write("\r\x1b[K");
      this.handleError(action, error);
      return null;
    }
  }

  async getTransactionError(txHash) {
    try {
      const receipt = await this.provider.getTransactionReceipt(txHash);
      if (receipt && receipt.logs) {
        for (const log of receipt.logs) {
          const errorEvent = this.swapRouterContract.interface.parseLog(log);
          if (errorEvent) {
            return errorEvent.args[0];
          }
        }
      }
      return "Unknown error";
    } catch (error) {
      this.handleError("Error fetching transaction receipt:", error);
      return "Error fetching transaction receipt";
    }
  }

  async handleTransaction(fn, action) {
    try {
      const tx = await fn();
      if (tx && tx.hash) {
        Twist.log(
          `${action}`,
          this.acc,
          this,
          `✅ Transaction sent, txid: ${tx.hash}`
        );
        await this.sleep(1500);
        return tx;
      } else {
        this.handleError(`${action}`, `Transaction failed to send.`);
        return null;
      }
    } catch (error) {
      console.error(error);
      this.handleError(`${action}`, `during transaction: ${error.message}`);
      return null;
    }
  }

  async retryTransaction(fn, maxAttempts = 1) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        console.error(error);
        if (error.code === "ECONNRESET" && attempt < maxAttempts) {
          const backoffDelay = Math.min(1000 * Math.pow(2, attempt), 10000);
          await Helper.delay(
            backoffDelay,
            this.acc,
            this,
            `Retrying... Attempt ${attempt + 1}/${maxAttempts}`,
            `Previous attempt failed: ${error.message}`
          );
          continue;
        }
      }
    }
    this.handleError(
      `Function retryTransaction failed.`,
      `Max attempts reached, transaction failed.`
    );
    return null;
  }

  async handleError(action, error) {
    Twist.log(action, this.acc, this, `❌ Error : ${error}`);
  }

  startLoadingSpinner(spinnerChars, elapsedTime, action, message) {
    return setInterval(() => {
      const timeString = this.formatElapsedTime(elapsedTime);
      Twist.log(
        action,
        this.acc,
        this,
        `${
          spinnerChars[elapsedTime % spinnerChars.length]
        } ${timeString} ${message}`
      );
      elapsedTime++;
    }, 1000);
  }

  formatElapsedTime(elapsedTime) {
    const hours = Math.floor(elapsedTime / 3600);
    const minutes = Math.floor((elapsedTime % 3600) / 60);
    const seconds = elapsedTime % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  }

  formatTxHash(txHash) {
    return `${txHash.substring(0, 12)}...${txHash
      .slice(-12)
      .split("")
      .reverse()
      .join("")}`;
  }

  async getUserData() {
    try {
      const config = this.createAxiosConfig();
      const result = await axios(config);

      if (result.status === 200) {
        this.score = result.data.score;
        this.rank = result.data.rank;
      } else {
        this.handleError(
          "Failed to get user data.",
          `Unexpected status code: ${result.status}`
        );
        return null;
      }
    } catch (error) {
      this.handleAxiosError(error);
      return null;
    }
  }

  createAxiosConfig() {
    return {
      url: `https://trailblazer.mainnet.taiko.xyz/s2/user/rank?address=${this.address}`,
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
        accept: "application/json, text/plain, */*",
        "accept-language": "id-ID,id;q=0.9",
        "cache-control": "no-cache",
        pragma: "no-cache",
        priority: "u=1, i",
        "sec-ch-ua":
          '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        Referer: "https://trailblazers.taiko.xyz/",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
    };
  }

  handleAxiosError(error) {
    if (error.response) {
      this.handleError(
        "Failed get user data.",
        new Error(`${error.response.status} - ${error.response.data}`)
      );
    } else if (error.request) {
      this.handleError(
        "Failed get user data.",
        new Error(`No response received: ${error.message}`)
      );
    } else {
      this.handleError("Failed get user data.", error);
    }
  }

  async sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
