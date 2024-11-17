import { fromBech32 } from "@cosmjs/encoding";

/**
 * validate bech32address
 * @param address - cosmos address
 * @returns boolean
 */
export function validateBech32Address(address: string): {
  valid: boolean;
  errorMsg?: string;
} {
  try {
    const { prefix, data } = fromBech32(address);

    if (!["neutron", "cosmos"].includes(prefix)) {
      return {
        valid: false,
        errorMsg: `Invalid prefix for address: ${prefix}`,
      };
    }

    if (data.length < 20) {
      console.error(`Address data too short: ${data.length} bytes`);
      return {
        valid: false,
        errorMsg: `Address data too short: ${data.length} bytes`,
      };
    }

    return { valid: true, errorMsg: "" };
  } catch (error: any) {
    return { valid: false, errorMsg: `Invalid Bech32: ${error.message}` };
  }
}
