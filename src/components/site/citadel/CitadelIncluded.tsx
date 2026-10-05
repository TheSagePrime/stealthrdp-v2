import type { CitadelCopy } from '@/content/i18n/en/citadel';
import { Check } from '@phosphor-icons/react/dist/ssr';
import styles from './CitadelIncluded.module.css';

/* The "Included with every plan" list from the WHMCS store, in the page's language. */
export function CitadelIncluded({ copy }: { copy: CitadelCopy['included'] }) {
  return (
    <section className={styles.included} aria-labelledby="citadel-included-title">
      <h3 id="citadel-included-title">{copy.title}</h3>
      <ul>
        {copy.items.map(item => (
          <li key={item}>
            <Check size={16} weight="bold" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
