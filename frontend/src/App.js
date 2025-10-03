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
  const API_BASE = "https://seu-backend-render.onrender.com";  
  
  const [comentarios, setComentarios] = useState([]);
  const [novoComentario, setNovoComentario] = useState("");
  const [ultimoComentario, setUltimoComentario] = useState(null);
  

  // Busca todos os comentários ao carregar e define o último para mostrar
  useEffect(() => {
    fetch(`${API_BASE}/comentarios`)
      .then(res => res.json())
      .then(data => {
        setComentarios(data);
        if (data.length > 0) setUltimoComentario(data[data.length - 1]);
      });
  }, []);

  function handleEnviar(e) {
    e.preventDefault();
    fetch(`${API_BASE}/comentarios`, {  // Usando API_BASE no fetch POST
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto: novoComentario })
    })
      .then(res => res.json())
      .then((comentario) => {
        // Atualizar lista interna (todos comentários salvos)
        setComentarios([...comentarios, comentario]);
        // Mostrar só o último comentário na aba
        setUltimoComentario(comentario);
        setNovoComentario("");
      });
  }

  return (
    <div className="comentarios-container">
      <h3>Deixe uma mensagem para a próxima pessoa que entrar aqui!</h3>
      <form onSubmit={handleEnviar}>
        <input
          value={novoComentario}
          onChange={e => setNovoComentario(e.target.value)}
          placeholder="Deixe seu comentário"
          required
        />
        <button type="submit">Enviar</button>
      </form>

      {/* Mostrar somente o último comentário com avatar */}
      {ultimoComentario && (
        <div className="ultimo-comentario" key={ultimoComentario.id}>
          <div className="comentario-header">
            <div className="avatar"></div>
            <div className="user-info">
              <div className="username"></div>
              <div className="timestamp"></div>
            </div>
          </div>
          <div className="comment-text">
            {ultimoComentario.texto}
          </div>
        </div>
      )}
    </div>
  );
}


function App() {
  const [sorteado, setSorteado] = useState(null);
  const [girando, setGirando] = useState(false);
  const [jaSorteou, setJaSorteou] = useState(false);
  const [mostrarComentarios, setMostrarComentarios] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const flag = localStorage.getItem("jaSorteou");
    if (flag === "true") {
      setJaSorteou(true);
      setMostrarComentarios(true);
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
      setMostrarComentarios(true);

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

        {mostrarComentarios && <Comentarios />}
      </div>
    </div>
  );
}

export default App;
