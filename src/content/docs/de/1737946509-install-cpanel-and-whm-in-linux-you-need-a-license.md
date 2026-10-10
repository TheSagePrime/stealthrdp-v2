---
order: 17
title: cPanel installieren unter Linux (mit WHM)
sidebarTitle: cPanel installieren
category: Web panels
date: Jan 27, 2025
sourceTitle: Install Cpanel and WHM in Linux (You need a license)
sourceUrl: https://docs.stealthrdp.com/hc/stealth-rdp-docs/articles/1737946509-install-cpanel-and-whm-in-linux-you-need-a-license
migration:
  source: Verified StealthRDP documentation snapshot
  date: 2026-08-13
  redactions:
    - example endpoint placeholder redacted
summary: "cPanel installieren mit dem offiziellen Installer auf einem frischen Linux-Server. Die cPanel-Lizenz erwerben Sie bei cPanel für die IP-Adresse Ihres Servers."
relatedSlugs: []
translationOf: 1737946509-install-cpanel-and-whm-in-linux-you-need-a-license
locale: de
publishAt: 2026-10-19
primaryKeyword: cpanel installieren
---
In dieser Anleitung erfahren Sie, wie Sie cPanel installieren. cPanel und WHM installieren Sie auf einem Linux-Server, und wir haben die Schritte so einfach wie möglich gehalten. Die cPanel-Lizenz müssen Sie auf der Website von cPanel erwerben.

:::warn
**Wichtiger Hinweis:**

cPanel, L.L.C. entwickelt Software für kommerzielles Hosting. Daher lizenziert cPanel nur öffentlich sichtbare, statische IP-Adressen. Dynamische, reservierte oder sogenannte Sticky-IP-Adressen sowie interne IP-Adressen werden nicht lizenziert. Wir bieten kein Deinstallationsprogramm an. Wenn Sie unsere Software entfernen möchten, müssen Sie den Server neu formatieren.

Installieren Sie cPanel & WHM nur auf einem frisch installierten Betriebssystem. Sie müssen sich als Root-Benutzer am Server anmelden, um cPanel & WHM zu installieren. Wenn Sie keinen Root-Zugriff haben, wenden Sie sich an Ihren Systemadministrator oder Hosting-Anbieter.

Wir empfehlen den cPanel-&-WHM-Installer, der alle erforderlichen Dienste installiert. Wenn Sie Dienste vor cPanel & WHM installieren, kann es zu Kompatibilitätsproblemen kommen.

Neue Installationen von cPanel & WHM verwenden standardmäßig den schnellen Installationsmodus. Um diesen zu deaktivieren, folgen Sie den Schritten in unserer Dokumentation zu „Customize Your Installation“.
:::

## Systemanforderungen

Bevor Sie cPanel & WHM oder cPanel DNSOnly® installieren, stellen Sie sicher, dass Ihr System alle Mindestanforderungen für neue Installationen erfüllt. Die Mindestanforderungen unterscheiden sich je nach Betriebssystem Ihres Servers:

- [Systemanforderungen für AlmaLinux](https://docs.cpanel.net/installation-guide/system-requirements-almalinux)
- [Systemanforderungen für Ubuntu](https://docs.cpanel.net/installation-guide/system-requirements-ubuntu/)
- [Systemanforderungen für CloudLinux™](https://docs.cpanel.net/installation-guide/system-requirements-cloudlinux)

## cPanel installieren

Um cPanel & WHM auf Ihrem Server zu installieren, führen Sie folgenden Befehl aus:

```bash title="cPanel-&-WHM-Installer ausführen"
cd /home && curl -o latest -L https://securedownloads.cpanel.net/latest && sh latest
```
