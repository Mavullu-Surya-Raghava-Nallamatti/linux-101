# 11 — Monitoring & Disk Usage

[⬅ Back to course outline](../README.md) | Previous: [Text Processing & Editors](10-text-processing.md) | Next: [Archiving & Compression ➡](12-archiving-compression.md)

## Disk space

```bash
df -h              # free/used space per mounted filesystem, human-readable
df -i                # inode usage (can run out even with free space left!)
du -sh /var/log         # total size of a directory
du -h --max-depth=1 /      # size of each top-level folder (find what's eating space)
lsblk                        # list block devices (disks/partitions) as a tree
fdisk -l                       # detailed partition info (needs root)
```

## Memory

```bash
free -h              # total/used/free RAM and swap, human-readable
cat /proc/meminfo       # very detailed memory stats
vmstat 1                  # virtual memory stats, refreshed every second
```

## CPU & load

```bash
uptime                       # how long the system's been up + load averages
cat /proc/cpuinfo               # detailed CPU info
lscpu                             # summarized CPU info (cores, model, etc.)
nproc                               # number of available processing units
mpstat 1                              # per-CPU usage stats (may need sysstat package)
```

### Understanding load average

`uptime` reports three numbers, e.g. `0.52 0.60 0.55` — average number of processes waiting for CPU over the last **1, 5, and 15 minutes**. A load of 1.0 per core roughly means the CPU is fully utilized.

## I/O and general activity

```bash
iostat -x 1              # disk I/O stats (needs sysstat)
iotop                       # per-process disk I/O (like top, but for disk)
sar -u 1 5                    # historical/live CPU stats (sysstat)
```

## Combined live dashboards

```bash
top            # classic process/resource monitor
htop             # nicer UI version of top
glances             # all-in-one system monitor (CPU, RAM, disk, network)
```

## Mount points

```bash
mount                    # show all currently mounted filesystems
mount | column -t           # nicely aligned output
cat /etc/fstab                # filesystems configured to mount at boot
sudo mount /dev/sdb1 /mnt        # manually mount a device
sudo umount /mnt                   # unmount
```

## System info

```bash
uname -a               # kernel name, version, architecture
cat /etc/os-release       # distro name and version
hostnamectl                  # hostname, OS, kernel, virtualization info
lsusb                           # list USB devices
lspci                             # list PCI devices (GPU, network cards, etc.)
```

---
Next: [12 — Archiving & Compression ➡](12-archiving-compression.md)
