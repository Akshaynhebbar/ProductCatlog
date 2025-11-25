<template>
  <v-app-bar color="primary" dark>
    <v-app-bar-title>Products Catalog</v-app-bar-title>
    <v-spacer></v-spacer>
    <v-btn to="/products" variant="text">
      Products
    </v-btn>
    <v-badge
      :content="cartCount"
      :model-value="cartCount > 0"
      color="error"
    >
      <v-btn to="/cart" variant="text">
        Cart
      </v-btn>
    </v-badge>
  </v-app-bar>
</template>

<script>
import { useCart } from '../store/cart'

export default {
  name: 'NavigationBar',
  data() {
    const { cart } = useCart()
    return {
      cart
    }
  },
  computed: {
    cartCount() {
      return this.cart.items.reduce((total, item) => total + item.quantity, 0)
    }
  }
}
</script>
