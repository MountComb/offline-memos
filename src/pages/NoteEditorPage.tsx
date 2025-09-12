import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useParams } from "react-router-dom";
import { addNote, getNoteById, updateNote } from "@/lib/db";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type TimestampOption = "now" | "keep" | "set";

// Helper to convert a Date object to a string suitable for datetime-local input
const toLocalISOString = (date: Date) => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().slice(0, 16);
};

function NoteEditorPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [content, setContent] = useState("");
    const [originalDisplayTime, setOriginalDisplayTime] = useState<Date | null>(null);
    const [customDisplayTime, setCustomDisplayTime] = useState(new Date());
    const [timestampOption, setTimestampOption] = useState<TimestampOption>("now");

    const isEditing = !!id;

    useEffect(() => {
        if (isEditing) {
            const noteId = parseInt(id, 10);
            getNoteById(noteId).then(note => {
                if (note) {
                    setContent(note.content);
                    setOriginalDisplayTime(note.displayTime);
                    setTimestampOption("keep");
                }
            });
        } else {
          setTimestampOption("now");
        }
    }, [id, isEditing]);

    const getEffectiveDisplayTime = () => {
        switch (timestampOption) {
            case "now":
                return new Date();
            case "keep":
                return originalDisplayTime || new Date();
            case "set":
                return customDisplayTime;
        }
    };

    const handleSave = async () => {
        const effectiveDisplayTime = getEffectiveDisplayTime();

        if (isEditing) {
            const noteId = parseInt(id, 10);
            await updateNote(noteId, content, effectiveDisplayTime);
        } else {
            await addNote(content, effectiveDisplayTime);
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

            <div className="rounded-md border p-4">
                <h2 className="mb-2 text-lg font-semibold">Timestamp</h2>
                <RadioGroup value={timestampOption} onValueChange={(value) => setTimestampOption(value as TimestampOption)} className="mb-4">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="now" id="now" />
                        <Label htmlFor="now">Now</Label>
                    </div>
                    {isEditing && originalDisplayTime && (
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="keep" id="keep" />
                            <Label htmlFor="keep">Keep Original ({originalDisplayTime.toLocaleString()})</Label>
                        </div>
                    )}
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="set" id="set" />
                        <Label htmlFor="set">Set Custom</Label>
                    </div>
                </RadioGroup>

                {timestampOption === "set" && (
                    <input
                        type="datetime-local"
                        className="w-auto rounded-md border bg-transparent p-2 text-sm"
                        value={toLocalISOString(customDisplayTime)}
                        onChange={(e) => setCustomDisplayTime(new Date(e.target.value))}
                    />
                )}
            </div>

            <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
                <Button onClick={handleSave} disabled={!content.trim()}>Save</Button>
            </div>
        </div>
    );
}

export default NoteEditorPage;
