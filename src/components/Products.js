import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from './ProductCard'
import { Stack } from "@mui/material";

const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [noItem, setNoItem] = useState(false)

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const loading = <Grid item xs={12} sx={{ height: '40vh' }}>
    <Stack
      justifyContent="center"
      alignItems="center"
      spacing={2}>
      <CircularProgress />
      <h5>Loading Products</h5>
    </Stack>
  </Grid>

  const notFound = <Grid item xs={12} sx={{ height: '40vh' }}>
    <Stack
      justifyContent="center"
      alignItems="center"
      spacing={2}>
      <SentimentDissatisfied />
      <h5>No Products Found</h5>
    </Stack>
  </Grid>


  // fetching data function
  const performAPICall = async (query='') => {
    try {
      setIsLoading(true);
      const product = await axios.get(`${config.endpoint}/products${query}`);
      if (product.status === 200) {
        setProducts(product.data);
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        return enqueueSnackbar(err.response.data.message, { autoHideDuration: 3000, variant: 'error' });
      }
      if (err.response && err.response.status === 404) {
        setNoItem(true);
        return;
      }
      enqueueSnackbar('Something went wrong. Check that the backend is running, reachable and returns valid JSON.', { autoHideDuration: 3000, variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }




  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */

  // Searching query function
  const performSearch = async (text) => {
    setNoItem(false);
    let query = ''
    if (text) {
      query = `/search?value=${text}`
    }
    performAPICall(query);
    // const filteredResult = await axios.get(`${config.endpoint}/products/search?value=${text}`);
    // if (filteredResult.status === 200) {
    //   setProducts(filteredResult.data);
    // }
    
  }

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */

  const debounceSearch = (event, debounceTimeout) => {
    const searchId = setTimeout(() => {
      performSearch(event.target.value);

    }, 500)
  }

  useEffect(() => {
    performAPICall();
  }, [])

  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
          className="search-desktop"
          size="small"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}

          onChange={debounceSearch}
          placeholder="Search for items/categories"
          name="search"
        />
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        onChange={debounceSearch}
        placeholder="Search for items/categories"
        name="search"
      />
      <Grid container spacing={2}>
        <Grid item className="product-grid">
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>
        </Grid>
        {
          isLoading ? loading : noItem ? notFound : products.map((item) => {
            return (
              <Grid item xs={6} md={3} key={item._id}>
                <ProductCard product={item} />
              </Grid>
            )
          })}
      </Grid>
      <Footer />
    </div>
  );
};

export default Products;
