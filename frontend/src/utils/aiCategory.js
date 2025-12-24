export function autoCategorize(title) {
  if (!title) return "Other";

  const text = title.toLowerCase();

  if (
    text.includes("food") ||
    text.includes("pizza") ||
    text.includes("burger") ||
    text.includes("hotel") ||
    text.includes("restaurant") ||
    text.includes("cafe")
  ) {
    return "Food";
  }

  if (
    text.includes("uber") ||
    text.includes("ola") ||
    text.includes("bus") ||
    text.includes("train") ||
    text.includes("fuel") ||
    text.includes("petrol")
  ) {
    return "Transport";
  }

  if (
    text.includes("amazon") ||
    text.includes("flipkart") ||
    text.includes("shopping") ||
    text.includes("mall")
  ) {
    return "Shopping";
  }

  if (
    text.includes("rent") ||
    text.includes("electricity") ||
    text.includes("water") ||
    text.includes("bill") ||
    text.includes("gas")
  ) {
    return "Bills";
  }

  if (
    text.includes("movie") ||
    text.includes("netflix") ||
    text.includes("spotify") ||
    text.includes("game")
  ) {
    return "Entertainment";
  }

  return "Other";
}
