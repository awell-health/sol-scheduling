/**
 * Filter option with label and value.
 */
export interface FilterOption<T = string> {
  label: string;
  value: T;
}

/**
 * Filter configuration for both desktop and mobile views.
 */
export interface FilterConfig<T = string> {
  /** Unique key for this filter */
  key: string;
  /** Display label */
  label: string;
  /** Available options */
  options: FilterOption<T>[];
  /** Current selected value */
  value: T | undefined;
  /** Callback when value changes */
  onChange: (value: T | undefined) => void;
  /** Whether filter can be cleared (defaults to true) */
  clearable?: boolean;
  /** Whether filter is disabled */
  disabled?: boolean;
  /** Placeholder text when no value selected */
  placeholder?: string;
}



