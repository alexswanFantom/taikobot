import { ethers } from "ethers";

export const tokenDecimals = {
  taiko: 18,
  usdc: 6,
  usdt: 6,
  weth: 18,
};

export const contractAddress = {
  weth: "0xA51894664A773981C6C112C43ce576f315d5b1B6",
  usdt: "0x2DEF195713CF4a606B49D07E520e22C17899a736",
  taiko: "0xA9d23408b9bA935c230493c40C73824Df71A0975",
  usdc: "0x07d83526730c7438048D55A4fc0b850e2aaB6f0b",
  "izumi-swap": "0x04830cfCED9772b8ACbAF76Cfc7A630Ad82c9148",
};

export const routermap = {
  izumi: "0x04830cfCED9772b8ACbAF76Cfc7A630Ad82c9148",
};

// Fungsi untuk memvalidasi alamat
export function validateAddress(address) {
  try {
    return ethers.getAddress(address);
  } catch (error) {
    throw new Error(`Invalid address: ${address}`);
  }
}

// Fungsi untuk mendapatkan alamat token berdasarkan kunci
export function getContract(contractName) {
  if (!(contractName in contractAddress)) {
    throw new Error(`Contract ${contractName} not found in contractAddress`);
  }
  return validateAddress(contractAddress[contractName]);
}
