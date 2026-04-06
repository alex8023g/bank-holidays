export function ContainerMainAside({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex h-full flex-col overflow-y-hidden bg-gray-100 xl:flex-row'>
      {children}
    </div>
  );
}
