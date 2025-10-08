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
    render(<Button prefix={{ value: '📅' }}>With icon</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('📅');
    expect(button).toHaveTextContent('With icon');
    expect(button.querySelector('.button__icon-prefix')).toBeInTheDocument();
  });

  it('renders icon prefix before text', () => {
    render(<Button prefix={{ value: '📅' }}>Calendar</Button>);
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

  it('renders as link when href is provided', () => {
    render(<Button href="https://example.com">Link Button</Button>);
    const link = screen.getByRole('link', { name: 'Link Button' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('renders link with button styles', () => {
    render(
      <Button href="https://example.com" variant="primary" size="lg">
        Styled Link
      </Button>
    );
    const link = screen.getByRole('link');
    expect(link).toHaveClass('button');
    expect(link).toHaveClass('button--primary');
    expect(link).toHaveClass('button--lg');
  });
  it('renders link with value prefix', () => {
    render(
      <Button href="https://example.com" prefix={{ value: '🔗' }}>
        Link with Value
      </Button>
    );
    const link = screen.getByRole('link');
    expect(link).toHaveTextContent('🔗');
    expect(link).toHaveTextContent('Link with Value');
    expect(link.querySelector('.button__icon-prefix')).toBeInTheDocument();
  });

  // TODO: it('renders link with icon prefix', () => {...})

  it('passes through anchor props when href is provided', () => {
    render(
      <Button href="https://example.com" target="_blank" rel="noopener noreferrer">
        External Link
      </Button>
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
