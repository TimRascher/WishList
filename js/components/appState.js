import wishlistReader from "../helpers/wishlistReader.js"

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
   listScrollY: 0,
   restoreListScroll() {
      Alpine.nextTick(() => {
         requestAnimationFrame(() => {
            window.scrollTo(0, this.listScrollY)
         })
      })
   },
   /** Reads the initial URL and keeps the view in sync with Back and Forward. */
   async init() {
      await wishlistReader.read()
      this.syncFromUrl()
      window.addEventListener("popstate", () => this.syncFromUrl())
   },
   /** Updates the selection from the URL without adding a history entry. */
   syncFromUrl() {
      const wasShowingItem = this.display === Display.ITEM
      const id = new URL(window.location.href).searchParams.get("id") || null
      this.itemId = id
      this.display = id === null ? Display.WISHLIST : Display.ITEM
      if (wasShowingItem && this.display === Display.WISHLIST) {
         this.restoreListScroll()
      }
   },
   /** @returns {boolean} Whether the wishlist view should be visible. */
   get shouldShowWishlist() {
      return this.display === Display.WISHLIST
   },
   /** @returns {boolean} Whether the selected-item view should be visible. */
   get shouldShowItem() {
      return this.display === Display.ITEM
   },
   /**
    * Selects an item, switches to its detail view, and adds its URL to history.
    *
    * @param {string} id
    */
   showItem(id) {
      this.listScrollY = window.scrollY
      const url = new URL(window.location.href)
      url.searchParams.set("id", id)
      window.history.pushState({ itemId: id }, "", url)
      this.itemId = id
      this.display = Display.ITEM
      Alpine.nextTick(() => window.scrollTo(0, 0))
   },
   /** Clears the selection, removes the ID query parameter, and adds the URL to history. */
   showWishlist() {
      const url = new URL(window.location.href)
      url.searchParams.delete("id")
      window.history.pushState({ itemId: null }, "", url)
      this.itemId = null
      this.display = Display.WISHLIST
      this.restoreListScroll()
   }
}

/** Registers the shared application state with Alpine. */
function load() {
   Alpine.store("app", appStore)
}

export { appStore, Display, load as appStoreLoad }
