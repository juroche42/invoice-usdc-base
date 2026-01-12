# 🔒 Blocage d'Actions - Documentation

## Vue d'ensemble

Le système de blocage d'actions empêche les utilisateurs d'interagir avec certaines fonctionnalités lorsque :
- ❌ Le wallet n'est pas connecté
- ❌ L'utilisateur est sur le mauvais réseau

---

## 📦 Composants de blocage

### 1. `<RequireWallet />` - Wrapper de contenu

Bloque l'affichage de son contenu et affiche un message d'avertissement.

#### Import
```tsx
import { RequireWallet } from '@/components/RequireWallet'
```

#### Utilisation basique
```tsx
<RequireWallet>
  <button onClick={handlePayment}>
    Payer la facture
  </button>
</RequireWallet>
```

#### Avec validation du réseau
```tsx
<RequireWallet requireCorrectNetwork={true} correctNetworkId={84532}>
  <PaymentForm />
</RequireWallet>
```

#### Props

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `children` | ReactNode | - | Contenu à afficher si connecté |
| `fallback` | ReactNode | undefined | Message personnalisé si bloqué |
| `requireCorrectNetwork` | boolean | false | Vérifier le réseau |
| `correctNetworkId` | number | 84532 | Chain ID requis |

#### États affichés

**Wallet non connecté:**
```
┌─────────────────────────────────────┐
│ ⚠️ Wallet non connecté              │
│                                      │
│ Vous devez connecter votre wallet   │
│ pour accéder à cette fonctionnalité │
└─────────────────────────────────────┘
```

**Mauvais réseau:**
```
┌─────────────────────────────────────┐
│ 🔄 Mauvais réseau                   │
│                                      │
│ Vous devez être sur le bon réseau   │
│ Utilisez le sélecteur ci-dessus     │
└─────────────────────────────────────┘
```

---

### 2. `<BlockedButton />` - Bouton bloqué

Bouton qui se désactive automatiquement avec message personnalisé.

#### Import
```tsx
import { BlockedButton } from '@/components/BlockedButton'
```

#### Utilisation basique
```tsx
<BlockedButton
  requireWallet={true}
  onClick={handleClick}
  className="px-4 py-2 bg-blue-600 text-white rounded"
>
  Action
</BlockedButton>
```

#### Avec validation du réseau
```tsx
<BlockedButton
  requireWallet={true}
  requireCorrectNetwork={true}
  onClick={handlePayment}
  className="px-4 py-2 bg-blue-600 text-white rounded"
>
  Payer 100 USDC
</BlockedButton>
```

#### Avec message personnalisé
```tsx
<BlockedButton
  requireWallet={true}
  blockedMessage="🔒 Connectez-vous pour continuer"
  onClick={handleSubmit}
  className="btn-primary"
>
  Soumettre
</BlockedButton>
```

#### Props

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `children` | ReactNode | - | Contenu du bouton |
| `onClick` | () => void | - | Fonction au clic |
| `disabled` | boolean | false | Désactiver manuellement |
| `className` | string | '' | Classes CSS |
| `requireWallet` | boolean | true | Bloquer si non connecté |
| `requireCorrectNetwork` | boolean | false | Bloquer si mauvais réseau |
| `correctNetworkId` | number | 84532 | Chain ID requis |
| `blockedMessage` | string | auto | Message quand bloqué |

#### Comportement

**Wallet connecté:**
```html
<button class="px-4 py-2 bg-blue-600 text-white">
  Payer 100 USDC
</button>
```

**Wallet non connecté:**
```html
<button disabled class="px-4 py-2 opacity-50 cursor-not-allowed">
  🔒 Connectez votre wallet
</button>
```

**Mauvais réseau:**
```html
<button disabled class="px-4 py-2 opacity-50 cursor-not-allowed">
  🔒 Changez de réseau
</button>
```

---

## 🎯 Exemples d'utilisation

### Exemple 1: Page de paiement de facture

```tsx
import { WalletStatus } from '@/components/WalletStatus'
import { RequireWallet } from '@/components/RequireWallet'
import { BlockedButton } from '@/components/BlockedButton'

export default function InvoicePage() {
  return (
    <div>
      {/* Status du wallet */}
      <WalletStatus />

      {/* Contenu bloqué si pas connecté */}
      <RequireWallet requireCorrectNetwork={true}>
        <div className="invoice-details">
          <h2>Détails de la facture</h2>
          
          <BlockedButton
            requireWallet={true}
            requireCorrectNetwork={true}
            onClick={handlePayment}
            className="btn-primary"
          >
            💳 Payer 100 USDC
          </BlockedButton>
        </div>
      </RequireWallet>
    </div>
  )
}
```

---

### Exemple 2: Formulaire avec actions multiples

```tsx
import { RequireWallet } from '@/components/RequireWallet'
import { BlockedButton } from '@/components/BlockedButton'

export default function TransferForm() {
  return (
    <RequireWallet>
      <form>
        <input type="text" placeholder="Adresse destinataire" />
        <input type="number" placeholder="Montant" />
        
        <div className="actions">
          <BlockedButton
            requireWallet={true}
            requireCorrectNetwork={true}
            onClick={handleSend}
            className="btn-primary"
          >
            Envoyer USDC
          </BlockedButton>
          
          <BlockedButton
            requireWallet={true}
            onClick={handleEstimate}
            className="btn-secondary"
          >
            Estimer les frais
          </BlockedButton>
        </div>
      </form>
    </RequireWallet>
  )
}
```

---

### Exemple 3: Fallback personnalisé

```tsx
import { RequireWallet } from '@/components/RequireWallet'

export default function ProtectedContent() {
  const customFallback = (
    <div className="custom-message">
      <h2>🔐 Accès restreint</h2>
      <p>Cette fonctionnalité nécessite un wallet Web3.</p>
      <button onClick={() => alert('Guide de connexion')}>
        Comment me connecter ?
      </button>
    </div>
  )

  return (
    <RequireWallet fallback={customFallback}>
      <div className="protected-content">
        {/* Contenu sensible ici */}
      </div>
    </RequireWallet>
  )
}
```

---

### Exemple 4: PayInvoiceButton avec blocage

Le composant `PayInvoiceButton` a été mis à jour avec un blocage complet :

```tsx
import { PayInvoiceButton } from '@/components/PayInvoiceButton'

<PayInvoiceButton
  invoiceId="INV-001"
  recipientAddress="0x..."
  amount="100.50"
  usdcAddress={USDC_ADDRESS}
  usdcAbi={USDC_ABI}
/>
```

**États:**

1. **Wallet non connecté** → Affiche message jaune + bouton grisé
2. **Mauvais réseau** → Affiche message orange + bouton grisé
3. **Prêt** → Bouton de paiement actif
4. **En cours** → Spinner + "Transaction en cours..."
5. **Succès** → ✅ Message de confirmation + lien BaseScan
6. **Erreur** → ❌ Message d'erreur + bouton retry

---

## 🎨 États visuels

### RequireWallet - Wallet non connecté

```
┌───────────────────────────────────────────────┐
│ ⚠️  Wallet non connecté                       │
│                                                │
│ Vous devez connecter votre wallet pour        │
│ accéder à cette fonctionnalité.               │
└───────────────────────────────────────────────┘
```

**Couleurs:**
- Fond: `bg-yellow-50`
- Bordure: `border-yellow-300`
- Texte: `text-yellow-800` / `text-yellow-900`

---

### RequireWallet - Mauvais réseau

```
┌───────────────────────────────────────────────┐
│ 🔄  Mauvais réseau                            │
│                                                │
│ Vous devez être sur le bon réseau pour        │
│ accéder à cette fonctionnalité.               │
│ Utilisez le sélecteur de réseau ci-dessus.    │
└───────────────────────────────────────────────┘
```

**Couleurs:**
- Fond: `bg-orange-50`
- Bordure: `border-orange-300`
- Texte: `text-orange-800` / `text-orange-900`

---

### BlockedButton - États

| État | Apparence | Curseur |
|------|-----------|---------|
| Normal | Couleur d'origine | `cursor-pointer` |
| Bloqué | 50% opacité | `cursor-not-allowed` |
| Désactivé | 50% opacité | `cursor-not-allowed` |

---

## 🔧 Configuration avancée

### Changer le réseau requis

Par défaut, le réseau requis est Base Sepolia (84532).

Pour changer vers Base mainnet (8453):

```tsx
<RequireWallet 
  requireCorrectNetwork={true}
  correctNetworkId={8453}  // Base mainnet
>
  {children}
</RequireWallet>
```

---

### Créer un wrapper personnalisé

```tsx
// components/RequireBaseSepolia.tsx
import { RequireWallet } from './RequireWallet'

export function RequireBaseSepolia({ children }) {
  return (
    <RequireWallet
      requireCorrectNetwork={true}
      correctNetworkId={84532}
      fallback={
        <div className="custom-blocked">
          <h3>🔵 Base Sepolia requis</h3>
          <p>Cette application fonctionne uniquement sur Base Sepolia.</p>
        </div>
      }
    >
      {children}
    </RequireWallet>
  )
}
```

---

## 🧪 Tests recommandés

### Test 1: RequireWallet

```bash
1. Ouvrir une page avec RequireWallet
2. Ne pas connecter le wallet
3. ✓ Vérifier que le contenu est caché
4. ✓ Vérifier que le message d'avertissement s'affiche
5. Connecter le wallet
6. ✓ Vérifier que le contenu s'affiche
```

### Test 2: BlockedButton

```bash
1. Créer un bouton avec requireWallet={true}
2. Ne pas connecter le wallet
3. ✓ Vérifier que le bouton est grisé
4. ✓ Vérifier que le message "🔒 Connectez votre wallet" s'affiche
5. Connecter le wallet
6. ✓ Vérifier que le bouton redevient actif
7. ✓ Vérifier que le onClick fonctionne
```

### Test 3: RequireCorrectNetwork

```bash
1. Se connecter sur Ethereum Mainnet
2. Ouvrir une page avec requireCorrectNetwork={true}
3. ✓ Vérifier que le message "Mauvais réseau" s'affiche
4. Changer vers Base Sepolia
5. ✓ Vérifier que le contenu s'affiche
```

### Test 4: PayInvoiceButton

```bash
1. Ouvrir une page de facture sans connecter le wallet
2. ✓ Vérifier que le bouton "Paiement bloqué" s'affiche
3. ✓ Vérifier qu'il est impossible de cliquer
4. Connecter le wallet sur Ethereum
5. ✓ Vérifier que le message "Mauvais réseau" s'affiche
6. Changer vers Base Sepolia
7. ✓ Vérifier que le bouton de paiement s'active
```

---

## 📊 Intégration dans le projet

### Fichiers créés

1. **`src/components/RequireWallet.tsx`** - Wrapper de blocage de contenu
2. **`src/components/BlockedButton.tsx`** - Bouton avec blocage automatique

### Fichiers modifiés

3. **`src/components/PayInvoiceButton.tsx`** - Blocage amélioré si wallet non connecté
4. **`src/app/invoice/[id]/page.tsx`** - Exemple d'intégration complète

---

## 🎯 Checklist d'intégration

Pour ajouter le blocage sur une nouvelle page :

- [ ] Importer `WalletStatus` pour afficher le statut de connexion
- [ ] Importer `RequireWallet` pour bloquer le contenu principal
- [ ] Enrober les sections sensibles avec `<RequireWallet>`
- [ ] Utiliser `BlockedButton` pour les boutons d'action
- [ ] Définir `requireCorrectNetwork={true}` si validation réseau nécessaire
- [ ] Tester avec wallet non connecté
- [ ] Tester avec mauvais réseau
- [ ] Tester le flux complet de connexion

---

## ✅ Résumé

Le système de blocage d'actions est maintenant **complètement intégré** avec :

✅ 2 composants de blocage (`RequireWallet`, `BlockedButton`)  
✅ Blocage automatique si wallet non connecté  
✅ Blocage automatique si mauvais réseau  
✅ Messages d'avertissement clairs et visuels  
✅ Exemple d'intégration dans la page de facture  
✅ `PayInvoiceButton` mis à jour avec blocage complet  
✅ Documentation complète  
✅ Compilation sans erreur  

**Les utilisateurs ne peuvent plus effectuer d'actions critiques sans être connectés ! 🔒**

