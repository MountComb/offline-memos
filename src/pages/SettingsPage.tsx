import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

function SettingsPage() {
    const handleSave = () => {
        // Later, this will save settings to localStorage or IndexedDB
        console.log("Saving settings...");
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Settings</h2>
                <p className="text-muted-foreground">
                    Configure your Memos instance and preferences.
                </p>
            </div>
            <Separator />
            <div className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="api-endpoint">Memos API Endpoint</Label>
                    <Input id="api-endpoint" placeholder="https://your-memos-instance.com" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="access-token">Access Token</Label>
                    <Input id="access-token" type="password" placeholder="Your secret access token" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="auto-delete">Auto-delete synced notes (days)</Label>
                    <Input id="auto-delete" type="number" placeholder="e.g., 7" defaultValue={0} />
                     <p className="text-xs text-muted-foreground">
                        Set to 0 to disable auto-delete.
                    </p>
                </div>
            </div>
            <Button onClick={handleSave}>Save Settings</Button>
        </div>
    );
}

export default SettingsPage;
