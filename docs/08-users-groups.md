# 08 — Users & Groups

[⬅ Back to course outline](../README.md) | Previous: [Package Management](07-package-management.md) | Next: [Networking ➡](09-networking.md)

## Core concept: multi-user by design

Linux was built from the ground up to be multi-user, with strict separation between accounts to prevent one user from interfering with another (or with the system).

## Key files

| File | Contents |
|---|---|
| `/etc/passwd` | One line per user: username, UID, GID, home dir, shell, etc. (world-readable, no passwords) |
| `/etc/shadow` | Encrypted passwords and password aging info (root-only) |
| `/etc/group` | Group names, GIDs, and member lists |
| `/etc/sudoers` | Who can use `sudo` and with what privileges (edit only with `visudo`) |

Example `/etc/passwd` line:

```
alice:x:1001:1001:Alice Smith:/home/alice:/bin/bash
```
`username:password-placeholder:UID:GID:comment:home-dir:shell`

## Viewing identity info

```bash
whoami            # current username
id                  # UID, GID, and all group memberships
id alice              # info for another user
groups                 # groups the current user belongs to
last                      # recent login history
who                         # who's logged in right now
w                            # who's logged in + what they're doing
```

## Managing users

```bash
sudo useradd -m -s /bin/bash alice     # create user with home dir and bash shell
sudo passwd alice                        # set/change alice's password
sudo usermod -aG sudo alice                # add alice to the 'sudo' group
sudo usermod -l newname alice                # rename user
sudo userdel -r alice                          # delete user + home directory
```

> `-a` with `-G` is important — without it, `usermod -G` **replaces** all existing group memberships instead of adding to them.

## Managing groups

```bash
sudo groupadd developers          # create a group
sudo usermod -aG developers alice    # add alice to the group
sudo gpasswd -d alice developers       # remove alice from the group
sudo groupdel developers                 # delete a group
```

## `sudo` — privilege escalation

`sudo` (superuser do) lets an authorized user run a command as root (or another user) without sharing the root password.

```bash
sudo apt update           # run a single command as root
sudo -i                     # start an interactive root shell
sudo -u alice whoami          # run a command as another user
sudo -l                         # list what you're allowed to run
```

Configure via `sudo visudo` (never edit `/etc/sudoers` directly — `visudo` checks syntax to prevent lockouts).

## Switching users

```bash
su alice          # switch to alice (needs alice's password)
su -                # switch to root with root's own environment
```

## Password policy

```bash
chage -l alice              # show password aging info
sudo chage -M 90 alice         # force password change every 90 days
```

---
Next: [09 — Networking ➡](09-networking.md)
