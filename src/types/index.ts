export type GenericObject = {
  [key: string]: any  // eslint-disable-line @typescript-eslint/no-explicit-any
}

export type ApiError = {
  detail?: GenericObject | string
  status: number,
  statusText: string
}

export type LoadingState = "IDLE" | "LOADING";

export type Property = {
  formatted: string;
  itemOrder: unknown[]
  items?: unknown
  label: string;
}

export type PropertyGroup = {
  extension: string;
  label: string;
  properties: {
    [key: string]: Property
  }
}
