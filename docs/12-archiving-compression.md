# 12 — Archiving & Compression

[⬅ Back to course outline](../README.md) | Previous: [Monitoring & Disk Usage](11-monitoring-disk.md) | Next: [Shell Scripting Basics ➡](13-shell-scripting.md)

## `tar` — the classic archiver

`tar` bundles multiple files/directories into a single **archive** (`.tar`). It's commonly combined with compression.

```bash
tar -cvf archive.tar folder/          # create an archive
tar -xvf archive.tar                    # extract an archive
tar -tvf archive.tar                      # list contents without extracting
```

Flags: `c`=create, `x`=extract, `t`=list, `v`=verbose, `f`=filename (always last before the filename).

### Compressed tarballs

```bash
tar -czvf archive.tar.gz folder/       # create + gzip compress
tar -xzvf archive.tar.gz                 # extract a .tar.gz
tar -cjvf archive.tar.bz2 folder/           # create + bzip2 compress (better ratio, slower)
tar -xjvf archive.tar.bz2                     # extract a .tar.bz2
tar -cJvf archive.tar.xz folder/                # create + xz compress (best ratio, slowest)
```

## `gzip` / `gunzip`

```bash
gzip file.txt          # compress -> file.txt.gz (removes original)
gunzip file.txt.gz        # decompress -> file.txt
gzip -k file.txt            # keep the original file too
zcat file.txt.gz | less        # view a gzipped file without fully extracting
```

## `zip` / `unzip`

```bash
zip archive.zip file1 file2       # create a zip
zip -r archive.zip folder/           # zip a directory recursively
unzip archive.zip                       # extract
unzip -l archive.zip                       # list contents without extracting
```

## `rsync` — efficient sync & backup

`rsync` only transfers the differences between source and destination, making it ideal for backups and repeated syncs (local or remote via SSH).

```bash
rsync -avh src/ dest/                            # archive mode, verbose, human-readable sizes
rsync -avh --delete src/ dest/                      # mirror exactly (delete extra files in dest)
rsync -avz src/ user@remote:/path/dest/                # sync to a remote host over SSH, with compression
rsync -avh --dry-run src/ dest/                          # preview what would happen, no changes made
```

Key flags: `-a` (archive: preserves permissions/timestamps/symlinks, recursive), `-v` (verbose), `-z` (compress during transfer), `-h` (human-readable).

## Choosing a format

| Format | Compression ratio | Speed | Typical use |
|---|---|---|---|
| `.tar` | none | instant | bundling only, no compression |
| `.tar.gz` / `.tgz` | good | fast | most common default |
| `.tar.bz2` | better | slower | when size matters more than speed |
| `.tar.xz` | best | slowest | distributing software releases |
| `.zip` | good | fast | cross-platform (Windows-friendly) |

---
Next: [13 — Shell Scripting Basics ➡](13-shell-scripting.md)
