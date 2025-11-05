import { Link } from "react-router-dom";

export default function App() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800">
      <h1 className="text-4xl font-bold mb-6">Welcome to LiveMART 🛒</h1>
      <p className="text-lg mb-8 text-center w-80">
        Your one-stop online delivery system connecting customers, retailers, and wholesalers.
      </p>

      <div className="flex space-x-4">
        <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Login
        </Link>
        <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Register
        </Link>
      </div>
    </div>
  );
}
