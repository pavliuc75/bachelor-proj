function replaceDotsWithCommas(str: string): string {
  return str.toString().replace(".", ",");
}

function replaceCommasWithDots(str: string): string {
  return str.toString().replace(",", ".");
}

function getFormattedPrice(price: number): string {
  return price?.toLocaleString("ro-mo") + " MDL";
}

function underscoreToCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, function (g) {
    return g[1].toUpperCase();
  });
}

export const stringFormatterHelper = {
  replaceDotsWithCommas,
  replaceCommasWithDots,
  getFormattedPrice,
  underscoreToCamelCase,
};
