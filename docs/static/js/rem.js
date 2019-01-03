(function (doc, win) {
  var docEl = doc.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = function () {
      var clientWidth = docEl.clientWidth;
      if (!clientWidth) return;
      // docEl.style.fontSize = 20 * (clientWidth / 320) + 'px';
      // docEl.style.fontSize = 20 * (375 / 320) + 'px'
      docEl.style.fontSize = 20.17857142857143 + 'px'
    };

  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
