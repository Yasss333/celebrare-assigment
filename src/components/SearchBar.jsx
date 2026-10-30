export default function SearchBar({ search, onSearchChange }) {
  return (
    <div className="sticky top-0 z-10 mb-8 bg-white py-4">
      <div className="max-w-md">
        <label htmlFor="author-search" className="mb-2 block text-sm font-medium">
          Search by author
        </label>
        <input
          id="author-search"
          type="search"
          value={search}
          onChange={onSearchChange}
          placeholder="Type an author's name…"
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        />
      </div>
    </div>
  )
}
