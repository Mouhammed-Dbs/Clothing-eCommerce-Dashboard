import NavAndSideBar from "@/components/NavAndSideBar";
import { Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { isLogin } from "../../public/functions/auth";
import { useRouter } from "next/router";

export default function HomeLayout({ children }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  useEffect(() => {
    isLogin()
      .then((logged) => {
        if (!logged) {
          router.replace("/login");
        } else {
          setPageLoading(false);
          setMounted(true);
        }
      })
      .catch(async (err) => {
        await router.replace("/login");
        setPageLoading(false);
      });
  }, []);

  if (!mounted || pageLoading)
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

  return (
    <div className="flex">
      <NavAndSideBar />
      <main className="flex-grow w-full" style={{ marginTop: "64px" }}>
        <div>{children}</div>
      </main>
    </div>
  );
}
