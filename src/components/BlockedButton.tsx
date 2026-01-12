'use client'

import { useAccount } from 'wagmi'
import { ReactNode } from 'react'

interface BlockedButtonProps {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
  requireWallet?: boolean
  requireCorrectNetwork?: boolean
  correctNetworkId?: number
  blockedMessage?: string
}

/**
 * Bouton qui se bloque automatiquement si le wallet n'est pas connecté
 * ou si l'utilisateur est sur le mauvais réseau
 */
export function BlockedButton({
  children,
  onClick,
  disabled = false,
  className = '',
  requireWallet = true,
  requireCorrectNetwork = false,
  correctNetworkId = 84532, // Base Sepolia
  blockedMessage,
}: BlockedButtonProps) {
  const { isConnected, chainId } = useAccount()

  const isBlocked =
    (requireWallet && !isConnected) ||
    (requireCorrectNetwork && chainId !== correctNetworkId)

  const getBlockedReason = () => {
    if (requireWallet && !isConnected) {
      return blockedMessage || '🔒 Connectez votre wallet'
    }
    if (requireCorrectNetwork && chainId !== correctNetworkId) {
      return blockedMessage || '🔒 Changez de réseau'
    }
    return null
  }

  if (isBlocked) {
    return (
      <button
        disabled
        className={`cursor-not-allowed opacity-50 ${className}`}
        title={getBlockedReason() || 'Action bloquée'}
      >
        {getBlockedReason() || children}
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  )
}

