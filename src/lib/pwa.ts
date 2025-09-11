import { useEffect } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { toast } from "sonner";

// This hook can be used in the main App component to register the service worker
// and show a toast when the app is ready for offline use.
// It also provides the necessary state and actions for the update prompt.
export const usePWAUpdate = () => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  useEffect(() => {
    if (offlineReady) {
      toast.success("App is ready to work offline.");
      setOfflineReady(false);
    }
  }, [offlineReady, setOfflineReady]);

  return {
    needRefresh,
    updateServiceWorker: () => updateServiceWorker(true),
  };
};
