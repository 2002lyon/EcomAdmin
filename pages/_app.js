import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { Poppins } from "@next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <div className={poppins.className}>
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
}
