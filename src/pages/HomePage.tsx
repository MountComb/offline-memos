import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

// Mock data for initial UI display
const mockNotes = [
  {
    localId: 1,
    content: "This is my first note. It's stored locally and not synced yet.",
    displayTime: new Date(),
    isSynced: false,
  },
  {
    localId: 2,
    content: "This is a synced note. It has been saved to the remote Memos server.",
    displayTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    isSynced: true,
  },
  {
    localId: 3,
    content: "Markdown is supported! You can use **bold**, *italic*, and `code`.",
    displayTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    isSynced: true,
  },
];


function NoteItem({ note }: { note: typeof mockNotes[0] }) {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(note.displayTime);

  return (
    <Card>
      <Link to={`/note/${note.localId}`}>
        <CardContent className="pt-6">
          <p className="whitespace-pre-wrap text-sm text-foreground">{note.content}</p>
        </CardContent>
        <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{formattedDate}</span>
          {!note.isSynced && <Badge variant="outline">Not Synced</Badge>}
        </CardFooter>
      </Link>
    </Card>
  );
}


function HomePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Your Notes</h1>
       {mockNotes.length > 0 ? (
        <div className="space-y-4">
          {mockNotes.map((note) => (
            <NoteItem key={note.localId} note={note} />
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground">
            <p>You don't have any notes yet.</p>
            <p>Click the '+' button to create one.</p>
        </div>
      )}
    </div>
  );
}

export default HomePage;
