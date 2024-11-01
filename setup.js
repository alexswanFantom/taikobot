export class Setup {
  static SWAPCOUNT = 1; // 1x run = x13 transaction
  static MAXCOUNT = this.SWAPCOUNT * 13;
  static DELAYINHOURS = 24;
  static privateKey = [""];

  static animation = [
    "🕛",
    "🕐",
    "🕑",
    "🕒",
    "🕓",
    "🕔",
    "🕕",
    "🕖",
    "🕗",
    "🕘",
    "🕙",
  ];

  static SLIPPAGE = 0.3; // 3% slippage
  static MINIMUMBUY = "0.000015"; //
  static MAXBUY = "0.00005";
  static DELAY = 0.1;
  static DELAYINHOURS = 24;
  static GASPRICE = "0.2"; // 1000 point
  static GASLIMIT = 382135; // you can  change
}
