import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { JSX, SVGProps } from "react"

export default function NavBar() {
  return (
    <header className="flex z-50 h-20 w-full shrink-0 items-center px-10 fixed top-0 bg-slate-400 bg-opacity-25 shadow-lg">
      {/* Mobile */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden">
            <MenuIcon className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-7/12">
          <div className="grid gap-2 py-6">
            <Link href="#" className="flex w-full items-center py-2 text-lg font-semibold" prefetch={false}>
              <SheetTitle>Home</SheetTitle>
            </Link>
            <Link href="#" className="flex w-full items-center py-2 text-lg font-semibold" prefetch={false}>
            <SheetTitle>Try It Out</SheetTitle>
            </Link>
            <Link href="#" className="flex w-full items-center py-2 text-lg font-semibold" prefetch={false}>
            <SheetTitle>About</SheetTitle>
            </Link>
            <Link href="#" className="flex w-full items-center py-2 text-lg font-semibold" prefetch={false}>
            <SheetTitle>GitHub</SheetTitle>
            </Link>
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Main */}
      <Link href="#" className="mr-6 hidden lg:flex" prefetch={false}>
        <h1 className="font-semibold text-xl text-white">Lumina</h1>
      </Link>
      <nav className="ml-auto hidden lg:flex gap-6 text-white">
        <Link
          href="#"
          className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-base font-semibold transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
          prefetch={false}
        >
          Home
        </Link>
        <Link
          href="#"
          className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-base font-semibold transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
          prefetch={false}
        >
          Try It Out
        </Link>
        <Link
          href="#"
          className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-base font-semibold transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
          prefetch={false}
        >
          About
        </Link>
        <Link
          href="#"
          className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-base font-semibold transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
          prefetch={false}
        >
          GitHub
        </Link>
      </nav>
    </header>
  )
}

function MenuIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}