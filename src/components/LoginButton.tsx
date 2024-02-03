import { requestToken } from "@/server/actions/whooing"

export const LoginButton = () => {

  return (
    <form action={requestToken}>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={requestToken}
        type="submit"
      >
        Login
      </button>
    </form>
  )
}
