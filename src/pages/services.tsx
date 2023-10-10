import React from "react";
import { useEffect, useState } from "react";
import Minter from '../components/Minter.jsx'
import ShopProduct from "../components/productcard/ShopProduct";
import Navbar from "../components/navbar/Navbar";
import SendTransaction from "@/components/magic/cards/SendTransactionsCard";
import AppHeader from "@/components/ui/AppHeader";
import { Box, Container } from "@mui/material";
function Services() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      fetch("https://fakestoreapi.com/products?limit=6")
        .then((res) => res.json())
        .then((data) => setProducts(data));
      console.log(products);
    };
    fetchAllData();
  }, []);
  return (
    <>
      <Navbar />
      <div className="home-page">
        <Box m="2.5rem">
          <SendTransaction />
        </Box>
        <Box
          sx={{
            display:"flex",
            flexWrap:"wrap",
            justifyContent:"center"
          }}
        >
          {products.map((product) => {
            return <ShopProduct {...product} />;
          })}

         
        </Box>
        { <Minter/>}
      </div>
      <Box></Box>
    </>
  );
}

export default Services;
