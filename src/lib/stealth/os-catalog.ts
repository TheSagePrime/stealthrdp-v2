/* The operating-system lists shown on /windows-vps and /linux-vps. Shared by the pages and the
   Markdown copies at /docs-md/windows-vps and /docs-md/linux-vps. */

export const windowsVersions = ['2019', '2022', '2025'];

/* "Latest" is replaced with the page's own word for it (linuxVpsCopy.latest) when rendered. */
export const linuxDistros = [
  { name: 'Ubuntu', versions: '18.04 LTS, 20.04 LTS, 22.04 LTS, 24.04 LTS, 26.04 LTS', text: 'Fits many websites, panels, and development stacks.' },
  { name: 'Debian', versions: '10, 11, 12, 13', text: 'Use when the stack asks for Debian.' },
  { name: 'CentOS', versions: '7, Stream 8, Stream 9', text: 'Use when the stack asks for CentOS.' },
  { name: 'AlmaLinux', versions: '8, 9, 10', text: 'Use when the stack asks for AlmaLinux.' },
  { name: 'Rocky Linux', versions: '8, 9, 10', text: 'Use when the stack asks for Rocky Linux.' },
  { name: 'Fedora', versions: '37, 38, 39, 40, 41, 42, 43, 44', text: 'Use when the stack asks for Fedora.' },
  { name: 'Alpine Linux', versions: '3.15, 3.19, 3.23', text: 'Use when the stack asks for Alpine Linux.' },
  { name: 'FreeBSD', versions: '13.2, 13.3, 14.0, 14.1, 14.2, 14.3, 15.0', text: 'Use when the stack asks for FreeBSD.' },
  { name: 'openSUSE', versions: 'Leap 15', text: 'Use when the stack asks for openSUSE Leap 15.' },
  { name: 'CloudLinux', versions: '9', text: 'Use when the stack asks for CloudLinux 9.' },
  { name: 'Arch Linux', versions: 'Latest', text: 'Use when the stack asks for Arch Linux.' },
  { name: 'Oracle Linux', versions: '8, 9', text: 'Use when the stack asks for Oracle Linux.' },
];
