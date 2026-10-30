import { useEffect, useState } from 'react'

export default function useFetchPhotos() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function fetchPhotos() {
      try {
        const response = await fetch('https://picsum.photos/v2/list?limit=30')
        if (!response.ok) throw new Error('Photo request failed')

        const data = await response.json()
        if (!Array.isArray(data)) throw new Error('Invalid photo response')
        if (active) setPhotos(data)
      } catch {
        if (active) setError('Could not load photos. Please refresh the page to try again.')
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchPhotos()

    // A request may finish after this component has unmounted.
    return () => { active = false }
  }, [])

  return { photos, loading, error }
}
