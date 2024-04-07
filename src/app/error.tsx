'use client' // Error components must be Client Components

import { LoginButton } from '@/components/LoginButton'

export const ErrorNotLogged = () => {
  return (
    <div id="abc" className="flex justify-center items-center flex-grow">
      <div className="text-center">
        <h2 className='p-4'>후잉 가계부에 로그인 하세요.</h2>
        <LoginButton />
      </div>
    </div>
  )
}

export default function ErrorComponent({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  if (error.message.startsWith('WAM_NOT_LOGGED_IN:')) {
    return <ErrorNotLogged />
  }

  return (
    <div>
      <div id="abc" className="flex justify-center items-center flex-grow">
        <div>
          <p className="m-4">{error.message}</p>
          <pre className="m-4">{error.stack}</pre>

          <h2 className='p-4'>문제가 발생했어요.</h2>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => location.pathname = '/'}
            type="submit"
          >
            새로고침
          </button>
        </div>
      </div>
    </div>
  )
}
