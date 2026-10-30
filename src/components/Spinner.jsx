export default function Spinner() {
  return (
    <div role="status" className="flex items-center justify-center gap-3 py-20 text-slate-600">
      <span aria-hidden="true" className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-800 motion-reduce:animate-none" />
      Loading photos…
    </div>
  )
}
