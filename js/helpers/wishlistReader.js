/** Loads and retains the wishlist data shared by the Alpine components. */
class WishlistReader {
   /** @type {import("../../types/wishlist").Wishlist} */
   wishlist = []

   /**
    * Fetches the wishlist from the application's JSON data source.
    *
    * The last successfully loaded wishlist remains available on this instance
    * if the request fails.
    *
    * @returns {Promise<import("../../types/wishlist").Wishlist|null>}
    * The loaded wishlist, or `null` when it could not be loaded.
    */
   async read() {
      try {
         const response = await fetch("data/wishlist.json")

         if (!response.ok) {
            return null
         }

         this.wishlist = await response.json()
         return this.wishlist
      } catch {
         return null
      }
   }
}

export default new WishlistReader()
