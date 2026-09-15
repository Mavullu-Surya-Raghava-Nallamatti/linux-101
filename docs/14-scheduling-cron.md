# 14 — Scheduling: cron & at

[⬅ Back to course outline](../README.md) | Previous: [Shell Scripting Basics](13-shell-scripting.md) | Next: [systemd & Services ➡](15-systemd-services.md)

## `cron` — recurring scheduled tasks

`cron` runs commands automatically on a repeating schedule, driven by a **crontab** (cron table).

```bash
crontab -l          # list your current cron jobs
crontab -e            # edit your crontab (opens in your default editor)
crontab -r              # remove all your cron jobs
sudo crontab -u alice -l   # view another user's crontab (as root)
```

### Crontab syntax

```
* * * * * command-to-run
│ │ │ │ │
│ │ │ │ └── day of week (0-6, Sunday=0)
│ │ │ └──── month (1-12)
│ │ └────── day of month (1-31)
│ └──────── hour (0-23)
└────────── minute (0-59)
```

Examples:

```cron
0 2 * * *        /home/alice/backup.sh          # every day at 2:00 AM
*/15 * * * *      /home/alice/check.sh              # every 15 minutes
0 9 * * 1-5         /home/alice/weekday_report.sh       # 9 AM, Monday-Friday
0 0 1 * *              /home/alice/monthly_cleanup.sh      # midnight on the 1st of each month
@reboot                  /home/alice/on_startup.sh              # once, at system boot
```

Shortcuts: `@reboot`, `@yearly`, `@monthly`, `@weekly`, `@daily`, `@hourly`.

### System-wide cron locations

| Location | Purpose |
|---|---|
| `/etc/crontab` | System-wide crontab (includes a username field) |
| `/etc/cron.d/` | Drop-in system cron job files |
| `/etc/cron.daily/`, `.hourly/`, `.weekly/`, `.monthly/` | Scripts run automatically at that interval |
| `/var/spool/cron/crontabs/<user>` | Per-user crontabs (edited via `crontab -e`) |

### Tips

- Cron jobs run with a **minimal environment** (no full `PATH`, no shell profile) — use absolute paths in scripts.
- Redirect output to a log so failures aren't silently lost: `0 2 * * * /home/alice/backup.sh >> /var/log/backup.log 2>&1`

## `at` — one-time scheduled tasks

```bash
at 10:00 PM                  # schedule an interactive one-off job
at> /home/alice/notify.sh
at> <Ctrl+D>                    # finish input

echo "/home/alice/task.sh" | at now + 30 minutes   # schedule directly
atq                                                   # list pending 'at' jobs
atrm 3                                                  # cancel job number 3
```

## Modern alternative: systemd timers

`systemd` timers can replace cron with better logging (via `journalctl`) and dependency management — see the next module for details.

```bash
systemctl list-timers          # list active systemd timers
```

---
Next: [15 — systemd & Services ➡](15-systemd-services.md)
