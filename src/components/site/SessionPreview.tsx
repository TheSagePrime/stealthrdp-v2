import { Zap } from 'lucide-react';
import type { ReactNode } from 'react';
import { docsArticles } from '@/lib/stealth/content';

/**
 * Remote-session preview (card t_48af6be8).
 *
 * The device is drawn, not photographed: every element is HTML and CSS, so it
 * stays crisp at any device-pixel-ratio. There is no third-party
 * desktop-environment clone behind it and no operating-system logo, wallpaper
 * or brand mark in it — the layout uses desktop conventions (a title bar and,
 * for the desktop variant, a bottom taskbar with a start affordance) and the
 * chrome is our own.
 *
 * Every string the chrome shows is sourced. The desktop variant takes its title
 * and tray from the caller, which reads them from src/content/plans.json. The
 * terminal variant reads its transcript from the published documentation, and
 * drops any line the source does not contain, so it can never invent a command.
 */

export type SessionPreviewVariant = 'desktop' | 'terminal';

type DesktopProps = {
  variant: 'desktop';
  /** Session title. Real value: the plan name from src/content/plans.json. */
  title: string;
  /** Decorative application mark. */
  mark?: ReactNode;
  /** Session tray for the taskbar, normally the plan's region and operating system. */
  tray?: ReactNode;
  /** The session's content area. */
  children: ReactNode;
};

type TerminalProps = {
  variant: 'terminal';
  /**
   * Window title. Defaults to the title of the documentation article the
   * transcript comes from.
   */
  title?: string;
  /** Decorative application mark. */
  mark?: ReactNode;
};

export type SessionPreviewProps = DesktopProps | TerminalProps;

/**
 * The documentation article the terminal variant transcribes: the Outline VPN
 * setup guide in src/content/docs-articles.json.
 */
const TRANSCRIPT_SLUG = '1737946054-how-to-setup-your-vpn-on-linux-server-using-outline';

/**
 * Candidate command lines. Each is an exact substring of the published article
 * content; a line the source does not carry is dropped rather than shown.
 */
const TRANSCRIPT_COMMANDS = [
  'sudo systemctl start docker',
  'sudo systemctl enable docker',
  'sudo systemctl status docker',
];

function readTranscript(): { commands: string[]; title: string | null } {
  const article = docsArticles.find(item => item.slug === TRANSCRIPT_SLUG);
  if (!article) {
    return { commands: [], title: null };
  }

  return {
    commands: TRANSCRIPT_COMMANDS.filter(command => article.content.includes(command)),
    title: article.title,
  };
}

function Mark({ mark }: { mark?: ReactNode }) {
  if (!mark) {
    return null;
  }

  return <span className="sr-session-mark" aria-hidden="true">{mark}</span>;
}

export function SessionPreview(props: SessionPreviewProps) {
  if (props.variant === 'terminal') {
    const { commands, title } = readTranscript();
    const heading = props.title ?? title;

    return (
      <div className="sr-session" data-variant="terminal">
        <div className="sr-session-bar">
          <Mark mark={props.mark} />
          {heading ? <h2 className="sr-session-title">{heading}</h2> : null}
        </div>

        <div className="sr-session-screen sr-session-screen-term">
          <ol className="sr-term-lines">
            {commands.map(command => (
              <li className="sr-term-line" key={command}>
                <span className="sr-term-prompt" aria-hidden="true">$</span>
                <span className="sr-term-command">{command}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="sr-session" data-variant="desktop">
      <div className="sr-session-bar">
        <Mark mark={props.mark} />
        <h2 className="sr-session-title">{props.title}</h2>
      </div>

      <div className="sr-session-screen">{props.children}</div>

      {/* Desktop convention. The mark is decoration: nothing behind it acts, so
          it has no hover state, no pointer events and no pressed state. */}
      <div className="sr-session-taskbar">
        <span className="sr-session-start" aria-hidden="true"><Zap /></span>
        {props.tray ? <div className="sr-activity-meta">{props.tray}</div> : null}
      </div>
    </div>
  );
}
