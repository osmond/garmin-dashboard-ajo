// make `require('ui/plugin')` a no‑op so it never blows up
module.exports = function () {
  return function () {};
};
