const ALEO_ADDRESS_REGEX = /^aleo1[0-9a-z]{58}$/;

export function isValidAleoAddress(addr: string): boolean {
  return typeof addr === "string" && ALEO_ADDRESS_REGEX.test(addr.trim());
}
