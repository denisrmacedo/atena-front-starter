'use client'

import { useState, useEffect } from 'react';

import axios from 'axios';

const useFetch = <T>(resource: string) => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setData(null)
    setError('')

    // const source = axios.CancelToken.source()

    const url = `http://localhost:3010/${resource.startsWith('/') ? resource.slice(1) : resource}`

    const token = localStorage.getItem('storedToken');

    axios.get(url, {
      headers: { 'Authorization': `Bearer ${token}` },

      // cancelToken: source.token,
    })
      .then(response => {
        setLoading(false);

        //checking for multiple responses for more flexibility
        //with the url we send in.
        console.log('response', url, response.data)
        response.data && setData(response.data);
      })
      .catch(err => {
        setLoading(false)
        setError('An error occurred. Awkward..' + err)
      })

    // return () => {
    //   source.cancel();
    // }
  }, [resource])

  return { loading, data, error }
}

export default useFetch;

// import { useCallback, useEffect, useState } from "react"

// type Props = {
//   path: string,
//   method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH",
//   instance?: any,
//   start: boolean,
// }

// type FetchReturn<T> = {
//   loading: boolean,
//   data: T | undefined,
//   refresh: () => void,
//   statusCode: number,
// }

// export function useFetch<T>({ path, method, instance, start }: Props): FetchReturn<T> {
//   const [result, setResult] = useState<T>()
//   const [loading, setLoading] = useState(false)
//   const [statusCode, setCode] = useState(-1)

//   const fetchData = useCallback(async () => {
//     if (loading) {
//       return
//     }

//     setLoading(true)

//     const url = `${process.env.API_URL}/${path}`

//     const response = await fetch(url, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//       },
//       body: instance && JSON.stringify(instance),
//       method: method,
//     })

//     setCode(response.status)

//     try {
//       const data = await response.json()
//       setResult(data)
//     } catch (err) {
//       setResult(undefined)
//     }

//     setLoading(false)
//   }, [instance, loading, statusCode])

//   useEffect(() => {
//     if (start) {
//       fetchData();
//     }
//   }, [fetchData, start]);

//   const refresh = () => {
//     fetchData()
//   }

//   return { loading, data: result, refresh, statusCode }
// }

// export function useGet<T>(path: string): FetchReturn<T> {
//   return useFetch<T>({ path, method: "GET", start: true })
// }

// export function usePost<T>({ path, start, instance }: Props): FetchReturn<T> {
//   return useFetch({ path, method: "POST", start, instance })
// }
// import axios from 'axios';
// import { getSession } from 'next-auth/react';

// const baseURL = process.env.API_URL || 'http://localhost:3010';

// const apiService = () => {
//   const options = {
//     baseURL,
//   };

//   const instance = axios.create(options);

//   instance.interceptors.request.use(async (request) => {
//     const session: any = await getSession();
//     if (session) {
//       request.headers.Authorization = `Bearer ${session.user.accessToken}`;
//     }
//     return request;
//   });

//   instance.interceptors.response.use(
//     (response) => {
//       return response;
//     },
//     (error) => {
//       console.log(`error`, error);
//     },
//   );

//   return instance;
// };

// const setToken = (token: string) => {
//   http.defaults.headers.common['Authorization'] = `Bearer ${token}`
// }
// https://github.com/nextauthjs/next-auth/discussions/3550

// export default apiService;

// const apiService = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// apiService.interceptors.request.use(
//   async (config) => {
//     let token;
//     if (typeof window === "undefined") {
//       console.log("inside server");
//       const { cookies: serverCookies } = await import("next/headers");
//       token = serverCookies().get("user_token")?.value;
//     } else {
//       console.log("inside client");
//       const { default: clientCookies } = await import("js-cookie");
//       token = clientCookies.get("user_token");
//     }

//     console.log("token in interceptor:", token);
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// apiService.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response && error.response.status === 401) {
//       try {
//         let refreshToken;
//         if (typeof window === "undefined") {
//           const { cookies: serverCookies } = await import("next/headers");
//           refreshToken = serverCookies().get("user_refresh_token")?.value;
//         } else {
//           const { default: clientCookies } = await import("js-cookie");
//           refreshToken = clientCookies.get("user_refresh_token");
//         }
//         if (!refreshToken) throw new Error("Refresh Token Not Found");

//         const { access_token, refresh_token } = await refreshAuthToken(refreshToken);
//         AuthService.setUserAuthenticationToken({ access_token, refresh_token });

//         error.config.headers.Authorization = `Bearer ${access_token}`;
//         return apiService.request(error.config);
//       } catch (refreshError) {
//         console.error("Failed to refresh token:", refreshError);
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// async function refreshAuthToken(refreshToken) {
//   try {
//     const response = await axios.post("endpointurl", { refresh_token: refreshToken });
//     console.log("response of refreshAuthToken:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("Failed to refresh token:", error);
//     throw new Error("Failed to refresh token");
//   }
// }

// const ApiService = {
//   async get(endpoint, params = {}) {
//     try {
//       const response = await apiService.get(endpoint, { params });
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   async post(endpoint, data = {}, config = {}) {
//     try {
//       const response = await apiService.post(endpoint, data, config);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   async postFormData(endpoint, formData, token) {
//     try {
//       const response = await apiService.post(endpoint, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   async put(endpoint, data = {}, config = {}) {
//     try {
//       const response = await apiService.put(endpoint, data, config);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   async patch(endpoint, data = {}, config = {}) {
//     try {
//       const response = await apiService.patch(endpoint, data, config);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   async delete(endpoint, config = {}) {
//     try {
//       const response = await apiService.delete(endpoint, config);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },
// };
