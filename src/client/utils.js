export function scrollDown(el) {
  el.scrollTop = el.scrollHeight;
}

export function format() {
  var string = arguments[0];
  var args = Array.prototype.splice.call(arguments, 1);
  return string.replace(/\{(\d+)\}/g, function (m, n) { return args[n]; });
};
