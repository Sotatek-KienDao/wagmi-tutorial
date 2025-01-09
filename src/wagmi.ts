import { http, cookieStorage, createConfig, createStorage } from "wagmi";
import { mainnet, sepolia, polygonAmoy } from "wagmi/chains";
import {
  coinbaseWallet,
  injected,
  walletConnect,
  metaMask,
} from "wagmi/connectors";

export function getConfig() {
  return createConfig({
    chains: [mainnet, sepolia, polygonAmoy],
    connectors: [
      injected(),
      coinbaseWallet(),
      metaMask(),
      walletConnect({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || "" }),
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
      [polygonAmoy.id]: http(),
    },
  });
}

declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}
