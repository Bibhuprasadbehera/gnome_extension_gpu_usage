import St from 'gi://St';
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import Extension from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelmenu.js';

export default class GPUUsageMonitor extends Extension {
    enable() {
        this._label = null;
        this._indicator = null;
        this._timerId = null;

        // Create the indicator button required by addToStatusArea
        this._indicator = new PanelMenu.Button(0, 'gpu-usage-monitor');

        // Create the label for the top bar
        this._label = new St.Label({
            text: 'GPU: --%',
            style_class: 'panel-button'
        });

        // Add the label to the button
        this._indicator.add_child(this._label);

        // Add the indicator button to the GNOME Shell status area
        Main.panel.addToStatusArea('gpu-usage-monitor', this._indicator);

        // Initial update
        this._updateUsage();

        // Update every 2 seconds
        this._timerId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 2, () => {
            this._updateUsage();
            return GLib.SOURCE_CONTINUE;
        });
    }

    disable() {
        // Stop the timer to prevent memory leaks
        if (this._timerId) {
            GLib.source_remove(this._timerId);
            this._timerId = null;
        }
        
        // Remove the indicator from the top bar
        if (this._indicator) {
            this._indicator.destroy();
            this._indicator = null;
        }
        
        this._label = null;
    }

    /**
     * Fetches the current GPU utilization using nvidia-smi and updates the top bar label.
     */
    _updateUsage() {
        try {
            // Use Gio.Subprocess to avoid blocking the GNOME Shell main thread.
            const proc = Gio.Subprocess.new(
                ['nvidia-smi', '--query-gpu=utilization.gpu', '--format=csv,noheader,nounits'],
                Gio.SubprocessFlags.STDOUT_PIPE
            );
            
            proc.communicate_utf8_async(null, (stream, output, error) => {
                if (error || !output) {
                    if (this._label) this._label.set_text('GPU: Error');
                    return;
                }
                if (this._label) {
                    this._label.set_text(`GPU: ${output.trim()}%`);
                }
            });
        } catch (e) {
            if (this._label) this._label.set_text('GPU: Error');
            console.error(`GPU Usage Monitor Error: ${e}`);
        }
    }
}