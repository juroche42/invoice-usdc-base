# ⚡ Quick Start - Wagmi

## 🎯 TL;DR

Wagmi est configuré et prêt ! Vous pouvez maintenant connecter un wallet et interagir avec la blockchain.

## 🚀 Démarrage rapide

```bash
# 1. Configurer les variables d'environnement
cp .env.example .env.local

# 2. Lancer le serveur
npm run dev

# 3. Ouvrir http://localhost:3000
```

**Le bouton de connexion wallet est déjà visible sur la page d'accueil ! 🎉**

## 📦 Composants prêts à l'emploi

### `<WalletStatus />` - Déjà sur la page d'accueil
Connexion/déconnexion avec validation du réseau

### `<WalletConnect />` - Version simple
Juste connexion/déconnexion basique

### `<PayInvoiceButton />` - Paiement USDC
Pour payer vos factures en USDC

## 🔧 Utiliser dans un composant

```tsx
'use client'
import { useAccount } from 'wagmi'

export function MyComponent() {
  const { address, isConnected } = useAccount()
  
  return (
    <div>
      {isConnected ? `Connecté: ${address}` : 'Non connecté'}
    </div>
  )
}
```

## 📚 Documentation complète

- **WAGMI_README.md** → Vue d'ensemble
- **COMPONENTS.md** → Guide des composants
- **WALLET_GUIDE.md** → Tous les hooks disponibles

## ✅ Ce qui fonctionne déjà

- ✅ Connexion wallet (MetaMask, WalletConnect, etc.)
- ✅ Affichage de l'adresse et balance
- ✅ Validation du réseau Base Sepolia
- ✅ Changement automatique de réseau
- ✅ Composant de paiement USDC prêt

**Tout est configuré, il ne reste plus qu'à développer ! 🚀**

