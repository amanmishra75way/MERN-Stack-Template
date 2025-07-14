import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { resetTokens, setTokens } from "../store/reducers/authReducer";
import { RootState } from "../store/store";

const baseUrl = import.meta.env.VITE_API_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (
    result.error &&
    result.error.status === 401 &&
    // @ts-ignore
    result.error.data.data.type === "TOKEN_EXPIRED"
  ) {
    const authState = (api.getState() as RootState).auth;

    if (!authState.accessToken || !authState.refreshToken) {
      return result; // Nothing to do if we don't have tokens
    }

    const refreshResult = await baseQuery(
      {
        url: "/users/refresh-token",
        method: "POST",
        body: { refreshToken: authState.refreshToken },
      },
      api,
      extraOptions
    );

    //@ts-ignore
    const data = refreshResult.data.data as {
      accessToken: string;
      refreshToken: string;
    };

    if (data) {
      // Update state with new tokens
      api.dispatch(setTokens(data));

      // Retry original request with new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(resetTokens());
    }
  }

  return result;
};
