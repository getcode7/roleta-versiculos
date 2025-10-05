const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

// Conexão com o MongoDB Atlas (substitua pela sua string real e senha)
mongoose.connect('mongodb+srv://joel:dbcaboverdeguine@cluster0.mx4s2dn.mongodb.net/commentsdb?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Conectado ao MongoDB Atlas!");
}).catch((err) => {
  console.error("Erro ao conectar ao MongoDB:", err);
});

// Schema e modelo Mongoose
const comentarioSchema = new mongoose.Schema({
  texto: { type: String, required: true }
});
const Comentario = mongoose.model("Comentario", comentarioSchema);

// Middlewares
app.use(cors({
  origin: "https://ecleberaujo.pt",
  optionsSuccessStatus: 200
}));
app.use(express.json({ limit: "1mb" }));

// Caminho para frontend build
const frontendBuildPath = path.join(__dirname, "../frontend/build");
app.use(express.static(frontendBuildPath));

// Rotas API
app.get("/comentarios", async (req, res) => {
  try {
    const comentarios = await Comentario.find();
    res.json(comentarios);
  } catch (err) {
    console.error("Erro ao buscar comentários:", err);
    res.status(500).json({ error: "Erro ao buscar comentários" });
  }
});

app.post("/comentarios", async (req, res) => {
  const { texto } = req.body;
  if (!texto || typeof texto !== "string") {
    return res.status(400).json({ error: "Campo texto é obrigatório e deve ser string" });
  }
  try {
    const novoComentario = new Comentario({ texto });
    const salvo = await novoComentario.save();
    res.status(201).json(salvo);
  } catch (err) {
    console.error("Erro ao adicionar comentário:", err);
    res.status(500).json({ error: "Erro ao adicionar comentário" });
  }
});

// Middleware fallback para React Router, sem interceptar rotas API
app.use((req, res, next) => {
  if (req.path.startsWith("/comentarios")) {
    return res.status(404).send("Not Found");
  }
  res.sendFile(path.join(frontendBuildPath, "index.html"));
});

// Porta
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
