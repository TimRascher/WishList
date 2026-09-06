import wishlistReader from "../helpers/wishlistReader.js"
import { appStore } from "./appState.js"
/** @typedef {import("../../types/wishlist").WishlistItem} WishlistItem */

/** Registers the Alpine component that displays the currently selected item. */
function load() {
   Alpine.data("listItem", () => ({
      /** @type {WishlistItem|undefined} */
      item: undefined,
      /**
       * @param {any} name
       * @returns {string}
       */
      getImage(name) {
         return `images/${this.item?.id}/${name}`
      },
      openURL() {
         window.open(this.item?.url, '_blank', 'noopener,noreferrer');
      },
      /** Resolves the selected item from the shared wishlist data. */
      init() {
         this.item = wishlistReader.wishlist.find(
            (/** @type {WishlistItem} */ i) => i.id === appStore.itemId)
      }
   }))
}

export default load
