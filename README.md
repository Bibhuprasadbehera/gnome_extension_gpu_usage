# GPU Usage Monitor for GNOME

A lightweight GNOME Shell extension that displays the current utilization of your NVIDIA GPU in the top bar.

## 🚀 Features
- **Real-time Monitoring**: Polls GPU usage every 2 seconds.
- **Non-blocking**: Uses asynchronous subprocesses to ensure the GNOME Shell UI remains fluid.
- **Compatible**: Designed for GNOME Shell versions 45 through 49.

## 📋 Prerequisites
- **NVIDIA GPU**: This extension relies on NVIDIA drivers.
- **nvidia-smi**: Ensure the `nvidia-smi` utility is installed and available in your system PATH.

## 🛠 Installation

### 1. Copy the Extension Folder
The extension must be placed in the local GNOME extensions directory. Run the following command to install it from your documents folder:

```bash
mkdir -p ~/.local/share/gnome-shell/extensions/gpu-usage-monitor@bibhu
cp -r /home/bibhu/Documents/gnome_extension/. ~/.local/share/gnome-shell/extensions/gpu-usage-monitor@bibhu/
```

### 2. Restart GNOME Shell
GNOME Shell only scans for new extensions upon startup.
- **X11**: Press `Alt+F2`, type `r`, and hit `Enter`.
- **Wayland**: Log out and log back in.

### 3. Enable the Extension
You can enable it via the **Extensions** app or using the CLI:

```bash
gnome-extensions enable gpu-usage-monitor@bibhu
```

## ⚙️ How it Works
The extension creates a `St.Label` in the top bar. Every 2 seconds, it executes the following command asynchronously via `Gio.Subprocess`:

```bash
nvidia-smi --query-gpu=utilization.gpu --format=csv,noheader,nounits
```

The output (a simple integer) is then parsed and displayed as `GPU: X%`.

## 📁 File Structure
- `metadata.json`: Contains the extension UUID, name, and supported GNOME versions.
- `extension.js`: Contains the main logic for the UI and data polling.