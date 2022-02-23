const B4 = {
  _keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
  encode: function (j) {
    var m = '';
    var d, b, g, v, c, l, k;
    var h = 0;
    j = B4._utf8_encode(j);
    while (h < j.length) {
      d = j.charCodeAt(h++);
      b = j.charCodeAt(h++);
      g = j.charCodeAt(h++);
      v = d >> 2;
      c = ((d & 3) << 4) | (b >> 4);
      l = ((b & 15) << 2) | (g >> 6);
      k = g & 63;
      if (isNaN(b)) {
        l = k = 64;
      } else {
        if (isNaN(g)) {
          k = 64;
        }
      }
      m =
        m +
        this._keyStr.charAt(v) +
        this._keyStr.charAt(c) +
        this._keyStr.charAt(l) +
        this._keyStr.charAt(k);
    }
    return m;
  },
  decode: function (j) {
    var m = '';
    var d, b, g;
    var v, c, l, k;
    var h = 0;
    j = j.replace(/[^A-Za-z0-9\+\/\=]/g, '');
    while (h < j.length) {
      v = this._keyStr.indexOf(j.charAt(h++));
      c = this._keyStr.indexOf(j.charAt(h++));
      l = this._keyStr.indexOf(j.charAt(h++));
      k = this._keyStr.indexOf(j.charAt(h++));
      d = (v << 2) | (c >> 4);
      b = ((c & 15) << 4) | (l >> 2);
      g = ((l & 3) << 6) | k;
      m = m + String.fromCharCode(d);
      if (l != 64) {
        m = m + String.fromCharCode(b);
      }
      if (k != 64) {
        m = m + String.fromCharCode(g);
      }
    }
    m = B4._utf8_decode(m);
    return m;
  },
  _utf8_encode: function (c) {
    c = c.replace(/\r\n/g, '\n');
    var a = '';
    for (var d = 0; d < c.length; d++) {
      var b = c.charCodeAt(d);
      if (b < 128) {
        a += String.fromCharCode(b);
      } else {
        if (b > 127 && b < 2048) {
          a += String.fromCharCode((b >> 6) | 192);
          a += String.fromCharCode((b & 63) | 128);
        } else {
          a += String.fromCharCode((b >> 12) | 224);
          a += String.fromCharCode(((b >> 6) & 63) | 128);
          a += String.fromCharCode((b & 63) | 128);
        }
      }
    }
    return a;
  },
  _utf8_decode: function (c) {
    var a = '';
    var d = 0;
    var c1;
    var c2;
    var c3;
    var b = (c1 = c2 = 0);
    while (d < c.length) {
      b = c.charCodeAt(d);
      if (b < 128) {
        a += String.fromCharCode(b);
        d++;
      } else {
        if (b > 191 && b < 224) {
          c2 = c.charCodeAt(d + 1);
          a += String.fromCharCode(((b & 31) << 6) | (c2 & 63));
          d += 2;
        } else {
          c2 = c.charCodeAt(d + 1);
          c3 = c.charCodeAt(d + 2);
          a += String.fromCharCode(
            ((b & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
          );
          d += 3;
        }
      }
    }
    return a;
  },
};

const dstr = (a) => {
  let str1 = '';
  for (let i = 0; i < a.length; ++i) {
    str1 += String.fromCharCode(a.charCodeAt(i) ^ 14);
  }
  let result = B4.decode(str1);
  return result;
};

console.log(B4.decode('b3N0ZW50YXRpb3Vz'));
let data = dstr("kJf|oYH;TZfdl`TfmcbbT<H>TY_;@IDo`Cwmtmy");
let data1 = data.substr(10);
let correct_answer_idx = data1.substr(0, data1.length - 10);
console.log(correct_answer_idx);
