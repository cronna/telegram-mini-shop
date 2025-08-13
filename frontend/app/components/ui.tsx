import React from 'react';
import clsx from 'classnames';

export function Button({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-md bg-black text-white px-4 py-2 text-sm font-medium shadow hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    />
  );
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm', className)} {...props} />;
}

export function Price({ value }: { value: number }) {
  const rub = (value / 100).toFixed(2).replace('.', ',');
  return <span>{rub} ₽</span>;
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/50"
      {...props}
    />
  );
}

export function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className="block text-xs uppercase tracking-wide text-gray-500 mb-1" {...props} />;
}
