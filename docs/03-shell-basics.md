# 03 — Shell Basics & the Terminal

[⬅ Back to course outline](../README.md) | Previous: [Filesystem Hierarchy](02-filesystem-hierarchy.md) | Next: [File & Directory Commands ➡](04-file-directory-commands.md)

## Terminal vs. Shell

- **Terminal (terminal emulator)**: The window/app you type into (e.g. GNOME Terminal, iTerm2, Windows Terminal).
- **Shell**: The program that reads and interprets your commands, e.g. `bash`, `zsh`, `fish`, `sh`. When you open a terminal, it starts a shell for you.

Check your current shell:

```bash
echo $SHELL
```

## The prompt

A typical prompt looks like:

```
alice@myhost:~/projects$
```

- `alice` — current username
- `myhost` — hostname
- `~/projects` — current working directory (`~` = home directory)
- `$` — regular user prompt (`#` typically means root)

## Anatomy of a command

```bash
command [options/flags] [arguments]
```

Example:

```bash
ls -la /home/alice
# ls      = command
# -la     = options (list all, long format)
# /home/alice = argument (target path)
```

## Getting help

| Command | Purpose |
|---|---|
| `man <command>` | Full manual page for a command |
| `<command> --help` | Quick usage summary |
| `whatis <command>` | One-line description |
| `apropos <keyword>` | Search man pages by keyword |
| `type <command>` | Shows if it's a builtin, alias, or binary, and where |
| `which <command>` | Shows the path of the executable that would run |

## Navigating & environment

```bash
pwd                 # print working directory
echo $PATH           # directories the shell searches for executable commands
echo $HOME            # your home directory
env                    # list all environment variables
export MYVAR=value     # set an environment variable for this session
```

`PATH` is a colon-separated list of directories. When you type a command, the shell searches each directory in `PATH`, in order, for a matching executable.

## Command history & shortcuts

| Shortcut / Command | Effect |
|---|---|
| `history` | Show command history |
| `↑` / `↓` | Cycle through previous commands |
| `Ctrl + R` | Reverse search history |
| `Ctrl + C` | Interrupt/kill the running foreground command |
| `Ctrl + D` | Send EOF (often exits the shell) |
| `Ctrl + L` | Clear the screen (same as `clear`) |
| `Ctrl + A` / `Ctrl + E` | Move cursor to start / end of line |
| `Tab` | Autocomplete command/file names |
| `!!` | Repeat the last command |
| `!$` | Last argument of the previous command |

## Redirection & pipes

| Syntax | Meaning |
|---|---|
| `command > file` | Redirect stdout to file (overwrite) |
| `command >> file` | Redirect stdout to file (append) |
| `command < file` | Use file as stdin |
| `command 2> file` | Redirect stderr to file |
| `command &> file` | Redirect both stdout and stderr |
| `cmd1 \| cmd2` | Pipe: send stdout of `cmd1` as stdin to `cmd2` |

Example:

```bash
ls -l /etc | grep ".conf" > conf_files.txt
```

## Running commands in background/foreground

```bash
long_task &      # run in background
jobs              # list background jobs
fg %1              # bring job 1 to foreground
bg %1               # resume job 1 in background
nohup long_task &   # keep running even after terminal closes
```

## Shell configuration files

| File | Purpose |
|---|---|
| `~/.bashrc` | Runs for every new interactive `bash` shell (aliases, functions, prompt). |
| `~/.bash_profile` / `~/.profile` | Runs for login shells (environment setup). |
| `~/.zshrc` | Equivalent for `zsh`. |
| `/etc/environment` | System-wide environment variables. |

---
Next: [04 — File & Directory Commands ➡](04-file-directory-commands.md)
