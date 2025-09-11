import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import HomePage from "@/pages/HomePage";
import NoteEditorPage from "@/pages/NoteEditorPage";
import SettingsPage from "@/pages/SettingsPage";
import { Toaster } from "@/components/ui/sonner";
import { cleanupOldNotes } from "./lib/cleanup";
import { usePWAUpdate } from "./lib/pwa";

function App() {
  const { needRefresh, updateServiceWorker } = usePWAUpdate();

  useEffect(() => {
    cleanupOldNotes();
  }, []);

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="new" element={<NoteEditorPage />} />
          <Route path="note/:id" element={<NoteEditorPage />} />
          <Route
            path="settings"
            element={<SettingsPage pwaNeedsRefresh={needRefresh} pwaUpdateServiceWorker={updateServiceWorker} />}
          />
        </Route>
      </Routes>
      <Toaster position="top-center" richColors />
    </Router>
  );
}

export default App;
