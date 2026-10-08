import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ResponseChart } from './ResponseChart';

const meta = {
  title: 'Status/Response time',
  component: ResponseChart,
  args: {
    locale: 'en',
    service: 'Example data — not live monitoring',
    samples: Array.from({ length: 144 }, (_, index) => ({
      at: new Date(Date.UTC(2026, 9, 8, 0, index * 5)).toISOString(),
      ms: index >= 76 && index <= 80 ? null : Math.round(80 + Math.sin(index * 0.35) * 14 + (index % 17 === 0 ? 45 : 0)),
    })),
  },
  decorators: [Story => (
    <div className="mx-auto max-w-5xl p-6">
      <p>Example data — not live monitoring</p>
      <Story />
    </div>
  )],
} satisfies Meta<typeof ResponseChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Measured: Story = {};
export const Unavailable: Story = { args: { samples: [] } };
