type EmptyStateProps = {
  children: React.ReactNode;
  icon?: React.ReactNode;
};

export function EmptyState({ icon, children }: Readonly<EmptyStateProps>) {
  return (
    <div className="text-default-500 text-small flex w-full flex-col items-center gap-3 py-6">
      {icon}
      {children}
    </div>
  );
}
