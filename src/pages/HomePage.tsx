import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import { db, type Note } from "@/lib/db";

function NoteItem({ note }: { note: Note }) {
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
  const notes = useLiveQuery(() => db.notes.orderBy('displayTime').reverse().toArray());

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Your Notes</h1>
       {notes && notes.length > 0 ? (
        <div className="space-y-4">
          {notes.map((note) => (
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
