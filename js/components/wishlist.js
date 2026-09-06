import wishlistReader from "../helpers/wishlistReader.js"

/** Registers the Alpine component that owns the rendered wishlist. */
function load() {
   Alpine.data("wishlist", () => ({
      /** @type {import("../../types/wishlist").Wishlist} */
      items: [],
      /**
       * Reloads the wishlist while preserving the currently rendered items if
       * the data source is unavailable.
       *
       * @returns {Promise<void>}
       */
      async refresh() {
         const items = await wishlistReader.read()
         if (items) {
            this.items = items
         }
      },
      /**
       * @param {import("../../types/wishlist").WishlistItem} item
       * @returns {string|undefined}
       */
      getImage(item) {
         if (item.images.length === 0) { return undefined }
         return `images/${item.id}/${item.images[0]}`
      },
      /**
       * @param {import("../../types/wishlist").WishlistItem} item
       * @returns {string|undefined}
       */
      getBackground(item) {
         if (item.tags.includes("BOARDGAME")) {
            return "boardgameBG"
         }
         if (item.tags.includes("GAME")) {
            return "gameBG"
         }
         return "defaultBG"
      },
      /** Performs the component's initial wishlist load. */
      async init() {
         await this.refresh()
      }
   }))
}

export default load
