import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";

export function createServer() {
  const app = express();

  // Performance: Security headers
  app.use((req, res, next) => {
    // Cache headers para assets estáticos
    if (req.url.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
    
    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Performance headers
    res.setHeader('X-Powered-By', 'ONBONGO');
    
    next();
  });

  // Middleware
  app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://lojista.onbongo.com.br', 'https://www.onbongo.com.br']
      : true,
    credentials: true
  }));
  
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Compression middleware em produção
  if (process.env.NODE_ENV === 'production') {
    // Note: compression seria adicionado aqui se necessário
    // app.use(compression());
  }

  // Health check
  app.get("/health", (_req, res) => {
    res.status(200).json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
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
