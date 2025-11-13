import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { BookmarkCheck, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface SavedNote {
  id: string;
  note_id: string;
  created_at: string;
  notes: {
    id: string;
    topic: string;
    subject: string;
    category: string;
    level: string;
    trust_score: number;
    file_type: string;
    profiles: {
      full_name: string;
      reputation_level: string;
    };
  };
}

const Library = () => {
  const navigate = useNavigate();
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    checkAuthAndFetchNotes();
  }, []);

  const checkAuthAndFetchNotes = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user?.id) {
      toast.error("Please login to view your library");
      navigate("/auth");
      return;
    }

    setCurrentUserId(session.user.id);
    fetchSavedNotes(session.user.id);
  };

  const fetchSavedNotes = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("saved_notes")
        .select(`
          id,
          note_id,
          created_at,
          notes (
            id,
            topic,
            subject,
            category,
            level,
            trust_score,
            file_type,
            uploader_id
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Library error:", error);
        toast.error("Failed to load saved notes");
        setLoading(false);
        return;
      }

      if (!data || data.length === 0) {
        setSavedNotes([]);
        setLoading(false);
        return;
      }

      // Fetch profiles separately for the uploaders
      const uploaderIds = data
        .map(item => item.notes?.uploader_id)
        .filter(Boolean);

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, reputation_level")
        .in("id", uploaderIds);

      // Merge profiles with notes
      const notesWithProfiles = data.map(item => ({
        ...item,
        notes: item.notes ? {
          ...item.notes,
          profiles: profiles?.find(p => p.id === item.notes?.uploader_id) || {
            full_name: "Unknown",
            reputation_level: "Newbie"
          }
        } : null
      }));

      setSavedNotes(notesWithProfiles as any);
    } catch (error) {
      console.error("Library fetch error:", error);
      toast.error("Failed to load saved notes");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveNote = async (savedNoteId: string) => {
    const { error } = await supabase
      .from("saved_notes")
      .delete()
      .eq("id", savedNoteId);

    if (error) {
      toast.error("Failed to remove note");
    } else {
      toast.success("Removed from library");
      setSavedNotes(savedNotes.filter(note => note.id !== savedNoteId));
    }
  };

  const getReputationColor = (level: string) => {
    switch (level) {
      case "Legend":
        return "bg-purple-500";
      case "Top Contributor":
        return "bg-accent";
      case "Active":
        return "bg-success";
      case "Contributor":
        return "bg-primary";
      default:
        return "bg-muted";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <BookmarkCheck className="h-8 w-8 text-primary" />
            My Library
          </h1>
          <p className="text-muted-foreground">
            Your saved notes for future reference and download
          </p>
        </div>

        {savedNotes.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookmarkCheck className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No saved notes yet</h3>
              <p className="text-muted-foreground mb-6">
                Start building your library by saving notes you want to revisit
              </p>
              <Button onClick={() => navigate("/notes")}>
                Browse Notes
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedNotes.map((savedNote) => (
              <Card key={savedNote.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg line-clamp-2">
                      {savedNote.notes.topic}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveNote(savedNote.id)}
                      className="ml-2"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">
                      {savedNote.notes.category === "programming" ? savedNote.notes.level :
                       savedNote.notes.category === "school" ? `Class ${savedNote.notes.level}` :
                       `Semester ${savedNote.notes.level}`}
                    </Badge>
                    <Badge variant="outline">{savedNote.notes.subject}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">By {savedNote.notes.profiles.full_name}</span>
                      <Badge className={getReputationColor(savedNote.notes.profiles.reputation_level)}>
                        {savedNote.notes.profiles.reputation_level}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Trust Score:</span>
                      <span className="font-semibold text-success">{savedNote.notes.trust_score}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Saved:</span>
                      <span className="text-sm">{new Date(savedNote.created_at).toLocaleDateString()}</span>
                    </div>
                    <Button 
                      onClick={() => navigate(`/notes/${savedNote.note_id}`)}
                      className="w-full"
                    >
                      View Note
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;
