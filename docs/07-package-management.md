# 07 — Package Management

[⬅ Back to course outline](../README.md) | Previous: [Process Management](06-process-management.md) | Next: [Users & Groups ➡](08-users-groups.md)

Package managers install, upgrade, configure, and remove software, resolving dependencies automatically.

## Debian/Ubuntu — `apt` / `dpkg`

```bash
sudo apt update                  # refresh package index from repositories
sudo apt upgrade                  # upgrade all installed packages
sudo apt install nginx              # install a package
sudo apt remove nginx                 # remove a package (keep config files)
sudo apt purge nginx                    # remove package + config files
sudo apt autoremove                       # remove unused dependencies
apt search nginx                           # search available packages
apt show nginx                              # show package details
dpkg -l                                       # list installed packages
dpkg -i package.deb                             # install a local .deb file
```

## Red Hat/Fedora/CentOS — `dnf` / `yum` / `rpm`

```bash
sudo dnf check-update            # check for updates
sudo dnf update                    # update all packages
sudo dnf install httpd               # install a package
sudo dnf remove httpd                  # remove a package
dnf search nginx                         # search packages
dnf info nginx                             # package details
rpm -qa                                      # list installed packages
rpm -ivh package.rpm                           # install a local .rpm file
```

(`yum` is the older tool; `dnf` is its modern successor with the same core commands.)

## Arch Linux — `pacman`

```bash
sudo pacman -Syu           # sync repos and upgrade everything
sudo pacman -S htop           # install a package
sudo pacman -R htop             # remove a package
sudo pacman -Ss htop               # search for a package
pacman -Q                            # list installed packages
```

## Universal/cross-distro formats

| Tool | Format | Notes |
|---|---|---|
| `snap` | Snap packages | Sandboxed, auto-updating, by Canonical: `sudo snap install code` |
| `flatpak` | Flatpak packages | Sandboxed, desktop-focused: `flatpak install flathub org.gimp.GIMP` |
| `AppImage` | Single-file apps | No installation needed, just `chmod +x` and run |

## Building from source (when no package exists)

```bash
tar -xzf project.tar.gz && cd project
./configure                 # check dependencies, generate Makefile
make                          # compile
sudo make install               # install system-wide
```

## Choosing packages wisely

- Prefer your distro's official repositories first — they're vetted and integrate with the update system.
- Only add third-party repositories (PPAs, COPR, etc.) from sources you trust — they run with system privileges.
- Use `apt list --installed`, `dnf list installed`, or `pacman -Q` to audit what's on your system.

---
Next: [08 — Users & Groups ➡](08-users-groups.md)
