---
order: 21
title: Fix WinRM and Install .NET Framework
category: Server management
date: Mar 17, 2025
sourceTitle: Step-by-Step Guide to Fix WinRM and Install .NET Framework
sourceUrl: https://docs.stealthrdp.com/hc/stealth-rdp-docs/articles/1742181117-step_by_step-guide-to-fix-win_rm-and-install-net-framework
migration:
  source: Verified StealthRDP documentation snapshot
  date: 2026-08-13
  redactions:
    - example endpoint placeholder redacted
summary: "Follow these steps to configure WinRM and resolve the .NET Framework installation issue:"
relatedSlugs: []
---
Fix WinRM and Install .NET Framework

Fix WinRM and Install .NET Framework
====================================

Last updated on Mar 17, 2025

## **Fix WinRM and Install .NET Framework**

Follow these steps to configure WinRM and resolve the .NET Framework installation issue:

### **Step 1: Open Command Prompt as Administrator**

1.  Press `Windows + X` and select **Command Prompt (Admin)** or **Windows PowerShell (Admin)** from the menu.
    
2.  If prompted by User Account Control (UAC), click **Yes** to proceed.
    

### **Step 2: Check the Current WinRM Configuration**

1.  In the Command Prompt window, type the following command and press **Enter**:
    

```cmd
winrm get winrm/config
```
        
    
2.  This command will display the current configuration of WinRM. Look for any errors or misconfigurations in the output.
    

### **Step 3: Configure WinRM (Recommended)**

If the output indicates that WinRM isn’t configured properly, you can quickly configure it by running the following command:


```cmd
winrm quickconfig
```
    

*   This command will set up WinRM with default settings, including enabling the WinRM service and creating a firewall exception.
    
*   Follow the on-screen prompts to complete the configuration.
    

### **Step 4: Verify WinRM is Running**

1.  After configuring WinRM, verify that it’s running by executing the following command:
    

```cmd
winrm enumerate winrm/config/listener
```
        
    
2.  This command should return details about the WinRM listener. If it doesn’t, there may still be an issue with the configuration.
    

### **Step 5: Retry the .NET Framework Installation**

1.  Once WinRM is configured correctly, retry installing the .NET Framework.
    
2.  The installation should now proceed without any issues related to WinRM.
    

* * *

Regards - [StealthRDP](/)
 Team 💙