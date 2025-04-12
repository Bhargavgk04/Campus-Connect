import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';

const REPORT_CATEGORIES = [
  'Spam',
  'Harassment',
  'Inappropriate Content',
  'Hate Speech',
  'Violence',
  'Other'
];

export const ReportDialog = ({
  isOpen,
  onClose,
  onSubmit,
  isResolveDialog = false,
  report = null,
  onNavigateToContent
}) => {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    if (!category && !isResolveDialog) {
      toast.error('Please select a category');
      return;
    }
    if (!description && !isResolveDialog) {
      toast.error('Please provide a description');
      return;
    }

    await onSubmit({
      category,
      description,
      resolution: isResolveDialog ? category : null
    });
    
    setCategory('');
    setDescription('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isResolveDialog ? 'Resolve Report' : 'Report Content'}
          </DialogTitle>
          <DialogDescription>
            {isResolveDialog ? 'Please select a resolution for this report.' : 'Please provide details about the content you want to report.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {!isResolveDialog ? (
            <>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {REPORT_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please provide details about the issue..."
                  className="min-h-[100px]"
                />
              </div>
            </>
          ) : (
            <>
              <div className="grid gap-2">
                <Label htmlFor="resolution">Resolution</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a resolution" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false_report">False Report</SelectItem>
                    <SelectItem value="suspended">Suspend User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {report && (
                <div className="grid gap-2">
                  <Label>Report Details</Label>
                  <div className="text-sm text-gray-500">
                    <p>Category: {report.category}</p>
                    <p>Description: {report.description}</p>
                    <p>Reported by: {report.reporter?.name}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <DialogFooter>
          {isResolveDialog && report?.contentType === 'question' && (
            <Button
              variant="outline"
              onClick={onNavigateToContent}
              className="mr-2 hover:bg-blue-500 hover:text-white"
            >
              View Content
            </Button>
          )}
          <Button onClick={handleSubmit}>
            {isResolveDialog ? 'Resolve' : 'Submit Report'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 