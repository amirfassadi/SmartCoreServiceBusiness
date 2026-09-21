import type { ApiError } from "@/api/errors";

export type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export type ApiResponse<T> =
  | { ok: true; data: T; status: number }
  | { ok: false; error: ApiError; status: number };

export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
}

export async function requestJson<T>(
  path: string,
  options: RequestInit & { method?: HttpMethod } = {},
): Promise<ApiResponse<T>> {
  const url = `${getApiBaseUrl()}${path}`;

  try {
    const response = await fetch(url, {
      ...options,
      method: options.method ?? "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
      },
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      const error: ApiError = {
        code: payload?.code ?? "PERSISTENCE_FAILURE",
        message: payload?.message ?? "Request failed.",
        details: payload?.details ?? {},
        httpStatus: response.status,
      };

      return { ok: false, error, status: response.status };
    }

    return { ok: true, data: payload as T, status: response.status };
  } catch (error) {
    const networkError: ApiError = {
      code: "NETWORK_ERROR",
      message: error instanceof Error ? error.message : "Network error.",
      details: {},
      httpStatus: 0,
    };

    return { ok: false, error: networkError, status: 0 };
  }
}

export function buildUrl(path: string, params?: Record<string, string | number | undefined>) {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  }

  const query = search.toString();
  return query ? `${path}?${query}` : path;
}
