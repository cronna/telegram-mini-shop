import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/shop", "routes/shop/index.tsx"),
  route("/shop/product/:id", "routes/shop/product.tsx"),
  route("/cart", "routes/cart.tsx"),
  route("/checkout", "routes/checkout.tsx"),
  route("/orders", "routes/orders.tsx"),
] satisfies RouteConfig;
