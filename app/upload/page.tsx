'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [transcript, setTranscript] = useState('');
  const [uploadedBy, setUploadedBy] = useState('');

  const uploadMutation = useMutation({
    mutationFn: dashboardApi.uploadMeeting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['actions'] });
      
      // Reset form
      setTitle('');
      setTranscript('');
      setUploadedBy('');

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/');
      }, 2000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !transcript.trim()) {
      return;
    }

    uploadMutation.mutate({
      title,
      transcript,
      uploadedBy: uploadedBy || 'anonymous',
    });
  };

  const sampleTranscript = `Sprint Planning Meeting - December 19, 2025

Attendees: Sarah (PM), John (Tech Lead), Alice (Designer), Bob (Backend Dev)

Sarah: Good morning everyone. Let's start with our sprint goals. First priority is the user authentication feature. John, can you lead that?

John: Yes, I'll handle the authentication backend. I need to implement OAuth and JWT tokens. I should have this done by Friday this week.

Sarah: Perfect. Alice, we need the login and signup UI designs. Can you get those to John by Wednesday?

Alice: Absolutely, I'll have the designs ready by end of day Wednesday. I'll also create a style guide for the forms.

Sarah: Great. Bob, we also need to fix that critical bug in the payment processing system. This is urgent.

Bob: I saw that. I'll investigate and fix it today. It's causing checkout failures for some users.

John: Bob, after the bug fix, can you help me with the database migration? We need to add the new user tables.

Bob: Sure, I can do that by Thursday. Just send me the schema.

Sarah: One more thing - we need to prepare the Q4 presentation for stakeholders. Alice, can you work on that next week?

Alice: Yes, I'll have a draft ready by next Monday.

Sarah: Excellent. Let's reconvene on Friday to check progress. Meeting adjourned.`;

  const loadSample = () => {
    setTitle('Sprint Planning Meeting - Dec 19');
    setTranscript(sampleTranscript);
    setUploadedBy('sarah@example.com');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Upload Meeting</h1>
        <p className="text-slate-600 mt-2">
          Upload your meeting transcript and let AI extract action items automatically
        </p>
      </div>

      {/* Upload Form */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Meeting Details</CardTitle>
          <CardDescription>
            Provide the meeting transcript and our AI will extract action items, assignees, and due dates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Meeting Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Sprint Planning Meeting - Dec 19"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={uploadMutation.isPending}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Your Email (optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={uploadedBy}
                onChange={(e) => setUploadedBy(e.target.value)}
                disabled={uploadMutation.isPending}
              />
              <p className="text-xs text-slate-500">
                We'll send you a confirmation email with the extracted action items
              </p>
            </div>

            {/* Transcript */}
            <div className="space-y-2">
              <Label htmlFor="transcript">Meeting Transcript *</Label>
              <Textarea
                id="transcript"
                placeholder="Paste your meeting transcript here..."
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                required
                rows={15}
                disabled={uploadMutation.isPending}
                className="font-mono text-sm"
              />
              <p className="text-xs text-slate-500">
                The AI will automatically identify action items, assignees, due dates, and priorities
              </p>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={loadSample}
                disabled={uploadMutation.isPending}
              >
                Load Sample
              </Button>

              <div className="flex items-center space-x-3">
                {uploadMutation.isSuccess && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-sm font-medium">
                      Meeting uploaded! Redirecting...
                    </span>
                  </div>
                )}

                {uploadMutation.isError && (
                  <div className="flex items-center space-x-2 text-red-600">
                    <AlertCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">Upload failed</span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={uploadMutation.isPending || !title.trim() || !transcript.trim()}
                >
                  {uploadMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Meeting
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex space-x-3">
            <div className="flex-shrink-0">
              <Upload className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-blue-900 mb-1">
                How it works
              </h3>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Upload your meeting transcript (text, VTT, or SRT format)</li>
                <li>AI extracts action items with assignees, due dates, and priorities</li>
                <li>Receive instant email confirmation with all action items</li>
                <li>Track progress in the dashboard and Kanban board</li>
                <li>Get daily reminder emails for due/overdue items (9 AM)</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}