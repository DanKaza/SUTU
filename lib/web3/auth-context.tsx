"use client";

/**
 * Auth context.
 *
 * The LIVE backend (tested 2026-09-10) has no SIWE routes yet — `POST
 * /auth/nonce` and `POST /auth/verify` return 404, and protected endpoints
 * authenticate via the `X-Wallet-Address` header instead of a JWT. So
 * "sign in" here means: connect the wallet extension and persist the address
 * for the API client. When the backend ships real SIWE, re-add the
 * nonce → sign → verify flow in `signIn` and switch the client back to
 * Bearer auth.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import {
  clearToken,
  clearWalletAddress,
  getWalletAddress,
  setWalletAddress,
} from "@/lib/api/client";
import { hasInjectedProvider, walletErrorMessage } from "@/lib/web3/wallet-errors";
import type { MeResponse } from "@/lib/api/types";

type AuthStatus = "disconnected" | "connecting-wallet" | "connected";

type AuthContextValue = {
  /** Wallet is connected and its address is available for API auth. */
  isAuthenticated: boolean;
  status: AuthStatus;
  address: `0x${string}` | undefined;
  user: MeResponse | null;
  /** Connect the wallet (if needed) and persist the address for API auth. */
  signIn: () => Promise<MeResponse | null>;
  signOut: () => void;
  /** Refresh the profile (balance + donation counters). */
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { disconnectAsync } = useDisconnect();

  const [status, setStatus] = useState<AuthStatus>("disconnected");
  const [user, setUser] = useState<MeResponse | null>(null);

  const loadUser = useCallback(async () => {
    const { fetchMe } = await import("@/lib/api/endpoints");
    const { data } = await fetchMe();
    setUser(data);
    return data;
  }, []);

  // Rehydrate: wallet already connected (wagmi persistence) or address still
  // in localStorage → load the profile so protected pages work after refresh.
  useEffect(() => {
    const stored = getWalletAddress();
    if (!stored) return;
    let cancelled = false;
    loadUser()
      .then((me) => {
        if (cancelled) return;
        setUser(me);
        setStatus("connected");
      })
      .catch(() => {
        if (!cancelled) {
          clearWalletAddress();
          setStatus("disconnected");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [loadUser]);

  // Keep localStorage in sync with the live wagmi connection (e.g. the user
  // disconnected via the wallet extension itself).
  useEffect(() => {
    if (isConnected && address) {
      if (getWalletAddress() !== address) setWalletAddress(address);
      setStatus((s) => (s === "connected" ? s : "connected"));
    } else if (!isConnected && status === "connected") {
      // Wallet disconnected itself (extension side) — drop the session.
      // Only triggers on genuine disconnect events, not initial hydration,
      // because wagmi restores the connection before this effect re-runs.
      clearWalletAddress();
      setStatus("disconnected");
      setUser(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address]);

  const signIn = useCallback(async (): Promise<MeResponse | null> => {
    try {
      // 0. Make sure a wallet extension actually exists before wagmi throws
      // its cryptic "Provider not found".
      if (!isConnected && !hasInjectedProvider()) {
        throw new Error(
          "No wallet found in this browser. Install MetaMask (metamask.io), then reopen this page.",
        );
      }

      setStatus((s) => (s === "connected" ? s : "connecting-wallet"));

      // 1. Ensure the wallet is connected.
      let wallet: `0x${string}` | undefined = address;
      if (!isConnected || !wallet) {
        const result = await connectAsync({ connector: connectors[0] });
        wallet = result.accounts[0] as `0x${string}`;
      }

      // 2. Persist the address — the API client sends it as X-Wallet-Address.
      setWalletAddress(wallet);

      // 3. Load the profile (auto-creates the user + $1,000 demo balance).
      const me = await loadUser();
      setStatus("connected");
      return me;
    } catch (err) {
      setStatus(isConnected ? "connected" : "disconnected");
      throw new Error(walletErrorMessage(err));
    }
  }, [address, isConnected, connectAsync, connectors, loadUser]);

  const signOut = useCallback(() => {
    clearWalletAddress();
    clearToken();
    setUser(null);
    setStatus(isConnected ? "connecting-wallet" : "disconnected");
    // Best-effort wallet disconnect; ignore rejection (e.g. MetaMask).
    void disconnectAsync().catch(() => undefined).finally(() => setStatus("disconnected"));
  }, [isConnected, disconnectAsync]);

  const refreshUser = useCallback(async () => {
    if (!getWalletAddress()) return;
    try {
      await loadUser();
    } catch {
      // Keep the last known profile on transient errors.
    }
  }, [loadUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: status === "connected" && !!getWalletAddress(),
      status,
      address,
      user,
      signIn,
      signOut,
      refreshUser,
    }),
    // getWalletAddress() is read on every render on purpose — it's a sync
    // localStorage read that tracks the persisted session.
    [status, address, user, signIn, signOut, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
