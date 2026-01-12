# 🌐 Contrôle de Réseau - Documentation

## Vue d'ensemble

Le composant `WalletStatus` inclut maintenant un **système de contrôle de réseau avancé** qui permet de :

- ✅ Détecter le réseau actuel de l'utilisateur
- ✅ Valider si le réseau est supporté
- ✅ Recommander le réseau préféré (Base Sepolia)
- ✅ Changer automatiquement de réseau
- ✅ Afficher des alertes contextuelles selon le réseau

---

## 🎯 États du réseau

### 1. ✅ Réseau Correct (Base Sepolia)
**Apparence:** Fond vert avec indicateur vert

**Affichage:**
```
✅ Connecté
Réseau: 🔵 Base Sepolia (ID: 84532)
✅ Vous êtes sur le bon réseau (Base Sepolia)
```

**Actions disponibles:**
- Bouton "Changer de réseau" (pliable) pour basculer vers Base mainnet

---

### 2. ⚠️ Réseau Non Recommandé (Base Mainnet)
**Apparence:** Fond jaune avec indicateur jaune

**Affichage:**
```
⚠️ Réseau non recommandé
Réseau: 🔵 Base (ID: 8453)

⚠️ Réseau non recommandé
Vous êtes sur Base. Le réseau recommandé est Base Sepolia.

[🔵 Changer vers Base Sepolia]
```

**Actions:**
- Un bouton proéminent pour changer vers Base Sepolia
- Section pliable "Changer de réseau" pour d'autres options

---

### 3. ⛔ Réseau Non Supporté (Ethereum, Polygon, etc.)
**Apparence:** Fond rouge avec indicateur rouge

**Affichage:**
```
⛔ Réseau non supporté
Réseau: Ethereum Mainnet (ID: 1)

⛔ Réseau non supporté
Ce réseau n'est pas supporté par l'application. 
Veuillez changer vers un réseau supporté.

[🔵 Passer à Base Sepolia] Recommandé
[🔵 Passer à Base]
```

**Actions:**
- Tous les réseaux supportés sont affichés
- Le réseau recommandé est marqué avec un badge

---

## 📋 Réseaux supportés

### Configuration actuelle

```typescript
const SUPPORTED_NETWORKS = [
  { 
    chain: baseSepolia,      // Chain ID: 84532
    name: 'Base Sepolia', 
    isPreferred: true,       // ⭐ Réseau recommandé
    color: 'blue',
    icon: '🔵'
  },
  { 
    chain: base,             // Chain ID: 8453
    name: 'Base', 
    isPreferred: false,
    color: 'blue',
    icon: '🔵'
  },
]
```

### Ajouter d'autres réseaux

Pour ajouter un nouveau réseau, modifiez `src/components/WalletStatus.tsx`:

```typescript
import { baseSepolia, base, optimism } from 'wagmi/chains'

const SUPPORTED_NETWORKS = [
  { chain: baseSepolia, name: 'Base Sepolia', isPreferred: true, icon: '🔵' },
  { chain: base, name: 'Base', isPreferred: false, icon: '🔵' },
  { chain: optimism, name: 'Optimism', isPreferred: false, icon: '🔴' },
]
```

**N'oubliez pas** de mettre à jour `src/lib/wagmi.ts` aussi :

```typescript
import { baseSepolia, base, optimism } from 'wagmi/chains'

export const config = createConfig({
  chains: [baseSepolia, base, optimism],
  transports: {
    [baseSepolia.id]: http('https://sepolia.base.org'),
    [base.id]: http('https://mainnet.base.org'),
    [optimism.id]: http('https://mainnet.optimism.io'),
  },
})
```

---

## 🎨 Interface utilisateur

### Indicateurs visuels

| État | Couleur | Icône | Badge |
|------|---------|-------|-------|
| Correct | Vert 🟢 | ✅ | "Vous êtes sur le bon réseau" |
| Non recommandé | Jaune 🟡 | ⚠️ | "Réseau non recommandé" |
| Non supporté | Rouge 🔴 | ⛔ | "Réseau non supporté" |

### Section "Changer de réseau"

Un bouton pliable permet de voir tous les réseaux disponibles :

```
▶ Changer de réseau    (fermé)
▼ Changer de réseau    (ouvert)
  [🔵 Base] Recommandé
```

**Comportement:**
- Cliquer sur un réseau déclenche `switchChain()`
- La section se ferme automatiquement après le changement
- Un spinner s'affiche pendant le changement

---

## 🔧 API du composant

### Hook `useSwitchChain()`

```typescript
const { switchChain, isPending: isSwitching } = useSwitchChain()

// Changer de réseau
switchChain({ chainId: baseSepolia.id })
```

### Détection du réseau actuel

```typescript
const { chainId, chain } = useAccount()

// Vérifier si c'est un réseau supporté
const currentNetwork = SUPPORTED_NETWORKS.find(n => n.chain.id === chainId)
const isKnownNetwork = !!currentNetwork

// Vérifier si c'est le réseau préféré
const isCorrectChain = chainId === baseSepolia.id
```

---

## 🎯 Flux utilisateur

### Scénario 1: Utilisateur sur Ethereum Mainnet

1. **État initial:** Fond rouge, message "Réseau non supporté"
2. **Action:** L'utilisateur clique sur "Passer à Base Sepolia"
3. **Wallet:** MetaMask demande confirmation du changement
4. **Résultat:** Fond vert, message "Vous êtes sur le bon réseau"

### Scénario 2: Utilisateur sur Base Mainnet

1. **État initial:** Fond jaune, message "Réseau non recommandé"
2. **Info:** Message explique que Base Sepolia est recommandé
3. **Action:** Clic sur "Changer vers Base Sepolia"
4. **Résultat:** Changement de réseau et fond vert

### Scénario 3: Utilisateur déjà sur Base Sepolia

1. **État initial:** Fond vert, badge de confirmation
2. **Option:** Peut ouvrir "Changer de réseau" pour voir Base
3. **Flexibilité:** Peut changer vers Base mainnet si besoin

---

## ⚙️ Configuration avancée

### Personnaliser le réseau préféré

Pour changer le réseau recommandé vers Base mainnet:

```typescript
const SUPPORTED_NETWORKS = [
  { 
    chain: baseSepolia, 
    name: 'Base Sepolia', 
    isPreferred: false,    // ❌ Non préféré
    icon: '🔵'
  },
  { 
    chain: base, 
    name: 'Base', 
    isPreferred: true,     // ✅ Préféré
    icon: '🔵'
  },
]
```

### Personnaliser les messages

Dans le composant, vous pouvez modifier les messages:

```typescript
// Message réseau non supporté
<p className="text-xs text-red-700 mb-3">
  Votre message personnalisé ici
</p>

// Message réseau non recommandé
<p className="text-xs text-yellow-700 mb-3">
  Vous êtes sur {currentNetwork?.name}. 
  Nous recommandons {preferredNetwork?.name} pour une meilleure expérience.
</p>
```

### Désactiver le changement automatique

Pour retirer les boutons de changement, commentez les sections:

```typescript
{/* Network Control Section */}
{/* Commentez cette section pour retirer le bouton de changement */}
```

---

## 🧪 Tests recommandés

### 1. Tester avec différents réseaux

```bash
# Dans votre wallet (MetaMask)
1. Connecter à Ethereum Mainnet → Vérifier message rouge
2. Connecter à Base Sepolia → Vérifier message vert
3. Connecter à Base → Vérifier message jaune
4. Connecter à Polygon → Vérifier message rouge
```

### 2. Tester le changement de réseau

```bash
1. Se connecter sur Ethereum
2. Cliquer sur "Passer à Base Sepolia"
3. Approuver dans MetaMask
4. Vérifier que le statut passe au vert
```

### 3. Tester le sélecteur

```bash
1. Se connecter sur Base Sepolia
2. Ouvrir "Changer de réseau"
3. Sélectionner Base
4. Vérifier le changement
```

---

## 📊 Variables d'environnement

Ajoutez dans `.env.local`:

```env
# Base Sepolia (testnet)
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=https://sepolia.base.org

# Base (mainnet)
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org

# WalletConnect (optionnel)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

---

## 🚀 Résumé

Le contrôle de réseau est maintenant **complètement intégré** dans WalletStatus avec :

- ✅ Détection automatique du réseau
- ✅ Validation intelligente (supporté / recommandé / non supporté)
- ✅ Changement de réseau en un clic
- ✅ Interface utilisateur intuitive avec indicateurs visuels
- ✅ Support multi-réseaux (Base Sepolia + Base mainnet)
- ✅ Messages contextuels adaptés à chaque situation
- ✅ Compilation sans erreur

**Le composant est prêt à l'emploi ! 🎉**

