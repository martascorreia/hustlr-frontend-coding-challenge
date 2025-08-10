import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";
import "./ProductCard.css";

const ProductCard = ({ product, addProduct }) => {
  const [variant, setVariant] = useState(product.variants?.[0] || "");

  return (
    <div
      id={product.id}
      key={product.id}
      className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4"
    >
      <div className="product-card outline-dark text-center h-100" key={product.id}>
       <Link to={`/product/${product.id}`} className="text-decoration-none">
          <img
            className="card-img-top p-3"
            src={product.image}
            alt={product.title}
            height={300}
            style={{ objectFit: "contain" }}
          />
          <div className="card-content">
            <div className="card-body">
              <h5 className="card-title text-dark">{product.title}</h5>
            </div>

            <ul className="list-group list-group-flush">
              <li className="list-group-item lead">${product.price}</li>
            </ul>
          </div>
        </Link>
        <div className="card-body buttons-container">
          <Link to={`/product/${product.id}`} className="btn btn-outline-dark m-1">
            More Info
          </Link>

          <button className={`btn m-1 
            ${product.stock > 0 ? "btn-dark" : "btn-danger"}`}
            disabled={product.stock === 0}
            onClick={() => {
              if (product.stock > 0) {
                toast.success("Added to cart");
                addProduct({ ...product, selectedVariant: variant });
              }
            }}
          >
            {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
