/**
 * @enum {string}
 */
const Display = {
   WISHLIST: "wishlist",
   ITEM: "item",
}

/** Shared navigation state exposed through Alpine's `app` store. */
const appStore = {
   display: Display.WISHLIST,
   /** @type {string|null} */
   itemId: null,
   /** @returns {boolean} Whether the wishlist view should be visible. */
   get shouldShowWishlist() {
      return this.display === Display.WISHLIST
   },
   /** @returns {boolean} Whether the selected-item view should be visible. */
   get shouldShowItem() {
      return this.display === Display.ITEM
   },
   /**
    * Selects an item and switches to its detail view.
    *
    * @param {string} id
    */
   showItem(id) {
      this.itemId = id
      this.display = Display.ITEM
   },
   /** Clears the selection and switches back to the wishlist view. */
   showWishlist() {
      this.itemId = null
      this.display = Display.WISHLIST
   }
}

/** Registers the shared application state with Alpine. */
function load() {
   Alpine.store("app", appStore)
}

export { appStore, Display, load as appStoreLoad }
