# 📦 Composants Wagmi - Guide rapide

## Composants disponibles

### 1. 🔌 WalletConnect (Simple)
**Fichier:** `src/components/WalletConnect.tsx`

Composant basique pour connecter/déconnecter un wallet.

**Import:**
```tsx
import { WalletConnect } from '@/components/WalletConnect'
```

**Utilisation:**
```tsx
<WalletConnect />
```

**Affiche:**
- Liste des connecteurs disponibles (MetaMask, WalletConnect, etc.)
- Adresse connectée (format court)
- Balance ETH
- Bouton de déconnexion

---

### 2. ✅ WalletStatus (Avancé)
**Fichier:** `src/components/WalletStatus.tsx`

Composant complet avec validation du réseau et gestion avancée.

**Import:**
```tsx
import { WalletStatus } from '@/components/WalletStatus'
```

**Utilisation:**
```tsx
<WalletStatus />
```

**Fonctionnalités:**
- ✅ Connexion/déconnexion
- ✅ Validation du réseau (Base Sepolia uniquement)
- ✅ Bouton de changement de réseau
- ✅ Copie de l'adresse d'un clic
- ✅ Affichage de la balance ETH
- ✅ Indicateur visuel (vert = connecté, jaune = mauvais réseau)
- ✅ Gestion des erreurs
- ✅ États de chargement
- ✅ Protection contre l'hydratation

**👉 Utilisé actuellement sur la page d'accueil**

---

### 3. 💳 PayInvoiceButton (Paiement)
**Fichier:** `src/components/PayInvoiceButton.tsx`

Composant complet pour payer une facture en USDC.

**Import:**
```tsx
import { PayInvoiceButton } from '@/components/PayInvoiceButton'
```

**Utilisation:**
```tsx
<PayInvoiceButton
  invoiceId="INV-001"
  recipientAddress="0x..."
  amount="100.50"
  usdcAddress={USDC_ADDRESS}
  usdcAbi={USDC_ABI}
/>
```

**Props:**
```typescript
interface PayInvoiceButtonProps {
  invoiceId: string                    // ID de la facture
  recipientAddress: `0x${string}`      // Adresse du destinataire
  amount: string                       // Montant en USDC (ex: "100.50")
  usdcAddress: `0x${string}`          // Adresse du contrat USDC
  usdcAbi: any                        // ABI du contrat USDC
}
```

**Fonctionnalités:**
- ✅ Vérification de la connexion wallet
- ✅ Vérification du réseau (Base Sepolia)
- ✅ Envoi de transaction USDC
- ✅ Attente de confirmation
- ✅ Affichage du statut (pending, success, error)
- ✅ Lien vers BaseScan après succès
- ✅ Gestion des erreurs avec bouton retry
- ✅ Indicateurs de chargement

**États affichés:**
1. **Non connecté** → Message d'avertissement
2. **Mauvais réseau** → Message d'erreur
3. **Prêt** → Bouton de paiement avec résumé
4. **En cours** → Spinner + message
5. **Succès** → ✅ avec lien BaseScan
6. **Erreur** → ❌ avec message et bouton retry

---

## 🎯 Exemple d'intégration complète

```tsx
// src/app/invoice/[id]/page.tsx
import { WalletStatus } from '@/components/WalletStatus'
import { PayInvoiceButton } from '@/components/PayInvoiceButton'
import { USDC_ADDRESS, USDC_ABI } from '@/lib/usdc'

export default function InvoicePage({ params }: { params: { id: string } }) {
  const invoice = getInvoice(params.id) // Votre logique
  
  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Status du wallet */}
      <div className="mb-6">
        <WalletStatus />
      </div>

      {/* Détails de la facture */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h1 className="text-2xl font-bold mb-4">Facture {params.id}</h1>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Montant:</span>
            <span className="font-bold">{invoice.amount} USDC</span>
          </div>
          <div className="flex justify-between">
            <span>Destinataire:</span>
            <code className="text-xs">{invoice.recipient}</code>
          </div>
        </div>
      </div>

      {/* Bouton de paiement */}
      <PayInvoiceButton
        invoiceId={params.id}
        recipientAddress={invoice.recipient}
        amount={invoice.amount}
        usdcAddress={USDC_ADDRESS}
        usdcAbi={USDC_ABI}
      />
    </div>
  )
}
```

---

## 🔧 Configuration requise

### Variables d'environnement (.env.local)

```env
# RPC Base Sepolia
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=https://sepolia.base.org

# WalletConnect Project ID (optionnel)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

### Constantes USDC

Assurez-vous d'avoir ces constantes dans `src/lib/usdc.ts`:

```typescript
export const USDC_ADDRESS = '0x...' as const // Adresse USDC sur Base Sepolia
export const USDC_ABI = [...] // ABI du contrat USDC
```

---

## 🎨 Personnalisation

Tous les composants utilisent Tailwind CSS et peuvent être facilement personnalisés :

### Changer les couleurs

Dans les fichiers des composants, vous pouvez modifier les classes Tailwind :

```tsx
// Bouton de connexion bleu → vert
className="bg-green-600 hover:bg-green-700"

// État connecté vert → bleu
className="bg-blue-50 border-blue-200"
```

### Changer les icônes

```tsx
// Remplacer les émojis par des icônes SVG
<span>✅</span> → <CheckIcon className="w-5 h-5" />
```

---

## 📊 Flux d'utilisation recommandé

1. **Page d'accueil** : Afficher `<WalletStatus />` pour que l'utilisateur connecte son wallet

2. **Page de liste de factures** : Afficher `<WalletStatus />` en haut + liste des factures

3. **Page de détail de facture** : 
   - `<WalletStatus />` (optionnel si déjà en header)
   - Détails de la facture
   - `<PayInvoiceButton />` pour le paiement

4. **Après paiement** : Rediriger vers une page de confirmation ou afficher un message

---

## 🚀 Prochaines améliorations possibles

- [ ] Ajouter `useBalance()` pour vérifier le solde USDC avant paiement
- [ ] Ajouter un bouton "Approve" si nécessaire
- [ ] Créer un composant `TransactionHistory`
- [ ] Ajouter une notification toast après transaction
- [ ] Créer un composant `NetworkSwitcher` séparé
- [ ] Ajouter support multi-chaînes (Base mainnet, autres L2)

---

## 📚 Voir aussi

- **WAGMI_README.md** - Vue d'ensemble de la configuration
- **WALLET_GUIDE.md** - Guide complet des hooks wagmi
- **WAGMI_SETUP.md** - Documentation technique de l'installation

