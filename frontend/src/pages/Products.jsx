import { useEffect, useState } from "react";
import { getProducts, placeOrder } from "../utils/api";
import axios from "axios";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [nearby, setNearby] = useState(false);
  const [coords, setCoords] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    getProducts().then((res) => setProducts(res.data));
  }, []);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => alert("Location permission denied")
      );
    } else alert("Geolocation not supported");
  };

  const handleNearby = async () => {
    if (!coords) return alert("Please allow location first");
    const res = await axios.get("http://127.0.0.1:8000/products/nearby", {
      params: { lat: coords.lat, lng: coords.lng, max_distance_km: 10 },
    });
    setProducts(res.data);
    setNearby(true);
  };

  const handleOrder = async (id) => {
    await placeOrder({ product_id: id, quantity: 1, payment_mode: "online" }, token);
    alert("Order placed!");
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Products</h1>
        <div>
          <button onClick={handleGetLocation} className="bg-gray-700 text-white px-3 py-1 rounded mr-2">
            📍 Get Location
          </button>
          <button onClick={handleNearby} className="bg-blue-600 text-white px-3 py-1 rounded">
            {nearby ? "Show All" : "Nearby (10 km)"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="border p-4 rounded-lg shadow">
            <h2 className="font-semibold text-lg">{p.name}</h2>
            <p>{p.description}</p>
            <p className="font-bold">₹{p.price}</p>
            <button className="mt-2 bg-green-600 text-white px-3 py-1 rounded" onClick={() => handleOrder(p.id)}>
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
