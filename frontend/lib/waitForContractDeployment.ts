/* eslint-disable @typescript-eslint/no-explicit-any */
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum: any;
  }
}

/**
 * Chờ cho đến khi hợp đồng được triển khai (có code khác "0x") trên blockchain.
 *
 * @param address - Địa chỉ hợp đồng.
 * @param timeout - Thời gian chờ tối đa (ms). Mặc định là 60000 (60 giây).
 * @param interval - Khoảng thời gian giữa các lần kiểm tra (ms). Mặc định là 1000 (1 giây).
 * @returns Một Promise<void> sẽ resolve khi hợp đồng đã được deploy, hoặc reject nếu hết timeout.
 */
export async function waitForContractDeployment(
  address: string,
  timeout = 60000,
  interval = 1000
): Promise<void> {
  if (typeof window === "undefined" || !window.ethereum)
    throw new Error("Ethereum provider not found");

  // Kiểm tra phiên bản của ethers và sử dụng provider tương ứng
  const provider = new ethers.BrowserProvider(window.ethereum as any); // Ethers v6

  const startTime = Date.now();

  while (true) {
    try {
      const code = await provider.getCode(address);
      if (code && code !== "0x") {
        console.log("Contract deployed successfully. Contract code:", code);
        return;
      }

      if (Date.now() - startTime > timeout)
        throw new Error("Timeout waiting for contract deployment");

      await new Promise((resolve) => setTimeout(resolve, interval));
    } catch (error) {
      console.error("Error checking contract code:", error);
      throw error;
    }
  }
}
