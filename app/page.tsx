"use client";

import JogoDados from "@/components/JogoDados";
import Fundo3D from "@/components/Fundo3D";

export default function Home() {
  return (
    <>
      <Fundo3D />
      <main className="pagina">
        <JogoDados />
      </main>
    </>
  );
}
