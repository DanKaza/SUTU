"use client";

/**
 * Wallet detection + error translation.
 *
 * "Provider" in wagmi errors = the EIP-1193 wallet extension injected into the
 * browser (MetaMask, Rabby, Coinbase Wallet, ...). When none exists the
 * injected connector throws `ProviderNotFoundError` — the user just needs to
 * install a wallet, so we detect that case up front and say so plainly.
 */

export type InjectedEip1193Provider = {
  request: (args: { method: string; params?: unknown[] | object }) => Promise<unknown>;
  on?: (...args: unknown[]) => void;
  removeListener?: (...args: unknown[]) => void;
  isMetaMask?: boolean;
};

declare global {
  interface Window {
    ethereum?: InjectedEip1193Provider & Record<string, unknown>;
  }
}

/** True when any EIP-1193 wallet extension is present in this browser. */
export function hasInjectedProvider(): boolean {
  if (typeof window === "undefined") return false;
  return typeof window.ethereum?.request === "function";
}

/** Common wallets, best-effort detection for UI hints. */
export function detectWalletName(): string | null {
  if (!hasInjectedProvider()) return null;
  const eth = window.ethereum as Record<string, unknown> | undefined;
  if (!eth) return null;
  if (eth.isMetaMask) return "MetaMask";
  if (eth.isRabby) return "Rabby";
  if (eth.isCoinbaseWallet) return "Coinbase Wallet";
  if (eth.isTrust || eth.isTrustWallet) return "Trust Wallet";
  return "Wallet";
}

/**
 * Translate raw wallet/wagmi errors into short, human messages.
 * Unrecognized errors are returned as-is (they may contain useful details).
 */
export function walletErrorMessage(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err);

  if (/Provider not found/i.test(raw)) {
    return "No wallet found in this browser. Install MetaMask, then reopen this page.";
  }
  if (/UserRejectedRequestError|User rejected|user rejected|User denied/i.test(raw)) {
    return "Request rejected in wallet. Approve it to continue.";
  }
  if (/-32603|4902|Unrecognized chain|Added chain|already exists/i.test(raw)) {
    return "Couldn't add the Monad testnet to your wallet. Add it manually and try again.";
  }
  if (/ChainNotConfigured|chainId/i.test(raw) && /not configured|unsupported/i.test(raw)) {
    return "Your wallet is on the wrong network. Switch to Monad testnet.";
  }
  if (/insufficient funds/i.test(raw)) {
    return "Not enough MON in your wallet for this transaction (need value + gas).";
  }
  return raw;
}
