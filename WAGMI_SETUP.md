# Configuration Wagmi

Ce projet utilise [Wagmi](https://wagmi.sh/) pour gérer les interactions Web3.

## Installation

Les packages suivants ont été installés :
- `wagmi` - Hooks React pour Ethereum
- `@tanstack/react-query` - Gestion d'état et cache
- `viem` - Librairie TypeScript pour Ethereum (déjà présent)

## Configuration

### 1. Fichiers créés

- **`src/lib/wagmi.ts`** : Configuration de wagmi avec Base Sepolia
- **`src/components/Providers.tsx`** : Provider qui encapsule wagmi et react-query
- **`src/components/WalletConnect.tsx`** : Composant exemple pour la connexion wallet

### 2. Variables d'environnement

Créez un fichier `.env.local` avec :

```env
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

Pour obtenir un Project ID WalletConnect (recommandé) : https://cloud.walletconnect.com

### 3. Utilisation

Le provider est déjà configuré dans `src/app/layout.tsx`. Vous pouvez maintenant utiliser les hooks wagmi dans vos composants client :

```tsx
'use client'

import { useAccount, useBalance, useWriteContract } from 'wagmi'

export function MyComponent() {
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({ address })
  const { writeContract } = useWriteContract()

  // Votre logique ici
}
```

### 4. Hooks disponibles

- `useAccount()` - Informations sur le compte connecté
- `useBalance()` - Balance du compte
- `useReadContract()` - Lire un contrat
- `useWriteContract()` - Écrire dans un contrat
- `useConnect()` - Connecter un wallet
- `useDisconnect()` - Déconnecter un wallet
- `useWaitForTransactionReceipt()` - Attendre une transaction
- Et bien d'autres : https://wagmi.sh/react/api/hooks

## Exemple d'utilisation

Importez le composant `WalletConnect` dans votre page :

```tsx
import { WalletConnect } from '@/components/WalletConnect'

export default function Page() {
  return (
    <div>
      <WalletConnect />
    </div>
  )
}
```

## Ressources

- [Documentation Wagmi](https://wagmi.sh/)
- [Viem Documentation](https://viem.sh/)
- [Base Sepolia Explorer](https://sepolia.basescan.org/)

