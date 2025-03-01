"use client";

import { useEffect, useState } from "react";

import { useSession } from "next-auth/react";

export function useToken() {
  const { data: session } = useSession();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const ref: any = session;

    if (ref?.user?.accessToken) {
      localStorage.setItem('storedToken', ref?.user?.accessToken);

      setToken(ref?.user?.accessToken);
    } else {
      const storedToken = localStorage.getItem('storedToken');

      setToken(storedToken);
    }
  }, [session]);

  return token;
}
