import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

type SubmitButtonProps = {
  loading?: boolean;
  disabled?: boolean;
  label?: string;
  loadingLabel?: string;
};

export function SubmitButton({
  loading = false,
  disabled = false,
  label = "Explorar",
  loadingLabel = "Enviando...",
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      aria-disabled={disabled || loading || undefined}
      className="w-full py-6"
    >
      <span className="flex items-center justify-center gap-2">
        {loading && <Spinner />}
        {loading ? loadingLabel : label}
      </span>
    </Button>
  );
}
