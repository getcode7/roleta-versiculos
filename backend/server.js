const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const db = new sqlite3.Database("./comentarios.db");

// Middlewares
app.use(cors());
app.use(express.json());

// Criação da tabela se não existir
db.run("CREATE TABLE IF NOT EXISTS comentarios (id INTEGER PRIMARY KEY AUTOINCREMENT, texto TEXT)", (err) => {
  if (err) {
    console.error("Erro ao criar tabela comentarios:", err.message);
  }
});

// Rota para listar comentários (GET)
app.get("/comentarios", (req, res) => {
  db.all("SELECT * FROM comentarios", [], (err, rows) => {
    if (err) {
      console.error("Erro ao buscar comentarios:", err.message);
      return res.status(500).json({ error: "Erro ao buscar comentários" });
    }
    res.json(rows);
  });
});

// Rota para adicionar comentário (POST)
app.post("/comentarios", (req, res) => {
  const { texto } = req.body;
  if (!texto || typeof texto !== "string") {
    return res.status(400).json({ error: "Campo texto é obrigatório e deve ser string" });
  }
  db.run("INSERT INTO comentarios (texto) VALUES (?)", [texto], function (err) {
    if (err) {
      console.error("Erro ao adicionar comentario:", err.message);
      return res.status(500).json({ error: "Erro ao adicionar comentário" });
    }
    res.status(201).json({ id: this.lastID, texto });
  });
});

// Servir frontend build (para produção)
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get(/^(?!\/comentarios).*$/, (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
