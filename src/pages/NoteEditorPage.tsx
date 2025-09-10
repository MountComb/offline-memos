import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";

function NoteEditorPage() {
    const navigate = useNavigate();

    // In a real implementation, we'd check if we're editing an existing note
    const isEditing = false; 

    const handleSave = () => {
        // Later, this will save to IndexedDB
        console.log("Saving note...");
        navigate("/");
    };

    const handleCancel = () => {
        navigate("/");
    };

    return (
        <div className="flex h-full flex-col gap-4">
            <h1 className="text-2xl font-bold">{isEditing ? "Edit Note" : "Create Note"}</h1>
            <div className="flex-1">
                <Textarea 
                    className="h-full min-h-64 resize-none"
                    placeholder="Write your memo here... Markdown is supported."
                />
            </div>
            <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
            </div>
        </div>
    );
}

export default NoteEditorPage;
