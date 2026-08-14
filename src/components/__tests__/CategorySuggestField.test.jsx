import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useState } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import CategorySuggestField from '../CategorySuggestField'
import { categorize } from '../../api/insights'

vi.mock('../../api/insights', () => ({
  categorize: vi.fn(),
  getMonthlySummary: vi.fn(),
}))

/** CategorySuggestField is controlled, so the test owns the description state. */
function Harness({ onCategoryChange }) {
  const [description, setDescription] = useState('')
  return (
    <CategorySuggestField
      description={description}
      onDescriptionChange={setDescription}
      onCategoryChange={onCategoryChange}
    />
  )
}

const typeDescription = (value) =>
  fireEvent.change(screen.getByLabelText('Description'), { target: { value } })

describe('CategorySuggestField', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows the predicted category tag for a known keyword', async () => {
    categorize.mockResolvedValue({
      description: 'Zomato order',
      category: 'FOOD',
      source: 'KEYWORD',
    })

    render(<Harness />)
    typeDescription('Zomato order')

    const tag = await screen.findByTestId('category-tag', {}, { timeout: 2000 })
    expect(tag).toHaveTextContent('Category: Food')
    expect(categorize).toHaveBeenCalledWith('Zomato order')
  })

  it('reports the selected category up to the parent form', async () => {
    const onCategoryChange = vi.fn()
    categorize.mockResolvedValue({
      description: 'Uber ride',
      category: 'TRANSPORT',
      source: 'KEYWORD',
    })

    render(<Harness onCategoryChange={onCategoryChange} />)
    typeDescription('Uber ride')

    await waitFor(() => expect(onCategoryChange).toHaveBeenCalledWith('TRANSPORT'), {
      timeout: 2000,
    })
  })

  it('debounces so rapid typing produces a single request', async () => {
    categorize.mockResolvedValue({
      description: 'Swiggy order',
      category: 'FOOD',
      source: 'KEYWORD',
    })

    render(<Harness />)
    typeDescription('Swi')
    typeDescription('Swiggy')
    typeDescription('Swiggy order')

    await screen.findByTestId('category-tag', {}, { timeout: 2000 })
    expect(categorize).toHaveBeenCalledTimes(1)
    expect(categorize).toHaveBeenCalledWith('Swiggy order')
  })

  it('lets the user override a wrong prediction', async () => {
    categorize.mockResolvedValue({
      description: 'Big Bazaar',
      category: 'FOOD',
      source: 'LLM',
    })

    render(<Harness />)
    typeDescription('Big Bazaar')

    const tag = await screen.findByTestId('category-tag', {}, { timeout: 2000 })
    expect(tag).toHaveTextContent('Category: Food')

    fireEvent.change(screen.getByLabelText('Override category'), {
      target: { value: 'SHOPPING' },
    })

    expect(screen.getByTestId('category-tag')).toHaveTextContent('Category: Shopping')
  })

  it('renders no tag while the description is empty', () => {
    render(<Harness />)

    expect(screen.queryByTestId('category-tag')).not.toBeInTheDocument()
    expect(categorize).not.toHaveBeenCalled()
  })
})
