import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-medium text-gray-900 mb-4">404</h1>
        <p className="text-gray-600 mb-6">Página não encontrada</p>
        <Link to="/" className="text-blue-600 hover:text-blue-800 underline">
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
