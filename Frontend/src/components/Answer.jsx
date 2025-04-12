import ReportDialog from './ReportDialog';

const Answer = ({ answer, questionId }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ReportDialog
          contentId={answer._id}
          contentType="answer"
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

export default Answer; 