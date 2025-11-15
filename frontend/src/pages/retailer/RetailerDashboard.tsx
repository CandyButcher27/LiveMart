import React from "react";
import Navbar from "../../components/layout/Navbar";
import CartModal from "../../components/cart/CartModal";
import { Link } from "react-router-dom";

const RetailerDashboard: React.FC = () => {
  const cards = [
    {
      title: "My Products",
      description: "Manage the items you sell to customers.",
      link: "/retailer/products",
      button: "Manage Products",
      gradient: "from-blue-600 to-indigo-600",
    },
    {
      title: "Customer Orders",
      description: "View and update incoming customer orders.",
      link: "/retailer/orders",
      button: "View Orders",
      gradient: "from-emerald-600 to-green-700",
    },
    {
      title: "My Wholesale Purchases",
      description: "Track products you have purchased from wholesalers.",
      link: "/retailer/wholesale-orders",
      button: "View Wholesale Orders",
      gradient: "from-purple-600 to-pink-600",
    },
    {
      title: "Buy from Wholesalers",
      description: "Explore wholesale products and restock your inventory.",
      link: "/retailer/buy-wholesale",
      button: "Explore Wholesale",
      gradient: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <CartModal />

      <main className="max-w-6xl mx-auto px-6 py-10">
        
        {/* HEADER */}
        <h1 className="text-3xl font-bold tracking-wide mb-8">
          Retailer Dashboard
        </h1>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {cards.map((card) => (
            <div
              key={card.title}
              className="glass-card p-6 rounded-2xl flex flex-col justify-between
                         hover:scale-[1.02] transition-all duration-300"
            >
              {/* Title + description */}
              <div>
                <h2 className="text-xl font-semibold mb-1">{card.title}</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* Button */}
              <Link
                to={card.link}
                className={`mt-5 px-4 py-2 rounded-xl text-center font-medium 
                           bg-gradient-to-r ${card.gradient} 
                           hover:opacity-90 transition shadow-md`}
              >
                {card.button}
              </Link>
            </div>
          ))}

        </div>
      </main>
    </div>
  );
};

export default RetailerDashboard;
