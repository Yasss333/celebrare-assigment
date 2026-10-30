export default function ErrorMessage({ message }) {
  return (
    <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-800">
      {message}
    </p>
  )
}
