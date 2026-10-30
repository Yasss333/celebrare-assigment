# Celebrare Photo Gallery

A small React + Vite + JavaScript app built for the frontend internship assignment. All styling uses Tailwind CSS. There are no component libraries or extra app features.

## Run locally

Use Node.js 24 LTS (recommended), or Node.js 22.13+, and npm.

```sh
npm ci
npm run dev
```

Open the local address printed by Vite. Keep an internet connection for Picsum photos.

```sh
npm test          # Behaviour tests, with mocked API responses
npm run lint     # ESLint, including the React Hooks rules
npm run build    # Production build in dist/
npm run preview  # Serve the production build locally
```

## The seven requirements

| Requirement | Where to find it |
| --- | --- |
| React + Vite; Tailwind only | `vite.config.js`, `src/index.css` |
| Fetch 30 photos; spinner and error message | `src/hooks/useFetchPhotos.js`, `Spinner` and `ErrorMessage` components |
| Responsive grid: 1 / 2 / 4 columns; photo, author, heart | `src/components/Gallery.jsx`, `src/components/PhotoCard.jsx` |
| Pinned search; real-time author filtering without API calls | `SearchBar`, `handleSearchChange`, `filteredPhotos` |
| Favourites with useReducer and localStorage | `src/reducers/favouritesReducer.js`; initialization and persistence in `Gallery` |
| Custom hook returning photos, loading, error | `src/hooks/useFetchPhotos.js` |
| useCallback handler and useMemo filtered list | `src/components/Gallery.jsx` |

## Understand the code

`App.jsx` renders the title and Gallery. `Gallery.jsx` manages search, favourites, and persistence. The custom hook fetches data; the reducer handles favourite updates. Small components render the search input, photo cards, spinner, and error message.

```text
src/
  App.jsx
  main.jsx
  index.css
  hooks/useFetchPhotos.js
  reducers/favouritesReducer.js
  components/
    Gallery.jsx
    SearchBar.jsx
    PhotoCard.jsx
    Spinner.jsx
    ErrorMessage.jsx
```

The search bar uses Tailwind's `sticky top-0` utilities to stay visible while scrolling. Each component has a few explicit props; there is no global state library or Context.

**API → custom hook → Gallery → search filter → cards**

**Heart click → reducer → updated favourites → localStorage**

- **useState:** holds the search text. The fetch hook also uses it for photos, loading, and error.
- **useEffect in the hook:** fetches on mount. It checks the HTTP response, reads JSON, and shows a friendly error if something fails. An `active` flag prevents a finished request updating an unmounted component. This ignores late results; it does not cancel the request.
- **useCallback:** keeps the same search-handler function between renders. The handler updates the search text. There is no memoized child depending on this function here, so the practical performance benefit is small; this hook is included because the assignment requires it.
- **useMemo:** reuses the filtered array until photos or search text change. Toggling a heart therefore does not repeat filtering. With only 30 photos this is a small optimization.
- **useReducer:** the single `TOGGLE_FAVOURITE` action adds or removes an ID. `includes` checks membership, `filter` removes an ID, and array spread adds one. Both return a new array instead of changing the previous state. Unknown actions leave state unchanged.
- **Lazy initialization:** `loadFavourites` reads localStorage when the reducer initializes, rather than reading it on every render. Only an array of string IDs is accepted; missing or invalid saved data becomes an empty list.
- **Persistence effect:** serializes favourite IDs after state changes. Storage errors are caught, so hearts still work in memory if the browser blocks storage. Persistence needs localStorage to be available and uses the same browser and origin.

Removing useCallback and replacing useMemo with a normal filter would not break correctness. They cache different things: a function and a computed value. useReducer is required by the assignment; useState could also handle a small list, but the reducer keeps updates in one place.

React Strict Mode may run effect setup twice during development. This can show two initial list requests in the Network panel; typing a search must never fetch again. Production does not perform that extra development check.

## Manual checks before recording

1. Open the Network panel, throttle the connection, and refresh: a spinner should appear, then 30 photos. Block the list request and refresh to see the error message; unblock it afterwards.
2. At 390px, 820px, and 1280px wide, expect 1, 2, and 4 grid columns. The exact breakpoints are 768px and 1024px.
3. Scroll down and confirm the search bar stays at the top. Type an author's name with mixed case and surrounding spaces. Clear it, then try a name that does not exist. Watch that no new list request appears when typing.
4. Select two hearts, search for an author, clear the search, and refresh. Both selections should persist. Deselect one and refresh again.
5. Use Tab to reach the search and heart buttons, then Enter or Space to toggle a heart. Check for visible focus outlines.
6. In browser developer tools, replace `celebrare-favourites` with invalid JSON and refresh. The app should start with no selected hearts and remain usable.

The automated tests check loading, 30 cards, network and HTTP failures, local search, toggling multiple favourites, restoring saved state, corrupt storage, and unavailable storage. Browser-specific layout and keyboard checks must also be verified in a real browser.

### Verification completed

- All 9 behaviour tests passed; ESLint and the production build passed.
- An isolated Chromium browser loaded 30 photos from the live Picsum API. The first visible images were confirmed loaded, and desktop/mobile screenshots were inspected.
- The production build showed the expected columns at 320, 390, 767, 768, 820, 1023, 1024, and 1280px, with no horizontal overflow.
- Browser checks passed for the pinned search bar while scrolling, local search with no new list requests, keyboard toggling, multiple favourites surviving refresh, and removal surviving another refresh.
- A delayed mocked API response confirmed the spinner and HTTP error state. Mocked corrupt and blocked storage checks also passed.
- The normal browser flow produced no console warnings or errors. Physical devices and other browser engines were not tested.

## Five-minute recording outline

| Time | What to show and explain |
| --- | --- |
| 0:00–1:00 | Show loading, search by author, selecting hearts, and a refresh preserving selections. |
| 1:00–2:00 | Open useFetchPhotos: its three return values, response.ok, try/catch/finally, and cleanup. |
| 2:00–3:00 | Open the reducer: the toggle action, new arrays, initial storage read, and persistence effect. Explain that useReducer is an assignment requirement. |
| 3:00–4:15 | Open the search handler and memoized filter. Explain function caching versus result caching, dependencies, and why removing either would not break correctness. |
| 4:15–5:00 | Explain one difficulty you actually encountered and how you solved it. Do not invent a personal experience. |

Read every line before recording. A useful practice topic is why saved favourites must be read during initialization, before the persistence effect writes anything. Use it as your hardest part only if it was genuinely difficult for you.

## Submission checklist

- Push the source and package-lock.json to a **public GitHub repository**. Do not upload node_modules or dist.
- Record your own five-minute walkthrough and upload it to Google Drive with viewer access or YouTube as unlisted.
- Open the separately supplied Google Form. Paste the repository link, recording link, and one sentence describing your actual hardest part.
- Submit within **24 hours of receiving the assignment**. The receipt time is not recorded in this project.

Hosting a live demo is not required by the PDF. The recording is mandatory.
