import { createConfig, fallback, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { monadTestnet } from "viem/chains";

/**
 * Public Monad testnet RPCs. After the user confirms in MetaMask, wagmi waits
 * for the transaction receipt over this transport — if the default public RPC
 * is rate-limited or unreachable, that wait hangs forever (the "stuck loading
 * after confirm" bug). So: multiple RPC fallbacks + per-request timeouts.
 */
const MONAD_RPC_URLS = [
  "https://testnet-rpc.monad.xyz",
  "https://rpc-testnet.monadinfra.com/rpc",
];

export const sutuConfig = createConfig({
  chains: [monadTestnet],
  connectors: [injected()],
  transports: {
    [monadTestnet.id]: fallback(
      [
        http(MONAD_RPC_URLS[0], { timeout: 15_000, retryCount: 1 }),
        http(MONAD_RPC_URLS[1], { timeout: 15_000, retryCount: 0 }),
      ],
      { rank: false },
    ),
  },
});
