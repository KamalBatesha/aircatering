export default function PriceFormatter(price) {
  // Check for invalid or zero values
  if (price === undefined || price === null || price === false) {
    return "";
  }

  // 1. Convert the number to a locale-specific string (e.g., "1,234,567")
  // Using 'en-US' locale by default for comma separation.
  const priceString = price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  // 2. Pad the string on the left to ensure a total length of 10 characters.
  // If the priceString is "1,234,567" (9 characters), it will add one space
  // at the beginning to make it 10 characters.
  // If the priceString is "123" (3 characters), it will add seven spaces.
  const paddedPrice = priceString.padStart(12, " ");

  return paddedPrice;
}
