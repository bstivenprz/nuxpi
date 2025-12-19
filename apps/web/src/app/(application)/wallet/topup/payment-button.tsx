"use client";

import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@heroui/button";

interface PaymentButtonProps {
  amount: number;
  children?: React.ReactNode;
}

export function PaymentButton({ amount = 1, children }: PaymentButtonProps) {
  const router = useRouter();

  async function handlePaymentWidget() {
    // const response = await initialize({
    //   quantity: amount,
    //   description: 'Recarga de billetera en Nuxpi',
    // }).unwrap()
    // const checkout = new WidgetCheckout({
    //   currency: response.currency,
    //   amountInCents: response.amount,
    //   reference: response.reference,
    //   publicKey: response.public_key,
    //   signature: {
    //     integrity: response.raw_payload,
    //   },
    // })

    // checkout.open((event) => {
    //   router.push(
    //     `/wallet/checkout/status?reference=${event.transaction.reference}`
    //   );

      // refetchBalanceQuery()
    // });
  }

  return (
    <Button
      color="primary"
      size="lg"
      fullWidth
      onPress={handlePaymentWidget}
      // isLoading={isLoading}
    >
      {children}
    </Button>
  );
}

export function PaymentButtonError() {
  return (
    <Button
      color="danger"
      size="lg"
      startContent={<XIcon />}
      fullWidth
      isDisabled
    >
      No es posible continuar
    </Button>
  );
}
