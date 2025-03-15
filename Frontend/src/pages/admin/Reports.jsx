import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Search, Trash, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Reports = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch reports
  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["admin", "reports"],
    queryFn: () => fetch("/api/admin/reports").then((res) => res.json()),
  });

  // Report action mutation
  const reportActionMutation = useMutation({
    mutationFn: ({ reportId, action }) =>
      fetch(`/api/admin/reports/${reportId}/${action}`, {
        method: "POST",
      }),
    onSuccess: (_, { action }) => {
      queryClient.invalidateQueries(["admin", "reports"]);
      toast({
        title: "Report updated",
        description: `Report has been ${action}ed successfully.`,
      });
    },
  });

  // Delete content mutation
  const deleteContentMutation = useMutation({
    mutationFn: ({ contentId, type }) =>
      fetch(`/api/admin/${type}/${contentId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin", "reports"]);
      toast({
        title: "Content deleted",
        description: "The reported content has been removed.",
      });
    },
  });

  // Filter reports based on search query and type
  const filteredReports = reports.filter(
    (report) =>
      (report.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.reporter.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (filterType === "all" || report.type === filterType)
  );

  const handleReportAction = (reportId, action) => {
    reportActionMutation.mutate({ reportId, action });
  };

  const handleDeleteContent = (contentId, type) => {
    if (window.confirm("Are you sure you want to delete this content?")) {
      deleteContentMutation.mutate({ contentId, type });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground">
            Review and manage reported content.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reports</SelectItem>
            <SelectItem value="question">Questions</SelectItem>
            <SelectItem value="answer">Answers</SelectItem>
            <SelectItem value="comment">Comments</SelectItem>
            <SelectItem value="profile">Profiles</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reports Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Reporter</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredReports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No reports found.
                </TableCell>
              </TableRow>
            ) : (
              filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                      {report.type}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-md truncate">
                    {report.content}
                  </TableCell>
                  <TableCell>{report.reporter}</TableCell>
                  <TableCell>{report.reason}</TableCell>
                  <TableCell>
                    {new Date(report.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            handleDeleteContent(report.contentId, report.type)
                          }
                          className="text-red-600"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete Content
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleReportAction(report.id, "dismiss")}
                          className="text-green-600"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Dismiss Report
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleReportAction(report.id, "escalate")}
                          className="text-yellow-600"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Escalate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Reports; 