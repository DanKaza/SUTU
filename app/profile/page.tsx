"use client";

/**
 * Profile — fed by GET /users/me (profile + demo wallet stats),
 * plus GET /wallet/balance and GET /wallet/history for the ledger view.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bookmark,
  History,
  Loader2,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { useAuth } from "@/lib/web3/auth-context";
import { ConnectButton } from "@/components/layout/connect-button";
import { fetchWalletBalance, fetchWalletHistory } from "@/lib/api/endpoints";
import { shortHex } from "@/lib/api/format";
import type { WalletHistoryEntry } from "@/lib/api/types";

const KIND_LABELS: Record<WalletHistoryEntry["kind"], string> = {
  SIGNUP_BONUS: "Signup bonus",
  DONATION: "Donation",
  REFUND: "Refund",
  ADJUSTMENT: "Adjustment",
};

export default function ProfilePage() {
  const { isAuthenticated, status, address, user, signOut } = useAuth();
  const [history, setHistory] = useState<WalletHistoryEntry[]>([]);
  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setHistory([]);
      setBalance(null);
      return;
    }
    let cancelled = false;

    fetchWalletBalance()
      .then(({ data }) => {
        if (!cancelled) setBalance(data.balanceUsd);
      })
      .catch(() => undefined);

    fetchWalletHistory(10, 0)
      .then(({ data }) => {
        if (!cancelled) setHistory(data);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const displayAddress = address ?? user?.walletAddress ?? null;

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <motion.h1
        variants={fadeInUp}
        initial="hidden"
        animate="show"
        className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl"
      >
        Profile
      </motion.h1>

      <motion.div variants={fadeInUp} initial="hidden" animate="show" className="mt-8">
        <Card className="flex items-center gap-4 p-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ink font-display text-lg font-bold text-void">
            {displayAddress ? displayAddress.slice(2, 3).toUpperCase() : <User className="h-5 w-5" />}
          </div>
          <div className="flex-1">
            {isAuthenticated && user ? (
              <>
                <p className="font-display text-lg font-bold text-ink">
                  {shortHex(user.walletAddress, 6)}
                </p>
                <p className="font-body text-sm text-muted">
                  Member since {new Date(user.memberSince).toLocaleDateString()} · Balance ${user.wallet.balanceUsd}
                </p>
              </>
            ) : status === "connecting-wallet" ? (
              <>
                <p className="font-display text-lg font-bold text-ink">Connecting…</p>
                <p className="font-body text-sm text-muted">
                  Approve the connection in your wallet.
                </p>
              </>
            ) : (
              <>
                <p className="font-display text-lg font-bold text-ink">Guest</p>
                <p className="font-body text-sm text-muted">
                  Connect your wallet to unlock your $1,000 demo balance.
                </p>
              </>
            )}
          </div>
          {isAuthenticated ? (
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </Button>
          ) : (
            <ConnectButton />
          )}
        </Card>
      </motion.div>

      {isAuthenticated && (
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="mt-6 flex flex-col gap-3">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body text-xs text-muted">Demo wallet balance</p>
                <p className="font-display text-2xl font-bold text-ink">
                  {balance ? `$${balance}` : <Loader2 className="h-5 w-5 animate-spin text-muted" />}
                </p>
              </div>
              <div className="text-right">
                <p className="font-body text-xs text-muted">Total donated</p>
                <p className="font-display text-lg font-bold text-violet">${user?.wallet.totalDonatedUsd ?? "0.00"}</p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <p className="font-body text-xs font-medium uppercase tracking-wide text-muted">
              Recent wallet activity
            </p>
            {history.length === 0 ? (
              <p className="mt-3 font-body text-sm text-muted">No activity yet.</p>
            ) : (
              <ul className="mt-3 flex flex-col divide-y divide-white/10 divide-white/10">
                {history.map((entry) => (
                  <li key={entry.id} className="flex items-center justify-between py-2.5">
                    <div>
                      <p className="font-body text-sm font-medium text-ink">
                        {KIND_LABELS[entry.kind] ?? entry.kind}
                      </p>
                      <p className="font-body text-xs text-muted">
                        {new Date(entry.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-body text-sm font-bold ${
                          entry.amount_usd.startsWith("-") ? "text-ink" : "text-violet"
                        }`}
                      >
                        ${entry.amount_usd}
                      </p>
                      <p className="font-body text-xs text-muted">
                        bal. ${entry.balance_after}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </motion.div>
      )}

      <div className="mt-6 flex flex-col gap-3">
        <Link href="/my-supports">
          <Card className="flex items-center gap-3 p-4 transition-colors duration-200 ease-quintic-out hover:border-violet-400">
            <History className="h-4 w-4 text-muted" />
            <span className="flex-1 font-body text-sm font-medium text-ink">My Supports</span>
            <ArrowRight className="h-4 w-4 text-muted" />
          </Card>
        </Link>

        <Card className="flex items-center gap-3 p-4 opacity-60">
          <Bookmark className="h-4 w-4 text-muted" />
          <span className="flex-1 font-body text-sm font-medium text-ink">
            Saved Communities
          </span>
          <span className="font-body text-xs text-muted/70">Coming soon</span>
        </Card>

        <Card className="flex items-center gap-3 p-4 opacity-60">
          <Settings className="h-4 w-4 text-muted" />
          <span className="flex-1 font-body text-sm font-medium text-ink">Settings</span>
          <span className="font-body text-xs text-muted/70">Coming soon</span>
        </Card>
      </div>

      <div className="mt-8 flex items-center gap-2 font-body text-xs text-muted/70">
        <User className="h-3.5 w-3.5" />
        {isAuthenticated ? "Signed in with Ethereum (SIWE)" : "Connected via Wallet (mock)"}
      </div>
    </div>
  );
}
