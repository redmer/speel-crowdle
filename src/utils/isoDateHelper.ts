export type XsdDate = string;

/**
 * Returns a JS Date, given a xsd:date string
 * @param {string} date A date in yyyy-mm-ddZ notation.
 */
export function fromXsdDate(date: XsdDate): Date {
  return new Date(date.replace(/-/g, "/").replace("Z", ""));
}

/**
 * Returns a xsd:date string, in UTC
 * @param {Date} date A date in a local timezone.
 */
export function toXsdDate(date: Date): XsdDate {
  return date.toISOString().split("T")[0] + "Z";
}
