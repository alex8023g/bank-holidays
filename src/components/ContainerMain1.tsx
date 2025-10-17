export function ContainerMain1({ children }: { children: React.ReactNode }) {
  return (
    <main className='h-2/3 overflow-y-scroll bg-gray-100 xl:h-full xl:flex-1'>
      {children}
    </main>
  );
}
