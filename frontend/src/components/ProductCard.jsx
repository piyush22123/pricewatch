import { FiBell } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { LuExternalLink } from "react-icons/lu";


// components/ProductCard.jsx
const ProductCard = ({ product, onDelete }) => {
  const isCheap = product.currentPrice <= product.targetPrice;

  return (
    <div
      className={`p-5 rounded-xl border transition ${
        isCheap
          ? "border-green-400 bg-green-50"
          : "border-gray-200 bg-white"
      }`}
    >
      {/* Title + Badge */}
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-sm line-clamp-2 w-[60%]">
          {product.title || "No title"}
        </h3>

        <span
          className={`flex gap-2 items-center text-xs px-2 py-1 rounded ${
            isCheap
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          <FiBell className="text-xs" />
          {isCheap ? "Price Hit!" : "Watching"}
        </span>
      </div>

      {/* Prices */}
      <div className="flex justify-between mt-4 text-sm">
        <div>
          <p className="text-gray-500">Current</p>
          <p className="font-semibold text-green-600">
            ₹{product.currentPrice}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Target</p>
          <p className="font-semibold">
            ₹{product.targetPrice}
          </p>
        </div>
      </div>

      {/* Status */}
      <div className="mt-4 text-xs">
        {isCheap ? (
          <div className="bg-green-100 text-green-700 p-2 rounded">
            🎉 Target reached! You save ₹
            {(product.targetPrice - product.currentPrice).toFixed(2)}
          </div>
        ) : (
          <div className="bg-gray-100 text-gray-600 p-2 rounded">
            Drop ₹
            {(product.currentPrice - product.targetPrice).toFixed(2)} more
            to hit target
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mt-4">
        <a
          href={product.productUrl}
          target="_blank"
          className="flex items-center gap-2 text-sm border-[1.3px] border-gray-200 px-3 py-1 rounded hover:bg-gray-100"
        >
          <LuExternalLink/> View on Amazon
        </a>

        <button
          onClick={() => onDelete(product._id)}
          className="p-2 rounded-4xl text-red-500 hover:bg-gray-200"
        >
          <RiDeleteBin6Line/>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;