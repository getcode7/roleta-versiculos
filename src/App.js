import React, { useState, useEffect, useRef } from "react";
import { versiculos } from "./versiculos";
import "./App.css";

function App() {
  const [sorteado, setSorteado] = useState(null);
  const [girando, setGirando] = useState(false);
  const [indice, setIndice] = useState(0);
  const startTimeRef = useRef(null);

  function iniciarRoleta() {
    if (girando) return;
    setGirando(true);
    startTimeRef.current = null;

    function animar(timestamp) {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;

      if (elapsed >= 3000) {
        // Para depois de 3 segundos
        setGirando(false);
        setSorteado(versiculos[indice]);
        return;
      }

      // Muda de versículo a cada 100ms
      if (Math.floor(elapsed / 100) !== Math.floor((elapsed - 16) / 100)) {
        setIndice((prev) => (prev + 1) % versiculos.length);
      }

      requestAnimationFrame(animar);
    }

    requestAnimationFrame(animar);
  }

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h2>Roleta de Versículos</h2>
      <button onClick={iniciarRoleta} disabled={girando}>
        {girando ? "Girando..." : "Girar Roleta"}
      </button>

      {sorteado && !girando && (
        <div className="card-versiculo">
          <span className="card-capitulo">{sorteado.capitulo}</span>
          <span className="card-versiculo-num">{sorteado.versiculo}</span>
          <span className="card-livro">{sorteado.livro}</span>
          <span className="card-texto">{sorteado.texto}</span>
        </div>
      )}

      {girando && (
        <div className="card-versiculo">
          <span className="card-capitulo">{versiculos[indice].capitulo}</span>
          <span className="card-versiculo-num">{versiculos[indice].versiculo}</span>
          <span className="card-livro">{versiculos[indice].livro}</span>
          <span className="card-texto">{versiculos[indice].texto}</span>
        </div>
      )}
    </div>
  );
}

export default App;

