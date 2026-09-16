const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api/v1";

type ApiError = { message?: string };

const endSession = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");

  if (window.location.pathname !== "/") {
    window.location.assign("/");
  }
};

const getErrorMessage = async (response: Response) => {
  const data = await response.json().catch(() => ({})) as ApiError;
  return data.message ?? "Request failed";
};

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) throw new Error("Your session has expired. Please log in again.");

  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    endSession();
    throw new Error("Your session has expired. Please log in again.");
  }

  const data = await response.json() as { accessToken?: string };
  if (!data.accessToken) throw new Error("Unable to refresh your session.");
  localStorage.setItem("accessToken", data.accessToken);
  return data.accessToken;
};

export async function apiFetch(path: string, init: RequestInit = {}) {
  const send = (token: string) => fetch(`${API_URL}${path}`, {
  ...init,
  headers: {
    "Content-Type": "application/json",
    ...init.headers,
    Authorization: `Bearer ${token}`,
  },
});

  const token = localStorage.getItem("accessToken");
  if (!token) {
    endSession();
    throw new Error("Please log in again.");
  }

  let response = await send(token);
  if (response.status === 401) {
    try {
      response = await send(await refreshAccessToken());
    } catch (error) {
      endSession();
      throw error;
    }
  }

  if (response.status === 401) {
    endSession();
    throw new Error("Your session has expired. Please log in again.");
  }

  if (!response.ok) throw new Error(await getErrorMessage(response));
  return response;
}

export async function apiJson<T>(path: string, init: RequestInit = {}) {
  return (await apiFetch(path, init)).json() as Promise<T>;
}
