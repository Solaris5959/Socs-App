import React from 'react';
import { render, screen } from '@testing-library/react';
import Button from '../src/components/testbutton';


test('renders button with label', () => {
  render(<Button label="Click Me" />);
  expect(screen.getByText('Click Me')).toBeInTheDocument();
})
