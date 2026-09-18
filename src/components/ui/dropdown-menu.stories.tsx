import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';

function DropdownPreview() {
  return (
    <DropdownMenu defaultOpen modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Workspace</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Overview</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem variant="destructive">Leave workspace</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const meta = {
  title: 'Foundation/DropdownMenu',
  component: DropdownPreview,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof DropdownPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {};
