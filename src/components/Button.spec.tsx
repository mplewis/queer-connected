import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('renders with primary variant by default', () => {
    render(<Button>Primary</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('button--primary');
  });

  it('renders with secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('button--secondary');
  });

  it('renders with ghost variant', () => {
    render(<Button variant="ghost">Ghost</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('button--ghost');
  });

  it('renders with small size', () => {
    render(<Button size="sm">Small</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('button--sm');
  });

  it('renders with medium size by default', () => {
    render(<Button>Medium</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('button--md');
  });

  it('renders with large size', () => {
    render(<Button size="lg">Large</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('button--lg');
  });

  it('renders without icon prefix by default', () => {
    render(<Button>No icon</Button>);
    expect(screen.queryByText('📅')).not.toBeInTheDocument();
  });

  it('renders with icon prefix', () => {
    render(<Button iconPrefix="📅">With icon</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('📅');
    expect(button).toHaveTextContent('With icon');
    expect(button.querySelector('.button__icon-prefix')).toBeInTheDocument();
  });

  it('renders icon prefix before text', () => {
    render(<Button iconPrefix="📅">Calendar</Button>);
    const button = screen.getByRole('button');
    const iconSpan = button.querySelector('.button__icon-prefix');
    expect(iconSpan).toBeInTheDocument();
    expect(iconSpan?.textContent).toBe('📅');
    expect(button.textContent).toBe('📅Calendar');
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
    expect(button).toHaveClass('button');
  });

  it('passes through HTML button props', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
