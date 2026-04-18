import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl">404 - Page Not Found</h1>
      <button
        onClick={() => navigate('/')}
        className="mt-4 px-4 py-2 bg-teal-600 text-white rounded"
      >
        Go Home
      </button>
    </div>
  );
}