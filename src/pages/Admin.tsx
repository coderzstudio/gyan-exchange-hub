import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Shield, AlertTriangle, FileText, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Report {
  id: string;
  reason: string;
  created_at: string;
  reporter_id: string;
  note_id: string;
  notes: {
    topic: string;
    subject: string;
    status: string;
    uploader_id: string;
  };
  profiles: {
    full_name: string;
    email: string;
  };
}

interface UserRole {
  role: string;
}

export default function Admin() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [processingReportId, setProcessingReportId] = useState<string | null>(null);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please log in to access admin panel");
        return;
      }

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      const hasAdminRole = roles?.some((r: UserRole) => r.role === "admin" || r.role === "moderator");
      setIsAdmin(hasAdminRole || false);

      if (hasAdminRole) {
        fetchReports();
      } else {
        setLoading(false);
        toast.error("You don't have permission to access this page");
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from("reports")
        .select(`
          *,
          notes (
            topic,
            subject,
            status,
            uploader_id
          ),
          profiles:reporter_id (
            full_name,
            email
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const handleNoteStatusChange = async (noteId: string, newStatus: "approved" | "pending" | "quarantined") => {
    setProcessingReportId(noteId);
    try {
      const { error } = await supabase
        .from("notes")
        .update({ status: newStatus })
        .eq("id", noteId);

      if (error) throw error;

      toast.success(`Note status updated to ${newStatus}`);
      fetchReports();
    } catch (error) {
      console.error("Error updating note status:", error);
      toast.error("Failed to update note status");
    } finally {
      setProcessingReportId(null);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    try {
      const { error } = await supabase
        .from("reports")
        .delete()
        .eq("id", reportId);

      if (error) throw error;

      toast.success("Report dismissed");
      setReports(reports.filter(r => r.id !== reportId));
    } catch (error) {
      console.error("Error deleting report:", error);
      toast.error("Failed to delete report");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "quarantined":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </ProtectedRoute>
    );
  }

  if (!isAdmin) {
    return (
      <ProtectedRoute>
        <Navbar />
        <div className="container mx-auto px-4 py-8 mt-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6" />
                Access Denied
              </CardTitle>
              <CardDescription>
                You don't have permission to access the admin panel.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
            <Shield className="h-8 w-8" />
            Admin Panel
          </h1>
          <p className="text-muted-foreground">
            Review and moderate reported content
          </p>
        </div>

        {reports.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Reports</CardTitle>
              <CardDescription>
                There are no reports to review at this time.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid gap-4">
            {reports.map((report) => (
              <Card key={report.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Reported Note: {report.notes.topic}
                      </CardTitle>
                      <CardDescription>
                        <div className="space-y-1">
                          <p><strong>Subject:</strong> {report.notes.subject}</p>
                          <p><strong>Reported by:</strong> {report.profiles.full_name} ({report.profiles.email})</p>
                          <p><strong>Date:</strong> {new Date(report.created_at).toLocaleDateString()}</p>
                        </div>
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(report.notes.status)}>
                      {report.notes.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-1 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Report Reason:
                      </h4>
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                        {report.reason}
                      </p>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <Select
                        onValueChange={(value) => handleNoteStatusChange(report.note_id, value as "approved" | "pending" | "quarantined")}
                        disabled={processingReportId === report.note_id}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Change status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="approved">Approve</SelectItem>
                          <SelectItem value="quarantined">Quarantine</SelectItem>
                          <SelectItem value="pending">Set to Pending</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteReport(report.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Dismiss Report
                      </Button>

                      {processingReportId === report.note_id && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
