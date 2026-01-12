# 🎨 États UX du Système de Paiement - Documentation

## Vue d'ensemble

Le composant `USDCPaymentButton` implémente une machine à états claire avec **5 états principaux** :

```
idle → signing → pending → confirmed
  ↓       ↓         ↓
  └───→ error ←─────┘
```

---

## 📊 États Principaux

### 1️⃣ État: `idle`

**Description:** État initial, prêt à payer

**Quand:** 
- Au chargement du composant
- Après un reset suite à une erreur
- Wallet connecté, réseau correct, solde suffisant

**Visuel:**
- Fond bleu clair
- Récapitulatif du paiement visible
- Bouton "💳 Payer X USDC" actif et cliquable
- Badge d'état: `idle`

**Actions possibles:**
- Cliquer sur "Payer" → passe à `signing`

**Code:**
```typescript
if (paymentState === 'idle') {
  return (
    <div>
      {/* Récap + bouton actif */}
      <button onClick={handlePayment}>
        💳 Payer {amount} USDC
      </button>
      État: idle
    </div>
  )
}
```

---

### 2️⃣ État: `signing`

**Description:** En attente de la signature utilisateur dans le wallet

**Quand:**
- Après clic sur "Payer"
- Juste avant que MetaMask s'ouvre
- Pendant que l'utilisateur signe

**Visuel:**
- Fond violet/purple
- Spinner animé
- Message: "En attente de signature..."
- Badge d'état: `signing`
- Bouton grisé "✍️ Signature en cours..."

**Durée:** Variable (dépend de l'utilisateur)

**Transitions:**
- Signature acceptée → `pending`
- Signature rejetée → `error`

**Code:**
```typescript
if (paymentState === 'signing') {
  return (
    <div className="bg-purple-50">
      <Spinner />
      En attente de signature...
      État: signing
    </div>
  )
}
```

---

### 3️⃣ État: `pending`

**Description:** Transaction soumise, en attente de confirmation on-chain

**Quand:**
- Après signature réussie
- Pendant le minage de la transaction
- Hash de transaction disponible

**Visuel:**
- Fond bleu
- Spinner animé
- Message: "Transaction en cours de minage..."
- Montant affiché
- Lien BaseScan cliquable
- Badge d'état: `pending`
- Bouton grisé "⏳ Confirmation en cours..."

**Durée:** ~1-10 secondes (selon le réseau)

**Transitions:**
- Confirmation réussie → `confirmed`
- Erreur réseau/blockchain → `error`

**Code:**
```typescript
if (paymentState === 'pending' && hash) {
  return (
    <div className="bg-blue-50">
      <Spinner />
      Transaction en cours de minage...
      <a href={baseScanUrl}>Suivre sur BaseScan →</a>
      État: pending
    </div>
  )
}
```

---

### 4️⃣ État: `confirmed`

**Description:** Transaction confirmée on-chain, paiement réussi

**Quand:**
- Transaction minée et confirmée
- État final de succès

**Visuel:**
- Fond vert
- Icône ✅ grande
- Message: "Paiement confirmé !"
- Détails du paiement (montant, destinataire, facture)
- Lien BaseScan
- Badge d'état: `confirmed`
- Message: "Aucune mise à jour automatique du statut"

**Durée:** Permanent (jusqu'à refresh de page)

**Transitions:** Aucune (état final)

**Callbacks:**
- `onTransactionConfirmed(hash)` appelé

**Code:**
```typescript
if (paymentState === 'confirmed' && hash) {
  return (
    <div className="bg-green-50">
      ✅ Paiement confirmé !
      ✓ Montant: {amount} USDC
      ✓ Destinataire: {address}
      <a href={baseScanUrl}>Voir sur BaseScan</a>
      État: confirmed
    </div>
  )
}
```

---

### 5️⃣ État: `error`

**Description:** Erreur lors du processus de paiement

**Quand:**
- Signature rejetée par l'utilisateur
- Erreur de contrat
- Erreur réseau
- Transaction échouée

**Visuel:**
- Fond rouge
- Icône ❌
- Message d'erreur détaillé
- Badge d'état: `error`
- Bouton "🔄 Réessayer" actif

**Durée:** Permanent (jusqu'à retry)

**Transitions:**
- Clic sur "Réessayer" → `idle` (reset)

**Callbacks:**
- `onError(error)` appelé

**Code:**
```typescript
if (paymentState === 'error') {
  return (
    <div className="bg-red-50">
      ❌ Erreur lors du paiement
      {errorMessage}
      <button onClick={handleReset}>🔄 Réessayer</button>
      État: error
    </div>
  )
}
```

---

## 🔄 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────┐
│                        DÉBUT                             │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
              ┌─────────────┐
              │    idle     │ ◄──────────┐
              │  (prêt)     │            │
              └──────┬──────┘            │
                     │                   │
                Clic "Payer"             │
                     │                   │
                     ▼                   │
              ┌─────────────┐            │
              │   signing   │            │
              │ (signature) │            │
              └──────┬──────┘            │
                     │                   │
           ┌─────────┴─────────┐         │
           │                   │         │
    Signature OK        Rejet signature  │
           │                   │         │
           ▼                   ▼         │
    ┌─────────────┐      ┌─────────────┐│
    │   pending   │      │    error    ││
    │  (minage)   │      │  (erreur)   ││
    └──────┬──────┘      └──────┬──────┘│
           │                    │        │
    ┌──────┴──────┐      Clic "Réessayer"
    │             │             │        │
Confirmé OK   Erreur TX         └────────┘
    │             │
    ▼             ▼
┌─────────────┐ ┌─────────────┐
│  confirmed  │ │    error    │
│  (succès)   │ │  (erreur)   │
└─────────────┘ └─────────────┘
     FIN              │
                      │
               Clic "Réessayer"
                      │
                      └─────► idle
```

---

## 🎨 Design System des États

### Couleurs par État

| État | Fond | Bordure | Icône | Spinner |
|------|------|---------|-------|---------|
| `idle` | `blue-50` | `blue-200` | 💳 | - |
| `signing` | `purple-50` | `purple-200` | ✍️ | Purple |
| `pending` | `blue-50` | `blue-200` | ⏳ | Blue |
| `confirmed` | `green-50` | `green-300` | ✅ | - |
| `error` | `red-50` | `red-300` | ❌ | - |

### Messages par État

| État | Titre | Description |
|------|-------|-------------|
| `idle` | "Montant à payer" | Récapitulatif complet |
| `signing` | "En attente de signature..." | "Veuillez signer dans votre wallet" |
| `pending` | "Transaction en cours de minage..." | "Paiement de X USDC en cours" |
| `confirmed` | "Paiement confirmé !" | Détails + lien BaseScan |
| `error` | "Erreur lors du paiement" | Message d'erreur spécifique |

---

## 💻 API du Composant

### Props

```typescript
interface USDCPaymentButtonProps {
  recipientAddress: `0x${string}`
  amount: string
  invoiceId?: string
  onTransactionSent?: (hash: string) => void
  onTransactionConfirmed?: (hash: string) => void
  onError?: (error: Error) => void
  onStateChange?: (state: PaymentState) => void  // 🆕 Nouveau !
}
```

### Type PaymentState

```typescript
type PaymentState = 'idle' | 'signing' | 'pending' | 'confirmed' | 'error'
```

### Callback: onStateChange

Nouveau callback qui est appelé à chaque changement d'état :

```typescript
<USDCPaymentButton
  onStateChange={(state) => {
    console.log('État changé:', state)
    
    // Vous pouvez :
    // - Logger les changements d'état
    // - Mettre à jour votre UI
    // - Envoyer des analytics
    // - Afficher des notifications
  }}
/>
```

---

## 🔧 Gestion Automatique des États

Le composant gère automatiquement les transitions d'états via `useEffect` :

```typescript
useEffect(() => {
  if (writeError || receiptError) {
    changeState('error')  // Erreur détectée
  } else if (isWritePending) {
    changeState('signing')  // En attente de signature
  } else if (isConfirming && hash) {
    changeState('pending')  // Transaction en minage
  } else if (isConfirmed && hash) {
    changeState('confirmed')  // Transaction confirmée
  }
}, [isWritePending, isConfirming, isConfirmed, writeError, receiptError, hash])
```

---

## 📝 Exemples d'Utilisation

### Exemple 1: Utilisation Basique

```typescript
<USDCPaymentButton
  recipientAddress="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
  amount="100.50"
  invoiceId="INV-001"
/>
```

**États visibles:**
- `idle` → Utilisateur voit le bouton "Payer"
- `signing` → MetaMask s'ouvre
- `pending` → Spinner pendant minage
- `confirmed` → Message de succès ✅

---

### Exemple 2: Avec Callback d'État

```typescript
const [currentState, setCurrentState] = useState<PaymentState>('idle')

<USDCPaymentButton
  recipientAddress="0x..."
  amount="100"
  onStateChange={(state) => {
    setCurrentState(state)
    
    // Analytics
    if (state === 'signing') {
      trackEvent('payment_signature_started')
    }
    if (state === 'confirmed') {
      trackEvent('payment_confirmed')
    }
  }}
/>

{/* Afficher l'état actuel */}
<div>État actuel: {currentState}</div>
```

---

### Exemple 3: Avec Toast Notifications

```typescript
<USDCPaymentButton
  recipientAddress="0x..."
  amount="50"
  onStateChange={(state) => {
    switch (state) {
      case 'signing':
        toast.info('Veuillez signer la transaction')
        break
      case 'pending':
        toast.loading('Transaction en cours...')
        break
      case 'confirmed':
        toast.success('Paiement réussi ! ✅')
        break
      case 'error':
        toast.error('Erreur lors du paiement')
        break
    }
  }}
  onTransactionConfirmed={(hash) => {
    toast.success(`Transaction confirmée: ${hash}`)
  }}
/>
```

---

### Exemple 4: Désactiver Autres Actions Pendant Paiement

```typescript
const [paymentState, setPaymentState] = useState<PaymentState>('idle')
const isProcessing = ['signing', 'pending'].includes(paymentState)

return (
  <div>
    <USDCPaymentButton
      onStateChange={setPaymentState}
      {...props}
    />
    
    {/* Désactiver autres boutons */}
    <button disabled={isProcessing}>
      Autre action
    </button>
    
    {/* Afficher loader global */}
    {isProcessing && <GlobalLoader />}
  </div>
)
```

---

## 🧪 Tests Recommandés

### Test 1: Flux Complet (Happy Path)

```bash
1. État initial
   ✓ Vérifier état "idle"
   ✓ Bouton "Payer" actif
   ✓ Badge affiche "idle"

2. Clic sur "Payer"
   ✓ État passe à "signing"
   ✓ Fond devient purple
   ✓ MetaMask s'ouvre
   ✓ Badge affiche "signing"

3. Signer la transaction
   ✓ État passe à "pending"
   ✓ Fond devient bleu
   ✓ Lien BaseScan visible
   ✓ Badge affiche "pending"

4. Attendre confirmation
   ✓ État passe à "confirmed"
   ✓ Fond devient vert
   ✓ Message "Paiement confirmé !"
   ✓ Badge affiche "confirmed"
```

### Test 2: Flux avec Erreur (Rejet de Signature)

```bash
1. État "idle"
2. Clic sur "Payer" → État "signing"
3. Rejeter dans MetaMask
   ✓ État passe à "error"
   ✓ Fond rouge
   ✓ Message d'erreur visible
   ✓ Bouton "Réessayer" visible
4. Clic sur "Réessayer"
   ✓ État retourne à "idle"
```

### Test 3: Callbacks

```bash
✓ onStateChange appelé à chaque changement
✓ onTransactionSent appelé après signing
✓ onTransactionConfirmed appelé après pending
✓ onError appelé si erreur
```

---

## 📊 Métriques & Analytics

### Événements à Tracker

```typescript
<USDCPaymentButton
  onStateChange={(state) => {
    // Analytics
    analytics.track('payment_state_changed', {
      state,
      timestamp: Date.now(),
    })
  }}
  onTransactionSent={(hash) => {
    analytics.track('payment_signature_completed', { hash })
  }}
  onTransactionConfirmed={(hash) => {
    analytics.track('payment_confirmed', { hash })
  }}
  onError={(error) => {
    analytics.track('payment_error', {
      error: error.message,
      type: error.name,
    })
  }}
/>
```

### Métriques Utiles

- Taux de conversion (idle → confirmed)
- Taux de rejet de signature (signing → error)
- Temps moyen en état "pending"
- Taux d'erreur par type
- Taux de retry après erreur

---

## ✅ Résumé

Le système d'états UX est **complètement implémenté** avec :

✅ **5 états principaux** : idle, signing, pending, confirmed, error  
✅ **Transitions automatiques** basées sur les hooks wagmi  
✅ **Callback onStateChange** pour tracking personnalisé  
✅ **Design cohérent** avec couleurs et icônes par état  
✅ **Badge d'état visible** sur chaque écran  
✅ **Messages clairs** adaptés à chaque état  
✅ **Gestion d'erreur** avec retry  
✅ **Documentation complète** avec exemples  
✅ **Tests recommandés** pour validation  
✅ **Compilation sans erreur**  

**Le système d'états UX est production-ready ! 🎨✨**

