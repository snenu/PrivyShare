export type AccessState = "unknown" | "owner" | "purchased" | "none";

export function checkAccessState(
  ownerAddress: string | undefined,
  purchaserAddresses: string[],
  currentAddress: string | undefined
): AccessState {
  if (!currentAddress) return "unknown";
  if (ownerAddress && ownerAddress === currentAddress) return "owner";
  if (purchaserAddresses.includes(currentAddress)) return "purchased";
  return "none";
}
