import { Appbar } from "./components/Appbar";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-purple-300 to-indigo-600">
      <Appbar />
      <main className="flex-1 py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl lg:text-6xl/none">
                Let Your Fans Choose the Beat
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-700 md:text-xl">
                Empower your audience to curate your music stream. Connect with
                fans like never before.
              </p>
            </div>
            {/* <div className="space-x-4">
              <Button className="bg-purple-600 text-white hover:bg-purple-700">
                <Link
                  href={{
                    pathname: "/auth",
                    query: { authType: "signUp" },
                  }}
                >
                  Get Started
                </Link>
              </Button>
              <Button className="bg-white text-purple-400 hover:bg-white/90">
                Learn More
              </Button>
            </div> */}
          </div>
        </div>
      </main>
    </div>
  );
}
