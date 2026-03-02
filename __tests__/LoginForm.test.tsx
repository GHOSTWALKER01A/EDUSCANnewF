import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import LoginForm from '../src/components/LoginForm'
import axios from 'axios'
import { ToastContainer } from 'react-toastify'

// Mock axios since the component calls it directly
vi.mock('axios')

describe('LoginForm Component', () => {
  it('renders all essential input fields', () => {
    // The component might expect a ToastContainer, but we render only LoginForm for simple test
    render(<LoginForm />)
    
    expect(screen.getByPlaceholderText(/Full Name/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Registration Number/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Log In/i })).toBeInTheDocument()
  })

  it('shows validation error if email does not end with @bitsindri.ac.in', async () => {
    render(<LoginForm />)
    
    const emailInput = screen.getByPlaceholderText(/Email/i)
    const submitBtn = screen.getByRole('button', { name: /Log In/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } })
    fireEvent.click(submitBtn)
    
    // React Hook Form validation text should appear
    await waitFor(() => {
      expect(screen.getByText(/Email must end with @bitsindri.ac.in/i)).toBeInTheDocument()
    })
  })
})
