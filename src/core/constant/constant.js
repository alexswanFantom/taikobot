import { ethers } from "ethers";

export const tokenDecimals = {
  taiko: 18,
  usdc: 6,
  usdt: 6,
  weth: 18,
};

export const contractAddress = {
  weth: "0xA51894664A773981C6C112C43ce576f315d5b1B6",
  eth: "0xA51894664A773981C6C112C43ce576f315d5b1B6",
  usdt: "0x2DEF195713CF4a606B49D07E520e22C17899a736",
  taiko: "0xA9d23408b9bA935c230493c40C73824Df71A0975",
  usdc: "0x07d83526730c7438048D55A4fc0b850e2aaB6f0b",
  "izumi-swap": "0x04830cfCED9772b8ACbAF76Cfc7A630Ad82c9148",
  "ritsu-swap": "0x7160570BB153Edd0Ea1775EC2b2Ac9b65F1aB61B",
  "henjin-swap": "0x07Bc9a408B385C7Aa8De2783795759512fE24356",
  "kodo-swap": "0xd04d75E1CDe512b195E70C6c18Cf7Ec4b2B12f41",
};

export const routermap = {
  izumi: "0x04830cfCED9772b8ACbAF76Cfc7A630Ad82c9148",
  henjin: "0x07Bc9a408B385C7Aa8De2783795759512fE24356",
  kodo: "0xd04d75E1CDe512b195E70C6c18Cf7Ec4b2B12f41",
};

export function validateAddress(address) {
  try {
    return ethers.getAddress(address);
  } catch (error) {
    throw new Error(`Invalid address: ${address}`);
  }
}

export function getContract(contractName) {
  if (!(contractName in contractAddress)) {
    throw new Error(`Contract ${contractName} not found in contractAddress`);
  }
  return validateAddress(contractAddress[contractName]);
}
