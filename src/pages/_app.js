import "@/styles/globals.css";
import HomeLayout from "@/layouts/HomeLayout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import { isLogin } from "../../public/functions/auth";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const getUserLoginStatus = async () => {
    setLoading(true);
    const logged = await isLogin();
    setLoading(false);
    setIsUserLoggedIn(logged);
  };

  const isLoginPage = router.pathname.endsWith("/login");

  useEffect(() => {
    getUserLoginStatus();
  }, [router]);

  if (isUserLoggedIn && !isLoginPage) {
    return (
      <HomeLayout>
        <Component {...pageProps} />
      </HomeLayout>
    );
  } else if (!isUserLoggedIn && !isLoginPage) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400 px-4">
        <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full text-center">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-4">
            Welcome Back!
          </h1>
          <p className="text-gray-600 mb-8">
            Please login to access your account.
          </p>
          <Link
            className="inline-block w-full bg-orange-500 text-white py-3 rounded-full font-semibold hover:bg-orange-600 hover:shadow-lg transition duration-300"
            href="/login"
          >
            Go to Login Page
          </Link>
        </div>
      </main>
    );
  } else {
    return <Component {...pageProps} />;
  }
}
