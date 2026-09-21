export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "INVALID_LOCALE"
  | "INVALID_TIMEZONE"
  | "INVALID_CURRENCY"
  | "INVALID_SERVICE_DURATION"
  | "INVALID_POLICY"
  | "BUSINESS_ACCESS_DENIED"
  | "BUSINESS_ARCHIVED"
  | "CROSS_BUSINESS_REFERENCE"
  | "BUSINESS_NOT_FOUND"
  | "PROFILE_NOT_FOUND"
  | "LOCATION_NOT_FOUND"
  | "CATEGORY_NOT_FOUND"
  | "SERVICE_NOT_FOUND"
  | "POLICY_NOT_FOUND"
  | "BUSINESS_SLUG_ALREADY_EXISTS"
  | "LOCATION_NAME_ALREADY_EXISTS"
  | "CATEGORY_SLUG_ALREADY_EXISTS"
  | "SERVICE_SLUG_ALREADY_EXISTS"
  | "POLICY_KEY_ALREADY_EXISTS"
  | "POLICY_VERSION_CONFLICT"
  | "INVALID_PARENT_CATEGORY"
  | "INVALID_SERVICE_CATEGORY"
  | "SERVICE_ARCHIVED"
  | "CATEGORY_ARCHIVED"
  | "CATEGORY_HAS_ACTIVE_SERVICES"
  | "PERSISTENCE_FAILURE"
  | (string & {});

export type ApiError = {
  code: ApiErrorCode;
  message: string;
  details?: unknown;
  httpStatus?: number;
};

export type GenericErrorCategory =
  | "validation"
  | "forbidden"
  | "notFound"
  | "conflict"
  | "unprocessableEntity"
  | "server"
  | "network";

export function classifyApiError(error: ApiError): GenericErrorCategory {
  if (error.httpStatus === 400 || error.code === "VALIDATION_ERROR") return "validation";
  if (error.httpStatus === 403 || error.code === "BUSINESS_ACCESS_DENIED" || error.code === "CROSS_BUSINESS_REFERENCE") return "forbidden";
  if (error.httpStatus === 404 || error.code === "BUSINESS_NOT_FOUND" || error.code === "LOCATION_NOT_FOUND") return "notFound";
  if (error.httpStatus === 409 || error.code === "POLICY_VERSION_CONFLICT") return "conflict";
  if (error.httpStatus === 422 || error.code === "INVALID_PARENT_CATEGORY" || error.code === "INVALID_SERVICE_CATEGORY") return "unprocessableEntity";
  if (error.httpStatus && error.httpStatus >= 500) return "server";
  return "network";
}
