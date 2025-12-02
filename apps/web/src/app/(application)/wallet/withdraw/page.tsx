"use client";

import { ArrowLeftRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { Controller, useForm } from "react-hook-form";

import { NumberInput } from "@/components/ui/number-input";
import { CardRadio } from "@/components/card-radio";
import { Header } from "@/components/header";
import { Heading } from "@/components/heading";
import { Button } from "@heroui/button";
import { RadioGroup } from "@heroui/radio";
import { Skeleton } from "@heroui/skeleton";

const MIN_WITHDRAWAL_AMOUNT = 1;

export default function Withdraw() {
  const router = useRouter();

  const { control } = useForm<{ amount: number }>({
    mode: "onChange",
    defaultValues: {
      amount: MIN_WITHDRAWAL_AMOUNT,
    },
  });

  const balance = 10;
  const details = {
    withdraw_amount: {
      to_currency: "USD",
      to_rate: 1,
      from_rate: 2,
      from_currency: "TK",
    },
    fee_amount: {
      from_rate: "USD",
      from_currency: "TK",
      to_currency: "USD",
      to_rate: 1,
    },
    receive_amount: 1,
  };

  const isLoadingDetails = false;

  return (
    <main>
      <Header
        endContent={
          <Button variant="bordered" onPress={router.back}>
            Cancelar
          </Button>
        }
      >
        Solicitar retiro
      </Header>

      <form className="flex flex-col gap-8">
        <div>
          <Heading level="caption">
            Ingresa la cantidad que deseas retirar
          </Heading>

          <Controller
            name="amount"
            control={control}
            render={({ field, fieldState }) => (
              <NumberInput
                className="mx-auto max-w-max"
                classNames={{
                  input: "text-3xl font-semibold text-center",
                  helperWrapper: "text-center",
                }}
                startContent
                variant="underlined"
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
                description={`Puedes retirar desde ${MIN_WITHDRAWAL_AMOUNT} token hasta ${balance} tokens.`}
                minValue={MIN_WITHDRAWAL_AMOUNT}
                fullWidth
                {...field}
              />
            )}
            rules={{
              required: "La cantidad es requerida.",
              validate: (value) => {
                if (value <= 0) {
                  return "La cantidad debe ser mayor a cero.";
                }
                if (value > (balance || 0)) {
                  return "La cantidad no puede ser mayor al saldo disponible.";
                }
                return true;
              },
            }}
          />
        </div>

        <div>
          <Heading level="caption">Selecciona una cuenta de destino</Heading>

          <RadioGroup>
            <CardRadio title="Cuenta bancaria" value="1">
              Bancolombia
            </CardRadio>
            <CardRadio title="Cuenta bancaria" value="2">
              Bancolombia
            </CardRadio>
          </RadioGroup>
        </div>

        <div>
          <Heading
            level="caption"
            className="text-tiny mb-3 font-medium uppercase"
          >
            Detalles de la solicitud
          </Heading>

          <div className="divide-divider border-divider rounded-medium flex flex-col divide-y divide-dashed border">
            <div className="flex px-4 py-2">
              <div className="text-small inline-flex w-full grow items-center font-semibold">
                Monto a retirar
              </div>
              <Skeleton isLoaded={!isLoadingDetails}>
                <div className="flex min-w-max shrink-0 items-center gap-2 font-semibold">
                  <div>{`${details?.withdraw_amount.from_rate} ${details?.withdraw_amount.from_currency}`}</div>
                  <ArrowLeftRightIcon
                    className="text-foreground-400"
                    size={16}
                  />
                  <div>
                    {Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: details?.withdraw_amount.to_currency ?? "USD",
                    }).format(details?.withdraw_amount.to_rate ?? 0)}
                  </div>
                </div>
              </Skeleton>
            </div>

            <div className="flex px-4 py-2">
              <div className="text-small inline-flex w-full grow items-center font-semibold">
                Comisión por retiro
              </div>
              <Skeleton isLoaded={!isLoadingDetails}>
                <div className="flex min-w-max shrink-0 items-center gap-2 font-semibold">
                  <div>{`${details?.fee_amount.from_rate} ${details?.fee_amount.from_currency}`}</div>
                  <ArrowLeftRightIcon
                    className="text-foreground-400"
                    size={16}
                  />
                  <div>
                    {Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: details?.fee_amount.to_currency ?? "USD",
                    }).format(details?.fee_amount.to_rate ?? 0)}
                  </div>
                </div>
              </Skeleton>
            </div>

            <div className="text-large flex px-4 py-2">
              <div className="inline-flex grow items-center font-bold">
                Total
              </div>
              <Skeleton isLoaded={!isLoadingDetails}>
                <div className="font-bold">
                  {Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: details?.withdraw_amount.to_currency ?? "USD",
                  }).format(details?.receive_amount ?? 0)}
                </div>
              </Skeleton>
            </div>
          </div>

          <p className="text-tiny text-foreground-400 mt-3">
            Se creará una solicitud de retiro, la cual será procesada por el
            equipo de soporte. Recibirás una notificación cuando se complete el
            proceso. Puedes revisar el estado de la solicitud en la sección de
            &quot;Transacciones&quot; en tu billetera.
          </p>
        </div>

        <Button color="primary" fullWidth>
          Crear solicitud de retiro
        </Button>
      </form>
    </main>
  );
}
