import Link from "next/link";
import { Appbar } from "./components/Appbar";
import { Button } from "@/components/ui/button";
// import { Redirect } from "./components/Redirect";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-purple-300 to-indigo-600">
      <Appbar />
      {/* <Redirect /> */}
      <main className="flex-1 py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2 select-none">
              <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl lg:text-6xl/none">
                Let Your Fans Choose the Beat
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-700 md:text-xl">
                Empower your audience to curate your music stream. Connect with
                fans like never before.
              </p>
            </div>
            <div className="space-x-4 pt-5">
              <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
                <Link
                  href={{
                    pathname: "/api/auth",
                    query: { authType: "signIn" },
                  }}
                >
                  Get Started
                </Link>
              </Button>
              <Button className="bg-white text-purple-400 hover:bg-white/90">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
