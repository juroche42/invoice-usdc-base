'use client'

import { useAccount, useConnect, useDisconnect, useBalance, useSwitchChain } from 'wagmi'
import { useState, useEffect } from 'react'
import { formatUnits } from 'viem'
import { baseSepolia, base } from 'wagmi/chains'

// Réseaux supportés avec leurs informations
const SUPPORTED_NETWORKS = [
  {
    chain: baseSepolia,
    name: 'Base Sepolia',
    isPreferred: true,
    color: 'blue',
    icon: '🔵'
  },
  {
    chain: base,
    name: 'Base',
    isPreferred: false,
    color: 'blue',
    icon: '🔵'
  },
]

export function WalletStatus() {
  const { address, isConnected, chainId, chain } = useAccount()
  const { connect, connectors, isPending, error: connectError } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({ address })
  const { switchChain, isPending: isSwitching } = useSwitchChain()
  const [mounted, setMounted] = useState(false)
  const [showNetworkSelector, setShowNetworkSelector] = useState(false)

  // Éviter les erreurs d'hydratation
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  // Trouver le réseau actuel dans les réseaux supportés
  const currentNetwork = SUPPORTED_NETWORKS.find(n => n.chain.id === chainId)
  const preferredNetwork = SUPPORTED_NETWORKS.find(n => n.isPreferred)
  const isCorrectChain = chainId === baseSepolia.id
  const isKnownNetwork = !!currentNetwork

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

  // État connecté - Déterminer le statut du réseau
  const networkStatus = !isKnownNetwork
    ? { bg: 'bg-red-50', border: 'border-red-300', dot: 'bg-red-500', text: 'Réseau non supporté' }
    : !isCorrectChain
    ? { bg: 'bg-yellow-50', border: 'border-yellow-300', dot: 'bg-yellow-500', text: 'Réseau non recommandé' }
    : { bg: 'bg-green-50', border: 'border-green-200', dot: 'bg-green-500', text: 'Connecté' }

  return (
    <div className={`p-4 rounded-lg border ${networkStatus.bg} ${networkStatus.border}`}>
      {/* Status Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${networkStatus.dot}`}></div>
          <span className="text-sm font-medium text-gray-700">
            {networkStatus.text}
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
          <span className="text-xs text-gray-500 w-20">Adresse:</span>
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
            <span className="text-xs text-gray-500 w-20">Balance:</span>
            <span className="text-xs text-gray-700">
              {parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(4)} {balance.symbol}
            </span>
          </div>
        )}

        {/* Contrôle de réseau détaillé */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 w-20">Réseau:</span>
          <div className="flex items-center gap-2">
            {currentNetwork && <span className="text-sm">{currentNetwork.icon}</span>}
            <span className={`text-xs font-medium ${!isKnownNetwork ? 'text-red-600' : isCorrectChain ? 'text-green-700' : 'text-yellow-700'}`}>
              {chain?.name || 'Inconnu'}
            </span>
            <span className="text-xs text-gray-500">(ID: {chainId})</span>
          </div>
        </div>
      </div>

      {/* Network Control Section */}
      {!isKnownNetwork && (
        <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded">
          <div className="flex items-start gap-2 mb-2">
            <span className="text-lg">⛔</span>
            <div className="flex-1">
              <p className="text-xs font-medium text-red-800 mb-1">
                Réseau non supporté
              </p>
              <p className="text-xs text-red-700 mb-3">
                Ce réseau n&apos;est pas supporté par l&apos;application. Veuillez changer vers un réseau supporté.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {SUPPORTED_NETWORKS.map((network) => (
              <button
                key={network.chain.id}
                onClick={() => switchChain({ chainId: network.chain.id })}
                disabled={isSwitching}
                className="w-full px-3 py-2 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSwitching ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Changement...
                  </>
                ) : (
                  <>
                    {network.icon} Passer à {network.name}
                    {network.isPreferred && <span className="text-[10px] bg-white/20 px-1 rounded">Recommandé</span>}
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {isKnownNetwork && !isCorrectChain && (
        <div className="mt-3 p-3 bg-yellow-100 border border-yellow-300 rounded">
          <div className="flex items-start gap-2 mb-2">
            <span className="text-lg">⚠️</span>
            <div className="flex-1">
              <p className="text-xs font-medium text-yellow-800 mb-1">
                Réseau non recommandé
              </p>
              <p className="text-xs text-yellow-700 mb-3">
                Vous êtes sur <strong>{currentNetwork?.name}</strong>. Le réseau recommandé est <strong>{preferredNetwork?.name}</strong>.
              </p>
            </div>
          </div>
          <button
            onClick={() => switchChain({ chainId: baseSepolia.id })}
            disabled={isSwitching}
            className="w-full px-3 py-2 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSwitching ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Changement...
              </>
            ) : (
              <>
                {preferredNetwork?.icon} Changer vers {preferredNetwork?.name}
              </>
            )}
          </button>
        </div>
      )}

      {/* Network Selector Toggle */}
      {isKnownNetwork && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <button
            onClick={() => setShowNetworkSelector(!showNetworkSelector)}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            {showNetworkSelector ? '▼' : '▶'} Changer de réseau
          </button>

          {showNetworkSelector && (
            <div className="mt-2 space-y-1">
              {SUPPORTED_NETWORKS.filter(n => n.chain.id !== chainId).map((network) => (
                <button
                  key={network.chain.id}
                  onClick={() => {
                    switchChain({ chainId: network.chain.id })
                    setShowNetworkSelector(false)
                  }}
                  disabled={isSwitching}
                  className="w-full px-3 py-2 bg-white border border-gray-300 text-xs rounded hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    {network.icon} {network.name}
                  </span>
                  {network.isPreferred && (
                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded">
                      Recommandé
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Success Indicator */}
      {isCorrectChain && (
        <div className="mt-3 p-2 bg-green-100 border border-green-300 rounded flex items-center gap-2">
          <span className="text-sm">✅</span>
          <p className="text-xs text-green-800">
            Vous êtes sur le bon réseau ({preferredNetwork?.name})
          </p>
        </div>
      )}
    </div>
  )
}

