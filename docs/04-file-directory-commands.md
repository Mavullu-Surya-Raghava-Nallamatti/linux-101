# 04 — File & Directory Commands

[⬅ Back to course outline](../README.md) | Previous: [Shell Basics](03-shell-basics.md) | Next: [Permissions & Ownership ➡](05-permissions-ownership.md)

## Navigation

| Command | Description | Example |
|---|---|---|
| `pwd` | Print current directory | `pwd` |
| `cd` | Change directory | `cd /var/log`, `cd ..`, `cd ~`, `cd -` (previous dir) |
| `ls` | List directory contents | `ls -la` (all, long format), `ls -lh` (human-readable sizes) |
| `tree` | Show directory tree | `tree -L 2` |

## Creating & removing

| Command | Description | Example |
|---|---|---|
| `mkdir` | Make directory | `mkdir project`, `mkdir -p a/b/c` (create parents) |
| `rmdir` | Remove **empty** directory | `rmdir old_folder` |
| `touch` | Create empty file / update timestamp | `touch notes.txt` |
| `rm` | Remove files | `rm file.txt`, `rm -r folder/` (recursive), `rm -rf folder/` (force, no confirm — dangerous) |

> ⚠️ `rm -rf` permanently deletes without a trash bin. Always double-check the path, especially with wildcards.

## Copying & moving

| Command | Description | Example |
|---|---|---|
| `cp` | Copy files/directories | `cp a.txt b.txt`, `cp -r src/ dst/` |
| `mv` | Move or rename | `mv a.txt b.txt` (rename), `mv file.txt /tmp/` (move) |
| `ln` | Create links | `ln file.txt hardlink.txt` (hard link), `ln -s file.txt symlink.txt` (symbolic link) |

## Viewing files

| Command | Description |
|---|---|
| `cat file` | Print entire file content |
| `less file` / `more file` | Page through file content (`less` is more capable) |
| `head -n 20 file` | First 20 lines |
| `tail -n 20 file` | Last 20 lines |
| `tail -f file` | Follow file as it grows (great for logs) |
| `wc -l file` | Count lines (also `-w` words, `-c` bytes) |

## Finding files

| Command | Description | Example |
|---|---|---|
| `find` | Search filesystem by criteria | `find / -name "*.log"`, `find . -type f -mtime -7` (modified in last 7 days), `find . -size +100M` |
| `locate` | Fast search using a prebuilt index (`updatedb`) | `locate nginx.conf` |
| `which` | Path of an executable in `PATH` | `which python3` |
| `whereis` | Locate binary, source, and man pages | `whereis ls` |

Useful `find` combos:

```bash
find . -name "*.tmp" -delete                 # find & delete matching files
find . -type d -empty                          # find empty directories
find / -perm -4000 2>/dev/null                  # find setuid binaries
```

## Disk usage of files/directories

```bash
du -sh folder/        # total size of a folder, human-readable
du -h --max-depth=1 .   # size per subfolder, one level deep
```

## Wildcards (globbing)

| Pattern | Matches |
|---|---|
| `*` | Any number of characters |
| `?` | Exactly one character |
| `[abc]` | One character: a, b, or c |
| `[0-9]` | One digit |

```bash
ls *.txt       # all .txt files
rm report_?.csv # report_1.csv, report_2.csv, etc.
```

## Comparing files

```bash
diff file1 file2      # show differences line by line
cmp file1 file2         # byte-by-byte comparison
md5sum file              # checksum for integrity verification
```

---
Next: [05 — Permissions & Ownership ➡](05-permissions-ownership.md)
