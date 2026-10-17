/* OS logos from the StealthRDP panel. StealthRDP's own artwork, loaded from its URL rather than copied
   into the repo, so an update on the panel reaches the site without a deploy. */
const panelLogos = 'https://servers.stealthrdp.com/img/logo';

export const osLogos = {
  windows: `${panelLogos}/windows_logo.png`,
  ubuntu: `${panelLogos}/ubuntu_logo.png`,
  debian: `${panelLogos}/debian_logo.png`,
  centos: `${panelLogos}/centos_logo.png`,
  almalinux: `${panelLogos}/almalinux_logo.png`,
  fedora: `${panelLogos}/fedora_logo.png`,
  rockylinux: `${panelLogos}/rocky_linux_logo.png`,
  alpinelinux: `${panelLogos}/alpine_logo.png`,
  freebsd: `${panelLogos}/freebsd_logo.png`,
  opensuse: `${panelLogos}/opensuse_logo.png`,
  archlinux: `${panelLogos}/archlinux_logo.png`,
  cloudlinux: `${panelLogos}/cloudlinux_logo.png`,
  oraclelinux: `${panelLogos}/oracle_linux_logo.png`,
} as const;
