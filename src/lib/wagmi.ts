import { http, createConfig } from 'wagmi'
import { baseSepolia, base } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

// Configuration wagmi
export const config = createConfig({
  chains: [baseSepolia, base],
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
    }),
  ],
  transports: {
    [baseSepolia.id]: http(
      process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org'
    ),
    [base.id]: http(
      process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org'
    ),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}

