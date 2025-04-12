import ReportDialog from './ReportDialog';

const Question = ({ question }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ReportDialog
          contentId={question._id}
          contentType="question"
          trigger={
            <Button variant="ghost" size="sm">
              <Flag className="h-4 w-4 mr-2" />
              Report
            </Button>
          }
        />
      </div>
    </div>
  );
};

export default Question; 