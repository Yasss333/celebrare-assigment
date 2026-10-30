export default function favouritesReducer(favourites, action) {
  if (action.type === 'TOGGLE_FAVOURITE') {
    return favourites.includes(action.photoId)
      ? favourites.filter((id) => id !== action.photoId)
      : [...favourites, action.photoId]
  }
  return favourites
}
