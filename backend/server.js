const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const db = new sqlite3.Database("./comentarios.db");

// Middlewares
app.use(cors());
app.use(express.json());

// Tabela
db.run("CREATE TABLE IF NOT EXISTS comentarios (id INTEGER PRIMARY KEY AUTOINCREMENT, texto TEXT)");

// Caminho para frontend build
const frontendBuildPath = path.join(__dirname, "../frontend/build");

// Rotas API
app.get("/comentarios", (req, res) => {
  db.all("SELECT * FROM comentarios", [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Erro ao buscar comentários" });
    res.json(rows);
  });
});

app.post("/comentarios", (req, res) => {
  const { texto } = req.body;
  if (!texto || typeof texto !== "string") {
    return res.status(400).json({ error: "Campo texto é obrigatório e deve ser string" });
  }
  db.run("INSERT INTO comentarios (texto) VALUES (?)", [texto], function(err) {
    if (err) return res.status(500).json({ error: "Erro ao adicionar comentário" });
    res.status(201).json({ id: this.lastID, texto });
  });
});

// Servir arquivos estáticos
app.use(express.static(frontendBuildPath));

// Middleware fallback para React Router, sem usar rota '*'
app.use((req, res, next) => {
  const reqPath = req.path;
  if (reqPath.startsWith("/comentarios")) {
    // Não intercepta rotas API que não existam
    return res.status(404).send("Not Found");
  }
  res.sendFile(path.join(frontendBuildPath, "index.html"));
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
