import NavAndSideBar from "@/components/NavAndSideBar";
import { Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { isLogin } from "../../public/functions/auth";
import { useRouter } from "next/router";

export default function HomeLayout({ children }) {
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);

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
        await router.replace("/login");
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

  return (
    <div className="flex">
      <NavAndSideBar />
      <main className="flex-grow w-full" style={{ marginTop: "64px" }}>
        <div>{children}</div>
      </main>
    </div>
  );
}
