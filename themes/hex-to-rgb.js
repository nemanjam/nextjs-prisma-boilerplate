function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  const obj = result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;

  // just numbers, no rgb() here but in with-opacity
  // rgb(255 255 255 / 1);
  return obj ? `${obj.r} ${obj.g} ${obj.b}` : null;
}

module.exports = hexToRgb;
