const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const app = express();


const db = new sqlite3.Database("/data/comentarios.db");



// Middlewares

// Configurar CORS para permitir apenas o domínio do frontend (substitua pela sua URL real)
app.use(cors({
  origin: "https://ecleberaujo.pt",
  optionsSuccessStatus: 200
}));

// Limitar tamanho do corpo da requisição a 1MB
app.use(express.json({ limit: "1mb" }));

// Criar tabela se ela não existir, com tratamento de erro
db.run("CREATE TABLE IF NOT EXISTS comentarios (id INTEGER PRIMARY KEY AUTOINCREMENT, texto TEXT)", (err) => {
  if (err) console.error("Erro ao criar tabela:", err);
});

// Caminho para frontend build
const frontendBuildPath = path.join(__dirname, "../frontend/build");

// Rotas API

app.get("/comentarios", (req, res) => {
  console.log("GET /comentarios recebido");
  db.all("SELECT * FROM comentarios", [], (err, rows) => {
    if (err) {
      console.error("Erro ao buscar comentários:", err);
      return res.status(500).json({ error: "Erro ao buscar comentários" });
    }
    res.json(rows);
  });
});

app.post("/comentarios", (req, res) => {
  console.log("POST /comentarios recebido", req.body);
  const { texto } = req.body;
  if (!texto || typeof texto !== "string") {
    return res.status(400).json({ error: "Campo texto é obrigatório e deve ser string" });
  }
  db.run("INSERT INTO comentarios (texto) VALUES (?)", [texto], function(err) {
    if (err) {
      console.error("Erro ao adicionar comentário:", err);
      return res.status(500).json({ error: "Erro ao adicionar comentário" });
    }
    res.status(201).json({ id: this.lastID, texto });
  });
});

// Servir arquivos estáticos do frontend
app.use(express.static(frontendBuildPath));

// Middleware fallback para React Router, sem interceptar rotas API
app.use((req, res, next) => {
  if (req.path.startsWith("/comentarios")) {
    return res.status(404).send("Not Found");
  }
  res.sendFile(path.join(frontendBuildPath, "index.html"));
});

// Definir porta e iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
