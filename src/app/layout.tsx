import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ContainerClientProviderVH } from '@/components/ContainerClientProviderVH';
import Header2 from '@/components/Header2';
import { findOrCreatePersonalRanges } from '@/lib/findOrCreatePersonalRanges';
import { YandexMetricaProvider } from 'next-yandex-metrica';
import Head from 'next/head';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log('🚀 ~ RootLayout ~ start');
  // const res = await findOrCreatePersonalRanges();
  // if (!res.ok) {
  //   return <div>Error: {res.errorMsg}</div>;
  // }
  // console.log('🚀 ~ RootLayout ~ personalRangesId:', res.personalRangesId);
  // console.log('🚀 ~ RootLayout ~ personalRanges:', res.personalRanges);
  const session = await getServerSession(authOptions);
  return (
    <html lang='ru'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <YandexMetricaProvider
          tagID={104866653}
          initParameters={{
            webvisor: true,
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true,
          }}
          router='app'
        >
          {/* <ContainerClientProviderVH
            session={res.session}
            personalRangesId={res.personalRangesId}
            personalRangesName={res.personalRanges.userName}
            personalRangesIdFromCookie={res.personalRangesIdFromCookie}
            personalRanges={res.personalRanges}
            > */}
          <div className='flex h-dvh flex-col'>
            <Header2 session={session}>{children}</Header2>
          </div>
          {/* </ContainerClientProviderVH> */}
        </YandexMetricaProvider>
      </body>
    </html>
  );
}
