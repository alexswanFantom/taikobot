export class Settup {
  static SWAPCOUNT = 5; // x7 transaction
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
  static GASPRICE = "0.2";
  static GASLIMIT = 550000;
}
