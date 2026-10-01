---
order: 1
title: 'Windows Server Rearm: Extend the Evaluation'
category: Windows
date: Jan 28, 2025
sourceTitle: How to Re-activate and Extend Your 180-Day Windows Trial
sourceUrl: https://docs.stealthrdp.com/hc/stealth-rdp-docs/articles/1737944563-how-to-re_activate-and-extend-your-180_day-windows-trial
migration:
  source: Verified StealthRDP documentation snapshot
  date: 2026-08-13
  redactions:
    - example endpoint placeholder redacted
summary: Use slmgr /rearm to reset the Windows Server 180-day evaluation, check the rearm count with slmgr /dlv, and see what happens when it expires.
relatedSlugs: []
---
Windows Server Rearm: Extend the Evaluation

Last updated on Oct 1, 2026

Windows Server evaluation editions run for 180 days. You can reset that timer with the `slmgr -rearm` command a limited number of times. This guide shows the commands, how to check the rearm count, and what happens when the evaluation expires.

## Step 1: Open PowerShell as Administrator

To begin, you need to run commands with administrator privileges. Here's how:

1.  Press the **Windows key**, type **PowerShell**, and when it appears, right-click on it.

2.  Select **Run as administrator** from the context menu.


## Step 2: Run the Re-arm Command

Once PowerShell is open with administrative privileges, enter the following command to re-arm the evaluation period:

```powershell
slmgr -rearm
```

`slmgr /rearm` is the same command. Windows accepts both the dash and the slash form.

This command resets the 180-day evaluation timer where Microsoft permits rearming on the installed Evaluation edition.

Note: Rearming resets the evaluation activation timer where supported by Microsoft. It does not convert an Evaluation edition into a licensed production edition.

## Step 3: Reboot Your System

To complete the process, reboot your computer for the changes to take effect. A restart is necessary for the re-arm to be fully implemented.

## Step 4: Check Evaluation Status

After rebooting, you can check the remaining evaluation period and rearm count by using the following command in PowerShell:

```powershell
slmgr -dlv
```

This command displays detailed evaluation status, including the number of re-arms remaining and how much time is left on the evaluation period.

In the output, read two lines:

- **Remaining Windows rearm count** shows how many more times you can run `slmgr -rearm`. When it reaches 0, the evaluation cannot be extended again.
- **Timebased activation expiration** shows how much evaluation time is left.

## What happens when the Windows Server evaluation expires?

When the evaluation period ends and no rearm is left, Windows Server shows activation warnings and the server can stop on its own. If your server stops at random times, check the evaluation status first with `slmgr -dlv`. The [server stops randomly](/docs/server-stops-randomly) article covers this case.

To keep a server in production, use an appropriate Microsoft licence instead of rearming. See [Windows licensing](/docs/windows-licensing).

## Step 5: Optional — Activate only with a valid license key

This step is not part of extending the evaluation period. StealthRDP does not provide Microsoft licence keys or Windows licences. The command below is a Microsoft activation command. It does not mean StealthRDP supplies a licence.

StealthRDP does not supply licence keys. The following Microsoft command is shown only as a technical reference:

```powershell
slmgr -ato
```

This Microsoft command attempts activation. It does not mean StealthRDP provided a licence.

* * *

These steps rearm or extend the Microsoft evaluation period where the installed Evaluation edition supports it. They do not activate Windows, supply a commercial license, or authorize production use. For production workloads, customers must obtain appropriate Microsoft licensing. StealthRDP does not supply that licensing.

If you have any issues or need further assistance, contact our support team.

* * *

See [Windows licensing](/docs/windows-licensing). StealthRDP provides the infrastructure only and does not supply Microsoft Windows licences. Customers using Windows are responsible for their own licensing compliance.
