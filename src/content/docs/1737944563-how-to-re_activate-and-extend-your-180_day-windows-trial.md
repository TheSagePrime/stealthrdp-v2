---
order: 1
title: How to Extend the Windows Server 180-Day Evaluation Period
category: Windows
date: Jan 28, 2025
sourceTitle: How to Re-activate and Extend Your 180-Day Windows Trial
sourceUrl: https://docs.stealthrdp.com/hc/stealth-rdp-docs/articles/1737944563-how-to-re_activate-and-extend-your-180_day-windows-trial
migration:
  source: Verified StealthRDP documentation snapshot
  date: 2026-08-13
  redactions:
    - example endpoint placeholder redacted
summary: Rearm the Windows Server evaluation period with slmgr -rearm, then check remaining time with slmgr -dlv.
relatedSlugs: []
---
How to Extend the Windows Server 180-Day Evaluation Period

How to Extend the Windows Server 180-Day Evaluation Period
===========================================================

Last updated on Jan 28, 2025

## Step 1: Open PowerShell as Administrator

To begin, you need to run commands with administrator privileges. Here's how:

1.  Press the **Windows key**, type **PowerShell**, and when it appears, right-click on it.

2.  Select **Run as administrator** from the context menu.


## Step 2: Run the Re-arm Command

Once PowerShell is open with administrative privileges, enter the following command to re-arm the evaluation period:

    slmgr -rearm

This command resets the 180-day evaluation timer where Microsoft permits rearming on the installed Evaluation edition.

Note: Rearming resets the evaluation activation timer where supported by Microsoft. It does not convert an Evaluation edition into a licensed production edition.

## Step 3: Reboot Your System

To complete the process, reboot your computer for the changes to take effect. A restart is necessary for the re-arm to be fully implemented.

## Step 4: Check Evaluation Status

After rebooting, you can check the remaining evaluation period and rearm count by using the following command in PowerShell:

    slmgr -dlv

This command displays detailed evaluation status, including the number of re-arms remaining and how much time is left on the evaluation period.

## Step 5: Optional — Activate only with a valid license key

This step is not part of extending the evaluation period. StealthRDP does not provide Microsoft licence keys or Windows licences. The command below is a Microsoft activation command. It does not mean StealthRDP supplies a licence.

StealthRDP does not supply licence keys. The following Microsoft command is shown only as a technical reference:

    slmgr -ato

This Microsoft command attempts activation. It does not mean StealthRDP provided a licence.

* * *

These steps rearm or extend the Microsoft evaluation period where the installed Evaluation edition supports it. They do not activate Windows, supply a commercial license, or authorize production use. For production workloads, customers must obtain appropriate Microsoft licensing. StealthRDP does not supply that licensing.

If you have any issues or need further assistance, contact our support team.

* * *

See [Windows licensing](/docs/windows-licensing). StealthRDP provides the infrastructure only and does not supply Microsoft Windows licences. Customers using Windows are responsible for their own licensing compliance.
