interface SkillBadgeProps {
  name: string;
  level: number;
}

export default function SkillBadge({ name, level }: SkillBadgeProps) {
  return (
    <div className="group relative">
      <div className="bg-muted hover:bg-muted/80 transition-colors px-4 py-2 rounded-full">
        <span className="font-medium">{name}</span>
      </div>
      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-background border shadow-md rounded-md px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full"
            style={{ width: `${level}%` }}
          ></div>
        </div>
        <span className="mt-1 block text-center">{level}%</span>
      </div>
    </div>
  );
}
