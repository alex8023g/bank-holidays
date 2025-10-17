export function ContainerAside({ children }: { children: React.ReactNode }) {
  return (
    <aside className='/border /border-orange-600 /md:mx-auto flex h-1/3 flex-col overflow-y-hidden rounded-lg bg-white px-2 shadow-[0_0_20px_rgba(0,0,0,0.2)] md:z-0 md:min-w-3xl xl:h-auto xl:w-1/3 xl:min-w-0'>
      {children}
    </aside>
  );
}
