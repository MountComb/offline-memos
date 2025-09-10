import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getSettings, saveSettings, type AppSettings } from '@/lib/settings';
import { toast } from 'sonner';

function SettingsPage() {
    const [settings, setSettings] = useState<AppSettings>({ apiEndpoint: '', accessToken: '', autoDeleteDays: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        setSettings(getSettings());
    }, []);

    const handleSave = () => {
        saveSettings(settings);
        toast.success("Settings saved!");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value, type } = e.target;
        setSettings(prevSettings => ({
            ...prevSettings,
            [id]: type === 'number' ? parseInt(value, 10) || 0 : value,
        }));
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
                    <Label htmlFor="apiEndpoint">Memos API Endpoint</Label>
                    <Input id="apiEndpoint" value={settings.apiEndpoint} onChange={handleChange} placeholder="https://your-memos-instance.com" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="accessToken">Access Token</Label>
                    <Input id="accessToken" type="password" value={settings.accessToken} onChange={handleChange} placeholder="Your secret access token" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="autoDeleteDays">Auto-delete synced notes (days)</Label>
                    <Input id="autoDeleteDays" type="number" value={settings.autoDeleteDays} onChange={handleChange} placeholder="e.g., 7" />
                     <p className="text-xs text-muted-foreground">
                        Set to 0 to disable auto-delete.
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button onClick={handleSave}>Save Settings</Button>
                <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
            </div>
        </div>
    );
}

export default SettingsPage;
