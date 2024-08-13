import "@/styles/globals.css";
import HomeLayout from "@/layouts/HomeLayout";

export default function App({ Component, pageProps }) {
  return <HomeLayout><Component {...pageProps} /></HomeLayout>

}
