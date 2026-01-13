'use client'

import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { useState, useEffect } from 'react'
import { formatUnits } from 'viem'
import { getUsdcAddress, erc20Abi, USDC_DECIMALS, parseUsdc } from '@/lib/usdc'
import { txUrl } from '@/lib/chain'

// États UX du composant
type PaymentState = 'idle' | 'signing' | 'pending' | 'confirmed' | 'error'

interface USDCPaymentButtonProps {
  recipientAddress: `0x${string}`
  amount: string // Montant en USDC format humain (ex: "100.50")
  invoiceId?: string
  onTransactionSent?: (hash: string) => void
  onTransactionConfirmed?: (hash: string) => void
  onError?: (error: Error) => void
  onStateChange?: (state: PaymentState) => void
}

/**
 * Composant de paiement USDC avec :
 * - Appel à USDC.transfer(to, amount)
 * - Gestion de la signature
 * - Attente du minage
 * - Aucune logique "PAID" automatique
 * - États UX: idle, signing, pending, confirmed, error
 */
export function USDCPaymentButton({
  recipientAddress,
  amount,
  invoiceId,
  onTransactionSent,
  onTransactionConfirmed,
  onError,
  onStateChange,
}: USDCPaymentButtonProps) {
  const { address, isConnected, chainId } = useAccount()
  const [paymentState, setPaymentState] = useState<PaymentState>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const usdcAddress = getUsdcAddress()
  const amountInWei = parseUsdc(amount)

  // Vérifier le réseau (Base Sepolia = 84532)
  const isCorrectNetwork = chainId === 84532

  // Lire le solde USDC de l'utilisateur
  const { data: balance } = useReadContract({
    address: usdcAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  })

  // Écriture du contrat (transfer)
  const {
    writeContract,
    data: hash,
    isPending: isWritePending,
    error: writeError,
    reset: resetWrite
  } = useWriteContract()

  // Attente de la confirmation de la transaction
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: receiptError
  } = useWaitForTransactionReceipt({
    hash,
  })

  // Vérifier si l'utilisateur a assez d'USDC
  const hasEnoughBalance = balance ? balance >= amountInWei : false

  // Fonction pour changer l'état
  const changeState = (newState: PaymentState) => {
    setPaymentState(newState)
    if (onStateChange) {
      onStateChange(newState)
    }
  }

  // Gestion automatique des états selon les hooks wagmi
  useEffect(() => {
    if (writeError || receiptError) {
      changeState('error')
      const error = writeError || receiptError
      setErrorMessage(error?.message || 'Une erreur est survenue')
      if (onError) {
        onError(error as Error)
      }
    } else if (isWritePending) {
      changeState('signing')
    } else if (isConfirming && hash) {
      changeState('pending')
    } else if (isConfirmed && hash) {
      changeState('confirmed')
      if (onTransactionConfirmed) {
        onTransactionConfirmed(hash)
      }
    }
  }, [isWritePending, isConfirming, isConfirmed, writeError, receiptError, hash])

  // Handler de paiement
  const handlePayment = async () => {
    if (!isConnected || !address) {
      alert('Veuillez connecter votre wallet')
      return
    }

    if (!isCorrectNetwork) {
      alert('Veuillez vous connecter au réseau Base Sepolia')
      return
    }

    if (!hasEnoughBalance) {
      alert(`Solde USDC insuffisant. Vous avez ${balance ? formatUnits(balance, USDC_DECIMALS) : '0'} USDC, vous avez besoin de ${amount} USDC`)
      return
    }

    try {
      changeState('signing')

      // Appel de USDC.transfer(to, amount)
      writeContract({
        address: usdcAddress,
        abi: erc20Abi,
        functionName: 'transfer',
        args: [recipientAddress, amountInWei],
      }, {
        onSuccess: (txHash) => {
          if (onTransactionSent) {
            onTransactionSent(txHash)
          }
        },
      })
    } catch (error) {
      changeState('error')
      setErrorMessage((error as Error).message || 'Une erreur est survenue')
      console.error('Erreur lors du paiement:', error)
      if (onError) {
        onError(error as Error)
      }
    }
  }

  // Handler pour réinitialiser (retry)
  const handleReset = () => {
    resetWrite()
    setErrorMessage(null)
    changeState('idle')
  }

  // Rendu basé sur l'état du paiement
  const renderByState = () => {
    // État: error
    if (paymentState === 'error') {
      return (
        <div className="space-y-3">
          <div className="p-4 bg-red-50 border-2 border-red-300 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="text-2xl">❌</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-900 mb-1">
                  Erreur lors du paiement
                </p>
                <p className="text-xs text-red-800 mb-2">
                  {errorMessage || 'Une erreur est survenue'}
                </p>
                <p className="text-xs text-red-700">
                  État: <code className="bg-red-100 px-1 rounded">error</code>
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="w-full px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            🔄 Réessayer
          </button>
        </div>
      )
    }

    // État: confirmed
    if (paymentState === 'confirmed' && hash) {
      return (
        <div className="space-y-4">
          <TransactionReceipt
            txHash={hash}
            amount={amount}
            recipientAddress={recipientAddress}
            token="USDC"
            invoiceId={invoiceId}
            timestamp={new Date()}
          />
        </div>
      )
    }

    // État: pending
    if (paymentState === 'pending' && hash) {
      return (
        <div className="space-y-3">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-900 mb-1">
                  Transaction en cours de minage...
                </p>
                <p className="text-xs text-blue-800 mb-2">
                  Votre paiement de <strong>{amount} USDC</strong> est en cours de confirmation sur la blockchain.
                </p>
                <p className="text-xs text-blue-700 mb-2">
                  État: <code className="bg-blue-100 px-1 rounded">pending</code>
                </p>
                <a
                  href={txUrl(hash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-700 hover:text-blue-900 underline underline-offset-2"
                >
                  Suivre sur BaseScan →
                </a>
              </div>
            </div>
          </div>

          <button
            disabled
            className="w-full px-6 py-3 bg-gray-400 text-white font-medium rounded-lg cursor-wait opacity-60 flex items-center justify-center gap-2"
          >
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Confirmation en cours...
          </button>
        </div>
      )
    }

    // État: signing
    if (paymentState === 'signing') {
      return (
        <div className="space-y-3">
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-purple-900 mb-1">
                  En attente de signature...
                </p>
                <p className="text-xs text-purple-800 mb-1">
                  Veuillez signer la transaction dans votre wallet
                </p>
                <p className="text-xs text-purple-700">
                  État: <code className="bg-purple-100 px-1 rounded">signing</code>
                </p>
              </div>
            </div>
          </div>

          <button
            disabled
            className="w-full px-6 py-3 bg-gray-400 text-white font-medium rounded-lg cursor-wait opacity-60"
          >
            ✍️ Signature en cours...
          </button>
        </div>
      )
    }

    // État: idle (par défaut)
    return (
      <div className="space-y-3">
        {/* Récapitulatif du paiement */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Montant à payer:</span>
              <span className="text-xl font-bold text-blue-900">{amount} USDC</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-600">Destinataire:</span>
              <code className="bg-white px-2 py-1 rounded font-mono text-gray-800">
                {recipientAddress.slice(0, 6)}...{recipientAddress.slice(-4)}
              </code>
            </div>

            {balance !== undefined && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">Votre solde USDC:</span>
                <span className="font-medium text-gray-800">
                  {formatUnits(balance, USDC_DECIMALS)} USDC
                </span>
              </div>
            )}

            {invoiceId && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">Facture:</span>
                <span className="font-medium text-gray-800">{invoiceId}</span>
              </div>
            )}

            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-600">État:</span>
              <code className="bg-gray-100 px-1 rounded text-gray-800">idle</code>
            </div>
          </div>
        </div>

        {/* Bouton de paiement */}
        <button
          onClick={handlePayment}
          disabled={!hasEnoughBalance}
          className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
        >
          <span className="text-lg">💳</span>
          Payer {amount} USDC
        </button>

        {/* Information */}
        <div className="p-3 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600">
          <p className="flex items-start gap-2">
            <span>ℹ️</span>
            <span>
              Le paiement sera effectué via USDC.transfer() sur Base Sepolia.
              Vous devrez signer la transaction dans votre wallet et attendre la confirmation on-chain.
            </span>
          </p>
        </div>
      </div>
    )
  }
  // État: Wallet non connecté (blocage)
  if (!isConnected) {
    return (
      <div className="space-y-3">
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg opacity-60">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Montant à payer:</span>
            <span className="text-lg font-bold text-gray-900">{amount} USDC</span>
          </div>
        </div>

        <div className="p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔒</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-yellow-900 mb-1">
                Action bloquée - Wallet non connecté
              </p>
              <p className="text-xs text-yellow-800">
                Connectez votre wallet pour effectuer le paiement en USDC.
              </p>
            </div>
          </div>
        </div>

        <button
          disabled
          className="w-full px-6 py-3 bg-gray-400 text-white font-medium rounded-lg cursor-not-allowed opacity-60"
        >
          🔒 Connectez votre wallet
        </button>
      </div>
    )
  }

  // État: Mauvais réseau (blocage)
  if (!isCorrectNetwork) {
    return (
      <div className="space-y-3">
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg opacity-60">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Montant à payer:</span>
            <span className="text-lg font-bold text-gray-900">{amount} USDC</span>
          </div>
        </div>

        <div className="p-4 bg-orange-50 border-2 border-orange-300 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔄</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-orange-900 mb-1">
                Action bloquée - Mauvais réseau
              </p>
              <p className="text-xs text-orange-800">
                Vous devez être sur Base Sepolia pour effectuer ce paiement.
              </p>
            </div>
          </div>
        </div>

        <button
          disabled
          className="w-full px-6 py-3 bg-gray-400 text-white font-medium rounded-lg cursor-not-allowed opacity-60"
        >
          🔒 Changez de réseau
        </button>
      </div>
    )
  }

  // État: Solde insuffisant (blocage)
  if (balance !== undefined && !hasEnoughBalance) {
    return (
      <div className="space-y-3">
        <div className="p-4 bg-red-50 border-2 border-red-300 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-2xl">❌</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-900 mb-1">
                Solde USDC insuffisant
              </p>
              <p className="text-xs text-red-800 mb-2">
                Solde actuel: {formatUnits(balance, USDC_DECIMALS)} USDC<br/>
                Montant requis: {amount} USDC
              </p>
              <p className="text-xs text-red-700">
                Veuillez obtenir plus d&apos;USDC avant de continuer.
              </p>
            </div>
          </div>
        </div>

        <button
          disabled
          className="w-full px-6 py-3 bg-gray-400 text-white font-medium rounded-lg cursor-not-allowed opacity-60"
        >
          ❌ Solde insuffisant
        </button>
      </div>
    )
  }

  // Rendu principal basé sur l'état
  return renderByState()
}
