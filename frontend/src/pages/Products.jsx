import { useEffect, useState } from "react";
import { getProducts, placeOrder } from "../utils/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    getProducts().then((res) => setProducts(res.data));
  }, []);

  const handleOrder = async (id) => {
    await placeOrder({ product_id: id, quantity: 1, payment_mode: "online" }, token);
    alert("Order placed!");
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Products</h1>
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
