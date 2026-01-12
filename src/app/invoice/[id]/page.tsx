// src/app/invoice/[id]/page.tsx
import Link from "next/link";
import { getInvoiceById } from "@/lib/invoices";
import { formatUsdc, usdcExplorerUrl } from "@/lib/usdc";
import { WalletStatus } from "@/components/WalletStatus";
import { USDCPaymentButton } from "@/components/USDCPaymentButton";

export default function InvoiceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const invoice = getInvoiceById(params.id);

  if (!invoice) {
    return (
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-xl font-semibold">Invoice not found</h1>
        <Link className="underline underline-offset-4" href="/">
          Back
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <header className="mb-6">
        <Link className="underline underline-offset-4" href="/">
          ← Back
        </Link>
        <h1 className="text-2xl font-bold mt-3">{invoice.reference}</h1>
        <p className="text-gray-600 mt-1">{invoice.vendorName}</p>
      </header>

      {/* Wallet Status */}
      <div className="mb-6">
        <WalletStatus />
      </div>

      <section className="rounded-xl border p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-gray-500">Status</div>
            <div className="font-medium">{invoice.status}</div>
          </div>

          <div>
            <div className="text-gray-500">Due date</div>
            <div className="font-medium">{invoice.dueDate}</div>
          </div>

          <div>
            <div className="text-gray-500">Amount</div>
            <div className="font-medium">
              {formatUsdc(invoice.amountUsdc)} {invoice.currency}
            </div>
            <div className="text-xs text-gray-500">
              (display: ${invoice.amountUsd})
            </div>
          </div>

          <div>
            <div className="text-gray-500">Vendor address</div>
            <div className="font-mono text-xs break-all">
              {invoice.vendorAddress}
            </div>

            <div className="mt-3 text-sm">
              <a
                className="underline underline-offset-4"
                href={usdcExplorerUrl()}
                target="_blank"
                rel="noreferrer"
              >
                View USDC token on BaseScan
              </a>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-gray-500 text-sm">Description</div>
          <div className="mt-1">{invoice.description}</div>
        </div>

        <div className="mt-6">
          <USDCPaymentButton
            recipientAddress={invoice.vendorAddress as `0x${string}`}
            amount={formatUsdc(invoice.amountUsdc)}
            invoiceId={invoice.reference}
            onTransactionSent={(hash) => {
              console.log('Transaction envoyée:', hash)
            }}
            onTransactionConfirmed={(hash) => {
              console.log('Transaction confirmée:', hash)
              // Ici vous pouvez ajouter votre logique custom
              // Mais AUCUNE mise à jour automatique du statut "PAID"
            }}
            onError={(error) => {
              console.error('Erreur de paiement:', error)
            }}
          />

          <div className="mt-3">
            <Link
              href={`/invoice/${invoice.id}/status`}
              className="inline-block rounded-lg px-4 py-2 border hover:bg-gray-50 transition-colors text-sm"
            >
              Voir le statut
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
