import { appStoreLoad } from "./components/appState.js"
import remoteComponentLoad from "./components/remote.js"
import wishlistLoad from "./components/wishlist.js"
import listItemLoad from "./components/listItem.js"

/** Registers all application data providers when Alpine becomes available. */
document.addEventListener("alpine:init", () => {
   remoteComponentLoad()
   appStoreLoad()
   wishlistLoad()
   listItemLoad()
})
