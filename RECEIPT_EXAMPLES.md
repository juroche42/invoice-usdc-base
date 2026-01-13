# 📚 Exemples d'utilisation des composants de reçu

## Exemple 1 : Usage basique avec USDCPaymentButton

Le plus simple - le reçu s'affiche automatiquement après confirmation :

```tsx
'use client'

import { USDCPaymentButton } from '@/components/USDCPaymentButton'
import { WalletStatus } from '@/components/WalletStatus'

export default function InvoicePage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <WalletStatus />
      
      <div className="mt-6">
        <h1 className="text-2xl font-bold mb-4">Facture INV-001</h1>
        
        <USDCPaymentButton
          recipientAddress="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1"
          amount="100.50"
          invoiceId="INV-001"
        />
      </div>
    </div>
  )
}
```

## Exemple 2 : Avec callbacks personnalisés

```tsx
'use client'

import { USDCPaymentButton } from '@/components/USDCPaymentButton'
import { useState } from 'react'

export default function CustomPaymentPage() {
  const [status, setStatus] = useState<string>('')

  return (
    <div className="max-w-2xl mx-auto p-6">
      {status && (
        <div className="mb-4 p-3 bg-blue-50 rounded">
          <p className="text-sm text-blue-900">{status}</p>
        </div>
      )}
      
      <USDCPaymentButton
        recipientAddress="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1"
        amount="250.00"
        invoiceId="INV-002"
        onTransactionSent={(hash) => {
          setStatus(`Transaction envoyée : ${hash}`)
        }}
        onTransactionConfirmed={(hash) => {
          setStatus(`✅ Transaction confirmée !`)
          // Envoyer un email, notifier le backend, etc.
          console.log('Notifier le backend:', hash)
        }}
        onError={(error) => {
          setStatus(`❌ Erreur : ${error.message}`)
        }}
      />
    </div>
  )
}
```

## Exemple 3 : Affichage manuel du reçu

Si vous voulez gérer l'affichage du reçu manuellement :

```tsx
'use client'

import { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { TransactionReceipt } from '@/components/TransactionReceipt'
import { getUsdcAddress, erc20Abi, parseUsdc } from '@/lib/usdc'

export default function ManualPaymentPage() {
  const { address } = useAccount()
  const [showReceipt, setShowReceipt] = useState(false)
  
  const recipientAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1'
  const amount = '50.00'
  
  const { writeContract, data: hash } = useWriteContract()
  const { isSuccess } = useWaitForTransactionReceipt({ hash })
  
  const handlePay = () => {
    writeContract({
      address: getUsdcAddress(),
      abi: erc20Abi,
      functionName: 'transfer',
      args: [recipientAddress, parseUsdc(amount)],
    })
  }
  
  // Afficher le reçu quand confirmé
  if (isSuccess && hash) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <TransactionReceipt
          txHash={hash}
          amount={amount}
          recipientAddress={recipientAddress}
          invoiceId="INV-003"
        />
        
        <button
          onClick={() => window.location.reload()}
          className="mt-6 w-full px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
        >
          Nouvelle transaction
        </button>
      </div>
    )
  }
  
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Paiement manuel</h1>
      <button
        onClick={handlePay}
        disabled={!address}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        Payer {amount} USDC
      </button>
    </div>
  )
}
```

## Exemple 4 : Version compacte dans une modal

```tsx
'use client'

import { useState } from 'react'
import { TransactionReceiptCompact } from '@/components/TransactionReceiptCompact'

export default function ModalExample() {
  const [showModal, setShowModal] = useState(true)
  
  return (
    <>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Transaction réussie</h2>
            
            <TransactionReceiptCompact
              txHash="0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b"
              amount="75.00"
              recipientAddress="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1"
            />
            
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
      
      <div className="max-w-2xl mx-auto p-6">
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg"
        >
          Afficher le reçu (modal)
        </button>
      </div>
    </>
  )
}
```

## Exemple 5 : Liste de reçus (historique)

```tsx
'use client'

import { TransactionReceiptCompact } from '@/components/TransactionReceiptCompact'

interface Transaction {
  id: string
  txHash: string
  amount: string
  recipientAddress: string
  timestamp: Date
}

export default function TransactionHistoryPage() {
  // En pratique, charger depuis une API ou localStorage
  const transactions: Transaction[] = [
    {
      id: '1',
      txHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
      amount: '100.00',
      recipientAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
      timestamp: new Date('2026-01-13T10:30:00'),
    },
    {
      id: '2',
      txHash: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c',
      amount: '250.00',
      recipientAddress: '0x851Cc1e9f1d1c5532925a3b844Bc9e7595f0bEb2',
      timestamp: new Date('2026-01-12T15:45:00'),
    },
  ]
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Historique des transactions</h1>
      
      <div className="space-y-4">
        {transactions.map((tx) => (
          <div key={tx.id} className="border rounded-lg p-4">
            <div className="mb-2 flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {tx.timestamp.toLocaleDateString('fr-FR', {
                  dateStyle: 'long',
                })}
              </span>
              <span className="text-xs text-gray-500">#{tx.id}</span>
            </div>
            
            <TransactionReceiptCompact
              txHash={tx.txHash}
              amount={tx.amount}
              recipientAddress={tx.recipientAddress}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
```

## Exemple 6 : Reçu avec export

```tsx
'use client'

import { useRef } from 'react'
import { TransactionReceipt } from '@/components/TransactionReceipt'

export default function ReceiptWithExportPage() {
  const receiptRef = useRef<HTMLDivElement>(null)
  
  const handlePrint = () => {
    window.print()
  }
  
  const handleDownloadPDF = () => {
    // En pratique, utiliser une lib comme jsPDF ou html2canvas
    alert('Fonctionnalité d\'export PDF à implémenter')
  }
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6 flex gap-3 print:hidden">
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
        >
          🖨️ Imprimer
        </button>
        <button
          onClick={handleDownloadPDF}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          📄 Télécharger PDF
        </button>
      </div>
      
      <div ref={receiptRef}>
        <TransactionReceipt
          txHash="0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b"
          amount="500.00"
          recipientAddress="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1"
          invoiceId="INV-2026-042"
          timestamp={new Date()}
        />
      </div>
    </div>
  )
}
```

## Exemple 7 : Intégration avec système de factures

```tsx
'use client'

import { useState } from 'react'
import { USDCPaymentButton } from '@/components/USDCPaymentButton'
import { TransactionReceipt } from '@/components/TransactionReceipt'

interface Invoice {
  id: string
  amount: string
  recipient: string
  status: 'pending' | 'paid'
  txHash?: string
}

export default function InvoiceSystemPage() {
  const [invoice, setInvoice] = useState<Invoice>({
    id: 'INV-2026-001',
    amount: '1000.00',
    recipient: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
    status: 'pending',
  })
  
  const handlePaymentConfirmed = (hash: string) => {
    // Mettre à jour l'invoice localement
    setInvoice({ ...invoice, status: 'paid', txHash: hash })
    
    // Notifier le backend (optionnel)
    // fetch('/api/invoices/' + invoice.id, {
    //   method: 'PATCH',
    //   body: JSON.stringify({ txHash: hash }),
    // })
  }
  
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Facture {invoice.id}</h1>
      
      {invoice.status === 'pending' ? (
        <USDCPaymentButton
          recipientAddress={invoice.recipient as `0x${string}`}
          amount={invoice.amount}
          invoiceId={invoice.id}
          onTransactionConfirmed={handlePaymentConfirmed}
        />
      ) : (
        <div>
          <div className="mb-4 p-3 bg-green-50 border border-green-300 rounded">
            <p className="text-sm text-green-900 font-semibold">
              ✅ Facture payée
            </p>
          </div>
          
          {invoice.txHash && (
            <TransactionReceipt
              txHash={invoice.txHash}
              amount={invoice.amount}
              recipientAddress={invoice.recipient}
              invoiceId={invoice.id}
            />
          )}
        </div>
      )}
    </div>
  )
}
```

## 🎯 Cas d'usage recommandés

| Cas d'usage | Composant recommandé |
|-------------|---------------------|
| Paiement de facture complet | `USDCPaymentButton` (avec reçu auto) |
| Affichage de transaction passée | `TransactionReceipt` |
| Liste d'historique | `TransactionReceiptCompact` |
| Modal de confirmation | `TransactionReceiptCompact` |
| Page de détail de transaction | `TransactionReceipt` |
| Email de confirmation | Extraire les props de `TransactionReceipt` |

## 💡 Bonnes pratiques

1. **Toujours vérifier la confirmation** avant d'afficher le reçu
2. **Conserver le txHash** pour pouvoir réafficher le reçu plus tard
3. **Ne pas mettre à jour automatiquement** le statut côté serveur
4. **Permettre à l'utilisateur de télécharger/imprimer** le reçu
5. **Afficher clairement** que le paiement est irréversible

