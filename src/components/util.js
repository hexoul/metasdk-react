export const POSITIONS = [
  'top left',
  'top center',
  'top right',
  'bottom left',
  'bottom center',
  'bottom right',
  'left center',
  'right center',
]

/**
 * Set QRCode style to dst from src
 * @param {map} dst
 * @param {map} src props
 * @param {string} caller name
 */
export function SetQRstyle(dst, src, caller) {
  dst['qrsize'] = src.qrsize > 0 ?  src.qrsize : 128;
  dst['qrvoffset'] = src.qrvoffset >= 0 ? src.qrvoffset : 20;
  dst['qrpadding'] = src.qrpadding ? src.qrpadding : '1em';
  dst['qrposition'] = POSITIONS.includes(src.qrposition) ? src.qrposition : 'bottom right';
  dst['qrtext'] = src.qrtext ? src.qrtext : caller;
}

export function MakeSessionID() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 8; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

export function ConvertVal2Hexd(value) {
  if(value.substring(0,2) != '0x') {
    var hex = parseInt(value,10).toString(16);
    return '0x'+hex;
  } 
  else {
    return value;
  }
}

export function ConvertData2Hexd(data) {
  if(data.substring(0,2) != '0x') {
    var hex = '';
	  for(var i=0;i<data.length;i++) {
		  hex += ''+data.charCodeAt(i).toString(16);
    }
    return '0x'+hex;
  }
  else {
    return data;
  }
}