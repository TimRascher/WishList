
/** @typedef {import("../../types/wishlist").Wishlist} Wishlist*/
/**
 * Sorts the wishlist by priority (high to low), then by title (A to Z).
 *
 * @param {Wishlist} wishlist 
 * @returns {Wishlist}
 */
function sort(wishlist) {
   const priorities = { HIGH: 0, MEDIUM: 1, LOW: 2 }

   const normalizedTitle = (/** @type {string} */ title) =>
      title.replace(/^(?:a|the)\s+/i, '')

   wishlist.forEach(({ tags }) => {
      tags.sort((a, b) =>
         a.localeCompare(b, undefined, { sensitivity: 'base' })
      )
   })

   return wishlist.sort((a, b) =>
      priorities[a.priority] - priorities[b.priority] ||
      normalizedTitle(a.title).localeCompare(normalizedTitle(b.title), undefined, {
         sensitivity: 'base',
      })
   )
}

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

         this.wishlist = sort(await response.json())
         return this.wishlist
      } catch {
         return null
      }
   }
}

export default new WishlistReader()
