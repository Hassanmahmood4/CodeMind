import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes with clsx, resolving conflicts via tailwind-merge
 * @param {...import('clsx').ClassValue} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Extract plain text from React markdown code children
 * @param {React.ReactNode} children
 * @returns {string}
 */
export function getCodeText(children) {
  if (children == null) return '';
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(getCodeText).join('');
  if (typeof children === 'object' && children.props?.children != null)
    return getCodeText(children.props.children);
  return String(children);
}
