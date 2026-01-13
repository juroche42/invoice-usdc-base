# Invoice USDC Base - Application de Paiement Web3

Application Next.js de paiement en USDC sur Base Sepolia avec gestion complète de wallet et reçus de transaction.

## 🚀 Fonctionnalités

### 1. Gestion de Wallet (Wagmi)
- **Connexion/Déconnexion** de wallet avec support multi-wallets
- Support de **WalletConnect** et wallets injectés (MetaMask, Coinbase Wallet, etc.)
- Configuration pour Base Sepolia et Base Mainnet

### 2. Contrôle de Réseau
- Vérification automatique du réseau blockchain
- Blocage des actions si le wallet n'est pas sur le bon réseau
- Messages clairs pour l'utilisateur

### 3. Système de Blocage
- **Action bloquée** si le wallet n'est pas connecté
- Vérification du solde USDC avant paiement
- Messages d'erreur explicites

### 4. Paiements USDC
- Appel direct à `USDC.transfer(to, amount)`
- Gestion complète de la signature de transaction
- Attente du minage de la transaction
- **Aucune logique "PAID" automatique** - uniquement confirmation on-chain

### 5. États UX du Paiement
- **idle**: État initial, prêt à payer
- **signing**: En attente de signature dans le wallet
- **pending**: Transaction soumise, en cours de minage
- **confirmed**: Transaction confirmée sur la blockchain
- **error**: Erreur lors de la transaction

### 6. Reçus de Transaction 📄
Après une transaction confirmée, affichage d'un reçu détaillé avec :
- **Transaction Hash** (avec bouton de copie)
- **Montant** payé en USDC
- **Adresse du destinataire** (avec bouton de copie)
- **Lien vers BaseScan** pour voir la transaction
- Date et heure de la transaction
- Numéro de facture (si applicable)

## 📁 Structure du Projet

```
src/
├── app/
│   ├── page.tsx                    # Page d'accueil
│   ├── receipt-demo/page.tsx       # Démo du composant de reçu
│   └── invoice/[id]/
│       ├── page.tsx                # Page de détail de facture
│       └── status/page.tsx         # Statut de facture
├── components/
│   ├── Providers.tsx               # Provider Wagmi
│   ├── WalletConnect.tsx           # Bouton de connexion wallet
│   ├── WalletStatus.tsx            # Statut du wallet
│   ├── RequireWallet.tsx           # HOC pour bloquer sans wallet
│   ├── USDCPaymentButton.tsx       # Bouton de paiement principal
│   ├── TransactionReceipt.tsx      # Reçu de transaction (complet)
│   └── TransactionReceiptCompact.tsx # Reçu de transaction (compact)
└── lib/
    ├── wagmi.ts                    # Configuration Wagmi
    ├── usdc.ts                     # Helpers USDC
    ├── chain.ts                    # Configuration réseau
    └── payments.ts                 # Logique de paiement
```

## 🛠️ Installation

```bash
# Installer les dépendances
npm install

# Copier le fichier .env.example
cp .env.example .env.local

# Configurer les variables d'environnement
# NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
# NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
# NEXT_PUBLIC_USDC_ADDRESS=0x036CbD53842c5426634e7929541eC2318f3dCF7e
```

## 🚀 Démarrage

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Visitez [http://localhost:3000/receipt-demo](http://localhost:3000/receipt-demo) pour voir la démo du composant de reçu.

## 📖 Documentation

- [QUICKSTART.md](./QUICKSTART.md) - Guide de démarrage rapide
- [WAGMI_SETUP.md](./WAGMI_SETUP.md) - Configuration de Wagmi
- [WALLET_GUIDE.md](./WALLET_GUIDE.md) - Guide de connexion wallet
- [NETWORK_CONTROL.md](./NETWORK_CONTROL.md) - Contrôle de réseau
- [BLOCKING_ACTIONS.md](./BLOCKING_ACTIONS.md) - Actions bloquées
- [USDC_PAYMENT.md](./USDC_PAYMENT.md) - Système de paiement USDC
- [UX_STATES.md](./UX_STATES.md) - États UX du paiement
- [RECEIPT_COMPONENT.md](./RECEIPT_COMPONENT.md) - Composant de reçu
- [COMPONENTS.md](./COMPONENTS.md) - Liste des composants

## 🎨 Composants Principaux

### USDCPaymentButton
Bouton de paiement USDC avec gestion complète du cycle de vie :
```tsx
<USDCPaymentButton
  recipientAddress="0x..."
  amount="100.50"
  invoiceId="INV-001"
  onTransactionConfirmed={(hash) => console.log('Paid!', hash)}
/>
```

### TransactionReceipt
Reçu de transaction détaillé après paiement confirmé :
```tsx
<TransactionReceipt
  txHash="0x..."
  amount="100.50"
  recipientAddress="0x..."
  token="USDC"
  invoiceId="INV-001"
/>
```

### TransactionReceiptCompact
Version compacte du reçu pour espaces restreints :
```tsx
<TransactionReceiptCompact
  txHash="0x..."
  amount="100.50"
  recipientAddress="0x..."
/>
```

## 🔗 Liens Utiles

- [Base Sepolia Explorer](https://sepolia.basescan.org)
- [USDC on Base Sepolia](https://sepolia.basescan.org/token/0x036CbD53842c5426634e7929541eC2318f3dCF7e)
- [Wagmi Documentation](https://wagmi.sh)
- [WalletConnect](https://walletconnect.com)

## 📝 Notes Importantes

- Les paiements sont **irréversibles** une fois confirmés on-chain
- Aucune mise à jour automatique du statut de facture
- Le système affiche uniquement la confirmation blockchain
- L'utilisateur est responsable de vérifier les informations avant de payer

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


