# linux-101

A comprehensive, beginner-to-advanced course for learning Linux — covering what Linux and the kernel actually are, the filesystem hierarchy (what every folder means), and commands organized by category with practical examples.

## 🎮 Practice app (live on GitHub Pages)

**[➡ Open the practice app](https://mavullu-surya-raghava-nallamatti.github.io/linux-101/)**

A companion static web app (`index.html` + `assets/`) lets you quiz yourself on every module and practice real command syntax in a safe, simulated terminal — all client-side, no backend required. Progress is saved in your browser (`localStorage`).

If the link above 404s, GitHub Pages hasn't been enabled yet for this repo:
1. Go to **Settings → Pages** on GitHub.
2. Under **Build and deployment**, set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`.
3. Save — the app will be live at the URL above within a minute or two.

## How to use this course

Go through the modules in order if you're starting from zero. Each module is self-contained, so you can also jump straight to the topic you need (e.g. "networking commands"). Use the practice app above to reinforce each module with a quiz and hands-on terminal tasks.

## Course outline

| # | Module | What you'll learn |
|---|--------|--------------------|
| 01 | [Introduction to Linux & the Kernel](docs/01-introduction.md) | What Linux is, history, distributions, kernel vs OS, how the kernel works |
| 02 | [Filesystem Hierarchy Standard](docs/02-filesystem-hierarchy.md) | What every top-level folder (`/etc`, `/var`, `/usr`, etc.) means and holds |
| 03 | [Shell Basics & the Terminal](docs/03-shell-basics.md) | Shells, prompts, PATH, navigation, shortcuts, getting help |
| 04 | [File & Directory Commands](docs/04-file-directory-commands.md) | `ls`, `cd`, `cp`, `mv`, `rm`, `find`, `ln`, and more |
| 05 | [Permissions & Ownership](docs/05-permissions-ownership.md) | `chmod`, `chown`, `chgrp`, umask, special permissions |
| 06 | [Process Management](docs/06-process-management.md) | `ps`, `top`, `htop`, `kill`, jobs, signals |
| 07 | [Package Management](docs/07-package-management.md) | `apt`, `dnf/yum`, `pacman`, `snap`, building from source |
| 08 | [Users & Groups](docs/08-users-groups.md) | `useradd`, `passwd`, `sudo`, `/etc/passwd`, `/etc/shadow` |
| 09 | [Networking](docs/09-networking.md) | `ip`, `ping`, `curl`, `ssh`, `scp`, firewall basics |
| 10 | [Text Processing & Editors](docs/10-text-processing.md) | `grep`, `sed`, `awk`, `cat`, `vim`, `nano` |
| 11 | [Monitoring & Disk Usage](docs/11-monitoring-disk.md) | `df`, `du`, `free`, `uptime`, `vmstat`, `iostat` |
| 12 | [Archiving & Compression](docs/12-archiving-compression.md) | `tar`, `gzip`, `zip`, `rsync` |
| 13 | [Shell Scripting Basics](docs/13-shell-scripting.md) | Variables, loops, conditionals, functions, exit codes |
| 14 | [Scheduling: cron & at](docs/14-scheduling-cron.md) | `crontab`, `at`, `systemd` timers |
| 15 | [systemd & Services](docs/15-systemd-services.md) | `systemctl`, `journalctl`, writing a unit file |
| 16 | [Logs & Troubleshooting](docs/16-logs-troubleshooting.md) | `/var/log`, `dmesg`, `journalctl`, debugging workflow |

## Quick command-category cheat sheet

- **Navigation**: `pwd`, `cd`, `ls`, `tree`
- **File ops**: `cp`, `mv`, `rm`, `mkdir`, `rmdir`, `touch`, `find`, `ln`
- **Viewing/editing files**: `cat`, `less`, `more`, `head`, `tail`, `vim`, `nano`
- **Permissions**: `chmod`, `chown`, `chgrp`, `umask`
- **Processes**: `ps`, `top`, `htop`, `kill`, `killall`, `nice`, `jobs`, `bg`, `fg`
- **Package management**: `apt`, `dnf`, `yum`, `pacman`, `snap`, `flatpak`
- **Users/groups**: `whoami`, `id`, `useradd`, `usermod`, `passwd`, `groups`, `sudo`
- **Networking**: `ip`, `ifconfig`, `ping`, `curl`, `wget`, `ssh`, `scp`, `netstat`, `ss`
- **Text processing**: `grep`, `sed`, `awk`, `cut`, `sort`, `uniq`, `wc`, `tr`
- **Disk/monitoring**: `df`, `du`, `free`, `top`, `uptime`, `mount`, `lsblk`
- **Archiving**: `tar`, `gzip`, `gunzip`, `zip`, `unzip`, `rsync`
- **System info**: `uname`, `hostnamectl`, `lscpu`, `lsusb`, `lspci`

See the linked modules above for full explanations and examples of each command.
