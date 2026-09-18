import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from './button';

const meta = {
  title: 'Foundation/Button',
  component: Button,
  args: {
    children: 'Continue',
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
