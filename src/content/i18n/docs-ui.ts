import type { SiteLocale } from '../../config/i18n';

/* Words of the docs layout (Fumadocs UI) in German and Spanish. Keys are Fumadocs' own:
   the English text followed by its notes, as listed in fumadocs-ui/dist/.translations/keys.js.
   English uses Fumadocs' defaults. */

type DocsUiCopy = Record<string, string>;

const de: DocsUiCopy = {
  'Search(search trigger)': 'Suchen',
  'Search(search dialog)': 'Suchen',
  'Open Search(search trigger)(aria-label)': 'Suche öffnen',
  'Close Search(search dialog)(aria-label)': 'Suche schließen',
  'No results found(search dialog)': 'Keine Ergebnisse',
  'On this page(table of contents)': 'Auf dieser Seite',
  'Table of Contents(inline table of contents)': 'Inhalt',
  'No Headings(table of contents)': 'Keine Überschriften',
  'Previous Page(pagination)': 'Vorherige Seite',
  'Next Page(pagination)': 'Nächste Seite',
  'Last updated on(page footer)': 'Zuletzt aktualisiert am',
  'Copy Link(accordion)(aria-label)': 'Link kopieren',
  'Copied Link(accordion)(aria-label)': 'Link kopiert',
  'Copy Anchor Link(heading anchor)(aria-label)': 'Link zum Abschnitt kopieren',
  'Copied Anchor Link(heading anchor)(aria-label)': 'Link zum Abschnitt kopiert',
  'Copy Text(code block)(aria-label)': 'Text kopieren',
  'Copied Text(code block)(aria-label)': 'Text kopiert',
  'Open Sidebar(sidebar)(aria-label)': 'Seitenleiste öffnen',
  'Close Sidebar(sidebar)(aria-label)': 'Seitenleiste schließen',
  'Close Sidebar(aria-label)': 'Seitenleiste schließen',
  'Collapse Sidebar(sidebar)(aria-label)': 'Seitenleiste einklappen',
  'Show Sidebar(sidebar)': 'Seitenleiste anzeigen',
  'Hide Sidebar(sidebar)': 'Seitenleiste ausblenden',
  'Toggle Menu(mobile menu)(aria-label)': 'Menü öffnen oder schließen',
};

const es: DocsUiCopy = {
  'Search(search trigger)': 'Buscar',
  'Search(search dialog)': 'Buscar',
  'Open Search(search trigger)(aria-label)': 'Abrir búsqueda',
  'Close Search(search dialog)(aria-label)': 'Cerrar búsqueda',
  'No results found(search dialog)': 'No hay resultados',
  'On this page(table of contents)': 'En esta página',
  'Table of Contents(inline table of contents)': 'Índice',
  'No Headings(table of contents)': 'Sin encabezados',
  'Previous Page(pagination)': 'Página anterior',
  'Next Page(pagination)': 'Página siguiente',
  'Last updated on(page footer)': 'Última actualización:',
  'Copy Link(accordion)(aria-label)': 'Copiar enlace',
  'Copied Link(accordion)(aria-label)': 'Enlace copiado',
  'Copy Anchor Link(heading anchor)(aria-label)': 'Copiar enlace a la sección',
  'Copied Anchor Link(heading anchor)(aria-label)': 'Enlace a la sección copiado',
  'Copy Text(code block)(aria-label)': 'Copiar texto',
  'Copied Text(code block)(aria-label)': 'Texto copiado',
  'Open Sidebar(sidebar)(aria-label)': 'Abrir la barra lateral',
  'Close Sidebar(sidebar)(aria-label)': 'Cerrar la barra lateral',
  'Close Sidebar(aria-label)': 'Cerrar la barra lateral',
  'Collapse Sidebar(sidebar)(aria-label)': 'Contraer la barra lateral',
  'Show Sidebar(sidebar)': 'Mostrar la barra lateral',
  'Hide Sidebar(sidebar)': 'Ocultar la barra lateral',
  'Toggle Menu(mobile menu)(aria-label)': 'Abrir o cerrar el menú',
};

export const docsUiCopy: Partial<Record<SiteLocale, DocsUiCopy>> = { de, es };
