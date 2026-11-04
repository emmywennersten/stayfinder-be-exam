import type { ApiResult, FieldErrors } from "@/types/api";

export function apiUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_BACKEND_URL}${path}`;
}

type ErrorBody = {
  error?: string;
  errors?: { field: string; message: string }[];
};

// Gör om backendens felsvar till ett format som formulären kan visa.
async function readError(response: Response): Promise<{ message: string; fieldErrors: FieldErrors }> {
  const fieldErrors: FieldErrors = {};
  let message = "Something went wrong. Please try again.";

  try {
    const body = (await response.json()) as ErrorBody;

    if (body.errors) {
      for (const { field, message: fieldMessage } of body.errors) {
        fieldErrors[field || "form"] ??= fieldMessage;
      }
      message = "Please check the highlighted fields.";
    } else if (body.error) {
      message = body.error;
    }
  } catch {
    // Svaret var inte JSON, behåll standardmeddelandet.
  }

  return { message, fieldErrors };
}

// Skickar ett anrop till API:t med cookies och returnerar antingen data eller ett fel.
export async function apiRequest<T>(
  path: string,
  options: { method?: string; body?: unknown } = {},
): Promise<ApiResult<T>> {
  try {
    const response = await fetch(apiUrl(path), {
      method: options.method ?? "GET",
      credentials: "include",
      headers: options.body ? { "Content-Type": "application/json" } : undefined,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      const { message, fieldErrors } = await readError(response);
      return { ok: false, status: response.status, message, fieldErrors };
    }

    const data = (await response.json()) as T;
    return { ok: true, data };
  } catch {
    return {
      ok: false,
      status: 0,
      message: "Could not reach the server. Is the backend running?",
      fieldErrors: {},
    };
  }
}
