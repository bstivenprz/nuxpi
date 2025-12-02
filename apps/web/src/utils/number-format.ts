export const numberFormat = Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
}).format;
