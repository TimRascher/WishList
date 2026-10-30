import wishlistReader from "../helpers/wishlistReader.js"

const SearchParam = {
   TEXT: "search",
   COST: "cost",
   PRIORITY: "priority",
}

/** Registers the Alpine component that owns the rendered wishlist. */
function load() {
   Alpine.data("wishlist", () => ({
      /** @type {import("../../types/wishlist").Wishlist} */
      items: [],
      searchText: "",
      costFilter: "",
      priorityFilter: "",
      /** @type {(() => void)|null} */
      handlePopState: null,
      screenSize: window.matchMedia("(min-width: 768px)"),
      /**
       * Reloads the wishlist while preserving the currently rendered items if
       * the data source is unavailable.
       *
       * @returns {Promise<void>}
       */
      async refresh() {
         const items = await wishlistReader.read()
         if (items) {
            this.filterItems()
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
      /** Applies the current filters to the full wishlist. */
      filterItems() {
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
         if (this.priorityFilter !== "") {
            items = items.filter(item => item.priority === this.priorityFilter)
         }
         this.items = items
      },
      /**
       * Adds the current search state to the URL and filters the wishlist.
       *
       * @param {HTMLInputElement|null} searchInput Search field to refocus after
       * the rendered results and history entry are updated.
       * @param {string|null} searchText Latest value from the search field.
       */
      search(searchInput = null, searchText = null) {
         const shouldRestoreFocus = searchInput !== null
            && document.activeElement === searchInput
         if (searchText !== null) {
            this.searchText = searchText
         }
         const url = new URL(window.location.href)
         const setOrDelete = (/** @type {string} */ name, /** @type {string} */ value) => {
            if (value === "") {
               url.searchParams.delete(name)
            } else {
               url.searchParams.set(name, value)
            }
         }

         setOrDelete(SearchParam.TEXT, this.searchText)
         setOrDelete(SearchParam.COST, this.costFilter)
         setOrDelete(SearchParam.PRIORITY, this.priorityFilter)

         if (url.href !== window.location.href) {
            window.history.pushState(window.history.state, "", url)
         }
         this.filterItems()

         if (shouldRestoreFocus) {
            Alpine.nextTick(() => {
               const currentSearchInput = document.querySelector('input[type="search"]')
               if (currentSearchInput instanceof HTMLInputElement) {
                  currentSearchInput.focus({ preventScroll: true })
               }
            })
         }
      },
      /** Restores search state from the current URL without changing history. */
      syncFromUrl() {
         const params = new URL(window.location.href).searchParams
         this.searchText = params.get(SearchParam.TEXT) || ""
         this.costFilter = params.get(SearchParam.COST) || ""
         this.priorityFilter = params.get(SearchParam.PRIORITY) || ""
         this.filterItems()
      },
      clear() {
         this.searchText = ""
         this.costFilter = ""
         this.priorityFilter = ""
         this.search()
      },
      /** Performs the component's initial wishlist load. */
      init() {
         this.syncFromUrl()
         this.handlePopState = () => this.syncFromUrl()
         window.addEventListener("popstate", this.handlePopState)
         window.addEventListener("wishlist:list-loaded", () => {
            this.filterItems()
         })
         window.addEventListener("resize", () => {
            this.screenSize = window.matchMedia("(min-width: 768px)")
         })
      },
      /** Removes the component's navigation listener when Alpine tears it down. */
      destroy() {
         if (this.handlePopState) {
            window.removeEventListener("popstate", this.handlePopState)
         }
      }
   }))
}

export default load
