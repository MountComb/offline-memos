import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getSettings, saveSettings, type AppSettings } from "@/lib/settings";
import { deleteDatabase } from "@/lib/db";
import { MemosAPI } from "@/lib/memos-api";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SettingsPageProps {
  pwaNeedsRefresh: boolean;
  pwaUpdateServiceWorker: () => void;
}

function SettingsPage({ pwaNeedsRefresh, pwaUpdateServiceWorker }: SettingsPageProps) {
  const [settings, setSettings] = useState<AppSettings>({ apiEndpoint: "", accessToken: "", autoDeleteDays: 0 });
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
    setSettings((prevSettings) => ({
      ...prevSettings,
      [id]: type === "number" ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleTestConnection = async () => {
    toast.info("Testing connection...");
    const api = new MemosAPI(settings);
    const result = await api.testConnection();
    if (result.ok) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleDeleteDatabase = async () => {
    console.log("Database deletion initiated");
    await deleteDatabase();
    toast.success("Local database deleted. The app will now reload.");
    setTimeout(() => window.location.reload(), 2000);
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
        <div>
          <h3 className="text-lg font-medium">API Settings</h3>
          <p className="text-sm text-muted-foreground">
            Configure the connection to your Memos instance.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="apiEndpoint">Memos API Endpoint</Label>
          <Input id="apiEndpoint" value={settings.apiEndpoint} onChange={handleChange} placeholder="https://your-memos-instance.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="accessToken">Access Token</Label>
          <Input id="accessToken" type="password" value={settings.accessToken} onChange={handleChange} placeholder="Your secret access token" />
        </div>
        <Button variant="outline" onClick={handleTestConnection}>Test Connection</Button>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Local Data</h3>
          <p className="text-sm text-muted-foreground">
            Manage local data and sync settings.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="autoDeleteDays">Auto-delete synced notes (days)</Label>
          <Input id="autoDeleteDays" type="number" value={settings.autoDeleteDays} onChange={handleChange} placeholder="e.g., 7" />
          <p className="text-xs text-muted-foreground">Set to 0 to disable auto-delete.</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={handleSave}>Save Settings</Button>
        <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
      </div>

      <Separator />

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>These actions are irreversible. Please proceed with caution.</CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Local Database</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all your local notes, including those that have not been synced. All settings will be reset.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteDatabase}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
          <CardDescription>Information about the application.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Version: {import.meta.env.APP_VERSION}</span>
            {pwaNeedsRefresh && (
              <Button onClick={() => pwaUpdateServiceWorker()}>Reload for New Version</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SettingsPage;
