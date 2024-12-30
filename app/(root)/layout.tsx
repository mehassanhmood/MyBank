import MobileNavbar from "@/components/MobileNavbar";
import Sidebar from "@/components/Sidebar";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { createAdminClient } from "@/lib/appwrite";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  
  const loggedIn = await getLoggedInUser();
  if (!loggedIn) redirect ("/sign-in")

  return (
    <main className="flex h-screen w-full">
        <Sidebar user={loggedIn} />
        <div className="flex flex-col size-full">
          <div className="root-layout">
            <Image src={"/icons/logo.svg"} width={30} height={30} alt="menu icon"/>
            <div> 
              <MobileNavbar user={loggedIn} />
            </div>
          </div>
          {children}
        </div>
    </main>
  );
}
