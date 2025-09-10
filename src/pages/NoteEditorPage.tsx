import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useParams } from "react-router-dom";
import { addNote, getNoteById, updateNote } from "@/lib/db";

function NoteEditorPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [content, setContent] = useState("");
    const isEditing = !!id;

    useEffect(() => {
        if (isEditing) {
            const noteId = parseInt(id, 10);
            getNoteById(noteId).then(note => {
                if (note) {
                    setContent(note.content);
                }
            });
        }
    }, [id, isEditing]);

    const handleSave = async () => {
        if (isEditing) {
            const noteId = parseInt(id, 10);
            await updateNote(noteId, content);
        } else {
            await addNote(content);
        }
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
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </div>
            <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
                <Button onClick={handleSave} disabled={!content.trim()}>Save</Button>
            </div>
        </div>
    );
}

export default NoteEditorPage;
