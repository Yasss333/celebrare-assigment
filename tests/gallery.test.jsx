import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, expect, test, vi } from 'vitest'
import Gallery from '../src/components/Gallery'

const photos = Array.from({ length: 30 }, (_, index) => ({
  id: String(index),
  author: index === 0 ? 'Alejandro Escamilla' : `Author ${index}`,
}))

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: async () => photos,
  }))
})

test('shows a spinner until the request resolves, then displays 30 complete cards', async () => {
  let resolveRequest
  fetch.mockReturnValue(new Promise((resolve) => { resolveRequest = resolve }))
  render(<Gallery />)
  expect(screen.getByRole('status')).toHaveTextContent('Loading photos')
  resolveRequest({ ok: true, json: async () => photos })
  expect(await screen.findAllByRole('img')).toHaveLength(30)
  expect(screen.getAllByRole('button')).toHaveLength(30)
  expect(screen.getByText('Alejandro Escamilla')).toBeInTheDocument()
  expect(fetch.mock.calls[0][0]).toBe('https://picsum.photos/v2/list?limit=30')
})

test.each(['network', 'http'])('shows an error after a %s failure', async (failure) => {
  if (failure === 'network') fetch.mockRejectedValue(new Error('Offline'))
  else fetch.mockResolvedValue({ ok: false, status: 500 })
  render(<Gallery />)
  expect(await screen.findByRole('alert')).toHaveTextContent('Could not load photos')
  expect(screen.queryByText('Loading photos…')).not.toBeInTheDocument()
})

test('searches locally, ignores case and whitespace, and handles no results', async () => {
  render(<Gallery />)
  await screen.findAllByRole('img')
  const search = screen.getByRole('searchbox')
  fireEvent.change(search, { target: { value: '  aLeJaNdRo  ' } })
  expect(screen.getAllByRole('img')).toHaveLength(1)
  fireEvent.change(search, { target: { value: 'missing author' } })
  expect(screen.getByText('No photos match your search.')).toBeInTheDocument()
  fireEvent.change(search, { target: { value: '' } })
  expect(screen.getAllByRole('img')).toHaveLength(30)
  expect(fetch).toHaveBeenCalledTimes(1)
})

test('toggles multiple favourites, preserves them through search, and restores them on remount', async () => {
  const view = render(<Gallery />)
  await screen.findAllByRole('img')
  fireEvent.click(screen.getAllByRole('button')[0])
  fireEvent.click(screen.getAllByRole('button')[1])
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Alejandro' } })
  expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
  await waitFor(() => expect(JSON.parse(localStorage.getItem('celebrare-favourites'))).toEqual(['0', '1']))
  view.unmount()
  render(<Gallery />)
  await screen.findAllByRole('img')
  expect(screen.getAllByRole('button')[0]).toHaveAttribute('aria-pressed', 'true')
  expect(screen.getAllByRole('button')[1]).toHaveAttribute('aria-pressed', 'true')
  fireEvent.click(screen.getAllByRole('button')[0])
  expect(screen.getAllByRole('button')[0]).toHaveAttribute('aria-pressed', 'false')
  expect(JSON.parse(localStorage.getItem('celebrare-favourites'))).toEqual(['1'])
})

test.each(['broken json', '{}', '[1,null]'])('recovers from invalid saved favourites: %s', async (saved) => {
  localStorage.setItem('celebrare-favourites', saved)
  render(<Gallery />)
  await screen.findAllByRole('img')
  expect(screen.getAllByRole('button')[0]).toHaveAttribute('aria-pressed', 'false')
  fireEvent.click(screen.getAllByRole('button')[0])
  expect(screen.getAllByRole('button')[0]).toHaveAttribute('aria-pressed', 'true')
})

test('keeps favourites working in memory when storage is unavailable', async () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('Blocked') })
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Blocked') })
  render(<Gallery />)
  await screen.findAllByRole('img')
  fireEvent.click(screen.getAllByRole('button')[0])
  expect(screen.getAllByRole('button')[0]).toHaveAttribute('aria-pressed', 'true')
})
