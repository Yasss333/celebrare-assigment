import Gallery from './components/Gallery'

export default function App() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-10 text-slate-900 sm:px-8">
      <header className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Photo Gallery</h1>
        <p className="mt-2 text-slate-600">Find a favourite, one photo at a time.</p>
      </header>
      <Gallery />
    </main>
  )
}
