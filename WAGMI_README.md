# 🎉 Wagmi Configuration Complète

Wagmi est maintenant installé et configuré sur votre projet Next.js !

## ✅ Ce qui a été fait

### Packages installés
- `wagmi@^3.3.2` - Hooks React pour Ethereum
- `@tanstack/react-query@^5.90.16` - Gestion d'état et cache
- `viem@^2.44.1` - Déjà présent

### Fichiers créés

#### Configuration
- **`src/lib/wagmi.ts`** - Configuration de wagmi avec Base Sepolia
- **`src/components/Providers.tsx`** - Provider qui encapsule wagmi et react-query

#### Composants de connexion
- **`src/components/WalletConnect.tsx`** - Composant simple pour connect/disconnect
- **`src/components/WalletStatus.tsx`** - Composant avancé avec validation réseau

#### Documentation
- **`WAGMI_SETUP.md`** - Documentation de l'installation
- **`WALLET_GUIDE.md`** - Guide complet d'utilisation des hooks
- **`.env.example`** - Variables d'environnement à configurer

### Fichiers modifiés
- **`src/app/layout.tsx`** - Ajout du Provider wagmi
- **`src/app/page.tsx`** - Intégration du composant WalletStatus

---

## 🚀 Utilisation

### 1. Configurer les variables d'environnement

Créez un fichier `.env.local` :

```env
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

> Obtenez un Project ID WalletConnect sur https://cloud.walletconnect.com (optionnel mais recommandé)

### 2. Utiliser les composants

Le composant **WalletStatus** est déjà intégré sur la page d'accueil et permet de :
- ✅ Connecter/déconnecter un wallet (MetaMask, WalletConnect, etc.)
- ✅ Afficher l'adresse et la balance
- ✅ Vérifier le bon réseau (Base Sepolia)
- ✅ Changer de réseau automatiquement
- ✅ Copier l'adresse d'un clic

### 3. Utiliser wagmi dans vos composants

```tsx
'use client'
import { useAccount } from 'wagmi'

export function MyComponent() {
  const { address, isConnected } = useAccount()
  
  if (!isConnected) {
    return <div>Connectez votre wallet</div>
  }
  
  return <div>Votre adresse : {address}</div>
}
```

---

## 📚 Documentation

### Composants disponibles

#### `<WalletConnect />` - Basique
Composant simple de connexion/déconnexion.

#### `<WalletStatus />` - Avancé
Composant complet avec :
- Validation du réseau
- Changement de réseau
- Copie d'adresse
- Gestion des erreurs
- États de chargement

### Hooks principaux

- **`useAccount()`** - Infos du compte connecté
- **`useBalance()`** - Balance du compte
- **`useConnect()`** - Connecter un wallet
- **`useDisconnect()`** - Déconnecter
- **`useReadContract()`** - Lire un contrat
- **`useWriteContract()`** - Écrire dans un contrat
- **`useSwitchChain()`** - Changer de réseau
- **`useWaitForTransactionReceipt()`** - Attendre une transaction

👉 Voir **WALLET_GUIDE.md** pour des exemples complets

---

## 🧪 Test

Le composant est visible sur la page d'accueil :

```bash
npm run dev
# Ouvrir http://localhost:3000
```

Vous verrez le composant WalletStatus qui vous permettra de :
1. Cliquer sur "Connecter [Wallet]"
2. Approuver la connexion dans votre wallet
3. Voir votre adresse et balance
4. Changer de réseau si nécessaire
5. Déconnecter

---

## 📖 Ressources

- [Documentation Wagmi](https://wagmi.sh/)
- [Hooks Wagmi](https://wagmi.sh/react/api/hooks)
- [Viem Documentation](https://viem.sh/)
- [Base Sepolia Explorer](https://sepolia.basescan.org/)
- [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)

---

## 🎯 Prochaines étapes

Vous pouvez maintenant :

1. **Lire les données d'un contrat** avec `useReadContract()`
2. **Envoyer des transactions** avec `useWriteContract()`
3. **Créer un système de paiement** pour vos factures
4. **Intégrer la signature de messages** avec `useSignMessage()`

Consultez **WALLET_GUIDE.md** pour voir des exemples complets ! 🚀

