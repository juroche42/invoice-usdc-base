'use client'

import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits } from 'viem'
import { useState } from 'react'

interface PayInvoiceButtonProps {
  invoiceId: string
  recipientAddress: `0x${string}`
  amount: string
  usdcAddress: `0x${string}`
  usdcAbi: any
}

export function PayInvoiceButton({
  invoiceId,
  recipientAddress,
  amount,
  usdcAddress,
  usdcAbi,
}: PayInvoiceButtonProps) {
  const { address, isConnected, chainId } = useAccount()
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const [isApproving, setIsApproving] = useState(false)

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  // Vérifier que l'utilisateur est sur Base Sepolia (chainId 84532)
  const isCorrectNetwork = chainId === 84532

  const handlePayment = async () => {
    if (!isConnected) {
      alert('Veuillez connecter votre wallet')
      return
    }

    if (!isCorrectNetwork) {
      alert('Veuillez vous connecter au réseau Base Sepolia')
      return
    }

    try {
      setIsApproving(true)

      // Envoyer la transaction USDC
      writeContract({
        address: usdcAddress,
        abi: usdcAbi,
        functionName: 'transfer',
        args: [recipientAddress, parseUnits(amount, 6)], // USDC a 6 décimales
      })
    } catch (err) {
      console.error('Erreur lors du paiement:', err)
    } finally {
      setIsApproving(false)
    }
  }

  // État de non-connexion
  if (!isConnected) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          ⚠️ Connectez votre wallet pour payer cette facture
        </p>
      </div>
    )
  }

  // Mauvais réseau
  if (!isCorrectNetwork) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-800">
          ⚠️ Veuillez vous connecter au réseau Base Sepolia
        </p>
      </div>
    )
  }

  // Transaction réussie
  if (isSuccess && hash) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-green-600 text-xl">✅</span>
          <span className="font-medium text-green-800">Paiement réussi !</span>
        </div>
        <p className="text-sm text-green-700 mb-2">
          La facture #{invoiceId} a été payée avec succès.
        </p>
        <a
          href={`https://sepolia.basescan.org/tx/${hash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-700 underline"
        >
          Voir la transaction sur BaseScan →
        </a>
      </div>
    )
  }

  // Erreur
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-800 mb-2">
          ❌ Erreur lors du paiement
        </p>
        <p className="text-xs text-red-600">
          {error.message}
        </p>
        <button
          onClick={handlePayment}
          className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    )
  }

  // Bouton de paiement
  return (
    <div className="space-y-3">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Montant à payer:</span>
          <span className="text-lg font-bold text-gray-900">{amount} USDC</span>
        </div>
        <div className="flex justify-between items-center text-xs text-gray-600">
          <span>Destinataire:</span>
          <code className="bg-white px-2 py-1 rounded font-mono">
            {recipientAddress.slice(0, 6)}...{recipientAddress.slice(-4)}
          </code>
        </div>
      </div>

      <button
        onClick={handlePayment}
        disabled={isPending || isConfirming || isApproving}
        className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isPending || isConfirming || isApproving ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            {isConfirming ? 'Confirmation...' : 'Transaction en cours...'}
          </>
        ) : (
          <>
            💳 Payer {amount} USDC
          </>
        )}
      </button>

      {isConfirming && hash && (
        <p className="text-xs text-center text-gray-600">
          Transaction soumise. En attente de confirmation...
        </p>
      )}
    </div>
  )
}

