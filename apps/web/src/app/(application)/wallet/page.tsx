import { Header } from "@/components/header";

import { Balance } from "./balance";
import { Transactions } from "./transactions";

export default function Wallet() {
  return (
    <main>
      <Header>Billetera</Header>

      <Balance />

      <Transactions />
    </main>
  );
}
