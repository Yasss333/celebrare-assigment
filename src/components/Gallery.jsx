import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import useFetchPhotos from '../hooks/useFetchPhotos'
import favouritesReducer from '../reducers/favouritesReducer'
import SearchBar from './SearchBar'
import PhotoCard from './PhotoCard'
import Spinner from './Spinner'
import ErrorMessage from './ErrorMessage'

const STORAGE_KEY = 'celebrare-favourites'

function loadFavourites() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (Array.isArray(saved) && saved.every((id) => typeof id === 'string')) return saved
  } catch {
    // Missing access or broken JSON should not stop the gallery.
  }
  return []
}

export default function Gallery() {
  const { photos, loading, error } = useFetchPhotos()
  const [search, setSearch] = useState('')
  const [favourites, dispatch] = useReducer(favouritesReducer, [], loadFavourites)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites))
    } catch {
      // Hearts still work for this visit if browser storage is unavailable.
    }
  }, [favourites])

  const handleSearchChange = useCallback((event) => {
    setSearch(event.target.value)
  }, [])

  const filteredPhotos = useMemo(() => {
    const query = search.trim().toLowerCase()
    return photos.filter((photo) => photo.author.toLowerCase().includes(query))
  }, [photos, search])

  return (
    <section aria-label="Photo gallery">
      <SearchBar search={search} onSearchChange={handleSearchChange} />

      {loading && <Spinner />}
      {!loading && error && <ErrorMessage message={error} />}
      {!loading && !error && (
        filteredPhotos.length === 0 ? (
          <p role="status" className="py-16 text-center text-slate-600">No photos match your search.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {filteredPhotos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                isFavourite={favourites.includes(photo.id)}
                onToggle={() => dispatch({ type: 'TOGGLE_FAVOURITE', photoId: photo.id })}
              />
            ))}
          </div>
        )
      )}
    </section>
  )
}
