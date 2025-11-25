<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Shopping Cart</h1>
      </v-col>
    </v-row>
    <v-row v-if="cart.items.length === 0">
      <v-col cols="12">
        <v-alert type="info" variant="tonal">
          Your cart is empty. Start shopping!
        </v-alert>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12">
        <v-card>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="item in cart.items"
                :key="item.id"
                class="mb-4"
              >
                <template #prepend>
                  <v-img
                    :src="item.image"
                    :alt="item.title"
                    width="100"
                    height="100"
                    contain
                    class="mr-4"
                  ></v-img>
                </template>
                <v-list-item-title class="text-h6 mb-2">
                  {{ item.title }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  ${{ item.price.toFixed(2) }} each
                </v-list-item-subtitle>
                <template #append>
                  <div class="d-flex align-center">
                    <v-btn
                      icon="mdi-minus"
                      size="small"
                      variant="text"
                      @click="decrementQuantity(item.id)"
                    ></v-btn>
                    <span class="mx-4 text-h6">{{ item.quantity }}</span>
                    <v-btn
                      icon="mdi-plus"
                      size="small"
                      variant="text"
                      @click="incrementQuantity(item.id)"
                    ></v-btn>
                    <span class="mx-4 text-h6">
                      ${{ (item.price * item.quantity).toFixed(2) }}
                    </span>
                    <v-btn
                      icon="mdi-delete"
                      size="small"
                      color="error"
                      variant="text"
                      @click="removeFromCart(item.id)"
                    ></v-btn>
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-text>
            <div class="d-flex justify-end">
              <div class="text-right">
                <p class="text-h5 mb-2">
                  <strong>TotalPrice: ${{ totalPrice.toFixed(2) }}</strong>
                </p>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useCart } from '../store/cart'

export default {
  name: 'CartPage',
  data() {
    const { cart } = useCart()
    return {
      cart
    }
  },
  computed: {
    totalPrice() {
      return this.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    }
  },
  methods: {
    removeFromCart(productId) {
      const { removeFromCart } = useCart()
      removeFromCart(productId)
    },
    incrementQuantity(productId) {
      const { incrementQuantity } = useCart()
      incrementQuantity(productId)
    },
    decrementQuantity(productId) {
      const { decrementQuantity } = useCart()
      decrementQuantity(productId)
    }
  }
}
</script>
