import "@/styles/globals.css";
import HomeLayout from "@/layouts/HomeLayout";
import { useRouter } from "next/router";
import { NextUIProvider } from "@nextui-org/system";

// Define the array of public routes
const publicRoutes = ["/login", "/forget-password"];

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // Check if the current route is in the public routes array
  const isPublicRoute = publicRoutes.some((route) =>
    router.pathname.endsWith(route)
  );

  if (isPublicRoute) {
    return (
      <NextUIProvider>
        <Component {...pageProps} />
      </NextUIProvider>
    );
  } else {
    return (
      <NextUIProvider>
        <HomeLayout>
          <Component {...pageProps} />
        </HomeLayout>
      </NextUIProvider>
    );
  }
}
