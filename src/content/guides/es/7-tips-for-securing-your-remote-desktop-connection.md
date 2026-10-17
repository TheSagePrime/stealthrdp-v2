---
order: 12
title: "Seguridad del escritorio remoto: 7 consejos para RDP"
sidebarTitle: Seguridad del escritorio remoto
excerpt: La seguridad del escritorio remoto en Windows, desde activar RDP con Configuración, PowerShell o directivas de grupo hasta MFA, VPN, pasarelas y NLA.
category: Remote Desktop
author: StealthRDP Team
date: 2025-06-11
readingTime: 17
image: https://assets.seobotai.com/cdn-cgi/image/quality=75,w=1536,h=1024/stealthrdp.com/6848cc1a5559d477e7526a0e-1749637212671.jpg
sources:
  - title: What's new in the Remote Desktop client for Windows
    url: https://learn.microsoft.com/en-us/previous-versions/remote-desktop-client/whats-new-windows
    publisher: Microsoft Learn
    accessedAt: 2026-10-09
  - title: Use features of the Remote Desktop client for Windows - Azure Virtual Desktop
    url: https://learn.microsoft.com/en-us/previous-versions/remote-desktop-client/client-features-windows-msrdc
    publisher: Microsoft Learn
    accessedAt: 2026-10-09
  - title: Configure Network Level Authentication for Remote Desktop Services Connections
    url: https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2008-r2-and-2008/cc732713(v=ws.11)
    publisher: Microsoft Learn
    accessedAt: 2026-10-09
  - title: RemoteDesktopServices Policy CSP
    url: https://learn.microsoft.com/en-us/windows/client-management/mdm/policy-csp-remotedesktopservices
    publisher: Microsoft Learn
    accessedAt: 2026-10-09
  - title: "One simple action you can take to prevent 99.9 percent of attacks on your accounts"
    url: https://www.microsoft.com/en-us/security/blog/2019/08/20/one-simple-action-you-can-take-to-prevent-99-9-percent-of-account-attacks/
    publisher: Microsoft Security Blog
    accessedAt: 2026-10-09
  - title: "Samsam infected thousands of LabCorp systems via brute force RDP"
    url: https://www.csoonline.com/article/565911/samsam-infected-thousands-of-labcorp-systems-via-brute-force-rdp.html
    publisher: CSO Online
    accessedAt: 2026-10-09
  - title: "Cybercriminals Abuse Remote Desktop Protocol (RDP) in 90% of Attacks Handled by Sophos Incident Response in 2023"
    url: https://www.sophos.com/en-us/press/press-releases/2024/04/cybercriminals-abuse-remote-desktop-protocol-rdp-90-attacks-handled
    publisher: Sophos
    accessedAt: 2026-10-09
  - title: "Widespread, Easily Exploitable Windows RDP Bug Opens Users to Data Theft"
    url: https://threatpost.com/windows-bug-rdp-exploit-unprivileged-users/177599/
    publisher: Threatpost
    accessedAt: 2026-10-09
  - title: "2026 Data Breach Investigations Report: Executive Summary"
    url: https://www.verizon.com/business/resources/executivebriefs/2026-dbir-executive-summary.pdf
    publisher: Verizon
    accessedAt: 2026-10-09
translationOf: 7-tips-for-securing-your-remote-desktop-connection
locale: es
publishAt: 2026-10-10
primaryKeyword: seguridad escritorio remoto
---
**Los atacantes abusaron de RDP en el 90% de los ciberataques que gestionó [Sophos](https://www.sophos.com/en-us/press/press-releases/2024/04/cybercriminals-abuse-remote-desktop-protocol-rdp-90-attacks-handled) en 2023.** <a class="seo-article-citation" href="#source-7" aria-label="Source 7">[7]</a> Protege tu conexión ahora con estos 7 consejos esenciales para reforzar la seguridad del escritorio remoto (RDP) y evitar brechas:

1. **Configura una autenticación sólida**: Usa contraseñas únicas y complejas y activa la autenticación multifactor (MFA) para bloquear los ataques de fuerza bruta.
2. **Mantén actualizado [el software RDP](/es)**: Instala con regularidad las actualizaciones y los parches de seguridad para corregir vulnerabilidades.
3. **Controla el acceso a la red**: Restringe el acceso RDP a IP de confianza, configura los cortafuegos y cambia el puerto RDP predeterminado (3389).
4. **Usa una VPN**: Cifra tu conexión y bloquea los accesos no autorizados con una VPN.
5. **Configura una pasarela RDP**: Enruta el tráfico a través de una pasarela segura para añadir cifrado y monitorización.
6. **Activa el cifrado y los túneles**: Usa la autenticación a nivel de red (NLA) y un túnel SSH para proteger los datos en tránsito.
7. **Aplica el modelo Zero Trust**: Verifica continuamente a los usuarios, aplica el mínimo privilegio y supervisa la actividad.

**¿Por qué actuar ya?** RDP es uno de los objetivos preferidos de los ciberdelincuentes. Estos pasos crean una defensa en capas que mantiene tu sistema a salvo de amenazas cada vez más sofisticadas.

## Todo lo que necesitas saber sobre la seguridad de RDP en 30 minutos (consejos de ciberseguridad de CCB)

<iframe class="sb-iframe" src="https://www.youtube.com/embed/-u2ZuGfixHM" frameborder="0" loading="lazy" allowfullscreen style="width: 100%; height: auto; aspect-ratio: 16/9;"></iframe>

## 1. Configura una autenticación sólida

Cuando hablamos de proteger el Protocolo de Escritorio remoto (RDP), la autenticación sólida es tu primera y más importante línea de defensa. Las contraseñas débiles dejan tu conexión expuesta a ataques automatizados diseñados para descifrar credenciales. Reforzar la autenticación reduce mucho la probabilidad de una brecha.

### Crea contraseñas fuertes y únicas

Tu contraseña es la puerta de entrada a tu conexión RDP, y las débiles son objetivos prioritarios de los ataques de fuerza bruta. Para protegerte, crea contraseñas de al menos 8 caracteres que combinen mayúsculas y minúsculas, números y caracteres especiales. Evita las palabras fáciles de adivinar, los datos personales y los patrones predecibles.

Un buen método es usar una frase de contraseña, que combina palabras aleatorias para formar una clave segura pero fácil de recordar. Por ejemplo, una frase como "Coffee!Mountain$Dance92" es robusta y fácil de recordar. Igual de importante: nunca reutilices contraseñas en distintas cuentas. Si una cuenta se ve comprometida, las contraseñas únicas protegen el resto.

Gestionar varias contraseñas fuertes puede resultar difícil, así que plantéate usar un gestor de contraseñas. Estas herramientas guardan tus credenciales de forma segura, generan contraseñas complejas y simplifican el inicio de sesión. Así mantienes una seguridad robusta sin tener que memorizar muchas claves.

Una vez protegidas tus contraseñas, es hora de añadir otra capa de protección con la autenticación multifactor.

### Activa la autenticación multifactor (MFA)

Las contraseñas fuertes son esenciales, pero combinadas con la autenticación multifactor (MFA) ofrecen una defensa todavía más sólida. La MFA exige una segunda forma de verificación, lo que dificulta mucho que un atacante acceda aunque tenga tu contraseña. [Microsoft](https://www.microsoft.com/en-us/security/blog/2019/08/20/one-simple-action-you-can-take-to-prevent-99-9-percent-of-account-attacks/) afirma que la MFA puede bloquear más del 99,9% de los ataques de compromiso de cuentas. <a class="seo-article-citation" href="#source-5" aria-label="Source 5">[5]</a>

Las opciones de MFA incluyen códigos de aplicaciones móviles, SMS, llamadas telefónicas, biometría o tokens físicos. Para que sea más cómodo, valora métodos que requieran poca entrada manual, como las verificaciones por llamada o las notificaciones en la aplicación. Por ejemplo, si usas [Microsoft Entra ID](https://www.microsoft.com/en-us/security/business/identity-access/microsoft-entra-id) con la extensión NPS para MFA, puedes elegir llamadas automáticas o notificaciones push para agilizar el proceso.

No implantar MFA puede tener consecuencias graves. Piensa en el incidente de ransomware de [LabCorp](https://www.labcorp.com/): en julio de 2018, un ataque de fuerza bruta contra RDP propagó ransomware a 7.000 sistemas y 1.900 servidores, hasta que LabCorp lo contuvo en 50 minutos, según [CSO Online](https://www.csoonline.com/article/565911/samsam-infected-thousands-of-labcorp-systems-via-brute-force-rdp.html). <a class="seo-article-citation" href="#source-6" aria-label="Source 6">[6]</a> Esto demuestra lo crítica que es la MFA para frenar brechas tan rápidas y devastadoras.

Hay varias formas de integrar la MFA en tu configuración RDP. Puedes usar Microsoft Entra ID con una extensión NPS, soluciones de MFA de terceros, una pasarela RDP con MFA integrada o una VPN compatible con MFA. Además de la seguridad, la MFA ayuda a las organizaciones a cumplir normativas como HIPAA, PCI DSS y el RGPD.

Para reforzar aún más tu MFA, asegúrate de usar TLS 1.2 o superior y activa la autenticación a nivel de red (NLA) para un mejor cifrado. Añadir herramientas de registro y monitorización también te permite seguir los intentos de acceso y detectar actividad sospechosa.

## 2. Mantén actualizado tu software RDP

Usar software desactualizado es como dejar la puerta sin cerrojo: los atacantes saben exactamente dónde buscar los puntos débiles. Cuando tu software RDP no está al día, le das a los ciberdelincuentes una hoja de ruta para explotar vulnerabilidades. Mantenerlo con los últimos parches de seguridad es fundamental, porque los atacantes buscan constantemente vulnerabilidades nuevas que aprovechar.

Los riesgos del software RDP desactualizado son muy reales. Toma como ejemplo la vulnerabilidad CVE-2022-21893, descubierta en enero de 2022. Este fallo permitía a un atacante, sin privilegios elevados, acceder a los sistemas de archivos de otros usuarios conectados, según [Threatpost](https://threatpost.com/windows-bug-rdp-exploit-unprivileged-users/177599/). <a class="seo-article-citation" href="#source-8" aria-label="Source 8">[8]</a> Abría la puerta a brechas en los datos del portapapeles y del sistema de archivos, que podían derivar en violaciones de la privacidad, movimientos no autorizados dentro de las redes o escalada de privilegios. Es solo un caso, pero demuestra que estar al día con las actualizaciones no es opcional: es imprescindible.

Además de corregir vulnerabilidades, las actualizaciones garantizan que tu software admita protocolos de cifrado modernos. Sin ellas, incluso una conexión que parece segura puede quedar peligrosamente expuesta.

### Activa las actualizaciones automáticas

La forma más sencilla de mantenerte seguro: activar las actualizaciones automáticas. Así los parches se aplican en cuanto salen, reduciendo al mínimo la ventana de vulnerabilidad. El proceso varía según el cliente RDP que uses, pero el objetivo es el mismo: mantener tu software seguro, siempre.

Para el **cliente [Microsoft Remote Desktop](https://www.microsoft.com/en-us/d/microsoft-remote-desktop/9wzdncrfj3ps) (versión MSI)**, puedes buscar actualizaciones manualmente abriendo la aplicación Remote Desktop, pulsando los tres puntos de la esquina superior derecha y seleccionando "Acerca de" (About). El cliente buscará actualizaciones y, si hay una disponible, basta con pulsar "Instalar actualización" (Install update) para aplicarla.

Los administradores pueden ajustar las actualizaciones mediante el Registro. La clave `AutomaticUpdates`, situada en `HKLM\Software\Microsoft\MSRDC\Policies`, permite elegir cómo se gestionan:

- **Valor 0**: desactiva por completo las actualizaciones automáticas y las notificaciones.
- **Valor 1**: activa las notificaciones, pero requiere que el usuario instale las actualizaciones.
- **Valor 2** (predeterminado): en instalaciones por usuario, aplica las actualizaciones en silencio en segundo plano cuando el cliente está cerrado, y solo muestra notificaciones cuando está abierto. En instalaciones por equipo solo recibes notificaciones. <a class="seo-article-citation" href="#source-2" aria-label="Source 2">[2]</a>

La **aplicación Microsoft Remote Desktop de Microsoft Store** ya no tiene soporte: llegó al fin de soporte en septiembre de 2025 y ya no está disponible para descargar ni instalar. El sustituto de Microsoft para las conexiones de Azure Virtual Desktop y Windows 365 es **Windows App**. Las conexiones a Remote Desktop Services y a equipos remotos no se ven afectadas por este cambio. Microsoft también dejó de dar soporte al cliente MSI para entornos de nube pública el 27 de marzo de 2026. <a class="seo-article-citation" href="#source-1" aria-label="Source 1">[1]</a>

Una ventaja del RDP integrado de Microsoft Windows es que sus actualizaciones van incluidas en las actualizaciones normales del sistema operativo. Así obtienes una capa extra de seguridad sin esfuerzo adicional.

### Revisa los clientes RDP de terceros

Si usas clientes RDP de terceros, se aplican las mismas reglas: mantenlos actualizados y con soporte. A diferencia del software RDP nativo, muchos clientes de terceros no incluyen actualizaciones automáticas, así que tendrás que comprobar a mano que usas la última versión. El software sin soporte o desactualizado no recibe parches de seguridad, y sus vulnerabilidades conocidas quedan expuestas indefinidamente.

Al elegir un cliente RDP de terceros, prioriza los que siguen estándares de seguridad modernos. Busca compatibilidad con protocolos de cifrado actuales y con la autenticación a nivel de red. Los clientes antiguos o mal mantenidos suelen carecer de estas protecciones críticas y ponen tu sistema en riesgo.

Para reducir la exposición, limita el número de clientes RDP que usas en tu entorno. Estandarizar en un único cliente bien mantenido simplifica la gestión de actualizaciones y reduce los posibles vectores de ataque. Si se identifican vulnerabilidades en clientes de terceros, prioriza los parches de las que tienen exploits públicos, porque son especialmente peligrosas: los atacantes ya disponen de las herramientas para explotarlas.

## 3. Controla el acceso a la red con reglas de cortafuegos

Configurar tu cortafuegos para bloquear las [conexiones RDP](https://dash.stealthrdp.com/index.php?rp=/login) no autorizadas es un paso crítico para proteger tu red. Una configuración sólida del cortafuegos aporta una capa de defensa vital para los servicios RDP. Según los datos de respuesta a incidentes de [Sophos](https://www.sophos.com/en-us/press/press-releases/2024/04/cybercriminals-abuse-remote-desktop-protocol-rdp-90-attacks-handled), **el abuso de RDP apareció en el 90% de los ataques que gestionó en 2023**.

> Las empresas deberían retirar RDP de internet público para reducir el riesgo de ser objetivo de los ciberdelincuentes.
>
> – Ryan Gregory, Coalition

Un cortafuegos puede limitar el acceso a los puertos de escucha del escritorio remoto, como el TCP 3389 predeterminado. Con una configuración correcta, bloqueas el tráfico externo no autorizado y sigues permitiendo que los usuarios aprobados se conecten a tu red.

### Permite el acceso solo desde IP de confianza

Restringir el acceso RDP a direcciones IP o segmentos de red concretos reduce mucho tu superficie de ataque. Así puedes configurarlo en el Firewall de Windows:

- Abre **Seguridad de Windows** (Windows Security) y ve a **Firewall y protección de red** (Firewall and Network Protection) > **Configuración avanzada** (Advanced Settings).
- Localiza la regla "Escritorio remoto - Modo de usuario (TCP de entrada)" (Remote Desktop – User Mode (TCP-In)) y edítala para permitir solo las direcciones IP autorizadas.

Para confirmar qué direcciones IP externas deben tener acceso, usa una herramienta de comprobación de IP.

Revisa y actualiza tu lista de IP de confianza con regularidad, porque las configuraciones de red cambian con el tiempo. Exponer los puertos RDP a todo internet nunca es recomendable. Este filtrado por IP, combinado con una monitorización cuidadosa, forma una base sólida para tu seguridad.

### Cambia el puerto RDP predeterminado

Otra forma eficaz de reforzar la seguridad es cambiar el puerto RDP predeterminado (3389). Aunque no sustituye a otras medidas, puede reducir la exposición a los escaneos automatizados. Los expertos recomiendan elegir un puerto entre **49152 y 65535** para evitar conflictos con otros servicios.

Así puedes cambiar el puerto RDP:

#### Con el Editor del Registro (Registry Editor)

1. Abre el **Editor del Registro** (Registry Editor).
2. Ve a:

   `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp`
3. Busca la entrada `PortNumber`, haz doble clic en ella, elige **Decimal** e introduce tu nuevo número de puerto.
4. Pulsa **Aceptar** y reinicia el servicio Escritorio remoto (o el equipo) para aplicar los cambios.

#### Con PowerShell

- Comprueba el puerto actual con:

  `Get-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp' -name "PortNumber"`
- Actualiza el puerto con:

  `Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp' -name "PortNumber" -Value <new_port>`
- Añade reglas de cortafuegos para el nuevo puerto:

  ```powershell title="PowerShell"
  New-NetFirewallRule -DisplayName "RDP New Port TCP" -Profile Public -Direction Inbound -Action Allow -Protocol TCP -LocalPort <new_port>  
  New-NetFirewallRule -DisplayName "RDP New Port UDP" -Profile Public -Direction Inbound -Action Allow -Protocol UDP -LocalPort <new_port>  
  ```

Una vez cambiado el puerto, crea una regla de entrada coincidente en el Firewall de Windows. Prueba el nuevo puerto conectándote con el formato `IP_address:new_port` (por ejemplo, `192.168.1.1:33091`) y verifica su actividad con este comando:

```
netstat -an | find "<new_port>"
```

### Añade una capa extra con NAT

Usar la traducción de direcciones de red (NAT) es otra opción para proteger tu RDP. Con NAT puedes asignar un puerto externo al puerto RDP interno, lo que añade una capa extra de ocultación y dificulta que los atacantes localicen tu conexión. Combinado con reglas de cortafuegos, este enfoque refuerza tu estrategia general de [seguridad RDP](/es/docs).

## 4. Usa una VPN para un acceso remoto seguro

Una VPN crea un túnel cifrado entre tu dispositivo y la red, de modo que cualquier dato interceptado sigue siendo ilegible. Conectarte a la VPN antes de iniciar la sesión RDP añade una capa de protección frente a posibles ciberataques. Estos son los pasos para habilitar el acceso VPN a tu conexión de escritorio remoto.

### Configura el acceso VPN para RDP

**Elegir tu solución VPN**

Tienes dos opciones principales. Los servicios VPN comerciales como [OpenVPN](https://openvpn.net/), [TunnelBear](https://www.tunnelbear.com/) y [Proton VPN](https://protonvpn.com/?srsltid=AfmBOor8HXnCA2hWvi-oC3wu6rVy1Ltz7ADWnMJHp-JWc0hanxkEcfgA) suelen ser compatibles con RDP sin mucha configuración. Eso sí, algunos servicios pueden necesitar ajustes específicos para funcionar bien.

**Montar tu propio servidor VPN**

Si quieres más control sobre tu seguridad, alojar tu propio servidor VPN es una gran opción. Al gestionarlo tú, puedes personalizar el cifrado, controlar el acceso de los usuarios y aplicar medidas de seguridad a tu medida. Para empezar, elige un proveedor de VPS que admita la instalación de VPN, como [DigitalOcean](https://www.digitalocean.com/), [Linode](https://www.linode.com/) o [AWS](https://aws.amazon.com/). El proceso suele incluir:

- Conectarte a tu VPS por SSH.
- Instalar un software de servidor VPN, como OpenVPN.
- Configurar el acceso para tus dispositivos.

Al configurar el servidor, elige una ubicación cercana a la región de destino para mejorar el rendimiento. Usa siempre un cifrado robusto, como AES de 256 bits, para proteger tus datos.

**Configuraciones de seguridad clave**

Cuando tu VPN esté en marcha, aplica estos pasos para reforzarla:

- Activa la autenticación de dos factores (2FA) en todas las sesiones VPN.
- Restringe el acceso VPN solo a dispositivos autorizados.
- Ajusta tus reglas de cortafuegos para que funcionen bien con la VPN y bloqueen los accesos no autorizados.
- Usa herramientas como [Fail2Ban](https://en.wikipedia.org/wiki/Fail2ban), desactiva el inicio de sesión de root y supervisa los registros con regularidad por si hay actividad inusual.
- Cambia los puertos predeterminados para que tu servidor VPN sea más difícil de localizar para los atacantes.

**Conectarte a través de tu VPN**

## 5. Configura una pasarela RDP

Una pasarela RDP (RDP Gateway) es un punto de control esencial que añade una capa extra de seguridad a tu red. Garantiza que todo el acceso externo a tus sistemas internos esté estrictamente controlado: autentica a los usuarios y cifra el tráfico antes de conceder acceso a recursos concretos.

### Cómo las pasarelas RDP mejoran la seguridad

Las pasarelas RDP redirigen el tráfico de escritorio remoto a través de HTTPS en el puerto 443, en lugar del puerto RDP estándar 3389. Al encapsular RDP sobre HTTPS, este enfoque protege los datos sensibles frente a ataques de intermediario (man-in-the-middle) y mantiene tu red interna protegida. Los usuarios solo pueden acceder a los recursos autorizados, lo que reduce de forma notable las posibles vulnerabilidades.

> RD Gateway encapsula el Protocolo de Escritorio remoto (RDP) dentro de RPC, y este dentro de HTTP sobre una conexión SSL (Secure Sockets Layer). - Microsoft

Otro beneficio clave es la autenticación y la auditoría centralizadas. La pasarela registra y supervisa cada intento de conexión, lo que facilita seguir la actividad de los usuarios y detectar comportamientos extraños. Para aprovecharla al máximo, es fundamental configurar bien sus directivas.

### Consejos para configurar bien la pasarela

Para sacar el máximo partido a tu pasarela RDP, tendrás que configurar las **directivas de autorización de conexión (CAP)** y las **directivas de autorización de recursos (RAP)**:

- **Directivas CAP**: definen quién puede conectarse. Por ejemplo, puedes bloquear cuentas tras varios intentos fallidos de inicio de sesión o restringir el acceso a determinados rangos de IP. Así, solo los dispositivos de confianza pueden iniciar conexiones.
- **Directivas RAP**: controlan a qué recursos pueden acceder los usuarios una vez conectados. Aplicando el principio de mínimo privilegio, limitas el acceso a los recursos necesarios para cada usuario y reduces el daño si una cuenta se ve comprometida.

Otros pasos importantes:

- **Activa la MFA**: añadir autenticación multifactor al acceso a la pasarela refuerza la seguridad.
- **Usa certificados SSL de confianza**: obtenlos de proveedores reconocidos como [DigiCert](https://www.digicert.com/), [GlobalSign](https://www.globalsign.com/en) o [Let's Encrypt](https://letsencrypt.org/). Exige TLS 1.2 o superior, desactiva los algoritmos de cifrado débiles y renueva los certificados con regularidad para mantener las conexiones seguras.
- **Restringe el acceso**: una vez desplegada, limita el acceso a usuarios y sistemas concretos. Asegúrate de que todos los servicios de Escritorio remoto solo acepten conexiones a través de la pasarela RD.
- **Supervisa los registros**: registra todos los intentos de conexión y revísalos con regularidad para detectar anomalías.

> El servidor RD Gateway actúa como intermediario entre el cliente remoto y el RDSH, añadiendo una capa de seguridad al autenticar al usuario y cifrar el tráfico. - Limitless Technology

## 6. Activa el cifrado y los túneles

Para proteger tus sesiones de Protocolo de Escritorio remoto (RDP) frente a interceptaciones o monitorización no autorizadas, el cifrado y los túneles son imprescindibles. Si apilas capas de cifrado, creas un escudo sólido contra el espionaje y los ataques. Un paso clave es reforzar los métodos de autenticación, por ejemplo activando la autenticación a nivel de red (NLA).

### Activa la autenticación a nivel de red (NLA)

La autenticación a nivel de red (NLA) añade una capa de protección al exigir que los usuarios se autentiquen *antes* de que empiece la sesión de escritorio remoto. Así, los usuarios no autorizados ni siquiera llegan a la pantalla de inicio de sesión, lo que la convierte en una barrera de seguridad fundamental.

La NLA ayuda a reducir riesgos como los ataques de fuerza bruta, los intentos de denegación de servicio (DoS) y el robo de credenciales durante la conexión. Además, mejora la eficiencia de los recursos, ya que evita que los intentos no autorizados consuman memoria y CPU del servidor. Para los usuarios legítimos, la NLA admite el inicio de sesión único de Windows (NT Single Sign-On, SSO), lo que hace el acceso más fluido.

Para la máxima seguridad, activa siempre la NLA en tus conexiones RDP. Si la compatibilidad te obliga a desactivarla, compensa con otras medidas de protección, como contraseñas fuertes, cortafuegos bien configurados y controles de acceso estrictos.

### Usa túneles SSH o IPSec

El túnel SSH es otra forma eficaz de proteger tus sesiones RDP. Al encapsular el tráfico RDP en un túnel SSH cifrado, añades una capa extra de seguridad durante la transmisión de datos.

[CloudThat](https://www.cloudthat.com/), socio de AWS y Microsoft, publicó una guía con los pasos para configurar el acceso RDP mediante un túnel SSH con [PuTTY](https://www.putty.org/). Su proceso paso a paso incluye:

- Configurar PuTTY con los datos de tu servidor SSH (por ejemplo, nombre de host, puerto 22 y conexión SSH).
- Configurar el túnel para reenviar un puerto local (por ejemplo, 127.0.0.1:9999) al puerto RDP interno (localhost:3389).
- Mantener activa la sesión SSH y conectarte por RDP usando "localhost:9999".

Como dice Chrissy LeMaire, MVP de SQL y PowerShell:

> Si has estado exponiendo protocolos inseguros a internet, considera envolverlos en los brazos protectores de SSH.

Para más seguridad, usa puertos SSH no predeterminados y reenvíos de puertos internos personalizados para que tu configuración sea menos predecible. Como OpenSSH ya viene integrado en Windows 10, implementar este método es ahora más fácil. También puedes reforzar este enfoque con un bastión o servidor de salto (jump server), que actúa como punto de control adicional y gestiona el acceso a los recursos sensibles dentro de tu red segura. Esta estrategia de túneles en capas refuerza de forma significativa tu seguridad RDP.

## 7. Aplica el modelo Zero Trust

Cuando hablamos de la seguridad RDP moderna, el cifrado y el acceso controlado no bastan por sí solos. Para tratar de verdad los riesgos internos, el enfoque Zero Trust es esencial. Este modelo se rige por una regla sencilla pero poderosa: **"Nunca confíes, verifica siempre"**.

Zero Trust es especialmente crítico en las conexiones RDP, porque las credenciales comprometidas son una vía habitual para entrar en sistemas remotos. A diferencia de los modelos tradicionales, que dependen de proteger el perímetro de la red, Zero Trust exige que cada usuario y dispositivo verifique su identidad, esté donde esté.

### Principios básicos de Zero Trust

Zero Trust refuerza la seguridad RDP centrándose en tres principios fundamentales:

| Principio básico | Descripción |
| --- | --- |
| **Verificar continuamente** | Ningún usuario ni dispositivo es de confianza por defecto. La verificación es constante y se ajusta dinámicamente según los riesgos en tiempo real. |
| **Limitar el radio de impacto** | Minimiza el daño potencial de una brecha restringiendo la capacidad del atacante de moverse dentro de tu red. |
| **Automatizar la recopilación de contexto y la respuesta** | Recopila datos de todo tu entorno de TI y automatiza las respuestas a las amenazas en tiempo real. |

Aplicando estos principios, puedes mejorar de forma significativa tu postura de seguridad RDP.

### Exige verificación continua

Los esquemas RDP tradicionales autentican a los usuarios solo en el inicio de sesión. Zero Trust, en cambio, adopta un enfoque más proactivo y exige **autenticación y validación continuas** durante toda la sesión. Así, incluso con una sesión activa, cada acción se supervisa y se verifica.

Por ejemplo, imagina a un usuario que normalmente trabaja desde Nueva York y de repente empieza a descargar archivos sensibles desde una IP desconocida. Un sistema Zero Trust marcaría esa actividad y pediría una verificación adicional, lo que ayuda a detectar amenazas antes de que escalen.

### Concede el mínimo acceso necesario

Otro pilar de Zero Trust es el principio de mínimo privilegio. Significa que usuarios y aplicaciones solo deben tener acceso a los recursos que necesitan de verdad para su trabajo. Como dice Hubert Brychczynski:

> Zero Trust significa que cada persona de la organización puede ser un posible vector de ataque, intencionadamente o no.

Para aplicar el mínimo privilegio:

- Limita el acceso solo a los recursos necesarios para el rol de cada usuario.
- Elimina los privilegios excesivos o sin uso.
- Mantén el número de cuentas privilegiadas en el mínimo imprescindible.
- Asegúrate de que los permisos NTFS y de los recursos compartidos respeten el mínimo privilegio.

Usa herramientas como [Active Directory](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/get-started/virtual-dc/active-directory-domain-services-overview) y los grupos de Microsoft Entra ID para gestionar y controlar los permisos de forma centralizada. Restringe el acceso RDP a una lista preaprobada de direcciones IP y cuentas de usuario. Además, impide el acceso RDP directo desde redes externas exigiendo una conexión VPN como primer paso.

Para contener mejor las brechas, implementa la **microsegmentación**. Consiste en dividir tu infraestructura en segmentos más pequeños, lo que limita la capacidad de los atacantes para moverse lateralmente por la red. Combínala con políticas de mínimo privilegio y con la monitorización continua de todo el tráfico de red para mantener la visibilidad y detectar amenazas a tiempo.

## Cómo activar el escritorio remoto de forma segura en Windows

:::info

Cada consejo anterior da por hecho que el escritorio remoto solo está activado donde lo necesitas. Windows 10 y Windows 11 Pro, Enterprise y Education pueden aceptar conexiones RDP; las ediciones Home no pueden alojar una sesión. Hay tres formas habituales de activarlo. Sea cual sea la que uses, mantén activada la NLA y limita quién puede conectarse.

:::

### Permite el escritorio remoto en la configuración de Windows 11

En un único equipo, abre **Configuración** (Settings) > **Sistema** (System) > **Escritorio remoto** (Remote Desktop) y activa **Escritorio remoto**. Deja marcada la opción **Requerir que los dispositivos usen la autenticación a nivel de red para conectarse** (Require devices to use Network Level Authentication to connect) y usa **Usuarios de Escritorio remoto** (Remote Desktop users) para añadir solo las cuentas que necesiten acceso. Los administradores pueden conectarse por defecto.

### Activa el escritorio remoto con PowerShell

En un servidor o en un equipo remoto, PowerShell es más rápido. Ejecuta estos comandos en una sesión de PowerShell con privilegios de administrador. El primero permite las conexiones RDP y el segundo abre las reglas integradas del Firewall de Windows para Escritorio remoto:

```powershell title="PowerShell"
Set-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server' -Name "fDenyTSConnections" -Value 0
Enable-NetFirewallRule -DisplayGroup "Remote Desktop"
```

Después, restringe esas reglas de cortafuegos a direcciones de confianza, como se describe en el consejo 3, en lugar de dejar el puerto 3389 abierto a internet.

### Usa la directiva de grupo para activar el escritorio remoto

Para muchos equipos de un dominio, usa directivas de grupo. En el Editor de administración de directivas de grupo (Group Policy Management Editor), ve a **Configuración del equipo** (Computer Configuration) > **Plantillas administrativas** (Administrative Templates) > **Componentes de Windows** (Windows Components) > **Servicios de Escritorio remoto** (Remote Desktop Services) > **Host de sesión de Escritorio remoto** (Remote Desktop Session Host) > **Conexiones** (Connections) y activa **Permitir a los usuarios conectarse de forma remota mediante Servicios de Escritorio remoto** (Allow users to connect remotely by using Remote Desktop Services). En **Seguridad** (Security), dentro de la misma rama, activa **Requerir autenticación de usuario para conexiones remotas mediante autenticación a nivel de red** (Require user authentication for remote connections by using Network Level Authentication). <a class="seo-article-citation" href="#source-3" aria-label="Source 3">[3]</a> <a class="seo-article-citation" href="#source-4" aria-label="Source 4">[4]</a> Combina la directiva con una regla de cortafuegos que solo permita tu red de administración o el rango de la VPN.

Si ejecutas Windows en un [VPS con Windows](/es/windows-vps), los pasos son los mismos. Cambia la contraseña de administrador en el primer inicio de sesión y restringe RDP a las direcciones desde las que te conectas.

## Conclusión: refuerza la seguridad del escritorio remoto

El Protocolo de Escritorio remoto (RDP) es una herramienta muy útil, pero conlleva riesgos de seguridad importantes. Teniendo en cuenta que el abuso de RDP apareció en el 90% de los ataques que Sophos gestionó en 2023, las siete medidas que hemos visto en esta guía son imprescindibles para defenderse de amenazas cada vez más sofisticadas.

Las estadísticas recientes subrayan la urgencia: el [Informe de investigaciones sobre brechas de datos 2026 (DBIR) de Verizon](https://www.verizon.com/business/resources/executivebriefs/2026-dbir-executive-summary.pdf) reveló que el factor humano estuvo presente en el 62% de las brechas, frente al 60% del año anterior. <a class="seo-article-citation" href="#source-9" aria-label="Source 9">[9]</a> Lo bueno es que muchas de estas brechas se pueden evitar con las precauciones adecuadas y con concienciación.

Al adoptar prácticas clave como la autenticación sólida, las actualizaciones periódicas, el control del acceso a la red, las VPN, las pasarelas RDP, el cifrado y los principios Zero Trust, creas varias capas de protección para tu acceso remoto. Cada paso refuerza tus defensas:

- **La autenticación sólida** frena los ataques de fuerza bruta desde el principio.
- **Las actualizaciones periódicas** eliminan las vulnerabilidades que los hackers suelen explotar.
- **Los cortafuegos y las VPN** garantizan conexiones seguras y privadas.
- **Las pasarelas RDP** añaden un escudo extra de seguridad de nivel empresarial.
- **El cifrado** mantiene tus datos ilegibles para los usuarios no autorizados.
- **Los principios Zero Trust** verifican cada intento de acceso y no dejan lugar a la confianza ciega.

El panorama de amenazas evoluciona a una velocidad vertiginosa. Van desde los virus tradicionales hasta ataques avanzados que aprovechan el phishing, el malware e incluso herramientas basadas en IA. Los ataques de ransomware, impulsados por el auge del ransomware como servicio (RaaS), son cada vez más complejos y costosos.

Estas buenas prácticas, combinadas, crean un sistema de defensa en capas mucho más difícil de vulnerar. Una buena combinación de autenticación multifactor, actualizaciones de software, configuraciones de red seguras y principios Zero Trust convierte tu configuración RDP en una fortaleza capaz de resistir incluso ataques sofisticados.

No esperes: toma medidas ya para proteger tu conexión RDP. Revisa y actualiza los permisos de acceso con regularidad, supervisa la actividad de los usuarios por si hay patrones inusuales y forma a tu equipo en políticas de ciberseguridad, amenazas emergentes y cómo detectar intentos de phishing. Aplicar estas medidas de forma constante te mantiene por delante de los actores maliciosos y protege a tu organización frente a las amenazas actuales y futuras.

## Preguntas frecuentes

<h3 id="why-does-changing-the-default-rdp-port-improve-security-against-cyberattacks" data-faq-q>¿Por qué cambiar el puerto RDP predeterminado mejora la seguridad frente a los ciberataques?</h3>

<h2 id="changing-the-default-rdp-port">Cambiar el puerto RDP predeterminado</h2>

Cambiar el puerto predeterminado del Protocolo de Escritorio remoto (RDP) de **3389** a uno no estándar puede dificultar que los atacantes encuentren tu servicio de escritorio remoto y lo ataquen. Como el puerto 3389 es muy conocido y los escáneres automatizados lo revisan con frecuencia, cambiarlo reduce la visibilidad de tu conexión RDP y hace menos probables los ataques de fuerza bruta o los intentos de acceso no autorizado.

Este enfoque, a menudo llamado "seguridad por oscuridad", no debería ser tu única línea de defensa. Sin embargo, combinado con medidas como cortafuegos, contraseñas fuertes y autenticación multifactor, añade una capa extra de protección a tu sistema.

<h3 id="why-should-i-use-a-vpn-with-remote-desktop-and-how-does-it-enhance-security" data-faq-q>¿Por qué debo usar una VPN con el escritorio remoto y cómo mejora la seguridad?</h3>

Usar una **VPN** junto con el escritorio remoto añade una capa de seguridad sólida al cifrar tu conexión. Ese cifrado protege tus datos frente a interceptaciones o accesos no autorizados y mantiene a salvo el tráfico RDP mientras viaja por una red privada. Así se reduce de forma notable el riesgo de amenazas como el hackeo o el espionaje de comunicaciones.

Otra ventaja de la VPN es que oculta tu dirección IP, lo que aporta una capa adicional de privacidad. Así resulta mucho más difícil que los atacantes localicen o ataquen tu sistema. Combinar una VPN con RDP te permite acceder de forma segura a información sensible y proteger tanto tus datos como tu privacidad. Es una forma inteligente y eficaz de proteger las conexiones remotas.

<h3 id="what-is-zero-trust-security-and-how-does-it-help-protect-remote-desktop-protocol-rdp-connections" data-faq-q>¿Qué es la seguridad Zero Trust y cómo ayuda a proteger las conexiones del Protocolo de Escritorio remoto (RDP)?</h3>

Zero Trust es un modelo que exige una verificación estricta de la identidad de cada usuario y dispositivo que intenta acceder a un sistema, esté dentro o fuera de la red de la organización. Sigue el principio **"nunca confíes, verifica siempre"**, de modo que nadie es de confianza automáticamente.

En las conexiones RDP, Zero Trust eleva la seguridad un paso más al verificar continuamente la identidad de los usuarios y comprobar que los dispositivos cumplen los requisitos de conformidad. El acceso se controla estrictamente según el **principio de mínimo privilegio**, es decir, los usuarios solo acceden a los recursos que necesitan para sus tareas concretas. Incluso después de iniciar sesión, su actividad se supervisa de cerca para detectar y prevenir accesos no autorizados o el movimiento lateral por la red. Este método reduce mucho las vulnerabilidades potenciales y refuerza las defensas frente a las amenazas que apuntan a los entornos de escritorio remoto.
