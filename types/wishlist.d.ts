/** A single entry in the wishlist data source. */
export interface WishlistItem {
   id: string
   title: string
   description: string
   tags: Tag[]
   images: Image[]
   priority: WishlistPriority
   url: string,
   cost: Cost
}

/** The complete ordered collection of wishlist entries. */
export type Wishlist = WishlistItem[]

export type Tag = string

export type Image = string

export enum WishlistPriority {
   HIGH = "HIGH",
   MEDIUM = "MEDIUM",
   LOW = "LOW"
}

export enum Cost {
   COST80PLUS = "$$$$$",
   COST80 = "$$$$",
   COST60 = "$$$",
   COST40 = "$$",
   COST20 = "$"
}