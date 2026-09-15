# 10 — Text Processing & Editors

[⬅ Back to course outline](../README.md) | Previous: [Networking](09-networking.md) | Next: [Monitoring & Disk Usage ➡](11-monitoring-disk.md)

Linux administration is largely about reading, filtering, and transforming text (logs, configs, output of other commands).

## `grep` — search text

```bash
grep "error" app.log                # lines containing "error"
grep -i "error" app.log                # case-insensitive
grep -r "TODO" src/                       # recursive search in a directory
grep -v "debug" app.log                     # invert match: lines NOT containing "debug"
grep -n "error" app.log                       # show line numbers
grep -c "error" app.log                         # count matching lines
grep -E "error|warning" app.log                   # extended regex, multiple patterns
```

## `sed` — stream editor (find & replace)

```bash
sed 's/foo/bar/' file.txt              # replace first "foo" per line with "bar" (prints to stdout)
sed 's/foo/bar/g' file.txt                # replace ALL occurrences per line
sed -i 's/foo/bar/g' file.txt               # edit the file in-place
sed -n '5,10p' file.txt                       # print only lines 5-10
sed '/^#/d' file.txt                            # delete lines starting with '#' (comments)
```

## `awk` — pattern-action text processing

`awk` treats each line as a record split into fields (`$1`, `$2`, … and `$0` for the whole line).

```bash
awk '{print $1}' file.txt                 # print first column
awk -F: '{print $1, $3}' /etc/passwd         # use ':' as field separator, print username & UID
awk '$3 > 100 {print $0}' data.txt              # print lines where field 3 > 100
ps aux | awk '{print $2, $11}'                    # PID and command from ps output
```

## Other essential text tools

| Command | Description | Example |
|---|---|---|
| `cut` | Extract columns/fields | `cut -d: -f1 /etc/passwd` (1st field, `:` delimiter) |
| `sort` | Sort lines | `sort file.txt`, `sort -n nums.txt`, `sort -r` (reverse) |
| `uniq` | Remove/count adjacent duplicate lines (use after `sort`) | `sort file.txt \| uniq -c` |
| `tr` | Translate/delete characters | `tr 'a-z' 'A-Z' < file.txt` (uppercase) |
| `wc` | Count lines/words/chars | `wc -l file.txt` |
| `xargs` | Build/run commands from stdin | `find . -name "*.tmp" \| xargs rm` |
| `column` | Format text into aligned columns | `mount \| column -t` |
| `tee` | Write output to a file AND stdout | `command \| tee output.log` |

## Combining tools (the "Unix pipeline" philosophy)

```bash
cat access.log | grep "500" | awk '{print $1}' | sort | uniq -c | sort -nr | head -10
```
This finds the top 10 IPs generating HTTP 500 errors from a web server log.

## Text editors

### `nano` — beginner-friendly

```bash
nano file.txt
# Ctrl+O = save, Ctrl+X = exit, Ctrl+W = search
```

### `vim` — powerful modal editor

```bash
vim file.txt
```

| Mode | How to enter | Purpose |
|---|---|---|
| Normal | `Esc` | Navigate, run commands |
| Insert | `i`, `a`, `o` | Type text |
| Command | `:` (from normal mode) | Save, quit, search/replace |

Essential vim commands:

```
i          enter insert mode
Esc        return to normal mode
:w         save
:q         quit
:wq        save and quit
:q!        quit without saving
/pattern   search forward
dd         delete current line
u          undo
```

---
Next: [11 — Monitoring & Disk Usage ➡](11-monitoring-disk.md)
