import React, { useEffect, useState } from "react";
import { useProduct } from "../../Context/ProductContext";
import styles from "./styles.module.css";
import Spinner from "../../Components/Spinner";
import { useParams } from "react-router-dom";
import { useCart } from '../../Context/CartContext'
import { useFavorite } from '../../Context/FavoriteContext'
import Card from "../../Components/Card";

const Products = () => {
  const { addToCart, items } = useCart();
  const { addToFavorite, favoriteItems } = useFavorite();
  const { productList, loading, setProductID, setCategory } = useProduct();
  const { category_id } = useParams();
  const [sortBy, setSortBy] = useState(null); // Initially no sorting
  const [sortedProducts, setSortedProducts] = useState([]);

  useEffect(() => {
    setCategory(category_id);
  }, [category_id]);

  useEffect(() => {
    // Sort products when productList or sortBy changes
    if (productList && productList.length > 0 && sortBy) {
      const sorted = [...productList].sort((a, b) => {
        if (sortBy === 'lowToHigh') {
          return a.price - b.price;
        } else if (sortBy === 'highToLow') {
          return b.price - a.price;
        }
        return 0;
      });
      setSortedProducts(sorted);
    } else {
      // If sortBy is null, use original product list
      setSortedProducts([...productList]);
    }
  }, [productList, sortBy]);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.sortByContainer}>
        Sort by price:
        <select value={sortBy} onChange={handleSortChange}>
          <option value="">Select</option>
          <option value="lowToHigh">Low to High</option>
          <option value="highToLow">High to Low</option>
        </select>
      </div>
      <div className={styles.cardGroup}>
        {!loading ? (
          sortedProducts.map((item, index) => {
            const findCartItem = items.find((cart_item) => cart_item.id === item.id);
            const findFavoriteItem = favoriteItems.find((favorite_item) => favorite_item.id === item.id);
            return (
              <Card key={`product-${index}`} item={item} setProductID={setProductID} findCartItem={findCartItem} findFavoriteItem={findFavoriteItem} addToCart={addToCart} addToFavorite={addToFavorite} />
            );
          })
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
};

export default Products;
