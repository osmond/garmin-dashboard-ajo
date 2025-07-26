import { render, screen } from '@testing-library/react'
import HomePage from '../pages/index'

test('renders tabs', () => {
  render(<HomePage />)
  expect(screen.getByText('Overview')).toBeInTheDocument()
  expect(screen.getByText('History')).toBeInTheDocument()
})
