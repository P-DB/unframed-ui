// Sample data shared by the Table and Pagination stories.

export interface Invoice {
  [key: string]: unknown;
  id: string;
  customer: string;
  date: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  amount: number;
}

const customers = ['Acme', 'Globex', 'Initech', 'Umbrella', 'Hooli', 'Stark', 'Wayne', 'Wonka', 'Tyrell', 'Cyberdyne', 'Soylent', 'Aperture'];
const statuses: Invoice['status'][] = ['Paid', 'Paid', 'Pending', 'Overdue'];

export const invoices: Invoice[] = Array.from({ length: 57 }, (_, i) => ({
  id: `INV-${String(1001 + i)}`,
  customer: customers[(i * 7) % customers.length],
  date: `2026-${String(1 + (i % 9)).padStart(2, '0')}-${String(1 + ((i * 11) % 28)).padStart(2, '0')}`,
  status: statuses[(i * 5) % statuses.length],
  amount: Math.round(((i * 137) % 900) + 100 + (i % 3) * 0.5),
}));
