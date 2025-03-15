"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { ArrowLeftIcon, FileIcon, UploadIcon } from "lucide-react";

export default function UploadParticipantsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [previewData, setPreviewData] = useState<
    { name: string; number: string; club: string; nickname: string }[]
  >([]);
  const [isUploading, setIsUploading] = useState(false);

  // Dummy classes data
  const classes = [
    {
      id: 1,
      name: "2020 Girl",
      batches: [
        { id: 1, name: "Batch 1" },
        { id: 2, name: "Batch 2" },
      ],
    },
    {
      id: 2,
      name: "2021 Boy",
      batches: [
        { id: 3, name: "Batch 1" },
        { id: 4, name: "Batch 2" },
      ],
    },
    {
      id: 3,
      name: "FFA Max 2025 Boy",
      batches: [
        { id: 5, name: "Batch 1" },
        { id: 6, name: "Batch 2" },
      ],
    },
  ];

  // Get batches for the selected class
  const batches = selectedClass
    ? classes.find((c) => c.id.toString() === selectedClass)?.batches || []
    : [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    // Parse CSV file
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = text.split("\n");
      const headers = rows[0].split(",");

      const data = rows
        .slice(1)
        .map((row) => {
          const values = row.split(",");
          return headers.reduce((obj, header, index) => {
            obj[header.trim()] = values[index]?.trim() || "";
            return obj;
          }, {} as any);
        })
        .filter((row) => Object.values(row).some((val) => val));

      setPreviewData(data);
    };

    reader.readAsText(selectedFile);
  };

  const handleUpload = () => {
    if (!file || !selectedClass || !selectedBatch) {
      toast("Missing information", {
        description: "Please select a file, class, and batch before uploading.",
      });
      return;
    }

    setIsUploading(true);

    // Simulate API call
    setTimeout(() => {
      toast("Upload successful", {
        description: `${previewData.length} participants have been added to the batch.`,
      });
      setIsUploading(false);
      router.push(`/dashboard/kompetisi/${params.id}`);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Link href={`/dashboard/kompetisi/${params.id}`}>
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Upload Participants
          </h1>
          <p className="text-muted-foreground">
            Upload participants from a CSV file
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload CSV File</CardTitle>
            <CardDescription>
              Upload a CSV file with participant data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="class">Class</Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger id="class">
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id.toString()}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="batch">Batch</Label>
                <Select
                  value={selectedBatch}
                  onValueChange={setSelectedBatch}
                  disabled={!selectedClass || batches.length === 0}
                >
                  <SelectTrigger id="batch">
                    <SelectValue placeholder="Select a batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {batches.map((batch) => (
                      <SelectItem key={batch.id} value={batch.id.toString()}>
                        {batch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="csv-file">CSV File</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="csv-file"
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="flex-1"
                  />
                </div>
              </div>

              {file && (
                <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                  <FileIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{file.name}</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {(file.size / 1024).toFixed(2)} KB
                  </span>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleUpload}
              disabled={
                !file || !selectedClass || !selectedBatch || isUploading
              }
              className="w-full"
            >
              {isUploading ? (
                <>Uploading...</>
              ) : (
                <>
                  <UploadIcon className="mr-2 h-4 w-4" />
                  Upload Participants
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview Data</CardTitle>
            <CardDescription>
              Preview the data from your CSV file
            </CardDescription>
          </CardHeader>
          <CardContent>
            {previewData.length > 0 ? (
              <div className="overflow-auto max-h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {Object.keys(previewData[0]).map((header) => (
                        <TableHead key={header}>{header}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.slice(0, 5).map((row, index) => (
                      <TableRow key={index}>
                        {Object.values(row).map((value, i) => (
                          <TableCell key={i}>{value}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {previewData.length > 5 && (
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Showing 5 of {previewData.length} rows
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-center">
                <FileIcon className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Upload a CSV file to preview the data
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  The CSV should include columns for name, number, club, and
                  nickname
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
