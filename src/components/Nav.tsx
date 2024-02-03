// import { Lobster_Two } from "next/font/google"
import { IconButton } from "@radix-ui/themes"
import { getUser } from "../server/actions/whooing"
import { LoginButton } from "./LoginButton"
import { MagnifyingGlassIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons'
// const lobster = Lobster_Two({ subsets: ["latin"], weight: ["400"] })

export const Nav = async () => {
  const { data: user } = await getUser()
  return (
    <nav
      className="flex justify-between items-center h-16 w-full px-60 bg-white dark:bg-zinc-900/50 dark:border-neutral-800"
    >
      <ul className="flex py-8 justify-between items-center">
        {user ? (
          <p className="text-2xl font-bold">Hello {user.username}</p>
        ) : (
          <LoginButton />
        )}
      </ul>
      <IconButton>
        <MagnifyingGlassIcon width="18" height="18" />
      </IconButton>

    </nav>
  )
}
