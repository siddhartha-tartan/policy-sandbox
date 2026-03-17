import { AxiosHeaders, AxiosInstance, RawAxiosRequestHeaders } from "axios";

export interface BASE_API_RESPONSE {
  status_code: number;
  message: string;
}

export interface SUCCESS_API_RESPONSE<TData> extends BASE_API_RESPONSE {
  data: TData;
}

export interface PAGINATED_DATA<TData> {
  current_page: number;
  total_pages: number;
  page_size: number;
  data: TData;
}

export interface PAGINATED_API_RESPONSE<TData> extends BASE_API_RESPONSE {
  data: PAGINATED_DATA<TData>;
}

export interface ERROR_API_RESPONSE extends BASE_API_RESPONSE {
  error: any;
}

export interface PAGINATED_API_QUERY_PARAMS {
  page_number: number;
  page_size: number;
}

export interface BASE_API_CONFIG<TPayload, TResponse> {
  apiClient: AxiosInstance;
  key: string;
  endpoint: any;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  payload?: TPayload;
  response?: TResponse;
  headers?: RawAxiosRequestHeaders | AxiosHeaders;
  queryParams?: Record<string, string | number>;
  pathVariables?: Record<string, string | number>;
}

export interface CSV_COLUMN_MAPPING {
  columnName: string;
  jsonFieldName: string;
  required: boolean;
  pattern?: RegExp;
  acceptedvalues?: string[];
  dataType?: "string" | "boolean" | "number" | "integer";
}

export interface OPTION {
  label: string;
  value: string;
}

export interface FORM_FIELD {
  label: string;
  id: string;
  name: string;
  placeholder: string;
  type: string;
  disabled?: boolean;
  component?: React.FC;
  options?: OPTION[];
  postFieldContent?: JSX.Element;
}

export interface NestedObjectConfig<T> {
  fieldsToMap: string[];
  mapTo: keyof T;
  nestedDefaultValues?: Record<string, any>;
  nestedColumnMapping?: Record<string, string>;
  nestedTypeMapping?: Record<string, (value: any) => any>;
}

export interface PAYLOAD_MAKER_CONFIG<T> {
  columnsToConsider?: (keyof T)[];
  defaultValues?: Partial<{ [K in keyof T]: any }>;
  columnMapping?: Partial<{ [K in keyof T]: string }>;
  typeMapping?: Partial<{ [K in keyof T]: (value: any) => any }>;
  nestedObjects?: NestedObjectConfig<T>[];
}

export interface ROUTE_DATA {
  path: string;
  element: React.ReactNode;
  children?: ROUTE_DATA[];
  name: string;
}
