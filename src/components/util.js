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

function MakeSessionID() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 8; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

export default MakeSessionID;