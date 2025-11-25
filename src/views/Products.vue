<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Products</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="4">
        <v-select
          v-model="selectedCategory"
          :items="categories"
          label="Filter by Category"
          clearable
          @update:model-value="filterProducts"
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="filteredProducts"
          :loading="loading"
          :items-per-page="itemsPerPage"
          :items-per-page-options="itemsPerPageOptions"
          v-model:page="currentPage"
          @update:items-per-page="handleItemsPerPageChange"
          @click:row="showProductDetails"
          class="elevation-1"
        >
          <template v-slot:[`item.image`]="{ item }">
            <v-img
              :src="item.image"
              :alt="item.title"
              width="80"
              height="80"
              contain
            ></v-img>
          </template>
          <template v-slot:[`item.price`]="{ item }">
            ${{ item.price.toFixed(2) }}
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn
              color="primary"
              size="small"
              @click.stop="addToCart(item)"
            >
              Add to Cart
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row v-if="totalPages > 1">
      <v-col cols="12" class="d-flex justify-center">
        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          @update:model-value="handlePageChange"
        ></v-pagination>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" max-width="600">
      <v-card v-if="selectedProduct">
        <v-card-title class="text-h5">
          {{ selectedProduct.title }}
        </v-card-title>
        <v-card-text>
          <v-img
            :src="selectedProduct.image"
            :alt="selectedProduct.title"
            height="300"
            contain
            class="mb-4"
          ></v-img>
          <p class="text-h6 mb-2">${{ selectedProduct.price.toFixed(2) }}</p>
          <p class="text-body-1 mb-2"><strong>Category:</strong> {{ selectedProduct.category }}</p>
          <p class="text-body-1 mb-2"><strong>Description:</strong></p>
          <p class="text-body-2">{{ selectedProduct.description }}</p>
          <p class="text-body-1 mt-2">
            <strong>Rating:</strong> {{ selectedProduct.rating?.rate }} 
            ({{ selectedProduct.rating?.count }} reviews)
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="addToCartFromDialog">
            Add to Cart
          </v-btn>
          <v-btn @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { useCart } from '../store/cart'

export default {
  name: 'ProductsPage',
  data() {
    return {
      products: [],
      filteredProducts: [],
      loading: false,
      selectedCategory: null,
      categories: [],
      currentPage: 1,
      itemsPerPage: 10,
      itemsPerPageOptions: [5, 10, 25, 50, 100],
      dialog: false,
      selectedProduct: null,
      headers: [
        { title: 'Image', key: 'image', sortable: false },
        { title: 'Title', key: 'title', sortable: true },
        { title: 'Price', key: 'price', sortable: true },
        { title: 'Actions', key: 'actions', sortable: false }
      ]
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.itemsPerPage)
    }
  },
  methods: {
    async fetchProducts() {
      this.loading = true
      try {
        const response = await fetch('https://fakestoreapi.com/products')
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        this.products = data
        this.filteredProducts = data
        this.extractCategories()
      } catch (error) {
        console.error('Error while fetching products :', error)
      } finally {
        this.loading = false
      }
    },
    extractCategories() {
      const uniqueCategories = [...new Set(this.products.map(p => p.category))]
      this.categories = uniqueCategories.map(cat => ({
        title: cat.charAt(0).toUpperCase() + cat.slice(1),
        value: cat
      }))
    },
    filterProducts() {
      if (this.selectedCategory) {
        this.filteredProducts = this.products.filter(
          p => p.category === this.selectedCategory
        )
      } else {
        this.filteredProducts = this.products
      }
      this.currentPage = 1
    },
    handlePageChange(page) {
      this.currentPage = page
    },
    handleItemsPerPageChange(value) {
      this.itemsPerPage = value
      this.currentPage = 1
    },
    showProductDetails(event, { item }) {
      console.log(item,event)
      this.selectedProduct = item
      this.dialog = true
    },
    addToCartFromDialog() {
      if (this.selectedProduct) {
        const { addToCart } = useCart()
        addToCart(this.selectedProduct)
        this.dialog = false
      }
    },
    addToCart(product) {
      const { addToCart } = useCart()
      addToCart(product)
    }
  },
  mounted() {
    this.fetchProducts()
  }
}
</script>
