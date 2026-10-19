import { createContext, useContext, type ReactNode } from 'react';
import { formatDisplayDate } from '../../lib/calendar';

/** Turns a stored `YYYY-MM-DD` value into the text a date field shows. */
export type DateFormatter = (iso: string) => string;

const DateFormatContext = createContext<DateFormatter>(formatDisplayDate);

export interface DateFormatProviderProps {
  /** How dates read, e.g. the signed-in user's preferred format. Called with a non-empty `YYYY-MM-DD`. */
  format: DateFormatter;
  children?: ReactNode;
}

/**
 * Sets how every DatePicker inside shows its date. Display only: values stay `YYYY-MM-DD`.
 * Without a provider, dates read as "27 May 2026".
 */
export function DateFormatProvider({ format, children }: DateFormatProviderProps) {
  return <DateFormatContext.Provider value={format}>{children}</DateFormatContext.Provider>;
}

/** The nearest DateFormatProvider's formatter, else the default ("27 May 2026"). */
export const useDateFormat = () => useContext(DateFormatContext);
