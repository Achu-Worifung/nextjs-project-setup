import { render, screen } from '@testing-library/react'
import { Button } from './button'

describe('Button', () => {
  it('renders as a button element by default', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button.tagName).toBe('BUTTON')
  })

  it('renders as a Slot component when asChild is true', () => {
    render(
      <Button asChild>
        <a href="#">Link Button</a>
      </Button>
    )
    const link = screen.getByRole('link')
    expect(link).toBeInTheDocument()
    expect(link.tagName).toBe('A')
    expect(link).toHaveAttribute('href', '#')
    expect(link).toHaveAttribute('data-slot', 'button')
  })
})
