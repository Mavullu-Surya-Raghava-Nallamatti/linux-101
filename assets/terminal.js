// A tiny in-memory filesystem simulator to let users practice real command syntax
// entirely client-side (no server), safe to run on GitHub Pages.

function createVirtualFS() {
  const root = { type: "dir", name: "/", children: {} };
  root.children["home"] = { type: "dir", name: "home", children: {} };
  root.children["home"].children["student"] = { type: "dir", name: "student", children: {} };
  root.children["etc"] = { type: "dir", name: "etc", children: {
    "passwd": { type: "file", name: "passwd", content: "root:x:0:0:root:/root:/bin/bash\nstudent:x:1000:1000:Student:/home/student:/bin/bash\n" },
    "hostname": { type: "file", name: "hostname", content: "practice-box\n" },
  } };
  root.children["var"] = { type: "dir", name: "var", children: {
    "log": { type: "dir", name: "log", children: {
      "syslog": { type: "file", name: "syslog", content: "Sep 15 09:00:01 practice-box systemd[1]: Started session.\n" },
    } },
  } };
  return { root, cwd: root.children["home"].children["student"], cwdPath: ["home", "student"] };
}

class Terminal {
  constructor(outputEl, onCommand) {
    this.outputEl = outputEl;
    this.onCommand = onCommand;
    this.fs = createVirtualFS();
    this.history = [];
  }

  resolvePathParts(pathParts) {
    let node = pathParts[0] === "" ? this.fs.root : this.fs.cwd;
    const parts = pathParts[0] === "" ? pathParts.slice(1) : pathParts;
    for (const part of parts) {
      if (part === "" || part === ".") continue;
      if (part === "..") {
        node = node.__parent || node;
        continue;
      }
      if (!node.children || !node.children[part]) return null;
      node = node.children[part];
    }
    return node;
  }

  getNode(path) {
    if (!path) return this.fs.cwd;
    if (path === "/") return this.fs.root;
    if (path === "~") return this.fs.root.children["home"].children["student"];
    const parts = path.split("/");
    return this.resolvePathParts(parts);
  }

  currentPathString() {
    return "/" + this.fs.cwdPath.join("/");
  }

  print(text, cls) {
    const div = document.createElement("div");
    if (cls) div.className = cls;
    div.textContent = text;
    this.outputEl.appendChild(div);
    this.outputEl.scrollTop = this.outputEl.scrollHeight;
  }

  printPrompt(cmd) {
    this.print(`student@practice-box:${this.currentPathString()}$ ${cmd}`, "cmd-line");
  }

  run(raw) {
    const cmd = raw.trim();
    this.printPrompt(cmd);
    if (cmd === "") return;
    this.history.push(cmd);
    const [name, ...args] = cmd.split(/\s+/);
    try {
      this.dispatch(name, args, cmd);
    } catch (e) {
      this.print(String(e.message || e), "err-line");
    }
    if (this.onCommand) this.onCommand(name, args, cmd);
  }

  dispatch(name, args, fullCmd) {
    switch (name) {
      case "pwd":
        this.print(this.currentPathString());
        break;
      case "whoami":
        this.print("student");
        break;
      case "clear":
        this.outputEl.innerHTML = "";
        break;
      case "echo":
        this.print(args.join(" "));
        break;
      case "help":
        this.print("Supported: pwd, ls, cd, mkdir, touch, rm, cat, echo, cp, mv, whoami, clear, help");
        break;
      case "ls":
        this.cmdLs(args);
        break;
      case "cd":
        this.cmdCd(args);
        break;
      case "mkdir":
        this.cmdMkdir(args);
        break;
      case "touch":
        this.cmdTouch(args);
        break;
      case "cat":
        this.cmdCat(args);
        break;
      case "rm":
        this.cmdRm(args);
        break;
      case "cp":
        this.cmdCp(args);
        break;
      case "mv":
        this.cmdMv(args);
        break;
      default:
        this.print(`command not found: ${name}`, "err-line");
    }
  }

  cmdLs(args) {
    const flags = args.filter((a) => a.startsWith("-")).join("");
    const targets = args.filter((a) => !a.startsWith("-"));
    const target = targets[0];
    const node = target ? this.getNode(target) : this.fs.cwd;
    if (!node || node.type !== "dir") {
      this.print(`ls: cannot access '${target}': No such file or directory`, "err-line");
      return;
    }
    const names = Object.keys(node.children);
    if (names.length === 0) return;
    if (flags.includes("l")) {
      for (const n of names) {
        const child = node.children[n];
        const kind = child.type === "dir" ? "d" : "-";
        this.print(`${kind}rwxr-xr-x 1 student student ${child.type === "file" ? (child.content || "").length : 4096} ${n}${child.type === "dir" ? "/" : ""}`);
      }
    } else {
      this.print(names.map((n) => (node.children[n].type === "dir" ? n + "/" : n)).join("  "));
    }
  }

  cmdCd(args) {
    const target = args[0] || "~";
    if (target === "..") {
      if (this.fs.cwdPath.length > 0) {
        this.fs.cwdPath.pop();
        this.fs.cwd = this.getNode("/" + this.fs.cwdPath.join("/")) || this.fs.root;
      }
      return;
    }
    if (target === "~" || target === "/home/student") {
      this.fs.cwdPath = ["home", "student"];
      this.fs.cwd = this.fs.root.children["home"].children["student"];
      return;
    }
    if (target === "/") {
      this.fs.cwdPath = [];
      this.fs.cwd = this.fs.root;
      return;
    }
    const node = target.startsWith("/") ? this.getNode(target) : this.fs.cwd.children[target];
    if (!node || node.type !== "dir") {
      this.print(`cd: no such file or directory: ${target}`, "err-line");
      return;
    }
    this.fs.cwd = node;
    if (target.startsWith("/")) {
      this.fs.cwdPath = target.split("/").filter(Boolean);
    } else {
      this.fs.cwdPath.push(target);
    }
  }

  cmdMkdir(args) {
    const flags = args.filter((a) => a.startsWith("-"));
    const names = args.filter((a) => !a.startsWith("-"));
    for (const n of names) {
      if (flags.includes("-p")) {
        let node = this.fs.cwd;
        for (const part of n.split("/")) {
          if (!node.children[part]) {
            node.children[part] = { type: "dir", name: part, children: {}, __parent: node };
          }
          node = node.children[part];
        }
      } else {
        if (this.fs.cwd.children[n]) {
          this.print(`mkdir: cannot create directory '${n}': File exists`, "err-line");
          continue;
        }
        this.fs.cwd.children[n] = { type: "dir", name: n, children: {}, __parent: this.fs.cwd };
      }
    }
  }

  cmdTouch(args) {
    for (const n of args) {
      if (!this.fs.cwd.children[n]) {
        this.fs.cwd.children[n] = { type: "file", name: n, content: "", __parent: this.fs.cwd };
      }
    }
  }

  cmdCat(args) {
    for (const n of args) {
      const node = n.startsWith("/") ? this.getNode(n) : this.fs.cwd.children[n];
      if (!node || node.type !== "file") {
        this.print(`cat: ${n}: No such file or directory`, "err-line");
        continue;
      }
      this.print(node.content || "");
    }
  }

  cmdRm(args) {
    const flags = args.filter((a) => a.startsWith("-"));
    const names = args.filter((a) => !a.startsWith("-"));
    for (const n of names) {
      const node = this.fs.cwd.children[n];
      if (!node) {
        this.print(`rm: cannot remove '${n}': No such file or directory`, "err-line");
        continue;
      }
      if (node.type === "dir" && Object.keys(node.children).length && !flags.includes("-r") && !flags.includes("-rf")) {
        this.print(`rm: cannot remove '${n}': Is a directory (use -r)`, "err-line");
        continue;
      }
      delete this.fs.cwd.children[n];
    }
  }

  cmdCp(args) {
    if (args.length < 2) { this.print("cp: missing file operand", "err-line"); return; }
    const [src, dest] = args;
    const node = this.fs.cwd.children[src];
    if (!node) { this.print(`cp: cannot stat '${src}': No such file or directory`, "err-line"); return; }
    this.fs.cwd.children[dest] = JSON.parse(JSON.stringify(node));
  }

  cmdMv(args) {
    if (args.length < 2) { this.print("mv: missing file operand", "err-line"); return; }
    const [src, dest] = args;
    const node = this.fs.cwd.children[src];
    if (!node) { this.print(`mv: cannot stat '${src}': No such file or directory`, "err-line"); return; }
    this.fs.cwd.children[dest] = node;
    delete this.fs.cwd.children[src];
  }
}
