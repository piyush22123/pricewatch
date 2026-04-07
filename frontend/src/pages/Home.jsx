// pages/Home.jsx
import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import toast from "react-hot-toast";
import { IoIosAddCircleOutline } from "react-icons/io";



const Home = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    productUrl: "",
    targetPrice: "",
  });
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    const res = await API.get("/products");
    setProducts(res.data.products);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.productUrl || !form.targetPrice) {
      toast.error("All fields required");
      return;
    }

    try {
      setLoading(true);
      await API.post("/products", form);
      toast.success("Product added");
      setForm({ productUrl: "", targetPrice: "" });
      fetchProducts();
    } catch (err) {
      toast.error("Failed to add product");
    }

    setLoading(false);
  };

  const handleDelete = async (id) => {
    await API.delete(`/products/${id}`);
    toast.success("Deleted Successfully");
    fetchProducts();
  };

  const hitCount = products.filter(
    (p) => p.currentPrice <= p.targetPrice
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      
      <Navbar
        onLogout={() => {
          localStorage.removeItem("token");
          window.location.reload();
        }}
      />

      <div className="p-6 max-w-6xl mx-auto">

        {/* Header */}
        <h1 className="text-2xl font-bold mb-1">
          My Price Alerts
        </h1>
        <p className="text-gray-600 mb-6">
          Tracking {products.length} products ·{" "}
          <span className="text-green-600 font-medium">
            {hitCount} prices hit!
          </span>
        </p>

        {/* Add Product Bar */}
        <div className="bg-white border-[1.3px] border-gray-300 rounded-xl p-4 mb-6 ">
          <div className="text-xl text-gray-700 font-semibold flex items-center gap-2 mb-5">
            <span className="text-2xl"><IoIosAddCircleOutline/></span>
            <span className="">Track a New Product</span>
          </div>
          <div className="flex flex-col md:flex-row gap-3 items-center">
            <input
            name="productUrl"
            value={form.productUrl}
            placeholder="Paste Amazon product URL..."
            onChange={handleChange}
            className="flex-1 px-5 py-2 border-[1.3px] border-gray-300 rounded-lg"
          />

          <input
            name="targetPrice"
            value={form.targetPrice}
            placeholder="$ Target price"
            onChange={handleChange}
            className="w-full md:w-40 px-5 py-2 border-[1.3px] border-gray-300 rounded-lg"
          />

          <button
            onClick={handleSubmit}
            className="bg-black text-white font-medium px-5 py-2 rounded-lg"
          >
            {loading ? "Adding..." : "Add Alert"}
          </button>
          </div>
        </div>

        {/* Cards */}
        {
          products.length === 0 ? (
            <div className="flex items-center justify-center"><img className="w-40 h-40" src="noproducts.png" alt="" /></div>
            
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <ProductCard
                  key={p._id}
                  product={p}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )
        }
      </div>
    </div>
  );
};

export default Home;