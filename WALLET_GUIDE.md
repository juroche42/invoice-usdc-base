# Guide d'utilisation - Connexion Wallet avec Wagmi

## Composants disponibles

### 1. `WalletConnect` (Basique)
Composant simple pour connecter/déconnecter un wallet.

**Utilisation:**
```tsx
import { WalletConnect } from '@/components/WalletConnect'

export default function Page() {
  return <WalletConnect />
}
```

**Fonctionnalités:**
- Connexion via MetaMask, WalletConnect, etc.
- Affichage de l'adresse connectée
- Affichage de la balance ETH
- Bouton de déconnexion

---

### 2. `WalletStatus` (Complet)
Composant avancé avec validation du réseau et gestion des erreurs.

**Utilisation:**
```tsx
import { WalletStatus } from '@/components/WalletStatus'

export default function Page() {
  return <WalletStatus />
}
```

**Fonctionnalités:**
- ✅ Connexion/déconnexion
- ✅ Validation du réseau (Base Sepolia)
- ✅ Changement automatique de réseau
- ✅ Copie de l'adresse
- ✅ Affichage de la balance
- ✅ Gestion des erreurs
- ✅ États de chargement

---

## Hooks Wagmi disponibles dans vos composants

### `useAccount()`
Obtenir les informations du compte connecté.

```tsx
'use client'
import { useAccount } from 'wagmi'

export function MyComponent() {
  const { address, isConnected, chainId } = useAccount()
  
  if (!isConnected) return <div>Connectez votre wallet</div>
  
  return <div>Connecté: {address}</div>
}
```

### `useBalance()`
Obtenir la balance d'une adresse.

```tsx
'use client'
import { useAccount, useBalance } from 'wagmi'
import { formatUnits } from 'viem'

export function Balance() {
  const { address } = useAccount()
  const { data } = useBalance({ address })
  
  if (!data) return null
  
  return (
    <div>
      Balance: {formatUnits(data.value, data.decimals)} {data.symbol}
    </div>
  )
}
```

### `useReadContract()`
Lire les données d'un smart contract.

```tsx
'use client'
import { useReadContract } from 'wagmi'
import { USDC_ADDRESS, USDC_ABI } from '@/lib/usdc'

export function USDCBalance({ address }: { address: string }) {
  const { data: balance } = useReadContract({
    address: USDC_ADDRESS,
    abi: USDC_ABI,
    functionName: 'balanceOf',
    args: [address],
  })
  
  return <div>USDC Balance: {balance?.toString()}</div>
}
```

### `useWriteContract()`
Écrire dans un smart contract (envoyer une transaction).

```tsx
'use client'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { USDC_ADDRESS, USDC_ABI } from '@/lib/usdc'
import { parseUnits } from 'viem'

export function SendUSDC() {
  const { writeContract, data: hash } = useWriteContract()
  
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const sendTokens = async () => {
    writeContract({
      address: USDC_ADDRESS,
      abi: USDC_ABI,
      functionName: 'transfer',
      args: ['0x...', parseUnits('10', 6)], // 10 USDC
    })
  }

  return (
    <button onClick={sendTokens} disabled={isLoading}>
      {isLoading ? 'En cours...' : 'Envoyer 10 USDC'}
    </button>
  )
}
```

### `useConnect()` & `useDisconnect()`
Gérer manuellement la connexion.

```tsx
'use client'
import { useConnect, useDisconnect, useAccount } from 'wagmi'

export function CustomConnect() {
  const { connectors, connect } = useConnect()
  const { disconnect } = useDisconnect()
  const { isConnected } = useAccount()

  if (isConnected) {
    return <button onClick={() => disconnect()}>Déconnecter</button>
  }

  return (
    <div>
      {connectors.map((connector) => (
        <button
          key={connector.id}
          onClick={() => connect({ connector })}
        >
          Connecter {connector.name}
        </button>
      ))}
    </div>
  )
}
```

### `useSwitchChain()`
Changer de réseau blockchain.

```tsx
'use client'
import { useSwitchChain } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'

export function NetworkSwitcher() {
  const { switchChain } = useSwitchChain()

  return (
    <button onClick={() => switchChain({ chainId: baseSepolia.id })}>
      Passer à Base Sepolia
    </button>
  )
}
```

---

## Exemple complet: Payer une facture

```tsx
'use client'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { USDC_ADDRESS, USDC_ABI } from '@/lib/usdc'
import { parseUnits } from 'viem'

export function PayInvoice({ recipientAddress, amount }: { 
  recipientAddress: string
  amount: string 
}) {
  const { address, isConnected } = useAccount()
  const { writeContract, data: hash, isPending } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const handlePayment = async () => {
    if (!isConnected) {
      alert('Connectez votre wallet')
      return
    }

    try {
      writeContract({
        address: USDC_ADDRESS,
        abi: USDC_ABI,
        functionName: 'transfer',
        args: [recipientAddress, parseUnits(amount, 6)], // USDC a 6 décimales
      })
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  if (!isConnected) {
    return <div>Connectez votre wallet pour payer</div>
  }

  if (isSuccess) {
    return (
      <div className="text-green-600">
        ✅ Paiement réussi! 
        <a href={`https://sepolia.basescan.org/tx/${hash}`} target="_blank">
          Voir la transaction
        </a>
      </div>
    )
  }

  return (
    <button
      onClick={handlePayment}
      disabled={isPending || isConfirming}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
    >
      {isPending || isConfirming ? 'Traitement...' : `Payer ${amount} USDC`}
    </button>
  )
}
```

---

## Configuration avancée

### Ajouter d'autres réseaux

Éditez `src/lib/wagmi.ts`:

```ts
import { base, baseSepolia } from 'wagmi/chains'

export const config = createConfig({
  chains: [baseSepolia, base], // Ajoutez base mainnet
  // ...
  transports: {
    [baseSepolia.id]: http('https://sepolia.base.org'),
    [base.id]: http('https://mainnet.base.org'),
  },
})
```

### Ajouter d'autres connecteurs

```ts
import { coinbaseWallet, walletConnect, injected } from 'wagmi/connectors'

export const config = createConfig({
  // ...
  connectors: [
    injected(),
    walletConnect({ projectId: 'YOUR_PROJECT_ID' }),
    coinbaseWallet({ appName: 'Invoice USDC' }),
  ],
})
```

---

## Ressources

- [Documentation Wagmi](https://wagmi.sh/)
- [Hooks Wagmi](https://wagmi.sh/react/api/hooks)
- [Viem Utils](https://viem.sh/docs/utilities/formatEther.html)
- [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)

