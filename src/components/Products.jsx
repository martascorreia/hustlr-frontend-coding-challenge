import React, { useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import ProductCard from "../components/ProductCard";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Products = () => {
  const [products, setProducts] = useState([]); // all products with stock
  const [filteredCategory, setFilteredCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  // Add product to cart and decrease stock
  const addProduct = (product) => {
    if (product.stock <= 0) return;

    dispatch(addCart(product));

    setProducts((prev) =>
      prev.map((item) =>
        item.id === product.id
          ? { ...item, stock: Math.max(0, item.stock - 1) }
          : item
      )
    );
  };

  // Fetch products on mount
  useEffect(() => {
    let isMounted = true;

    const getProducts = async () => {
      setLoading(true);

      try {
        const response = await fetch("https://fakestoreapi.com/products/");
        const products = await response.json();

        if (!isMounted) return;

        // Add random stock
        const productsWithStock = products.map((product) => ({
          ...product,
          stock: Math.floor(Math.random() * 11),
        }));

        setProducts(productsWithStock);
        setCategories([...new Set(productsWithStock.map((p) => p.category))]);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    getProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  // Memoized filtered products
  const filteredProducts = useMemo(() => {
    if (filteredCategory === "all") return products;
    return products.filter((p) => p.category === filteredCategory);
  }, [products, filteredCategory]);

  // Loading skeleton component
  const LoadingSkeleton = () => {
    return (
      <>
        <div className="col-12 py-5 text-center">
          <Skeleton height={40} width={560} />
        </div>
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4"
          >
            <Skeleton height={592} />
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="container my-3 py-3">
      <div className="row">
        <div className="col-12">
          <h2 className="display-5 text-center">Latest Products</h2>
          <hr />
        </div>
      </div>

      <div className="buttons text-center py-5">
        <button
          className={`btn btn-outline-dark btn-sm m-2 ${
            filteredCategory === "all" ? "active" : ""
          }`}
          onClick={() => setFilteredCategory("all")}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`btn btn-outline-dark btn-sm m-2 ${
              filteredCategory === cat ? "active" : ""
            }`}
            onClick={() => setFilteredCategory(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="row justify-content-center">
        {loading ? (
          <LoadingSkeleton />
        ) : (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addProduct={addProduct}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Products;
