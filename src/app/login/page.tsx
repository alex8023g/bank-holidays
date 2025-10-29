import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { LoginBtnsGroup } from '@/components/LoginBtnsGroup';

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session?.user.id) {
    redirect(`/`);
  }
  return (
    <div className='grid min-h-svh lg:grid-cols-2'>
      <div className='flex flex-col gap-4 p-6 md:p-10'>
        <div className='flex justify-center gap-2 md:justify-start'></div>
        <div className='flex flex-1 items-center justify-center'>
          <div className='w-full max-w-xs'>
            <LoginBtnsGroup />
          </div>
        </div>
      </div>
      <div className='bg-muted relative hidden bg-gray-100 lg:block'>
        <img
          src='/calendar.svg'
          alt='Image'
          className='absolute inset-0 top-1/4 left-1/4 h-[400px] w-[400px] object-cover dark:brightness-[0.2] dark:grayscale'
        />
        {/* <Image
          src='/calendar.svg'
          alt='Image'
          className='/w-full absolute inset-0 m-auto h-full object-cover lg:h-auto dark:brightness-[0.2] dark:grayscale'
          height={400}
          width={400}
        /> */}
      </div>
    </div>
  );
}
