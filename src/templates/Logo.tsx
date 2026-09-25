import { AppConfig } from '@/utils/AppConfig';

/** The real brand asset, used by the header and the footer as well. Never a hand-traced path. */
const LOGO_SRC = 'https://cdn.stealthrdp.com/images/new/6.png';

export const Logo = (props: {
  isTextHidden?: boolean;
}) => (
  <div className="flex items-center gap-2 text-xl font-semibold">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      className={props.isTextHidden ? 'h-7 w-auto' : 'h-8 w-auto'}
      src={LOGO_SRC}
      alt={AppConfig.name}
      width="700"
      height="170"
    />
  </div>
);
