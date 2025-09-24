import React, { useState, useRef, useEffect } from "react";
import { versiculos } from "./versiculos";
import "./App.css";

function CardVersiculo({ data }) {
  if (!data) return null;
  return (
    <div className="card-versiculo">
      <span className="card-capitulo">{data.capitulo}</span>
      <span className="card-versiculo-num">{data.versiculo}</span>
      <span className="card-livro">{data.livro}</span>
      <span className="card-texto">{data.texto}</span>
    </div>
  );
}

function App() {
  const [sorteado, setSorteado] = useState(null);
  const [girando, setGirando] = useState(false);
  const [jaSorteou, setJaSorteou] = useState(false);
  const timeoutRef = useRef(null);

  // Verifica no carregamento da página se já foi sorteado
  useEffect(() => {
    const flag = localStorage.getItem("jaSorteou");
    if (flag === "true") {
      setJaSorteou(true);
    }
  }, []);

  function iniciarRoleta() {
    if (girando || jaSorteou) return;

    setSorteado(null);
    setGirando(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      const indiceAleatorio = Math.floor(Math.random() * versiculos.length);
      setSorteado(versiculos[indiceAleatorio]);
      setGirando(false);
      setJaSorteou(true);

      // guarda no navegador que já sorteou
      localStorage.setItem("jaSorteou", "true");
      timeoutRef.current = null;
    }, 1200);
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div>
    <div className="rain-overlay"></div> {/* Fundo de chuva*/}
    <div className="app-container">
      <h2 className="titulo">Tudo tem um propósito debaixo do céu.</h2>

      <button
        onClick={iniciarRoleta}
        disabled={girando || jaSorteou}
        className="btn-roleta"
      >
        {jaSorteou
          ? "Deus seja contigo!"
          : girando
          ? "Procurando..."
          : "Ver"}
      </button>

      {girando && (
        <div className="card-placeholder">A procurar um versículo…</div>
      )}

      {!girando && sorteado && <CardVersiculo data={sorteado} />}
    </div>
  </div>
  );
}

export default App;
