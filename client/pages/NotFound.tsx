import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-light flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-medium text-dark mb-4">404</h1>
        <p className="text-muted mb-6">Página não encontrada</p>
        <Link to="/" className="text-accent hover:text-accent/80 underline">
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
