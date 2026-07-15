import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#F8FAFC] px-6 text-center">
      <div className="w-24 h-24 bg-[#EBF3FF] rounded-full flex items-center justify-center mb-6 text-5xl">
        🔍
      </div>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-2">404 - Page Not Found</h1>
      <p className="text-gray-500 font-medium mb-8">The page you are looking for doesn't exist.</p>
      <button
        onClick={() => navigate('/')}
        className="px-8 py-3.5 bg-[#0062FF] hover:bg-blue-700 text-white font-bold rounded-full transition-colors shadow-lg shadow-blue-600/20"
      >
        Go Home
      </button>
    </div>
  );
}