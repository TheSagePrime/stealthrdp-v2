import { List, X } from '@phosphor-icons/react/dist/ssr';
import { Button } from '@/components/ui/button';

/**
 * Icon-only menu toggle for small screens.
 * The glyph and the accessible name follow the open state, so the control never
 * lies about what pressing it does.
 *
 * @param props The properties for the component.
 * @param props.open Whether the menu is currently open.
 * @param props.onClick Function to run when the button is clicked.
 */
const MenuToggle = (props: {
  open?: boolean;
  onClick?: () => void;
}) => (
  <Button
    variant="ghost"
    size="icon"
    aria-label={props.open ? 'Close menu' : 'Open menu'}
    aria-expanded={props.open ?? false}
    onClick={props.onClick}
  >
    {props.open
      ? <X size={24} aria-hidden="true" />
      : <List size={24} aria-hidden="true" />}
  </Button>
);

export { MenuToggle };
