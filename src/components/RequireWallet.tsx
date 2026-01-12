'use client'

import { useAccount } from 'wagmi'
import { ReactNode } from 'react'

interface RequireWalletProps {
  children: ReactNode
  fallback?: ReactNode
  requireCorrectNetwork?: boolean
  correctNetworkId?: number
}

/**
 * Composant qui bloque l'affichage de son contenu si le wallet n'est pas connecté
 * Affiche un message d'avertissement à la place
 */
export function RequireWallet({
  children,
  fallback,
  requireCorrectNetwork = false,
  correctNetworkId = 84532 // Base Sepolia par défaut
}: RequireWalletProps) {
  const { isConnected, chainId } = useAccount()

  // Pas connecté
  if (!isConnected) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-yellow-900 mb-1">
              Wallet non connecté
            </p>
            <p className="text-xs text-yellow-800">
              Vous devez connecter votre wallet pour accéder à cette fonctionnalité.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Connecté mais mauvais réseau
  if (requireCorrectNetwork && chainId !== correctNetworkId) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="p-4 bg-orange-50 border-2 border-orange-300 rounded-lg">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🔄</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-orange-900 mb-1">
              Mauvais réseau
            </p>
            <p className="text-xs text-orange-800">
              Vous devez être sur le bon réseau pour accéder à cette fonctionnalité.
              Utilisez le sélecteur de réseau ci-dessus.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Tout est OK, afficher le contenu
  return <>{children}</>
}

