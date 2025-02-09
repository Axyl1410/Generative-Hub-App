// waitForDeployment.ts

import { BrowserProvider } from "ethers";

// Định nghĩa interface cho Ethereum provider theo tiêu chuẩn EIP-1193
interface EIP1193Provider {
  request(args: { method: string; params?: unknown[] }): Promise<unknown>;
  on?(event: string | symbol, listener: (...args: unknown[]) => void): void;
  removeListener?(event: string | symbol, listener: (...args: unknown[]) => void): void;
}

// Mở rộng interface của Window để thêm thuộc tính ethereum
declare global {
  interface Window {
    ethereum?: EIP1193Provider;
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
  // Kiểm tra nếu window.ethereum tồn tại
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("Ethereum provider not found");
  }

  // Tạo provider từ window.ethereum sử dụng BrowserProvider của ethers v6
  const provider = new BrowserProvider(window.ethereum);
  const startTime = Date.now();

  while (true) {
    try {
      const code = await provider.getCode(address);
      if (code && code !== "0x") {
        console.log("Contract deployed successfully. Contract code:", code);
        return;
      }
      if (Date.now() - startTime > timeout) {
        throw new Error("Timeout waiting for contract deployment");
      }
      // Chờ interval rồi kiểm tra lại
      await new Promise((resolve) => setTimeout(resolve, interval));
    } catch (error) {
      console.error("Error checking contract code:", error);
      throw error;
    }
  }
}
