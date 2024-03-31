'use client' // Error components must be Client Components

import { LoginButton } from '@/components/LoginButton'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  console.log(error.message)

  if (error.message.startsWith('WAM_NOT_LOGGED_IN:')) {
    return (
      // center middle align ()
      // <div className="flex flex-col items-center justify-center self-center">
      <div id="abc" className="flex justify-center items-center flex-grow">
        <div className="text-center">

          <h2 className='p-4'>후잉 가계부에 로그인 하세요.</h2>
          <LoginButton />
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
      <div>
        <p className="m-4">{error.message}</p>

        <pre className="m-4">{error.stack}</pre>
      </div>
    </div>
  )
}
