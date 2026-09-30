---
order: 13
title: How to Force HTTPS using .htaccess
category: Web panels
date: Jan 27, 2025
sourceTitle: How to Force HTTPS using .htaccess
sourceUrl: https://docs.stealthrdp.com/hc/stealth-rdp-docs/articles/1737945947-how-to-force-https-using-htaccess
migration:
  source: Verified StealthRDP documentation snapshot
  date: 2026-08-13
  redactions:
    - example endpoint placeholder redacted
summary: What is an SSL and why do you need it?
relatedSlugs: []
---
How to Force HTTPS using .htaccess

How to Force HTTPS using .htaccess
==================================

Last updated on Jan 27, 2025

What is an SSL and why do you need it?
--------------------------------------

SSL stands for Secure Sockets Layer, a security protocol that creates an encrypted link between a web server and a web browser. Companies and organizations need to add SSL certificates to their websites to secure online transactions and keep customer information private and secure

After installing an SSL certificate, your website is available over HTTP and HTTPS. However, it’s better to use only the latter because it encrypts and secures your website’s data

Forcing HTTPS on All Traffic
----------------------------

**1**

Go to **File Manager** in your hosting panel and open .htaccess inside the **public\_html** folder. If you can’t locate it, make sure to create or unhide it

**2**

Scroll down to find **RewriteEngine** On and insert the following lines of code below it:

**RewriteEngine On** **RewriteCond %{HTTPS} off** **RewriteRule ^(.\*)$ https://%{HTTP\_HOST}%{REQUEST\_URI} \[L,R=301\]** **3**

Save the **changes**

Forcing HTTPS on a Specific Domain
----------------------------------

Let’s say that you have two domains: **http://yourdomain1.com** and **http://yourdomain2.com** Both domains access the same website, but you only want the first one to be redirected to the HTTPS version. In this case, you need to use the following code:

**RewriteEngine On** **RewriteCond %{HTTP\_HOST} ^yourdomain1.com \[NC\]** **RewriteCond %{HTTPS} off** **RewriteRule ^(.\*)$ https://%{HTTP\_HOST}%{REQUEST\_URI} \[R=301,L\]**

Make sure to replace **yourdomain1** with the actual domain you’re trying to force HTTPS on.

Forcing HTTPS on a Specific Folder
----------------------------------

The **.htaccess** file can also be used to force HTTPS on specific folders. However, the file should be placed in the folder that will have the HTTPS connection

**RewriteEngine On** **RewriteCond %{HTTPS} off** **RewriteRule ^(folder1|folder2|folder3) https://%{HTTP\_HOST}%{REQUEST\_URI} \[R=301,L\]** **Make sure to change the folder references to the actual directory names.**

After making the changes, clear your browser’s cache and try to connect to your site via HTTP. If everything was added correctly, the browser will redirect you to the HTTPS version.