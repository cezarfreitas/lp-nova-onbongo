import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { initDatabase } from "./database/index.js";
import leadsRouter from "./routes/leads.js";
import adminRouter from "./routes/admin.js";

export function createServer() {
  const app = express();

  // Inicializar banco de dados
  try {
    initDatabase();
    console.log('✅ Banco de dados inicializado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error);
  }

  // Cache headers para assets estáticos
  app.use((req, res, next) => {
    if (
      req.url.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)
    ) {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    }
    next();
  });

  // Middleware
  app.use(
    cors({
      origin:
        process.env.NODE_ENV === "production"
          ? ["http://b2b.onbongo.com.br", "https://www.onbongo.com.br"]
          : true,
      credentials: true,
    }),
  );

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Compression middleware em produção
  if (process.env.NODE_ENV === "production") {
    // Note: compression seria adicionado aqui se necessário
    // app.use(compression());
  }

  // Health check
  app.get("/health", (_req, res) => {
    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ONBONGO API is running!";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  return app;
}
