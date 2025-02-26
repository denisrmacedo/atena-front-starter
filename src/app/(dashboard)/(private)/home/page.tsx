'use client'

import { useSession } from "next-auth/react"

export default function Page() {
  const { data: session } = useSession()

  return (
    <>
      <h1>Página inicial</h1>
      <h2>Seja bem vindo {session?.user?.name}!</h2>
    </>
  );
}
