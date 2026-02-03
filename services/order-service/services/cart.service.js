// services/cart.service.js
const axios = require("axios");

const CART_SERVICE_URL = process.env.CART_SERVICE_URL;

const getCart = async (req) => {
  return axios.get(`${CART_SERVICE_URL}/cart`, {
    headers: {
      Authorization: req.headers.authorization
    }
  });
};

const validateCart = async (req) => {
  return axios.get(`${CART_SERVICE_URL}/cart/validate`, {
    headers: {
      Authorization: req.headers.authorization
    }
  });
};

const clearCartByUserId = async (req) => {
  return axios.delete(`${CART_SERVICE_URL}/cart/clear`, {
    headers: {
      Authorization: req.headers.authorization
    }
  });
}



module.exports = { getCart , validateCart, clearCartByUserId};
