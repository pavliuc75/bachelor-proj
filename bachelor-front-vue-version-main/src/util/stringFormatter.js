function replaceDotsWithCommas(str) {
  return str.toString().replace(".", ",");
}

function replaceCommasWithDots(str) {
  return str.toString().replace(",", ".");
}

function getFormattedPrice(price) {
  return price?.toLocaleString("ro-mo") + " MDL";
}

function underscoreToCamelCase(str) {
  return str.replace(/_([a-z])/g, function(g) {
    return g[1].toUpperCase();
  });
}

export const stringFormatter = { replaceDotsWithCommas, replaceCommasWithDots, getFormattedPrice, underscoreToCamelCase };
