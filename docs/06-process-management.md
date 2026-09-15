# 06 — Process Management

[⬅ Back to course outline](../README.md) | Previous: [Permissions & Ownership](05-permissions-ownership.md) | Next: [Package Management ➡](07-package-management.md)

## What is a process?

A **process** is a running instance of a program. Each has a unique **PID** (Process ID), a parent process (**PPID**), an owner, memory space, and a state (running, sleeping, stopped, zombie).

## Viewing processes

| Command | Description |
|---|---|
| `ps aux` | Snapshot of all running processes (BSD-style, very common) |
| `ps -ef` | Snapshot of all processes (UNIX-style, shows PPID clearly) |
| `top` | Real-time, interactive process viewer sorted by CPU usage |
| `htop` | Improved, colorized, interactive version of `top` (may need installing) |
| `pgrep <name>` | Find PIDs matching a process name |
| `pidof <name>` | PID of a running program by exact name |
| `pstree` | Show processes as a parent/child tree |

Example:

```bash
ps aux | grep nginx        # find nginx processes
ps -ef --forest              # show as a tree
```

### Reading `ps aux` columns

```
USER  PID  %CPU  %MEM  VSZ   RSS   TTY  STAT  START  TIME  COMMAND
```

- `PID` — process ID
- `%CPU` / `%MEM` — resource usage
- `STAT` — state: `R` running, `S` sleeping, `D` uninterruptible sleep, `Z` zombie, `T` stopped
- `TIME` — total CPU time consumed

## Killing processes & signals

```bash
kill <PID>            # send SIGTERM (graceful stop request)
kill -9 <PID>          # send SIGKILL (force kill, cannot be ignored)
kill -l                 # list all available signals
killall firefox           # kill by process name
pkill -f "python app.py"   # kill by matching command line pattern
```

Common signals:

| Signal | Number | Meaning |
|---|---|---|
| `SIGHUP` | 1 | Hangup — often used to tell a daemon to reload config |
| `SIGINT` | 2 | Interrupt (same as Ctrl+C) |
| `SIGKILL` | 9 | Force kill — cannot be caught or ignored |
| `SIGTERM` | 15 | Polite termination request (default for `kill`) |
| `SIGSTOP` | 19 | Pause a process |
| `SIGCONT` | 18 | Resume a paused process |

## Job control (foreground/background)

```bash
long_command &     # start in background
jobs                 # list jobs in current shell
fg %1                 # bring job 1 to foreground
bg %1                  # resume job 1 in background
Ctrl+Z                   # suspend the foreground job
```

## Priority (niceness)

Processes have a "niceness" value from **-20** (highest priority) to **19** (lowest priority). Default is 0.

```bash
nice -n 10 long_task        # start a task with lower priority
renice -n 5 -p <PID>          # change priority of a running process (root for negative values)
```

## Zombie & orphan processes

- **Zombie**: A finished process whose exit status hasn't been read by its parent yet — takes up a PID slot but no resources. Usually cleared automatically once the parent calls `wait()`.
- **Orphan**: A process whose parent has exited before it did; gets re-parented to `init`/`systemd` (PID 1).

## Monitoring resource usage live

```bash
top          # interactive; press 'q' to quit, 'k' to kill a PID
htop          # nicer UI; F9 to kill, F6 to sort
watch -n 1 "ps aux --sort=-%cpu | head -10"   # top 10 CPU consumers, refreshed every second
```

---
Next: [07 — Package Management ➡](07-package-management.md)
