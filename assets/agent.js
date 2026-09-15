// Rule-based "Tutor Agent" — adapts difficulty based on performance.
// 100% client-side logic (no API calls, no server, no cost) so it works on static GitHub Pages hosting.

const AGENT_KEY = "linux101-agent";

function loadAgentState() {
  try {
    return JSON.parse(localStorage.getItem(AGENT_KEY)) || { level: 0, completedChallenges: [], hardUnlocked: {} };
  } catch {
    return { level: 0, completedChallenges: [], hardUnlocked: {} };
  }
}

function saveAgentState(state) {
  localStorage.setItem(AGENT_KEY, JSON.stringify(state));
}

// Bonus, tougher scenario-based questions per module. Unlocked once a learner
// scores 80%+ on the base quiz — the agent "raises the bar" as mastery grows.
const HARD_QUESTIONS = {
  "01": [
    { q: "A driver crashes in kernel space. Why is this more dangerous than a crashing user-space app?", options: ["It isn't — both are equally safe", "Kernel space has full hardware access, so a crash there can take down the whole system", "Kernel crashes are always silently ignored", "It only affects the GUI"], answer: 1, explain: "Kernel-space code runs privileged; a fault there can corrupt memory or halt the whole machine, unlike an isolated user-space crash." },
    { q: "You need long-term kernel support with minimal changes for a production server. Which distro trait matters most?", options: ["Bleeding-edge rolling releases", "An LTS (Long Term Support) release cycle", "The prettiest desktop theme", "Having the most desktop wallpapers"], answer: 1, explain: "LTS releases (e.g. Ubuntu LTS, RHEL) prioritize stability and long security-patch windows over newest features." },
  ],
  "02": [
    { q: "An app writes huge temp files that fill the disk and crash the whole system. Which FHS-aware fix reduces this risk?", options: ["Store temp files in /etc", "Mount /tmp as its own filesystem/partition so it can't consume all disk space", "Delete /var/log", "Move the kernel to /tmp"], answer: 1, explain: "Isolating /tmp (or /var) on its own partition contains runaway disk usage instead of starving the whole root filesystem." },
    { q: "You find a critical config was accidentally placed in /usr instead of /etc. Why is that a problem?", options: ["/usr is reserved for system-wide read-only program files/data, not host-specific config meant to be user-edited", "/usr doesn't exist on Linux", "/usr is slower to read from", "There is no difference"], answer: 0, explain: "/etc is for editable configuration; /usr holds distributed program resources — mixing them breaks upgrade/packaging expectations." },
  ],
  "03": [
    { q: "A colleague's script works when they run it manually but fails under cron with 'command not found'. Most likely cause?", options: ["Cron doesn't support bash", "Cron runs with a minimal environment/PATH different from an interactive shell", "The script has a syntax error", "cron is not installed"], answer: 1, explain: "Interactive shells load PATH from .bashrc/.profile; cron's environment is much more minimal, so absolute paths are safer." },
    { q: "You want to see exactly what a `|` pipeline's second command receives as input. What's actually being piped?", options: ["The exit code of the first command", "The stdout of the first command, fed as stdin to the second", "The stderr only", "Nothing, pipes just run commands in parallel"], answer: 1, explain: "A pipe connects the first command's stdout stream directly to the next command's stdin." },
  ],
  "04": [
    { q: "You ran `rm -rf ./*` inside what you thought was an empty scratch folder, but it wasn't. What's the safest habit that would have prevented this?", options: ["Always run rm -rf as root", "Run `pwd` and `ls` to confirm location and contents before destructive commands", "Never use wildcards ever", "Use rm -rf only on Fridays"], answer: 1, explain: "Confirming your current directory and its contents before a recursive delete is the single most effective safety habit." },
    { q: "`find . -type f -mtime -7 -size +50M` — what does this find?", options: ["Files smaller than 50MB modified more than 7 days ago", "Regular files modified in the last 7 days AND larger than 50MB", "Directories only", "All files regardless of size or date"], answer: 1, explain: "-type f (regular files), -mtime -7 (modified within last 7 days), -size +50M (over 50MB) — all conditions combine with AND by default." },
  ],
  "05": [
    { q: "A shared upload directory needs: new files inherit the directory's group automatically. Which bit do you set on the directory?", options: ["Sticky bit", "SGID (set-group-ID) on the directory", "SUID", "umask 777"], answer: 1, explain: "SGID on a directory makes new files/subdirectories inherit its group ownership automatically." },
    { q: "You find a world-writable script with the SUID bit owned by root. Why is this a serious security risk?", options: ["It isn't risky at all", "Any user can edit it AND it will execute with root privileges — a privilege escalation path", "SUID only works on directories", "World-writable files can't be executed"], answer: 1, explain: "Anyone could modify the script, and it would then run as root — a classic privilege escalation vulnerability." },
  ],
  "06": [
    { q: "A process is stuck ignoring SIGTERM. What's the correct escalation?", options: ["Reboot the whole machine immediately", "Send SIGKILL (kill -9) since it cannot be caught or ignored", "Send SIGHUP repeatedly", "Lower its niceness"], answer: 1, explain: "SIGKILL forces immediate termination at the kernel level, bypassing the process's own signal handlers." },
    { q: "`ps aux` shows a process in state 'D' consuming no CPU but unresponsive to kill -9. What does 'D' mean and why is it hard to kill?", options: ["Done — it already exited", "Uninterruptible sleep, usually waiting on I/O — it can't respond to signals until the I/O completes", "Killed already", "Daemonized, ignoring all signals by design"], answer: 1, explain: "Processes in uninterruptible sleep (D) are blocked in a kernel I/O call and won't respond to signals, including SIGKILL, until it returns." },
  ],
  "07": [
    { q: "You need a package version newer than what your distro repo offers but don't want to compile from source. What's the most appropriate step?", options: ["Manually edit /etc/passwd", "Add a trusted third-party repo/PPA or use a self-contained format like Flatpak/Snap for that app", "Delete the package manager", "Reinstall the entire OS"], answer: 1, explain: "Trusted third-party repos or sandboxed formats (Flatpak/Snap) let you get newer versions without breaking system package integrity." },
    { q: "After `apt remove nginx`, config files remain in /etc/nginx. Which command fully removes them too?", options: ["apt purge nginx", "apt clean nginx", "apt autoremove nginx", "apt update nginx"], answer: 0, explain: "`purge` removes the package AND its configuration files, unlike a plain `remove`." },
  ],
  "08": [
    { q: "You ran `usermod -G docker alice` intending to add alice to the docker group, and now she can't SSH in at all. What likely happened?", options: ["docker group blocks SSH", "-G without -a replaced ALL of alice's group memberships, removing her from groups she needed", "alice's password expired", "usermod deleted her account"], answer: 1, explain: "-G (without -a) overwrites the full supplementary group list instead of appending — a common, disruptive mistake." },
    { q: "Why does /etc/passwd remain world-readable while /etc/shadow is root-only?", options: ["/etc/passwd holds only non-secret account metadata; /etc/shadow holds password hashes that must stay protected", "It's a historical bug that was never fixed", "/etc/shadow is a duplicate of /etc/passwd", "Permissions don't matter for either file"], answer: 0, explain: "Splitting hashes into shadow (mode 600, root-only) protects them from offline cracking attempts by unprivileged users." },
  ],
  "09": [
    { q: "`ss -tulpn` shows a process listening on 0.0.0.0:22. What does 0.0.0.0 mean here?", options: ["No one can connect", "The service is listening on all available network interfaces", "It's an invalid IP and the service is broken", "It only listens on localhost"], answer: 1, explain: "0.0.0.0 as a bind address means 'listen on every interface', not a specific single IP." },
    { q: "`ping` to a host works, but `curl` to a web service on it times out. What's the most likely next troubleshooting step?", options: ["Reboot the router", "Check if the specific port is open/listening with `ss -tulpn` or test with `curl -v`/`nc`", "Uninstall curl", "Ping harder with bigger packets"], answer: 1, explain: "ICMP reachability doesn't guarantee a specific TCP port/service is open — check the port and service status directly." },
  ],
  "10": [
    { q: "You need the top 5 IPs causing the most 404 errors in a huge access log. Which pipeline accomplishes this?", options: ["cat log | head -5", "grep '404' log | awk '{print $1}' | sort | uniq -c | sort -nr | head -5", "sed 's/404//' log", "tail -5 log"], answer: 1, explain: "Filter matching lines, extract the IP field, then sort/count/rank — a classic Unix pipeline pattern." },
    { q: "`sed 's/foo/bar/' file.txt` vs `sed 's/foo/bar/g' file.txt` — what's the difference?", options: ["No difference", "Without 'g' only the FIRST match per line is replaced; with 'g' ALL matches per line are replaced", "'g' makes it case-insensitive", "'g' edits the file in place"], answer: 1, explain: "The g flag makes the substitution global across each line rather than stopping at the first match." },
  ],
  "11": [
    { q: "`df -h` shows plenty of free space, but you still get 'No space left on device'. What else should you check?", options: ["CPU temperature", "Inode usage with `df -i` — you may have run out of inodes, not blocks", "RAM usage", "Network bandwidth"], answer: 1, explain: "Filesystems can run out of inodes (metadata slots for files) even with free disk blocks remaining, especially with many tiny files." },
    { q: "Load average is '8.0 8.0 8.0' on a 4-core machine sustained over time. What does that indicate?", options: ["The system is idle", "The system is consistently oversubscribed — demand is double the available CPU capacity", "Memory is full", "Disk is corrupted"], answer: 1, explain: "Load average roughly maps to runnable/waiting processes; sustained load double the core count signals CPU contention." },
  ],
  "12": [
    { q: "You need a backup strategy that mirrors a folder exactly, deleting remote files no longer present locally. Which rsync flag is essential and risky?", options: ["--dry-run permanently", "--delete", "-h", "-z"], answer: 1, explain: "--delete makes the destination match the source exactly, including removing extra files — always test with --dry-run first." },
    { q: "Why might you choose `.tar.gz` over `.tar.xz` for a CI pipeline that runs frequently?", options: ["gz has a better compression ratio", "gz compresses/decompresses much faster, which matters more than ratio for frequent automated runs", "xz files can't be extracted", "There's no difference in speed"], answer: 1, explain: "xz achieves better compression but is much slower — for frequent automated runs, gzip's speed often wins." },
  ],
  "13": [
    { q: "Your script silently continues even after a command fails, causing later steps to corrupt data. What single line near the top would prevent this?", options: ["#!/bin/bash", "set -euo pipefail", "echo debug", "exit 0"], answer: 1, explain: "set -e exits on any failing command, -u catches unset variables, and pipefail catches failures inside pipelines." },
    { q: "Inside a function, why use `local name=$1` instead of just `name=$1`?", options: ["local is required syntax in bash", "local scopes the variable to the function, preventing it from leaking into/clobbering the global scope", "It makes the script run faster", "It converts the variable to a constant"], answer: 1, explain: "Without `local`, variables assigned in a function are global by default in bash, which can cause subtle bugs." },
  ],
  "14": [
    { q: "A cron job scheduled `0 2 * * *` didn't run because the system was powered off at 2 AM. Which tool would guarantee it still runs after a missed schedule?", options: ["Plain cron", "A systemd timer with Persistent=true", "at", "nice"], answer: 1, explain: "Persistent=true on a systemd timer runs the job on next boot/wake if a scheduled run was missed — plain cron does not." },
    { q: "Why does a script that works fine when run manually fail via crontab with relative paths like `./backup.sh`?", options: ["Cron jobs run from a directory you may not expect, with a minimal environment — always use absolute paths", "Cron doesn't support scripts", "Crontab requires .py extension", "Cron jobs run as a different kernel"], answer: 0, explain: "Cron's working directory and environment differ from an interactive shell, so relative paths often resolve incorrectly." },
  ],
  "15": [
    { q: "After editing /etc/systemd/system/myapp.service, `systemctl restart myapp` still uses the OLD config. What step was skipped?", options: ["systemctl daemon-reload", "rebooting the whole machine", "reinstalling systemd", "chmod 777 on the file"], answer: 0, explain: "systemd caches unit files in memory; daemon-reload makes it re-read them from disk before the change takes effect." },
    { q: "A service keeps crash-looping every few seconds. Which systemd feature helps you see WHY without guesswork?", options: ["systemctl mask", "journalctl -u <service> -e to inspect recent logs for that unit", "systemctl daemon-reload", "renice"], answer: 1, explain: "journalctl -u filtered to the failing unit shows the actual error output leading up to each crash." },
  ],
  "16": [
    { q: "You suspect a hardware/driver issue (e.g. a failing disk) rather than an application bug. Which log source is most directly relevant?", options: ["Application access logs only", "dmesg / journalctl -k (kernel messages)", "Shell history", "crontab -l"], answer: 1, explain: "Kernel-level hardware and driver events surface in dmesg / the kernel journal, not application logs." },
    { q: "`systemctl --failed` lists a unit, but its logs show nothing useful in the last hour. What's the next step?", options: ["Delete the unit file", "Widen the time window, e.g. `journalctl -u <unit> --since '1 day ago'`, to find the actual failure event", "Reboot with no investigation", "Ignore it, failed units are normal"], answer: 1, explain: "The failure may have happened earlier — widening the journalctl time range often reveals the root cause." },
  ],
};

// Progressive terminal-sandbox challenge tiers. Only uses commands the
// simulator actually supports (pwd, ls, cd, mkdir, touch, rm, cp, mv, cat, echo).
const CHALLENGE_TIERS = [
  {
    level: 0,
    label: "Foundations",
    tasks: [
      {
        id: "c0-1",
        desc: "Create a directory named 'workspace'",
        check: (cmd) => /^mkdir\s+workspace$/.test(cmd),
        followUp: { q: "What would happen if 'workspace' already existed and you ran plain `mkdir workspace` again?", options: ["It silently succeeds", "mkdir errors with 'File exists'", "It renames the old folder", "It deletes the old folder"], answer: 1, explain: "Without -p, mkdir errors if the target already exists." },
      },
      {
        id: "c0-2",
        desc: "Move into 'workspace' and create a file named 'draft.txt'",
        check: (cmd, term) => cmd === "touch draft.txt" && term.fs.cwdPath.join("/").endsWith("workspace"),
        followUp: { q: "Which command would you use to confirm you're inside 'workspace' before creating the file?", options: ["pwd", "rm", "cp", "kill"], answer: 0, explain: "`pwd` prints your current working directory, confirming your location." },
      },
      {
        id: "c0-3",
        desc: "List the contents of the current directory in long format",
        check: (cmd) => cmd === "ls -l" || cmd === "ls -la",
        followUp: { q: "In `ls -l` output, what does the very first character of each line typically indicate?", options: ["The file size", "Whether it's a file (-) or directory (d)", "The owner's name", "The permission count"], answer: 1, explain: "The first character is the file type indicator: '-' for regular file, 'd' for directory." },
      },
    ],
  },
  {
    level: 1,
    label: "Combining Commands",
    tasks: [
      {
        id: "c1-1",
        desc: "Create nested directories 'logs/2026/09' in a single command",
        check: (cmd) => /^mkdir\s+-p\s+logs\/2026\/09$/.test(cmd),
        followUp: { q: "Why is the -p flag necessary here instead of just `mkdir logs/2026/09`?", options: ["-p makes it faster", "-p creates all missing parent directories automatically instead of erroring", "-p is required for any mkdir command", "-p deletes existing folders first"], answer: 1, explain: "Without -p, mkdir fails if intermediate parent directories (logs, logs/2026) don't already exist." },
      },
      {
        id: "c1-2",
        desc: "Create three files named a.txt, b.txt, and c.txt with one command",
        check: (cmd) => /^touch\s+a\.txt\s+b\.txt\s+c\.txt$/.test(cmd),
        followUp: { q: "What general shell feature allows one command to act on multiple targets like this?", options: ["Piping", "Passing multiple arguments to a single command", "Redirection", "Background jobs"], answer: 1, explain: "Most Unix commands accept a variable number of arguments and apply the operation to each." },
      },
      {
        id: "c1-3",
        desc: "Make a backup copy of draft.txt named draft.bak, then remove the original draft.txt",
        check: (cmd, term, ctx) => {
          if (cmd === "cp draft.txt draft.bak") ctx.copied = true;
          if (cmd === "rm draft.txt" && ctx.copied) return true;
          return false;
        },
        followUp: { q: "Why copy before removing, instead of just deleting draft.txt directly?", options: ["It's always required by Linux", "It preserves a backup in case the original is still needed", "cp is faster than rm", "rm doesn't work without cp first"], answer: 1, explain: "Copying first ensures you retain the data even after removing the original — a basic backup safety pattern." },
      },
    ],
  },
  {
    level: 2,
    label: "Real-World Scenarios",
    tasks: [
      {
        id: "c2-1",
        desc: "From your home directory, create both 'data/raw' and 'data/processed' in one command",
        check: (cmd) => /^mkdir\s+-p\s+data\/raw\s+data\/processed$/.test(cmd),
        followUp: { q: "In a real data pipeline, why might you separate 'raw' and 'processed' into different folders?", options: ["To make the disk bigger", "To keep original untouched source data separate from transformed output, avoiding accidental overwrites", "Linux requires this structure", "It's only for permissions"], answer: 1, explain: "Separating raw and processed data is a common convention to avoid corrupting the original source during processing." },
      },
      {
        id: "c2-2",
        desc: "Rename 'a.txt' to 'config.txt' without creating a duplicate",
        check: (cmd) => cmd === "mv a.txt config.txt",
        followUp: { q: "How does `mv` differ from `cp` followed by `rm` for a rename?", options: ["No difference at all", "mv is a single atomic operation; cp+rm is two separate steps with a moment where both copies exist", "mv only works on directories", "cp+rm is always faster"], answer: 1, explain: "mv renames/moves in one step, which is both simpler and avoids a window where duplicate data exists." },
      },
      {
        id: "c2-3",
        desc: "Confirm your current location, then list the workspace directory contents without moving into it",
        check: (cmd, term, ctx) => {
          if (cmd === "pwd") ctx.pwdChecked = true;
          if (cmd === "ls workspace" && ctx.pwdChecked) return true;
          return false;
        },
        followUp: { q: "What's the benefit of `ls workspace` over `cd workspace && ls`?", options: ["There is none", "You inspect the folder without changing your current working directory", "cd workspace && ls is always faster", "ls workspace deletes files"], answer: 1, explain: "`ls <path>` lets you peek into a directory's contents while staying in your current location." },
      },
    ],
  },
];

class TutorAgent {
  constructor() {
    this.state = loadAgentState();
  }

  save() {
    saveAgentState(this.state);
  }

  getLevel() {
    return this.state.level || 0;
  }

  currentTier() {
    return CHALLENGE_TIERS[Math.min(this.getLevel(), CHALLENGE_TIERS.length - 1)];
  }

  isChallengeDone(id) {
    return this.state.completedChallenges.includes(id);
  }

  markChallengeDone(id) {
    if (!this.isChallengeDone(id)) {
      this.state.completedChallenges.push(id);
      this.save();
    }
  }

  nextIncompleteTask() {
    const tier = this.currentTier();
    return tier.tasks.find((t) => !this.isChallengeDone(t.id)) || null;
  }

  maybeLevelUp() {
    const tier = this.currentTier();
    const allDone = tier.tasks.every((t) => this.isChallengeDone(t.id));
    if (allDone && this.getLevel() < CHALLENGE_TIERS.length - 1) {
      this.state.level += 1;
      this.save();
      return true;
    }
    return false;
  }

  isHardUnlocked(moduleId) {
    return !!this.state.hardUnlocked[moduleId];
  }

  unlockHard(moduleId) {
    this.state.hardUnlocked[moduleId] = true;
    this.save();
  }
}
