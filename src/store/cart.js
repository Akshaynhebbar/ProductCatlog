import { reactive, watch } from 'vue'

const CART_STORAGE_KEY = 'product_catalog_cart'

const loadCartFromStorage = () => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error loading:', error)
    return []
  }
}

const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  } catch (error) {
    console.error('Error saving cart to localStorage:', error)
  }
}

const cart = reactive({
  items: loadCartFromStorage()
})

watch(() => cart.items, (newItems) => {
  saveCartToStorage(newItems)
}, { deep: true })

export const useCart = () => {
  const addToCart = (product) => {
    const existingItem = cart.items.find(item => item.id === product.id)
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.items.push({
        ...product,
        quantity: 1
      })
    }
  }

  const removeFromCart = (productId) => {
    const index = cart.items.findIndex(item => item.id === productId)
    if (index > -1) {
      cart.items.splice(index, 1)
    }
  }

  const updateQuantity = (productId, quantity) => {
    const item = cart.items.find(item => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId)
      } else {
        item.quantity = quantity
      }
    }
  }

  const incrementQuantity = (productId) => {
    const item = cart.items.find(item => item.id === productId)
    if (item) {
      item.quantity += 1
    }
  }

  const decrementQuantity = (productId) => {
    const item = cart.items.find(item => item.id === productId)
    if (item) {
      if (item.quantity > 1) {
        item.quantity -= 1
      } else {
        removeFromCart(productId)
      }
    }
  }

  const getCartCount = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    getCartCount,
    getTotalPrice
  }
}
