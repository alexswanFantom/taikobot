const a6_0x460521=a6_0x1b21;function a6_0x1b21(_0x5b7dd9,_0x36b4dc){const _0x27f479=a6_0x27f4();return a6_0x1b21=function(_0x1b2176,_0x5a1415){_0x1b2176=_0x1b2176-0xb1;let _0x2c772d=_0x27f479[_0x1b2176];return _0x2c772d;},a6_0x1b21(_0x5b7dd9,_0x36b4dc);}(function(_0x39e92e,_0x2df05c){const _0x256baa=a6_0x1b21,_0x23fc76=_0x39e92e();while(!![]){try{const _0xe4cb2f=-parseInt(_0x256baa(0xc3))/0x1*(parseInt(_0x256baa(0xc6))/0x2)+parseInt(_0x256baa(0xf3))/0x3*(-parseInt(_0x256baa(0xe9))/0x4)+-parseInt(_0x256baa(0xb8))/0x5*(parseInt(_0x256baa(0xdf))/0x6)+-parseInt(_0x256baa(0xee))/0x7+-parseInt(_0x256baa(0xeb))/0x8*(-parseInt(_0x256baa(0xc7))/0x9)+parseInt(_0x256baa(0xef))/0xa+parseInt(_0x256baa(0xd7))/0xb*(parseInt(_0x256baa(0xc4))/0xc);if(_0xe4cb2f===_0x2df05c)break;else _0x23fc76['push'](_0x23fc76['shift']());}catch(_0x4b9d8b){_0x23fc76['push'](_0x23fc76['shift']());}}}(a6_0x27f4,0x572a3));import{Twisters}from'twisters';import a6_0x4238d2 from'../core/core.js';import{Setup}from'../../setup.js';const COLORS={'BLACK':a6_0x460521(0xb3),'RED':a6_0x460521(0xd3),'GREEN':'\x1b[32m','YELLOW':'\x1b[33m','BLUE':a6_0x460521(0xde),'MAGENTA':a6_0x460521(0xc8),'CYAN':a6_0x460521(0xe0),'WHITE':a6_0x460521(0xb1),'RESET':'\x1b[0m','DIM':a6_0x460521(0xb1),'BOLD':'\x1b[1m'};class Twist{constructor(){const _0x2ed526=a6_0x460521;this[_0x2ed526(0xdd)]=new Twisters();}['log'](_0x227356='',_0x3cea45='',_0x3c6de4=new a6_0x4238d2(),_0x3741ee=''){const _0x53b45f=a6_0x460521,_0x2c69e=Setup[_0x53b45f(0xb6)][_0x53b45f(0xb4)](_0x3cea45),{eth:_0x3e9996,weth:_0x299a3b,taiko:_0xda2031,usdc:_0x273ef5,usdt:_0x29d664}=this[_0x53b45f(0xbf)](_0x3c6de4['balance']),_0x38deaf=this[_0x53b45f(0xd6)](_0x3c6de4['address']);let _0x17d008=COLORS[_0x53b45f(0xc2)];if(_0x3741ee[_0x53b45f(0xbe)]()['includes'](_0x53b45f(0xcb)))_0x17d008=COLORS[_0x53b45f(0xf1)];else{if(_0x3741ee[_0x53b45f(0xbe)]()['includes'](_0x53b45f(0xcd)))_0x17d008=COLORS[_0x53b45f(0xc2)];else _0x3741ee['toLowerCase']()[_0x53b45f(0xcc)](_0x53b45f(0xb7))?_0x17d008=COLORS[_0x53b45f(0xc2)]:_0x17d008=COLORS[_0x53b45f(0xb5)];}const _0x2823c3=_0x53b45f(0xda)+(_0x2c69e+0x1)+_0x53b45f(0xf2)+_0x38deaf+_0x53b45f(0xd0)+_0x3e9996+_0x53b45f(0xce)+_0x299a3b+_0x53b45f(0xce)+_0x273ef5+_0x53b45f(0xce)+_0x29d664+_0x53b45f(0xc5)+_0xda2031+_0x53b45f(0xe8)+_0x3c6de4[_0x53b45f(0xdb)]+_0x53b45f(0xe4)+this['formatCount'](_0x3c6de4['runCount'],Setup[_0x53b45f(0xe3)])+'\x0a\x0a\x20\x20├>\x20Current\x20Rank\x20\x20\x20├>\x20'+_0x3c6de4[_0x53b45f(0xe7)]+_0x53b45f(0xd4)+_0x3c6de4['score']+_0x53b45f(0xcf)+_0x227356+_0x53b45f(0xd1)+_0x17d008+_0x3741ee+COLORS['RESET']+_0x53b45f(0xdc);this['twisters']['put'](_0x3cea45,{'spinner':_0x53b45f(0xb2),'color':_0x53b45f(0xd9),'text':_0x2823c3});}['formatCount'](_0x3ba493,_0x2038d2){const _0x582a55=a6_0x460521;return(_0x3ba493??0x0)+_0x582a55(0xea)+_0x2038d2+'\x20'+((_0x3ba493??0x0)===_0x2038d2?_0x582a55(0xba):'');}['formatAddress'](_0x237700){const _0x57a6fc=a6_0x460521;if(!_0x237700||_0x237700==='-')return'-';const _0x6bb888=_0x237700[_0x57a6fc(0xd2)](0x0,0xc),_0x162440=_0x237700['slice'](-0xc)[_0x57a6fc(0xbc)]('')['reverse']()[_0x57a6fc(0xec)]('');return _0x6bb888+_0x57a6fc(0xbd)+_0x162440;}[a6_0x460521(0xbf)](_0x32abfb=[]){const _0x40a848=a6_0x460521;try{return{'eth':(_0x32abfb[0x0]?Number(_0x32abfb[0x0])[_0x40a848(0xc1)](0x8):'?')+'\x20ETH','weth':(_0x32abfb[0x1]?Number(_0x32abfb[0x1])[_0x40a848(0xc1)](0x8):'?')+_0x40a848(0xe2),'taiko':(_0x32abfb[0x2]?Number(_0x32abfb[0x2])[_0x40a848(0xc1)](0x8):'?')+'\x20TAIKO','usdc':(_0x32abfb[0x2]?Number(_0x32abfb[0x3])[_0x40a848(0xc1)](0x6):'?')+'\x20USDC','usdt':(_0x32abfb[0x2]?Number(_0x32abfb[0x4])['toFixed'](0x6):'?')+_0x40a848(0xd8)};}catch(_0x2c966b){return{'eth':_0x40a848(0xf0),'weth':_0x40a848(0xe6),'taiko':_0x40a848(0xe1),'usdc':_0x40a848(0xca),'usdt':_0x40a848(0xbb)};}}[a6_0x460521(0xe5)](_0x1743ba=''){const _0x25c481=a6_0x460521;this['twisters'][_0x25c481(0xc9)](0x2,{'spinner':'dots','color':_0x25c481(0xd9),'text':_0x25c481(0xc0)+_0x1743ba+'\x0a==============================================\x0a'});}[a6_0x460521(0xd5)](){const _0x340755=a6_0x460521;this['twisters'][_0x340755(0xb9)](0x2);}[a6_0x460521(0xed)](_0x521739){const _0x29d07e=a6_0x460521;this[_0x29d07e(0xdd)][_0x29d07e(0xb9)](_0x521739);}}export default new Twist();function a6_0x27f4(){const _0xde970b=['toFixed','GREEN','7yFtYps','6482436TGkkhl','\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20└>\x20💰\x20','88418douowY','9pwKqee','\x1b[35m','put','?\x20USDC','error','includes','success','\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20├>\x20💰\x20','\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x0a\x20\x20┌>\x20Info\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20├>\x20','\x0a\x20\x20└>\x20Balance\x20\x20\x20\x20\x20\x20\x20\x20├>\x20💰\x20','\x0a\x20\x20└>\x20Status\x20\x20\x20\x20\x20\x20\x20\x20\x20└>\x20','substring','\x1b[31m','\x20\x0a\x20\x20├>\x20Current\x20Score\x20\x20├>\x20','clearInfo','formatAddress','33kHzrmV','\x20USDT','cyan','========================\x20Account\x20','swapCount','\x0a=========================================================\x0a\x0a','twisters','\x1b[34m','306NvosPC','\x1b[36m','?\x20TAIKO','\x20WETH','RUNCOUNT','\x20tx\x0a\x20\x20├>\x20Run\x20Count\x20\x20\x20\x20\x20\x20├>\x20','info','?\x20WETH','rank','\x0a\x0a\x20\x20├>\x20Tx\x20Count\x20\x20\x20\x20\x20\x20\x20├>\x20','11684NVMJVV','\x20/\x20','735864SODiNt','join','clear','4045916BJcYZM','1398460FvBzfi','?\x20ETH','RED','\x20=====================\x0a\x20\x20┌>\x20Address\x20\x20\x20\x20\x20\x20\x20\x20┌>\x20','555fVndWb','\x1b[37m','dots','\x1b[90m','indexOf','YELLOW','privateKey','done','6625clPLyd','remove','Finished','?\x20USDT','split','...','toLowerCase','formatBalances','\x0a==============================================\x0aInfo\x20:\x20'];a6_0x27f4=function(){return _0xde970b;};return a6_0x27f4();}