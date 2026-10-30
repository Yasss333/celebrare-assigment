export default function PhotoCard({ photo, isFavourite, onToggle }) {
  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <img
        src={`https://picsum.photos/id/${photo.id}/600/450`}
        alt={`Photo by ${photo.author}`}
        width="600"
        height="450"
        loading="lazy"
        className="aspect-4/3 w-full object-cover"
      />
      <div className="flex items-center justify-between gap-2 p-3">
        <p className="min-w-0 text-sm font-medium wrap-break-word">{photo.author}</p>
        <button
          type="button"
          aria-label={`${isFavourite ? 'Remove' : 'Add'} photo by ${photo.author} ${isFavourite ? 'from' : 'to'} favourites`}
          aria-pressed={isFavourite}
          onClick={onToggle}
          className={`flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${isFavourite ? 'text-rose-600' : 'text-slate-500'}`}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill={isFavourite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
          </svg>
        </button>
      </div>
    </article>
  )
}
