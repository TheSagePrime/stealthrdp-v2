import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { UptimeBar } from '@/components/dashboardblocks/status';

const meta = {
  title: 'Status/DashboardBlocks uptime',
  component: UptimeBar,
  args: {
    label: 'Example data — not live monitoring',
    days: [
      { label: 'Example healthy day', status: 'operational', uptime: 100 },
      { label: 'Example missing day', status: 'unknown' },
      { label: 'Example outage day', status: 'major', uptime: 0 },
    ],
  },
  decorators: [
    Story => (
      <div className="mx-auto max-w-5xl p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof UptimeBar>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Measured: Story = {};
export const Unavailable: Story = { args: { days: [] } };
