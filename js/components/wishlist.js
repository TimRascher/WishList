import wishlistReader from "../helpers/wishlistReader.js"

/** Registers the Alpine component that owns the rendered wishlist. */
function load() {
   Alpine.data("wishlist", () => ({
      /** @type {import("../../types/wishlist").Wishlist} */
      items: [],
      searchText: "",
      costFilter: "",
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
       * @returns {string}
       */
      getBackground(item) {
         if (item.tags.includes("BOARDGAME")) {
            return "boardgameBG"
         }
         if (item.tags.includes("ROLEPLAYING")) {
            return "rolePlayingBG"
         }
         if (item.tags.includes("LEGO")) {
            return "legoBG"
         }
         if (item.tags.includes("HOME")) {
            return "homeBG"
         }
         if (item.tags.includes("WARGAME")) {
            return "wargameBG"
         }
         if (item.tags.includes("GAME")) {
            return "gameBG"
         }
         if (item.tags.includes("MANGA")) {
            return "mangaBG"
         }
         if (item.tags.includes("READING")) {
            return "readingBG"
         }
         return "defaultBG"
      },
      /**
       * @param {import("../../types/wishlist").WishlistItem} item
       * @returns {string}
       */
      getThumbnailClass(item) {
         if (item.images.length > 0) { return "thumbnail" }
         return "thumbnail-noImage"
      },
      search() {
         let items = wishlistReader.wishlist
         if (this.searchText.length >= 3) {
            items = wishlistReader.wishlist.filter(
               item => item.title.toLowerCase().includes(this.searchText.toLowerCase())
                  || item.tags.filter(tag => tag.toLowerCase().includes(this.searchText.toLowerCase())).length > 0
            )
         }
         if (this.costFilter !== "") {
            items = items.filter(item => item.cost === this.costFilter)
         }
         this.items = items
      },
      clear() {
         this.searchText = ""
         this.costFilter = ""
         this.search()
      },
      /** Performs the component's initial wishlist load. */
      init() {
         this.items = wishlistReader.wishlist
         window.addEventListener("wishlist:list-loaded", event => {
            this.items = wishlistReader.wishlist
         })
      }
   }))
}

export default load
