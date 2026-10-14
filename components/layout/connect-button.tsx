"use client";

import { useEffect, useState } from "react";
import { Loader2, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/web3/auth-context";
import { hasInjectedProvider, detectWalletName } from "@/lib/web3/wallet-errors";
import { shortHex } from "@/lib/api/format";

export function ConnectButton() {
  const { isAuthenticated, status, address, user, signIn, signOut } = useAuth();
  const [busy, setBusy] = useState(false);
  // Wallet detection reads window, so it can only run after mount. Rendering
  // the "no wallet" state on the first client pass would not match the server
  // markup and React would discard the whole tree.
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleSignIn = async () => {
    setBusy(true);
    try {
      await signIn();
    } catch {
      // Friendly message is surfaced by callers/status; keep the button usable.
    } finally {
      setBusy(false);
    }
  };

  if (isAuthenticated && address) {
  // No wallet extension installed → guide the user instead of erroring.
  if (mounted && !hasInjectedProvider()) {
    return (
      <a
        href="https://metamask.io/download/"
        target="_blank"
        rel="noreferrer"
        title="No wallet detected — install MetaMask to continue"
      >
        <Button size="sm" variant="outline">
          <LogIn className="h-3.5 w-3.5" />
          Install Wallet
        </Button>
      </a>
    );
  }

  return (
      <div className="flex items-center gap-2">
        {user && (
          <span className="hidden rounded-full bg-violet/15 px-2.5 py-1 font-body text-xs font-medium text-violet-400 sm:block">
            ${user.wallet.balanceUsd}
          </span>
        )}
        <Button variant="subtle" size="sm" onClick={signOut}>
          <LogOut className="h-3.5 w-3.5" />
          {shortHex(address)}
        </Button>
      </div>
    );
  }

  const connecting = busy || status === "connecting-wallet";
  const walletName = mounted ? detectWalletName() : "";

  return (
    <Button size="sm" onClick={handleSignIn} disabled={connecting} title={walletName ? `Connect ${walletName}` : undefined}>
      {connecting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LogIn className="h-3.5 w-3.5" />}
      {connecting ? "Connecting…" : "Connect"}
    </Button>
  );
}
