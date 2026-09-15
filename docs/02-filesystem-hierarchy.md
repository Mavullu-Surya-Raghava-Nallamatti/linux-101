# 02 — Filesystem Hierarchy Standard (FHS)

[⬅ Back to course outline](../README.md) | Previous: [Introduction](01-introduction.md) | Next: [Shell Basics ➡](03-shell-basics.md)

Linux organizes everything as files under a **single root directory**, `/` — there are no drive letters like `C:\`. Every disk, partition, or device gets **mounted** onto a directory within this tree. This layout is standardized as the **Filesystem Hierarchy Standard (FHS)**.

## The tree, at a glance

```
/
├── bin -> usr/bin      # essential user command binaries
├── boot                # bootloader files, kernel images
├── dev                 # device files
├── etc                 # system-wide configuration files
├── home                # personal directories for regular users
├── lib -> usr/lib       # essential shared libraries
├── media                # auto-mounted removable media (USB, CD)
├── mnt                  # temporary manual mount point
├── opt                  # optional/third-party software
├── proc                 # virtual filesystem: kernel & process info
├── root                  # home directory of the root user
├── run                   # runtime data since last boot
├── sbin -> usr/sbin      # essential system binaries (admin commands)
├── srv                   # data for services hosted on this system
├── sys                    # virtual filesystem: kernel/device info
├── tmp                    # temporary files, cleared on reboot
├── usr                    # user programs, libraries, docs (bulk of the system)
└── var                    # variable data: logs, caches, spool, databases
```

## Folder-by-folder explanation

| Folder | Meaning |
|---|---|
| `/` | The **root** directory — the top of the entire filesystem tree. Everything is a child of `/`. |
| `/bin` | Essential command binaries needed by all users, even in single-user mode (e.g. `ls`, `cp`, `cat`). On modern distros it's a symlink to `/usr/bin`. |
| `/boot` | Files needed to boot the system: the Linux kernel (`vmlinuz`), initial ramdisk (`initrd`/`initramfs`), and bootloader config (GRUB). |
| `/dev` | **Device files** — represents hardware (disks, terminals, USB) as files, e.g. `/dev/sda` (first disk), `/dev/null`, `/dev/tty`. Managed by `udev`. |
| `/etc` | **Configuration files** for the system and installed applications (no binaries). E.g. `/etc/passwd`, `/etc/fstab`, `/etc/ssh/sshd_config`. Name historically means "et cetera". |
| `/home` | Each regular user gets a subdirectory here, e.g. `/home/alice`, for personal files and configs. |
| `/lib` | Essential shared libraries needed by binaries in `/bin` and `/sbin` (like `.dll` equivalents). Usually symlinked to `/usr/lib`. |
| `/media` | Mount points for removable media automatically mounted by the desktop (USB drives, DVDs). |
| `/mnt` | Conventional, empty directory for **temporarily** mounting filesystems manually (`mount /dev/sdb1 /mnt`). |
| `/opt` | Optional, self-contained third-party software packages (e.g. some vendor apps install here instead of `/usr`). |
| `/proc` | A **virtual** filesystem exposing kernel and process information as "files" (nothing is actually on disk). E.g. `/proc/cpuinfo`, `/proc/meminfo`, `/proc/<pid>/status`. |
| `/root` | The home directory for the `root` (superuser) account — separate from `/home` for reliability during recovery. |
| `/run` | Runtime, volatile data since the last boot (PIDs, sockets, locks). Replaces older use of `/var/run`. |
| `/sbin` | Binaries for system administration, typically requiring root (e.g. `fdisk`, `iptables`, `reboot`). Symlinked to `/usr/sbin` on modern systems. |
| `/srv` | Data served by this system, e.g. web server files, FTP data. |
| `/sys` | Another **virtual** filesystem exposing kernel data structures, devices, and drivers for introspection/configuration. |
| `/tmp` | World-writable scratch space for temporary files; usually cleared on reboot. |
| `/usr` | "Unix System Resources" — the bulk of user-space programs, libraries, documentation, and headers, further split into `/usr/bin`, `/usr/lib`, `/usr/share`, `/usr/local`, etc. |
| `/var` | **Variable** data that changes frequently: logs (`/var/log`), spool/mail queues (`/var/spool`), caches (`/var/cache`), databases. |

## Important subfolders worth knowing

| Path | Purpose |
|---|---|
| `/etc/passwd` | List of user accounts (name, UID, home dir, shell). |
| `/etc/shadow` | Encrypted user passwords (root-readable only). |
| `/etc/fstab` | Defines filesystems to mount automatically at boot. |
| `/etc/hosts` | Static hostname-to-IP mappings. |
| `/var/log` | System and application log files, e.g. `/var/log/syslog`, `/var/log/auth.log`. |
| `/usr/local` | Software installed manually/locally, not managed by the package manager. |
| `/usr/share` | Architecture-independent shared data: docs, icons, man pages. |

## Exploring the hierarchy yourself

```bash
ls -l /                 # list top-level directories
tree -L 1 /              # one-level tree view (install `tree` first)
cat /etc/os-release       # see which distro/version you're running
df -h                     # see mounted filesystems and their sizes
mount | column -t          # see everything currently mounted
```

## Everything is a file

A core Linux philosophy: **"everything is a file."** Hardware devices, running processes, kernel parameters, sockets — all are represented and interacted with through the filesystem. This is why `/dev`, `/proc`, and `/sys` exist as virtual filesystems rather than special-cased APIs.

---
Next: [03 — Shell Basics & the Terminal ➡](03-shell-basics.md)
