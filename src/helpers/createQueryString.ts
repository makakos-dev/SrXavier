import type { ReadonlyURLSearchParams } from 'next/navigation';

type CreateQueryString = {
  key: string;
  value: string;
  searchParams: ReadonlyURLSearchParams;
};

type CreateSelectInputQueryString = {
  inputKey: string;
  selectInput: string;
  searchParams: ReadonlyURLSearchParams;
};

type CreateDateInputQueryString = {
  dateInput?: string;
  searchParams: ReadonlyURLSearchParams;
};

export const createQueryString = ({ searchParams, key, value }: CreateQueryString) => {
  const params = new URLSearchParams(searchParams);
  params.set(key, value);
  return String(params);
};
export const createSelectInputQueryString = ({
  inputKey,
  selectInput,
  searchParams,
}: CreateSelectInputQueryString) => {
  const queryString = `?${createQueryString({ key: inputKey, value: selectInput, searchParams })}`;
  window.history.pushState(null, '', queryString);
};

export const createDateInputQueryString = ({ dateInput, searchParams }: CreateDateInputQueryString) => {
  const date = `${dateInput} GMT-3`;
  const queryString = `?${createQueryString({ searchParams, key: 'date', value: date })}`;
  window.history.pushState(null, '', queryString);
};
