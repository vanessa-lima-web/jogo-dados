"use client";

type DadoProps = {
  valor: number;
  rolando?: boolean;
};

const FACES = [1, 2, 3, 4, 5, 6] as const;

export default function Dado({ valor, rolando = false }: DadoProps) {
  const face = valor >= 1 && valor <= 6 ? valor : 1;
  const visivel = valor >= 1 && valor <= 6;

  return (
    <div
      className={`dado ${rolando ? "dado--rolando" : ""} ${visivel ? "dado--ativo" : "dado--oculto"}`}
      aria-label={visivel ? `Dado com valor ${face}` : "Dado ainda não lançado"}
    >
      <div className="dado__cubo" data-face={face}>
        {FACES.map((n) => (
          <div key={n} className={`dado__face dado__face--${n}`}>
            <img src={`/dados/${n}.svg`} alt={`Dado ${n}`} width={112} height={112} draggable={false} />
          </div>
        ))}
      </div>
    </div>
  );
}
