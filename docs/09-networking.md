# 09 — Networking

[⬅ Back to course outline](../README.md) | Previous: [Users & Groups](08-users-groups.md) | Next: [Text Processing & Editors ➡](10-text-processing.md)

## Viewing network configuration

| Command | Description |
|---|---|
| `ip addr` (or `ip a`) | Show IP addresses for all interfaces (modern replacement for `ifconfig`) |
| `ip link` | Show network interfaces and their state (up/down) |
| `ip route` | Show the routing table |
| `hostname` | Show the system's hostname |
| `hostnamectl` | Show/set hostname and related metadata |
| `ifconfig` | Legacy tool to show/configure interfaces (deprecated but common) |

```bash
ip addr show eth0        # details for one interface
ip link set eth0 up        # bring an interface up
```

## Connectivity testing

```bash
ping google.com                # test reachability (ICMP echo)
ping -c 4 8.8.8.8                 # send exactly 4 packets
traceroute google.com               # show the route packets take (Linux)
mtr google.com                        # continuous traceroute + ping stats
```

## DNS

```bash
nslookup google.com          # query DNS for a domain
dig google.com                  # more detailed DNS query tool
dig +short google.com              # just the IP
cat /etc/resolv.conf                 # configured DNS servers
```

## Transferring data / talking to servers

```bash
curl https://example.com                 # fetch a URL, print response to stdout
curl -I https://example.com                 # headers only
curl -o file.html https://example.com          # save output to a file
wget https://example.com/file.zip                # download a file
```

## Remote access

```bash
ssh user@remote-host                    # secure shell into a remote machine
ssh -p 2222 user@remote-host              # connect on a non-default port
ssh-keygen -t ed25519                       # generate an SSH keypair
ssh-copy-id user@remote-host                  # copy your public key for passwordless login
scp file.txt user@remote-host:/tmp/             # copy a file to a remote host
scp user@remote-host:/tmp/file.txt .              # copy a file from a remote host
rsync -avz src/ user@remote-host:/dest/             # efficient sync/copy (see module 12)
```

## Inspecting ports & connections

```bash
ss -tulpn                 # modern tool: listening TCP/UDP ports + process (replaces netstat)
netstat -tulpn               # legacy equivalent
lsof -i :8080                   # what process is using port 8080
```

- `-t` TCP, `-u` UDP, `-l` listening only, `-p` show process, `-n` numeric (skip DNS lookups)

## Firewall basics

```bash
sudo ufw status                    # Ubuntu's simple firewall front-end
sudo ufw allow 22/tcp                 # allow SSH
sudo ufw enable                          # turn on the firewall

sudo firewall-cmd --state               # firewalld status (Fedora/RHEL)
sudo firewall-cmd --add-service=http --permanent
sudo firewall-cmd --reload

sudo iptables -L -n -v                    # low-level packet filtering rules (all distros)
```

## Network configuration files

| File | Purpose |
|---|---|
| `/etc/hosts` | Static hostname → IP mappings, checked before DNS |
| `/etc/resolv.conf` | DNS resolver configuration |
| `/etc/network/interfaces` (Debian) or Netplan YAML (Ubuntu) | Static network interface config |
| `/etc/nsswitch.conf` | Order of name resolution sources |

---
Next: [10 — Text Processing & Editors ➡](10-text-processing.md)
