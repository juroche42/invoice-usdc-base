'use client'

import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'
import { useState, useEffect } from 'react'
import { formatUnits } from 'viem'

export function WalletConnect() {
  const { address, isConnected, chainId } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({ address })
  const [mounted, setMounted] = useState(false)

  // Éviter les erreurs d'hydratation
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg border border-gray-200">
        <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
      </div>
    )
  }

  if (isConnected && address) {
    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">Wallet connecté</span>
          </div>
          <p className="text-xs text-gray-600 mt-1 font-mono">
            {address.slice(0, 6)}...{address.slice(-4)}
          </p>
          {balance && (
            <p className="text-xs text-gray-500 mt-1">
              Balance: {parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(4)} {balance.symbol}
            </p>
          )}
          {chainId && (
            <p className="text-xs text-gray-500">
              Chain ID: {chainId}
            </p>
          )}
        </div>
        <button
          onClick={() => disconnect()}
          className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors font-medium"
        >
          Déconnecter
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
        <span className="text-sm font-medium text-gray-700">Wallet non connecté</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {connectors.map((connector) => (
          <button
            key={connector.id}
            onClick={() => connect({ connector })}
            disabled={isPending}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Connexion...' : `${connector.name}`}
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500">
        Connectez votre wallet pour interagir avec l&apos;application
      </p>
    </div>
  )
}

