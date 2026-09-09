
/** @typedef {import("../../types/wishlist").Wishlist} Wishlist*/
/**
 * Sorts top-level items by priority and title, with children sorted by title
 * directly beneath their parent.
 *
 * @param {Wishlist} wishlist 
 * @returns {Wishlist}
 */
function sort(wishlist) {
   const priorities = { HIGH: 0, MEDIUM: 1, LOW: 2 }

   const normalizedTitle = (/** @type {string} */ title) =>
      title.replace(/^(?:a|the)\s+/i, '')

   /** @param {Wishlist[number]} a @param {Wishlist[number]} b */
   const compareTitles = (a, b) =>
      normalizedTitle(a.title).localeCompare(normalizedTitle(b.title), undefined, {
         sensitivity: 'base',
      })

   wishlist.forEach(({ tags }) => {
      tags.sort((a, b) =>
         a.localeCompare(b, undefined, { sensitivity: 'base' })
      )
   })

   /** @type {Map<string, Wishlist>} */
   const children = new Map()
   const parents = wishlist.filter(item => !item.parentItemId)
   for (const item of wishlist) {
      if (!item.parentItemId) { continue }
      const group = children.get(item.parentItemId) || []
      group.push(item)
      children.set(item.parentItemId, group)
   }
   parents.sort((a, b) =>
      priorities[a.priority] - priorities[b.priority] || compareTitles(a, b)
   )
   for (const group of children.values()) {
      group.sort(compareTitles)
   }

   /** @type {Wishlist} */
   const sorted = []
   const visited = new Set()
   /** @param {Wishlist[number]} item */
   function append(item) {
      if (visited.has(item)) { return }
      visited.add(item)
      sorted.push(item)
      for (const child of children.get(item.id) || []) {
         append(child)
      }
   }
   parents.forEach(append)
   // Keep items with missing or circular parent references visible as well.
   for (const group of children.values()) {
      group.forEach(append)
   }
   return sorted
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
         window.dispatchEvent(
            new CustomEvent("wishlist:list-loaded", {
               detail: {
                  loaded: true
               }
            })
         )
         return this.wishlist
      } catch {
         return null
      }
   }
}

export default new WishlistReader()
