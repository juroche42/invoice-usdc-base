'use client'

import { txUrl } from '@/lib/chain'

interface TransactionReceiptProps {
  txHash: string
  amount: string
  recipientAddress: string
  token?: string
  invoiceId?: string
  timestamp?: Date
}

/**
 * Composant de reçu de transaction après paiement USDC
 * Affiche :
 * - txHash (avec copie)
 * - Montant
 * - Destinataire
 * - Lien BaseScan
 */
export function TransactionReceipt({
  txHash,
  amount,
  recipientAddress,
  token = 'USDC',
  invoiceId,
  timestamp = new Date(),
}: TransactionReceiptProps) {

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copié dans le presse-papier !')
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* En-tête du reçu */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl shadow-lg overflow-hidden">
        {/* Bandeau de succès */}
        <div className="bg-green-600 text-white py-4 px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-4xl">✅</span>
            <h2 className="text-2xl font-bold">Paiement Confirmé</h2>
          </div>
          <p className="text-green-100 text-sm">
            Transaction enregistrée sur la blockchain
          </p>
        </div>

        {/* Corps du reçu */}
        <div className="p-6 space-y-4">
          {/* Montant principal */}
          <div className="text-center py-6 bg-white rounded-lg border-2 border-green-200 shadow-sm">
            <p className="text-sm text-gray-600 mb-2">Montant payé</p>
            <p className="text-4xl font-bold text-green-700">
              {amount} <span className="text-2xl text-gray-600">{token}</span>
            </p>
          </div>

          {/* Détails de la transaction */}
          <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">

            {/* Transaction Hash */}
            <div className="p-4">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                    Transaction Hash
                  </p>
                  <code className="text-sm font-mono text-gray-900 break-all">
                    {txHash}
                  </code>
                </div>
                <button
                  onClick={() => copyToClipboard(txHash)}
                  className="flex-shrink-0 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-medium rounded transition-colors"
                  title="Copier le hash"
                >
                  📋 Copier
                </button>
              </div>
            </div>

            {/* Destinataire */}
            <div className="p-4">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                    Destinataire
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono text-gray-900">
                      {formatAddress(recipientAddress)}
                    </code>
                    <span className="text-xs text-gray-500">
                      ({recipientAddress})
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(recipientAddress)}
                  className="flex-shrink-0 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-medium rounded transition-colors"
                  title="Copier l'adresse"
                >
                  📋 Copier
                </button>
              </div>
            </div>

            {/* Facture (optionnel) */}
            {invoiceId && (
              <div className="p-4">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Numéro de facture
                </p>
                <p className="text-sm font-mono text-gray-900">{invoiceId}</p>
              </div>
            )}

            {/* Date et heure */}
            <div className="p-4">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                Date et heure
              </p>
              <p className="text-sm text-gray-900">
                {timestamp.toLocaleString('fr-FR', {
                  dateStyle: 'full',
                  timeStyle: 'medium',
                })}
              </p>
            </div>

            {/* Réseau */}
            <div className="p-4">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                Réseau
              </p>
              <p className="text-sm text-gray-900 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                Base Sepolia Testnet
              </p>
            </div>
          </div>

          {/* Lien BaseScan */}
          <a
            href={txUrl(txHash)}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-4 bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg group"
          >
            <span className="flex items-center justify-center gap-2">
              🔍 Voir sur BaseScan
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </a>

          {/* Note informative */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex gap-3">
              <span className="text-xl">ℹ️</span>
              <div className="flex-1 text-sm text-blue-900">
                <p className="font-semibold mb-1">Information importante</p>
                <p className="text-xs text-blue-800">
                  Ce paiement a été enregistré sur la blockchain et ne peut pas être annulé.
                  Conservez ce reçu pour vos archives.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

