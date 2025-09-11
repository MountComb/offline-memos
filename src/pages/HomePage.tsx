import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import { db, type Note } from "@/lib/db";
import Markdown from "@/components/Markdown";

function NoteItem({ note }: { note: Note }) {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(note.displayTime);

  return (
    <Link to={`/note/${note.localId}`} className="block">
      <Card>
        <CardContent className="prose dark:prose-invert whitespace-pre-wrap">
          <Markdown content={note.content} />
        </CardContent>
        <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{formattedDate}</span>
          {note.isSynced ? (
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span>Synced</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-yellow-500" />
              <span>Not Synced</span>
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
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
