# 💳 Système de Paiement USDC - Documentation

## Vue d'ensemble

Le système de paiement USDC permet d'effectuer des paiements on-chain avec :
- ✅ Appel direct à `USDC.transfer(to, amount)`
- ✅ Gestion complète de la signature utilisateur
- ✅ Attente du minage et confirmation on-chain
- ✅ **AUCUNE logique "PAID" automatique**

---

## 🎯 Composant Principal

### `<USDCPaymentButton />`

Composant complet de paiement USDC avec gestion de tous les états.

#### Import
```tsx
import { USDCPaymentButton } from '@/components/USDCPaymentButton'
```

#### Utilisation
```tsx
<USDCPaymentButton
  recipientAddress="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
  amount="100.50"
  invoiceId="INV-001"
  onTransactionSent={(hash) => console.log('TX sent:', hash)}
  onTransactionConfirmed={(hash) => console.log('TX confirmed:', hash)}
  onError={(error) => console.error('Error:', error)}
/>
```

#### Props

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `recipientAddress` | `0x${string}` | ✅ | Adresse du destinataire |
| `amount` | string | ✅ | Montant en USDC (ex: "100.50") |
| `invoiceId` | string | ❌ | ID de la facture (affichage) |
| `onTransactionSent` | (hash: string) => void | ❌ | Callback après signature |
| `onTransactionConfirmed` | (hash: string) => void | ❌ | Callback après confirmation |
| `onError` | (error: Error) => void | ❌ | Callback en cas d'erreur |

---

## 🔄 Flux de Paiement

### Étape 1: Préparation
```
Utilisateur clique sur "Payer X USDC"
↓
Vérifications:
  ✓ Wallet connecté ?
  ✓ Réseau correct (Base Sepolia) ?
  ✓ Solde USDC suffisant ?
```

### Étape 2: Signature
```
Appel writeContract() avec USDC.transfer()
↓
État: "En attente de signature..."
↓
MetaMask s'ouvre
↓
Utilisateur signe la transaction
↓
Callback: onTransactionSent(hash)
```

### Étape 3: Minage
```
Transaction soumise au réseau
↓
État: "Transaction en cours de minage..."
↓
Attente de la confirmation (useWaitForTransactionReceipt)
↓
Lien BaseScan disponible pour suivre
```

### Étape 4: Confirmation
```
Transaction minée et confirmée
↓
État: "Paiement confirmé !"
↓
Callback: onTransactionConfirmed(hash)
↓
Affichage du lien BaseScan
↓
⚠️ AUCUNE mise à jour automatique du statut
```

---

## 📊 États du Composant

Le composant gère 9 états différents :

### 1. ❌ Wallet Non Connecté
```
┌─────────────────────────────────────┐
│ 🔒 Action bloquée                   │
│ Wallet non connecté                  │
│                                      │
│ [🔒 Connectez votre wallet]         │
└─────────────────────────────────────┘
```

### 2. 🔄 Mauvais Réseau
```
┌─────────────────────────────────────┐
│ 🔄 Action bloquée                   │
│ Mauvais réseau                       │
│                                      │
│ [🔒 Changez de réseau]              │
└─────────────────────────────────────┘
```

### 3. ❌ Solde Insuffisant
```
┌─────────────────────────────────────┐
│ ❌ Solde USDC insuffisant           │
│ Solde actuel: 50 USDC               │
│ Montant requis: 100 USDC            │
│                                      │
│ [❌ Solde insuffisant]              │
└─────────────────────────────────────┘
```

### 4. ✅ Prêt à Payer
```
┌─────────────────────────────────────┐
│ Montant à payer: 100.50 USDC        │
│ Destinataire: 0x1234...5678         │
│ Votre solde: 500 USDC               │
│                                      │
│ [💳 Payer 100.50 USDC]              │
│                                      │
│ ℹ️ Vous devrez signer dans wallet   │
└─────────────────────────────────────┘
```

### 5. ✍️ En Attente de Signature
```
┌─────────────────────────────────────┐
│ 🔄 En attente de signature...       │
│ Veuillez signer dans votre wallet   │
│                                      │
│ [✍️ Signature en cours...]          │
└─────────────────────────────────────┘
```

### 6. ⏳ Transaction en Minage
```
┌─────────────────────────────────────┐
│ 🔄 Transaction en cours de minage   │
│ Paiement de 100.50 USDC en cours    │
│ [Suivre sur BaseScan →]             │
│                                      │
│ [⏳ Confirmation en cours...]       │
└─────────────────────────────────────┘
```

### 7. ✅ Paiement Confirmé
```
┌─────────────────────────────────────┐
│ ✅ Paiement confirmé !              │
│                                      │
│ ✓ Montant: 100.50 USDC              │
│ ✓ Destinataire: 0x1234...5678       │
│ ✓ Facture: INV-001                  │
│                                      │
│ [Voir la transaction sur BaseScan]  │
│                                      │
│ ℹ️ Aucune mise à jour automatique   │
└─────────────────────────────────────┘
```

### 8. ❌ Erreur
```
┌─────────────────────────────────────┐
│ ❌ Erreur lors du paiement          │
│ User rejected the request           │
│                                      │
│ [🔄 Réessayer]                      │
└─────────────────────────────────────┘
```

---

## 🔧 Implémentation Technique

### Appel du Contrat USDC

```typescript
writeContract({
  address: usdcAddress,              // 0x036CbD53842c5426634e7929541eC2318f3dCF7e
  abi: erc20Abi,                     // ABI minimal ERC-20
  functionName: 'transfer',          // Fonction transfer
  args: [recipientAddress, amountInWei], // (to, amount)
})
```

### Vérification du Solde

```typescript
const { data: balance } = useReadContract({
  address: usdcAddress,
  abi: erc20Abi,
  functionName: 'balanceOf',
  args: [userAddress],
})

const hasEnoughBalance = balance >= amountInWei
```

### Attente de Confirmation

```typescript
const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
  hash, // Hash de la transaction
})
```

---

## 🎯 Callbacks

### onTransactionSent(hash)

Appelé immédiatement après la signature de la transaction.

```typescript
<USDCPaymentButton
  onTransactionSent={(hash) => {
    console.log('Transaction envoyée:', hash)
    // Vous pouvez :
    // - Enregistrer le hash en BDD
    // - Afficher une notification
    // - Logger l'événement
  }}
/>
```

### onTransactionConfirmed(hash)

Appelé quand la transaction est confirmée on-chain.

```typescript
<USDCPaymentButton
  onTransactionConfirmed={(hash) => {
    console.log('Transaction confirmée:', hash)
    // Vous pouvez :
    // - Enregistrer la confirmation en BDD
    // - Envoyer un email de confirmation
    // - Mettre à jour un état local
    // ⚠️ MAIS PAS de mise à jour automatique "PAID"
  }}
/>
```

### onError(error)

Appelé en cas d'erreur (rejet de signature, erreur réseau, etc.).

```typescript
<USDCPaymentButton
  onError={(error) => {
    console.error('Erreur:', error)
    // Vous pouvez :
    // - Logger l'erreur
    // - Afficher une notification
    // - Envoyer à un service de monitoring
  }}
/>
```

---

## 📝 Exemple Complet

### Page de Facture

```tsx
// src/app/invoice/[id]/page.tsx
import { USDCPaymentButton } from '@/components/USDCPaymentButton'
import { WalletStatus } from '@/components/WalletStatus'
import { getInvoiceById } from '@/lib/invoices'
import { formatUsdc } from '@/lib/usdc'

export default function InvoicePage({ params }: { params: { id: string } }) {
  const invoice = getInvoiceById(params.id)

  return (
    <div>
      {/* Status du wallet */}
      <WalletStatus />

      {/* Détails de la facture */}
      <section>
        <h1>{invoice.reference}</h1>
        <p>Montant: {formatUsdc(invoice.amountUsdc)} USDC</p>
        
        {/* Paiement USDC */}
        <USDCPaymentButton
          recipientAddress={invoice.vendorAddress as `0x${string}`}
          amount={formatUsdc(invoice.amountUsdc)}
          invoiceId={invoice.reference}
          onTransactionSent={(hash) => {
            console.log('✅ Transaction envoyée:', hash)
          }}
          onTransactionConfirmed={(hash) => {
            console.log('✅ Transaction confirmée:', hash)
            // Votre logique custom ici
            // SANS mise à jour automatique du statut
          }}
          onError={(error) => {
            console.error('❌ Erreur:', error)
          }}
        />
      </section>
    </div>
  )
}
```

---

## 🔐 Sécurité

### Vérifications Automatiques

Le composant effectue les vérifications suivantes :

1. ✅ **Wallet connecté** - Bloque si non connecté
2. ✅ **Réseau correct** - Vérifie Base Sepolia (chainId 84532)
3. ✅ **Solde suffisant** - Vérifie le solde USDC avant paiement
4. ✅ **Adresse valide** - TypeScript garantit le format `0x${string}`
5. ✅ **Montant valide** - Conversion avec `parseUsdc()`

### Gestion des Erreurs

| Erreur | Comportement |
|--------|--------------|
| User rejected | Affiche message + bouton Réessayer |
| Insufficient balance | Bloque le paiement + message clair |
| Wrong network | Bloque le paiement + message |
| Contract error | Affiche l'erreur + bouton Réessayer |
| Network error | Affiche l'erreur + bouton Réessayer |

---

## 🧪 Tests Recommandés

### Test 1: Paiement Complet

```bash
1. Ouvrir une facture
2. Connecter MetaMask sur Base Sepolia
3. S'assurer d'avoir assez d'USDC
4. Cliquer sur "Payer X USDC"
5. ✓ Vérifier que MetaMask s'ouvre
6. Signer la transaction
7. ✓ Vérifier l'état "En attente de signature"
8. ✓ Vérifier l'état "Transaction en cours de minage"
9. ✓ Cliquer sur le lien BaseScan
10. Attendre la confirmation
11. ✓ Vérifier l'état "Paiement confirmé"
12. ✓ Vérifier que le callback onTransactionConfirmed est appelé
13. ✓ Vérifier qu'AUCUNE mise à jour automatique "PAID" n'est faite
```

### Test 2: Solde Insuffisant

```bash
1. Ouvrir une facture avec montant > solde
2. ✓ Vérifier le message "Solde USDC insuffisant"
3. ✓ Vérifier que le bouton est grisé
4. ✓ Vérifier l'affichage du solde actuel vs requis
```

### Test 3: Rejet de Signature

```bash
1. Cliquer sur "Payer X USDC"
2. Dans MetaMask, cliquer sur "Reject"
3. ✓ Vérifier le message d'erreur
4. ✓ Vérifier le bouton "Réessayer"
5. Cliquer sur "Réessayer"
6. ✓ Vérifier que le processus recommence
```

### Test 4: Mauvais Réseau

```bash
1. Connecter MetaMask sur Ethereum Mainnet
2. Ouvrir une facture
3. ✓ Vérifier le message "Mauvais réseau"
4. ✓ Vérifier que le bouton est bloqué
5. Changer vers Base Sepolia
6. ✓ Vérifier que le bouton devient actif
```

---

## 📊 Intégration

### Fichiers Créés

1. **`src/components/USDCPaymentButton.tsx`** - Composant de paiement complet

### Fichiers Modifiés

2. **`src/app/invoice/[id]/page.tsx`** - Intégration du composant

### Hooks Wagmi Utilisés

- `useAccount()` - Info du compte connecté
- `useReadContract()` - Lecture du solde USDC
- `useWriteContract()` - Appel de USDC.transfer()
- `useWaitForTransactionReceipt()` - Attente de confirmation

---

## ⚙️ Configuration

### Adresse USDC

Par défaut: **Base Sepolia USDC** (0x036CbD53842c5426634e7929541eC2318f3dCF7e)

Pour changer (`.env.local`):
```env
NEXT_PUBLIC_USDC_ADDRESS=0xYourCustomUSDCAddress
```

### Réseau Requis

Par défaut: **Base Sepolia** (chainId 84532)

Pour changer dans le composant:
```typescript
const isCorrectNetwork = chainId === 8453 // Base mainnet
```

---

## 🎯 Points Importants

### ✅ CE QUI EST FAIT

- ✅ Appel direct à `USDC.transfer(to, amount)`
- ✅ Gestion complète de la signature utilisateur
- ✅ Attente du minage avec useWaitForTransactionReceipt
- ✅ 9 états différents gérés (connecté, signature, minage, confirmé, erreur, etc.)
- ✅ Vérifications de sécurité (solde, réseau, connexion)
- ✅ Callbacks pour hooks personnalisés (onTransactionSent, onTransactionConfirmed)
- ✅ Interface utilisateur complète et claire
- ✅ Liens vers BaseScan pour suivre la transaction

### ❌ CE QUI N'EST PAS FAIT (VOULU)

- ❌ **AUCUNE mise à jour automatique du statut "PAID"**
- ❌ Pas d'API call après confirmation
- ❌ Pas de modification de la BDD
- ❌ Pas de changement d'état de la facture

### 🎯 Responsabilité du Développeur

C'est à VOUS de décider quoi faire dans les callbacks :

```typescript
onTransactionConfirmed={(hash) => {
  // Votre logique ici :
  // - Appeler une API ?
  // - Mettre à jour une BDD ?
  // - Envoyer un email ?
  // - Marquer comme "PAID" ?
  // À VOUS DE CHOISIR !
}
```

---

## ✅ Résumé

Le système de paiement USDC est **complètement implémenté** avec :

✅ Composant `USDCPaymentButton` complet et réutilisable  
✅ Appel direct à `USDC.transfer(to, amount)`  
✅ Gestion de la signature utilisateur (MetaMask)  
✅ Attente du minage avec états visuels  
✅ 9 états différents gérés  
✅ Vérifications de sécurité complètes  
✅ Callbacks personnalisables  
✅ Interface utilisateur intuitive  
✅ **AUCUNE logique "PAID" automatique**  
✅ Documentation complète  
✅ Compilation sans erreur  

**Le paiement USDC est prêt à l'emploi ! 💳✨**

