type FieldErrorProps = {
  message?: string;
};

export default function FieldError({ message }: FieldErrorProps) {
  if (!message) {
    return null;
  }
  return <span className="text-sm text-red-600 dark:text-red-400">{message}</span>;
}
