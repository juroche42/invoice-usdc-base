'use client'

import { useAccount, useConnect, useDisconnect, useBalance, useSwitchChain } from 'wagmi'
import { useState, useEffect } from 'react'
import { formatUnits } from 'viem'
import { baseSepolia } from 'wagmi/chains'

export function WalletStatus() {
  const { address, isConnected, chainId, chain } = useAccount()
  const { connect, connectors, isPending, error: connectError } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({ address })
  const { switchChain } = useSwitchChain()
  const [mounted, setMounted] = useState(false)

  // Éviter les erreurs d'hydratation
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg border border-gray-200">
        <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
      </div>
    )
  }

  // État non connecté
  if (!isConnected) {
    return (
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <span className="text-sm font-medium text-gray-700">Wallet non connecté</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-2">
          {connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => connect({ connector })}
              disabled={isPending}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Connexion...
                </>
              ) : (
                `Connecter ${connector.name}`
              )}
            </button>
          ))}
        </div>

        {connectError && (
          <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-xs text-red-700">
            Erreur: {connectError.message}
          </div>
        )}

        <p className="text-xs text-gray-500 mt-2">
          Connectez votre wallet pour interagir avec l&apos;application
        </p>
      </div>
    )
  }

  // État connecté
  const isCorrectChain = chainId === baseSepolia.id

  return (
    <div className={`p-4 rounded-lg border ${isCorrectChain ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-300'}`}>
      {/* Status Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isCorrectChain ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
          <span className="text-sm font-medium text-gray-700">
            {isCorrectChain ? 'Wallet connecté' : 'Mauvais réseau'}
          </span>
        </div>
        <button
          onClick={() => disconnect()}
          className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors font-medium"
        >
          Déconnecter
        </button>
      </div>

      {/* Wallet Info */}
      <div className="space-y-1.5 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 w-16">Adresse:</span>
          <code className="text-xs text-gray-700 font-mono bg-white px-2 py-0.5 rounded">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </code>
          <button
            onClick={() => address && navigator.clipboard.writeText(address)}
            className="text-xs text-blue-600 hover:text-blue-700"
            title="Copier l'adresse"
          >
            📋
          </button>
        </div>

        {balance && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 w-16">Balance:</span>
            <span className="text-xs text-gray-700">
              {parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(4)} {balance.symbol}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 w-16">Réseau:</span>
          <span className="text-xs text-gray-700">
            {chain?.name || 'Inconnu'} (ID: {chainId})
          </span>
        </div>
      </div>

      {/* Wrong Network Warning */}
      {!isCorrectChain && (
        <div className="mt-3 p-2 bg-yellow-100 border border-yellow-300 rounded">
          <p className="text-xs text-yellow-800 mb-2">
            ⚠️ Veuillez vous connecter au réseau Base Sepolia
          </p>
          <button
            onClick={() => switchChain({ chainId: baseSepolia.id })}
            className="px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700 transition-colors font-medium"
          >
            Changer vers Base Sepolia
          </button>
        </div>
      )}
    </div>
  )
}

