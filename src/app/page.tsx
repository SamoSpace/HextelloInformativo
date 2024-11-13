import Link from "next/link"
export default function Home() {
  
  return (
    <div className="min-h-screen">
        <main id="main-container" className="relative h-screen p-2">
          <div className="[grid-area:main] p-12 gap-4 place-content-center text-center">
            <h1 className="font-bold text-3xl my-4">Bienvenidos a su gestor de noticias</h1>
            <Link href="/pages/login">
              <button className="py-4 px-6 bg-white text-black">Login</button>
            </Link>
          </div>
        </main>
    </div>
  );
}
