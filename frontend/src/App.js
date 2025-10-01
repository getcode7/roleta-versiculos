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

function Comentarios() {
  const [comentarios, setComentarios] = useState([]);
  const [novoComentario, setNovoComentario] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/comentarios")
      .then(res => res.json())
      .then(setComentarios);
  }, []);

  function handleEnviar(e) {
    e.preventDefault();
    fetch("http://localhost:5000/comentarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto: novoComentario })
    })
      .then(res => res.json())
      .then((comentario) => {
        setComentarios([...comentarios, comentario]);
        setNovoComentario("");
      });
  }

  return (
    <div className="comentarios-container">
      <h3>Comentários</h3>
      <form onSubmit={handleEnviar}>
        <input
          value={novoComentario}
          onChange={e => setNovoComentario(e.target.value)}
          placeholder="Deixe seu comentário"
        />
        <button type="submit">Enviar</button>
      </form>
      <ul>
        {comentarios.map(c => (
          <li key={c.id}>{c.texto}</li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  const [sorteado, setSorteado] = useState(null);
  const [girando, setGirando] = useState(false);
  const [jaSorteou, setJaSorteou] = useState(false);
  const timeoutRef = useRef(null);

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
      <div className="rain-overlay"></div>
      <div className="app-container">
        <h2 className="titulo">Tudo tem um propósito debaixo do céu.</h2>

        <button
          onClick={iniciarRoleta}
          disabled={girando || jaSorteou}
          className="btn-roleta"
        >
          {jaSorteou ? "Deus seja contigo!" : girando ? "Procurando..." : "Ver"}
        </button>

        {girando && <div className="card-placeholder">Espere por Favor</div>}

        {!girando && sorteado && <CardVersiculo data={sorteado} />}

        {/* Inserção dos comentários */}
        <Comentarios />
      </div>
    </div>
  );
}

export default App;
