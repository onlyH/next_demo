'use client'

import { useEffect } from "react";

export default function Error({
                                error, reset
                              }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])
  return (
    <main className="flex h-full flex-col item-center  justify-center">
      <h2 className="text-center">出错了！！</h2>
      <button className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
              onClick={() => reset()}
      >
        重试
      </button>
    </main>
  )
}
