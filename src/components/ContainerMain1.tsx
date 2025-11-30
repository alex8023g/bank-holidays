export function ContainerMain1({ children }: { children: React.ReactNode }) {
  return (
    <main className='overflow-y-scroll bg-gray-100 sm:h-2/3 xl:h-full xl:flex-1'>
      {children}
    </main>
  );
}
