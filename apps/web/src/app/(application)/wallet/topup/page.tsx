import { ErrorBoundary } from "react-error-boundary";

import { Anchor } from "@/components/anchor";
import { Header } from "@/components/header";

import { PaymentButton, PaymentButtonError } from "./payment-button";
import { SelectionTopUp } from "./selection";

export default function Topup() {
  const amount = 3;

  return (
    <main>
      <Header>Comprar tokens</Header>

      <div className="flex flex-col gap-4">
        <SelectionTopUp />

        <div className="mt-6">
            <PaymentButton amount={Number(amount)}>
              Comprar tokens
            </PaymentButton>
        </div>

        <div className="text-tiny text-foreground-400">
          <p>
            Nuestro método de pago es Wompi, una plataforma segura y confiable
            para realizar transacciones en línea. Al hacer clic en
            &quot;Recargar Billetera&quot;, aparecerá una ventana emergente
            donde podrás completar tu pago.
          </p>

          <br />

          <p>
            Al realizar este pedido, aceptas las{" "}
            <Anchor href="/policies/tokens">Políticas</Anchor> y las{" "}
            <Anchor href="/policies/payments">Condiciones de uso</Anchor> de
            Nuxpi.
          </p>
        </div>
      </div>
    </main>
  );
}
