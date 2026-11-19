import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '../App';

describe('Check In Berita AI primary flow', () => {
  it('has accessible input and renders evidence, warning and coverage profile', async () => {
    render(<App />);
    const input = screen.getByLabelText(/claim to check/i);
    fireEvent.change(input, { target: { value: "Malaysia's inflation rate was 1.8% in 2024." } });
    fireEvent.click(screen.getByRole('button', { name: /check claim/i }));

    expect((await screen.findAllByText('Hackathon demonstration fixture. Exact value requires human verification before public release.')).length).toBeGreaterThan(0);
    expect(screen.getByText(/evidence organisation/i)).toBeInTheDocument();
    expect(screen.getByText('Calculation')).toBeInTheDocument();
    expect(screen.getByText(/sample size/i)).toBeInTheDocument();
    expect(screen.getByText('Analysis period')).toBeInTheDocument();
    expect(screen.queryByText(/truth percentage/i)).not.toBeInTheDocument();
  });

  it.each([
    'A banana railway orbits Jupiter.',
    "Malaysia's inflation rate was 1.8% in 2023.",
  ])('shows insufficient evidence instead of a false match for %s', async (input) => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/claim to check/i), { target: { value: input } });
    fireEvent.click(screen.getByRole('button', { name: /check claim/i }));

    expect(await screen.findByText('Insufficient evidence: Check In Berita AI could not confidently match this claim to the currently approved evidence registry.')).toBeInTheDocument();
  });

  it('labels an absurd numeric conflict as false with a confidence score', async () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/claim to check/i), {
      target: { value: "Malaysia's inflation rate was 120% in 2024." },
    });
    fireEvent.click(screen.getByRole('button', { name: /check claim/i }));

    expect(await screen.findByText('False information')).toBeInTheDocument();
    expect(screen.getByText('Absurd false / fake claim')).toBeInTheDocument();
    expect(screen.getByRole('meter', { name: 'Comparison confidence score' })).toBeInTheDocument();
  });
});
