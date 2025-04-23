import Link from "next/link"

export function NavigationBar() {
  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      <Link
        href="/"
        className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-md text-white hover:bg-white/20 transition-colors"
      >
        Home
      </Link>
      <Link
        href="/menu"
        className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-md text-white hover:bg-white/20 transition-colors"
      >
        Menu
      </Link>
      <Link
        href="/admin"
        className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-md text-white hover:bg-white/20 transition-colors"
      >
        Admin
      </Link>
    </div>
  )
}

