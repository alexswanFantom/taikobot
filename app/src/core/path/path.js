import { validateAddress, getContract } from "../constant/constant.js";

export const tokenPath = {
  "weth-usdc": [
    [
      validateAddress(getContract("weth")),
      validateAddress(getContract("usdc")),
    ],
    [3000],
  ],

  "eth-usdc": [
    [
      validateAddress(getContract("weth")),
      validateAddress(getContract("usdc")),
    ],
    [3000],
  ],
  "usdc-eth": [
    [
      validateAddress(getContract("usdc")),
      validateAddress(getContract("weth")),
    ],
    [3000],
  ],

  "usdc-weth": [
    [
      validateAddress(getContract("usdc")),
      validateAddress(getContract("weth")),
    ],
    [3000],
  ],

  "weth-usdt": [
    [
      validateAddress(getContract("weth")),
      validateAddress(getContract("usdc")),
      validateAddress(getContract("usdt")),
    ],
    [3000, 500],
  ],

  "eth-usdt": [
    [
      validateAddress(getContract("weth")),
      validateAddress(getContract("usdc")),
      validateAddress(getContract("usdt")),
    ],
    [3000, 500],
  ],

  "usdt-weth": [
    [
      validateAddress(getContract("usdt")),
      validateAddress(getContract("usdc")),
      validateAddress(getContract("weth")),
    ],
    [500, 3000],
  ],

  "usdt-eth": [
    [
      validateAddress(getContract("usdt")),
      validateAddress(getContract("usdc")),
      validateAddress(getContract("weth")),
    ],
    [500, 3000],
  ],

  "weth-taiko": [
    [
      validateAddress(getContract("weth")),
      validateAddress(getContract("usdc")),
      validateAddress(getContract("taiko")),
    ],
    [3000, 3000],
  ],

  "eth-taiko": [
    [
      validateAddress(getContract("weth")),
      validateAddress(getContract("usdc")),
      validateAddress(getContract("taiko")),
    ],
    [3000, 3000],
  ],

  "taiko-weth": [
    [
      validateAddress(getContract("taiko")),
      validateAddress(getContract("usdc")),
      validateAddress(getContract("weth")),
    ],
    [3000, 3000],
  ],

  "taiko-eth": [
    [
      validateAddress(getContract("taiko")),
      validateAddress(getContract("usdc")),
      validateAddress(getContract("weth")),
    ],
    [3000, 3000],
  ],

  // "taiko-weth": [
  //   [
  //     validateAddress(getContract("taiko")),
  //     validateAddress(getContract("weth")),
  //   ],
  //   [1000],
  // ],

  // "taiko-usdt": [
  //   [
  //     validateAddress(getContract("taiko")),
  //     validateAddress(getContract("usdc")),
  //     validateAddress(getContract("usdt")),
  //   ],
  //   [3000, 500],
  // ],

  // "usdt-taiko": [
  //   [
  //     validateAddress(getContract("usdt")),
  //     validateAddress(getContract("usdc")),
  //     validateAddress(getContract("taiko")),
  //   ],
  //   [500, 3000],
  // ],
};
