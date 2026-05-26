const thaiDateFormatter = new Intl.DateTimeFormat("th-TH", {
  dateStyle: "medium"
});

export function formatThaiDate(value, fallback = "-") {
  if (!value) {
    return fallback;
  }

  return thaiDateFormatter.format(new Date(value));
}
