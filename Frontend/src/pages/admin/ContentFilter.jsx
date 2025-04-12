import RestrictedWords from '@/components/admin/RestrictedWords';

export default function ContentFilter() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Content Filter</h2>
        <p className="text-muted-foreground">
          Manage restricted words and content filtering rules.
        </p>
      </div>

      <RestrictedWords />
    </div>
  );
} 