# 05 — Permissions & Ownership

[⬅ Back to course outline](../README.md) | Previous: [File & Directory Commands](04-file-directory-commands.md) | Next: [Process Management ➡](06-process-management.md)

## Reading `ls -l` output

```
-rwxr-xr-- 1 alice devs 1240 Sep 10 10:32 deploy.sh
```

| Segment | Meaning |
|---|---|
| `-` | File type (`-`=file, `d`=directory, `l`=symlink) |
| `rwx` | Owner permissions: read, write, execute |
| `r-x` | Group permissions: read, execute (no write) |
| `r--` | Others' permissions: read only |
| `alice` | Owner (user) |
| `devs` | Owning group |

## Permission types

| Symbol | File meaning | Directory meaning |
|---|---|---|
| `r` (4) | Read file contents | List directory contents |
| `w` (2) | Modify file contents | Create/delete files inside |
| `x` (1) | Execute the file as a program/script | Enter (`cd` into) the directory |

Permissions are grouped into **owner**, **group**, **others** — each a combination of `r`, `w`, `x` represented either symbolically (`rwx`) or numerically (0–7, sum of 4+2+1).

## `chmod` — change permissions

Numeric (octal) mode:

```bash
chmod 755 script.sh   # owner: rwx, group: r-x, others: r-x
chmod 644 file.txt     # owner: rw-, group: r--, others: r--
chmod -R 755 folder/    # recursive
```

Symbolic mode:

```bash
chmod u+x script.sh    # add execute for owner (user)
chmod g-w file.txt       # remove write for group
chmod o=r file.txt        # set others to read-only
chmod a+r file.txt          # add read for all (user, group, others)
```

`u`=user/owner, `g`=group, `o`=others, `a`=all. `+`=add, `-`=remove, `=`=set exactly.

## `chown` / `chgrp` — change ownership

```bash
chown alice file.txt          # change owner
chown alice:devs file.txt       # change owner and group
chown -R alice:devs folder/      # recursive
chgrp devs file.txt               # change group only
```

Requires root/sudo unless you own the file and are only changing the group to one you belong to.

## `umask` — default permission mask

`umask` determines the default permissions of newly created files/directories by **subtracting** from the full permission set (666 for files, 777 for directories).

```bash
umask          # show current mask, e.g. 0022
umask 0027       # set a new mask for this session
```

With `umask 022`: new files get `644` (666-022), new directories get `755` (777-022).

## Special permissions

| Bit | Numeric | Symbol | Effect |
|---|---|---|---|
| **SUID** | 4000 | `s` in owner's `x` slot | Run the program as its **owner**, not the invoking user (e.g. `passwd`) |
| **SGID** | 2000 | `s` in group's `x` slot | Run as the file's group; on directories, new files inherit the directory's group |
| **Sticky bit** | 1000 | `t` in others' `x` slot | In shared directories (e.g. `/tmp`), only the file owner can delete their own files |

```bash
chmod 4755 /usr/bin/some_tool   # set SUID
chmod +t /shared_dir              # set sticky bit
```

## Checking who you are

```bash
whoami          # current username
id                # UID, GID, and group memberships
groups             # groups you belong to
```

## Common pitfalls

- `chmod 777` (world read/write/execute) is almost always wrong for anything security-sensitive.
- Forgetting `-R` when you meant to apply permissions recursively to a folder's contents.
- Confusing directory execute permission (needed to `cd`/traverse) with file execute permission (needed to run it).

---
Next: [06 — Process Management ➡](06-process-management.md)
