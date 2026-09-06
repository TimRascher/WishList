/** A single entry in the wishlist data source. */
export interface WishlistItem {
   id: string
   title: string
   description: string
   tags: Tag[]
   images: Image[]
}

/** The complete ordered collection of wishlist entries. */
export type Wishlist = WishlistItem[]

export type Tag = string

export type Image = string
