import NavAndSideBar from "@/components/NavAndSideBar";
import { Spinner } from "@nextui-org/react";
import { FaExclamationTriangle } from "react-icons/fa";
import { useEffect, useState } from "react";
import { isLogin } from "../../public/functions/auth";
import { useRouter } from "next/router";

export default function HomeLayout({ children }) {
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const logged = await isLogin();
        if (!logged) {
          await router.replace("/login");
        } else {
          setPageLoading(false);
        }
      } catch (err) {
        setError(
          "There was an error connecting to the server. Please try again later."
        );
        setPageLoading(false);
      }
    };

    checkLogin();
  }, [router]);

  if (pageLoading)
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400 px-4 text-center">
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
          <Spinner size="xl" />
          <p className="mt-4 text-lg font-medium text-gray-700">
            Loading, please wait...
          </p>
        </div>
      </main>
    );

  if (error)
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400 px-4 text-center">
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full flex flex-col items-center">
          <FaExclamationTriangle size={48} className="text-red-500 mb-4" />{" "}
          {/* أيقونة التحذير */}
          <p className="text-lg font-medium text-red-500">{error}</p>
          <p className="text-gray-600 mt-2">
            Please check your internet connection and try again.
          </p>
        </div>
      </main>
    );

  return (
    <div className="flex">
      <NavAndSideBar />
      <main className="flex-grow w-full" style={{ marginTop: "64px" }}>
        <div>{children}</div>
      </main>
    </div>
  );
}
