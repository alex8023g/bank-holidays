'use client';

import { GithubIcon } from '@/components/icons/GithubIcon';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { YandexIcon } from '@/components/icons/YandexIcon';
import { signIn } from 'next-auth/react';

export default function LoginBtnsGroup() {
  return (
    <>
      <div className='flex flex-col items-center space-y-5'>
        <p className='px-5 text-center'>
          Авторизуйтесь с помощью одного из сервисов
        </p>
        <button
          className='flex min-w-72 rounded-lg border bg-yellow-400 px-5 py-3 shadow-md'
          onClick={() => signIn('yandex')}
        >
          <span className='mr-6'>
            <YandexIcon />
          </span>
          <span className='font-semibold'>Continue with Yandex</span>
        </button>{' '}
        <button
          className='flex min-w-72 rounded-lg border px-5 py-3 shadow-md'
          onClick={() => signIn('google')}
        >
          <span className='mr-6'>
            <GoogleIcon />
          </span>
          <span className='font-semibold'>Continue with Google</span>
        </button>
        <button
          className='flex min-w-72 rounded-lg border bg-black px-5 py-3 shadow-md'
          onClick={() => signIn('github')}
        >
          <span className='mr-6'>
            <GithubIcon />
          </span>
          <span className='font-semibold text-white'>Continue with GitHub</span>
        </button>
      </div>
    </>
  );
}
