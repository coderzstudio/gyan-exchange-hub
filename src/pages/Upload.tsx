import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload as UploadIcon, Loader2 } from "lucide-react";
import { uploadSchema } from "@/lib/validation";

const Upload = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file with zod schema
      const fileValidation = uploadSchema.shape.file.safeParse(selectedFile);
      if (!fileValidation.success) {
        toast.error(fileValidation.error.errors[0].message);
        e.target.value = "";
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!semester || !subject || !topic || !file) {
      toast.error("Please fill in all fields");
      return;
    }

    // Validate all inputs with zod
    const validation = uploadSchema.safeParse({
      semester: parseInt(semester),
      subject: subject.trim(),
      topic: topic.trim(),
      tags,
      file
    });

    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    setLoading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please login first");
        navigate("/auth");
        return;
      }

      // Upload file to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("notes")
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("notes")
        .getPublicUrl(fileName);

      // Save note to database using validated data
      const { error: insertError } = await supabase.from("notes").insert({
        uploader_id: user.id,
        semester: validation.data.semester,
        subject: validation.data.subject,
        topic: validation.data.topic,
        file_url: publicUrl,
        file_type: file.type,
        tags: validation.data.tags,
      });

      if (insertError) {
        throw insertError;
      }

      // Award Gyan Points using secure RPC function
      await supabase.rpc("award_upload_points", { _user_id: user.id });

      toast.success("Note uploaded successfully! You earned 10 Gyan Points!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload note");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Upload Study Notes</CardTitle>
                <CardDescription>
                  Share your knowledge and earn Gyan Points
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="semester">Semester</Label>
                    <Select value={semester} onValueChange={setSemester}>
                      <SelectTrigger id="semester">
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6].map((sem) => (
                          <SelectItem key={sem} value={sem.toString()}>
                            Semester {sem}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="e.g., Data Structures, Web Development"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="topic">Topic</Label>
                    <Input
                      id="topic"
                      placeholder="e.g., Binary Search Trees, React Hooks"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      placeholder="e.g., algorithms, data structures, tutorial"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="file">Upload File (PDF or Image, max 10MB)</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="file"
                        type="file"
                        accept=".pdf,image/*"
                        onChange={handleFileChange}
                        disabled={loading}
                        className="cursor-pointer"
                      />
                      {file && (
                        <span className="text-sm text-muted-foreground">
                          {file.name}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                    <p className="text-sm text-foreground">
                      <strong>Note:</strong> By uploading, you'll earn 10 Gyan Points instantly! High-quality notes with good ratings will help you level up your reputation.
                    </p>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <UploadIcon className="mr-2 h-4 w-4" />
                        Upload Note
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Upload;
