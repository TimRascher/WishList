/** Registers the Alpine component used to load an HTML partial. */
export default function load() {
   Alpine.data('remoteComponent',
      /**
       * Creates state for a remotely loaded component partial.
       *
       * @param {string} url Partial name relative to the `components` directory.
       */
      url => ({
         html: '',
         loading: true,
         /** @type {string|null} */
         error: null,
         /** @type {AbortController|null} */
         controller: null,

         /** Fetches the partial and stores its markup for Alpine's `x-html`. */
         async init() {
            this.controller = new AbortController()

            try {
               const response = await fetch(`components/${url}.html`, {
                  signal: this.controller.signal
               })

               if (!response.ok) {
                  throw new Error(`HTTP ${response.status}`)
               }

               this.html = await response.text()

               // Inject the partial once. A reactive `x-html` binding also
               // tracks state read while its nested Alpine components are
               // initialized, which can replace focused controls on input.
               this.$root.innerHTML = this.html
            } catch (/** @type {any} */ error) {
               if (error.name !== 'AbortError') {
                  console.error(error)
                  this.error = 'Could not load this component.'
               }
            } finally {
               if (!this.controller.signal.aborted) {
                  this.loading = false
               }
            }
         },

         /** Cancels an outstanding request when Alpine removes the component. */
         destroy() {
            this.controller?.abort()
         }
      }))
}
