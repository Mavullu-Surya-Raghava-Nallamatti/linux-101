# 16 — Logs & Troubleshooting

[⬅ Back to course outline](../README.md) | Previous: [systemd & Services](15-systemd-services.md)

## Where logs live

| Location | Contents |
|---|---|
| `/var/log/syslog` (Debian/Ubuntu) or `/var/log/messages` (RHEL) | General system messages |
| `/var/log/auth.log` (Debian) or `/var/log/secure` (RHEL) | Authentication/login attempts, sudo usage |
| `/var/log/kern.log` | Kernel messages |
| `/var/log/dmesg` | Boot-time kernel ring buffer messages |
| `/var/log/dpkg.log` / `/var/log/yum.log` | Package install/upgrade history |
| `/var/log/nginx/`, `/var/log/apache2/` | Application-specific logs |

## `journalctl` — the systemd log viewer

On systemd systems, most logs (including kernel and service output) flow into the **journal**, viewable with `journalctl`.

```bash
journalctl                          # view the entire journal (oldest first)
journalctl -e                         # jump to the end (most recent)
journalctl -f                           # follow live, like `tail -f`
journalctl -u nginx                       # logs for a specific service/unit
journalctl -u nginx -f                      # follow logs for one service live
journalctl --since "1 hour ago"                # time-filtered
journalctl --since "2024-01-01" --until "2024-01-02"
journalctl -p err                                 # only error-level and above
journalctl -k                                       # kernel messages only (like dmesg)
journalctl --disk-usage                               # how much space the journal is using
sudo journalctl --vacuum-time=2weeks                     # trim old journal entries
```

## `dmesg` — kernel ring buffer

```bash
dmesg                     # all kernel messages since boot
dmesg | tail -50             # most recent 50 lines
dmesg -T                       # human-readable timestamps
dmesg | grep -i error             # search for errors (e.g. hardware/driver issues)
dmesg --level=err,warn               # filter by severity
```

## General troubleshooting workflow

1. **Identify the symptom** — what's failing, and what's the exact error message?
2. **Check the service status** — `systemctl status <service>` (look at `Active` and recent log lines).
3. **Read the logs** — `journalctl -u <service> -e` or the app's log file in `/var/log/`.
4. **Check resource pressure** — `df -h` (disk full?), `free -h` (out of memory?), `top`/`htop` (CPU pegged?).
5. **Check permissions** — is the process/user allowed to read/write the files/ports it needs? (`ls -l`, `id`)
6. **Check network** — can it reach what it needs? `ping`, `curl`, `ss -tulpn` for port conflicts.
7. **Check recent changes** — did a package update, config edit, or deploy happen recently? `dpkg.log`/`yum.log`, `history`.
8. **Reproduce minimally** — isolate the smallest command/config that triggers the issue.

## Useful one-liners for debugging

```bash
tail -f /var/log/syslog | grep -i error         # watch for errors live
find / -xdev -size +100M 2>/dev/null              # find large files eating disk space
lsof -i :80                                          # what's using port 80
ss -tulpn | grep LISTEN                                # all listening ports
systemctl --failed                                       # list all failed systemd units
dmesg -T | grep -i "out of memory"                          # check for OOM killer events
```

## Checking exit codes & command success

```bash
some_command
echo $?          # 0 = success; non-zero = failure (see man page for meaning)
```

## Where to go next

With these 16 modules, you have the foundation to operate confidently on any Linux system: understanding the kernel, navigating the filesystem, managing files/permissions/processes/users, installing software, working the network, editing/processing text, scripting automation, scheduling tasks, and diagnosing problems through logs.

Recommended next steps:
- Practice on a real system (a VM, a cloud instance, or WSL) rather than just reading.
- Read man pages for commands you use often (`man <command>`) — they always have more detail than any cheat sheet.
- Learn a specific distro's ecosystem in depth (Ubuntu Server, or RHEL-family for enterprise/certifications like RHCSA).

---
[⬅ Back to course outline](../README.md)
