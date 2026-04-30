type SuccessResponse<T> = {
  status: 'success';
  message: string;
  data: T;
};

type ErrorDetail = { field: string; message: string; type: string } | string;

type ErrorResponse = {
  status: 'error';
  error: string;
  errors?: ErrorDetail[];
};

export type ApiResponse<T = null> = SuccessResponse<T> | ErrorResponse;

export type DeleteResponse = ApiResponse<null>;
