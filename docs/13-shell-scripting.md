# 13 — Shell Scripting Basics

[⬅ Back to course outline](../README.md) | Previous: [Archiving & Compression](12-archiving-compression.md) | Next: [Scheduling: cron & at ➡](14-scheduling-cron.md)

## Your first script

```bash
#!/bin/bash
# ^ the "shebang" — tells the OS which interpreter to run this file with

echo "Hello, $USER!"
```

```bash
chmod +x hello.sh    # make it executable
./hello.sh              # run it
```

## Variables

```bash
name="Alice"           # no spaces around '='
echo "Hello, $name"       # use $ to read a variable
echo "Hello, ${name}!"      # braces avoid ambiguity when concatenating

readonly PI=3.14           # constant, cannot be reassigned
unset name                   # delete a variable
```

## Command substitution & arithmetic

```bash
current_dir=$(pwd)          # store command output in a variable
files_count=$(ls | wc -l)

sum=$((3 + 4))                 # arithmetic expansion
count=$((count + 1))
```

## Reading input & script arguments

```bash
read -p "Enter your name: " name
echo "Hi, $name"

# Script arguments: ./script.sh arg1 arg2
echo "Script name: $0"
echo "First arg: $1"
echo "All args: $@"
echo "Number of args: $#"
```

## Conditionals

```bash
if [ "$name" == "Alice" ]; then
    echo "Welcome back!"
elif [ -z "$name" ]; then
    echo "No name given."
else
    echo "Hello, stranger."
fi
```

Common test operators:

| Test | Meaning |
|---|---|
| `-z "$s"` | string is empty |
| `-n "$s"` | string is non-empty |
| `"$a" == "$b"` | strings equal |
| `-eq`, `-ne`, `-lt`, `-gt`, `-le`, `-ge` | numeric comparisons |
| `-f file` | file exists and is a regular file |
| `-d dir` | directory exists |
| `-x file` | file is executable |

## Loops

```bash
for i in 1 2 3; do
    echo "Number: $i"
done

for file in *.txt; do
    echo "Processing $file"
done

count=0
while [ $count -lt 5 ]; do
    echo "Count: $count"
    count=$((count + 1))
done
```

## Functions

```bash
greet() {
    local name=$1        # 'local' scopes the variable to the function
    echo "Hello, $name!"
}

greet "World"
```

## Exit codes

Every command returns an exit code: `0` = success, non-zero = failure.

```bash
grep "error" app.log
echo $?              # exit code of the previous command

command1 && command2     # run command2 only if command1 succeeded
command1 || command2       # run command2 only if command1 failed

exit 1                        # exit the script with a specific code
```

## Practical example: backup script

```bash
#!/bin/bash
set -euo pipefail    # exit on error, undefined var, or failed pipe (safer scripts)

SRC_DIR="$1"
DEST_DIR="/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

if [ ! -d "$SRC_DIR" ]; then
    echo "Error: $SRC_DIR does not exist" >&2
    exit 1
fi

tar -czf "$DEST_DIR/backup_$TIMESTAMP.tar.gz" "$SRC_DIR"
echo "Backup complete: $DEST_DIR/backup_$TIMESTAMP.tar.gz"
```

---
Next: [14 — Scheduling: cron & at ➡](14-scheduling-cron.md)
