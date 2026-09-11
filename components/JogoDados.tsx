"use client";

import { useMemo, useState } from "react";
import Dado from "./Dado";

type Fase = "p1" | "p2" | "resultado" | "fim";
type PlacarRodada = "Jogador 1 venceu" | "Jogador 2 venceu" | "Empate" | null;

function rolarPar(): [number, number] {
  return [
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
  ];
}

export default function JogoDados() {
  const [rodada, setRodada] = useState(1);
  const [fase, setFase] = useState<Fase>("p1");
  const [dadosJ1, setDadosJ1] = useState<[number, number]>([0, 0]);
  const [dadosJ2, setDadosJ2] = useState<[number, number]>([0, 0]);
  const [rolando, setRolando] = useState<"j1" | "j2" | null>(null);
  const [resultadoRodada, setResultadoRodada] = useState<PlacarRodada>(null);
  const [vitoriasJ1, setVitoriasJ1] = useState(0);
  const [vitoriasJ2, setVitoriasJ2] = useState(0);
  const [empates, setEmpates] = useState(0);
  const [historico, setHistorico] = useState<PlacarRodada[]>([]);

  const somaJ1 = dadosJ1[0] + dadosJ1[1];
  const somaJ2 = dadosJ2[0] + dadosJ2[1];
  const terminou = fase === "fim";

  const resultadoFinal = useMemo(() => {
    if (!terminou) return null;
    if (vitoriasJ1 > vitoriasJ2) return "Jogador 1 venceu a partida";
    if (vitoriasJ2 > vitoriasJ1) return "Jogador 2 venceu a partida";
    return "Empate geral";
  }, [terminou, vitoriasJ1, vitoriasJ2]);

  function avaliarRodada(parJ1: [number, number], parJ2: [number, number]) {
    const s1 = parJ1[0] + parJ1[1];
    const s2 = parJ2[0] + parJ2[1];
    let resultado: PlacarRodada = "Empate";
    if (s1 > s2) resultado = "Jogador 1 venceu";
    if (s2 > s1) resultado = "Jogador 2 venceu";

    setFase("resultado");
    setResultadoRodada(resultado);
    setHistorico((h) => [...h, resultado]);
    if (resultado === "Jogador 1 venceu") setVitoriasJ1((n) => n + 1);
    if (resultado === "Jogador 2 venceu") setVitoriasJ2((n) => n + 1);
    if (resultado === "Empate") setEmpates((n) => n + 1);

    window.setTimeout(() => {
      if (rodada >= 5) {
        setFase("fim");
        return;
      }
      setRodada((r) => r + 1);
      setDadosJ1([0, 0]);
      setDadosJ2([0, 0]);
      setResultadoRodada(null);
      setFase("p1");
    }, 900);
  }

  function jogarJogador1() {
    if (fase !== "p1" || rolando) return;
    setRolando("j1");
    setResultadoRodada(null);
    const tick = window.setInterval(() => {
      setDadosJ1(rolarPar());
    }, 70);
    window.setTimeout(() => {
      window.clearInterval(tick);
      const final = rolarPar();
      setDadosJ1(final);
      setRolando(null);
      setFase("p2");
    }, 700);
  }

  function jogarJogador2() {
    if (fase !== "p2" || rolando) return;
    setRolando("j2");
    const tick = window.setInterval(() => {
      setDadosJ2(rolarPar());
    }, 70);
    window.setTimeout(() => {
      window.clearInterval(tick);
      const final = rolarPar();
      setDadosJ2(final);
      setRolando(null);
      avaliarRodada(dadosJ1, final);
    }, 700);
  }

  function jogarNovamente() {
    setRodada(1);
    setFase("p1");
    setDadosJ1([0, 0]);
    setDadosJ2([0, 0]);
    setRolando(null);
    setResultadoRodada(null);
    setVitoriasJ1(0);
    setVitoriasJ2(0);
    setEmpates(0);
    setHistorico([]);
  }

  return (
    <section className="jogo">
      <header className="jogo__topo">
        <p className="jogo__kicker">UNICAP · Sistemas para Internet</p>
        <h1>Jogo de Dados</h1>
        <p className="jogo__sub">
          2 jogadores · 5 rodadas · vence a maior soma dos dois dados
        </p>
      </header>

      <div className="jogo__status">
        <span className="chip">Rodada {Math.min(rodada, 5)} de 5</span>
        <span className="chip chip--score">
          Placar {vitoriasJ1} × {vitoriasJ2}
          {empates > 0 ? ` · ${empates} empate${empates > 1 ? "s" : ""}` : ""}
        </span>
      </div>

      <div className="jogo__mesa">
        <article className={`jogador ${fase === "p1" ? "jogador--vez" : ""}`}>
          <h2>Jogador 1</h2>
          <div className="jogador__dados">
            <Dado valor={dadosJ1[0]} rolando={rolando === "j1"} />
            <Dado valor={dadosJ1[1]} rolando={rolando === "j1"} />
          </div>
          <p className="jogador__soma">
            Soma: <strong>{dadosJ1[0] > 0 ? somaJ1 : "—"}</strong>
          </p>
          <button
            type="button"
            className="btn"
            onClick={jogarJogador1}
            disabled={fase !== "p1" || rolando !== null}
          >
            Jogar Jogador 1
          </button>
        </article>

        <div className="jogo__versus" aria-hidden>
          <b>VS</b>
          <ol className="jogo__rounds">
            {Array.from({ length: 5 }, (_, i) => (
              <li
                key={i}
                className={
                  historico[i]
                    ? historico[i] === "Empate"
                      ? "empate"
                      : historico[i] === "Jogador 1 venceu"
                        ? "j1"
                        : "j2"
                    : i + 1 === rodada && !terminou
                      ? "atual"
                      : ""
                }
              >
                {i + 1}
              </li>
            ))}
          </ol>
        </div>

        <article className={`jogador ${fase === "p2" ? "jogador--vez" : ""}`}>
          <h2>Jogador 2</h2>
          <div className="jogador__dados">
            <Dado valor={dadosJ2[0]} rolando={rolando === "j2"} />
            <Dado valor={dadosJ2[1]} rolando={rolando === "j2"} />
          </div>
          <p className="jogador__soma">
            Soma: <strong>{dadosJ2[0] > 0 ? somaJ2 : "—"}</strong>
          </p>
          <button
            type="button"
            className="btn btn--j2"
            onClick={jogarJogador2}
            disabled={fase !== "p2" || rolando !== null}
          >
            Jogar Jogador 2
          </button>
        </article>
      </div>

      <p
        className={`jogo__resultado ${resultadoRodada ? "jogo__resultado--on" : ""} ${
          resultadoRodada === "Empate" ? "is-empate" : ""
        }`}
        role="status"
      >
        {resultadoRodada ?? (terminou ? "" : "Aguardando a jogada…")}
      </p>

      {terminou && (
        <div className="jogo__final">
          <p className="jogo__final-msg">{resultadoFinal}</p>
          <p className="jogo__final-sub">
            {vitoriasJ1} a {vitoriasJ2}
            {empates ? ` · ${empates} rodada(s) empatada(s)` : ""}
          </p>
          <button type="button" className="btn btn--again" onClick={jogarNovamente}>
            Jogar Novamente
          </button>
        </div>
      )}
    </section>
  );
}
