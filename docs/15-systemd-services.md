# 15 — systemd & Services

[⬅ Back to course outline](../README.md) | Previous: [Scheduling: cron & at](14-scheduling-cron.md) | Next: [Logs & Troubleshooting ➡](16-logs-troubleshooting.md)

## What is systemd?

`systemd` is the **init system** used by most modern Linux distributions (Ubuntu, Fedora, Debian, Arch, RHEL) — it's **PID 1**, the first process the kernel starts, responsible for bringing the rest of the system up: starting services, mounting filesystems, and managing dependencies between them.

## `systemctl` — control services

```bash
sudo systemctl start nginx           # start a service now
sudo systemctl stop nginx               # stop a service
sudo systemctl restart nginx              # stop then start
sudo systemctl reload nginx                 # reload config without restarting (if supported)
sudo systemctl enable nginx                   # start automatically at boot
sudo systemctl disable nginx                    # don't start at boot
sudo systemctl enable --now nginx                 # enable AND start in one command

systemctl status nginx           # current state, recent logs, PID
systemctl is-active nginx           # just "active" or "inactive"
systemctl is-enabled nginx            # is it set to start at boot?
systemctl list-units --type=service      # list all loaded services
systemctl list-unit-files --state=enabled  # list services enabled at boot
```

## Reading `systemctl status` output

```
● nginx.service - A high performance web server
     Loaded: loaded (/lib/systemd/system/nginx.service; enabled)
     Active: active (running) since Mon 2024-01-01 09:00:00 UTC; 2h ago
   Main PID: 1234 (nginx)
      Tasks: 5
     Memory: 12.3M
```

- `Loaded` — whether the unit file was found and whether it's enabled at boot
- `Active` — current runtime state
- `Main PID` — the primary process for this service

## Writing a custom unit file

Create `/etc/systemd/system/myapp.service`:

```ini
[Unit]
Description=My Application
After=network.target

[Service]
ExecStart=/usr/bin/python3 /opt/myapp/app.py
Restart=on-failure
User=myappuser
WorkingDirectory=/opt/myapp

[Install]
WantedBy=multi-user.target
```

Then:

```bash
sudo systemctl daemon-reload        # reload systemd's config after editing unit files
sudo systemctl enable --now myapp     # enable at boot + start now
```

## systemd timers (cron alternative)

`myapp.timer`:

```ini
[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
```

```bash
sudo systemctl enable --now myapp.timer
systemctl list-timers
```

## Targets (like old "runlevels")

| Target | Roughly equivalent to |
|---|---|
| `poweroff.target` | Shutdown |
| `rescue.target` | Single-user/recovery mode |
| `multi-user.target` | Normal multi-user mode, no GUI |
| `graphical.target` | Multi-user + GUI |
| `reboot.target` | Reboot |

```bash
systemctl get-default            # show the default boot target
sudo systemctl set-default multi-user.target
sudo systemctl isolate rescue.target   # switch targets immediately (careful!)
```

---
Next: [16 — Logs & Troubleshooting ➡](16-logs-troubleshooting.md)
