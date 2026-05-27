import { Suspense } from "react";
import AguardandoPagamnt from "./AguardandoPagamnt";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AguardandoPagamnt />
    </Suspense>
  );
}