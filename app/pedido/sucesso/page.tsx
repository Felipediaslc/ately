import { Suspense } from "react";
import PedidoSucessoClient from "./PedidoSucessoClient";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PedidoSucessoClient />
    </Suspense>
  );
}