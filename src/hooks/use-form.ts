import { useState, useEffect, useActionState, use } from "react";
import { useRouter } from "next/navigation";
import { ActionType, InitialFormState } from "@/types/action";
import { toast } from "sonner";

export function useForm(action: ActionType, route?: string) {
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [state, formAction, isPending] = useActionState(
    action,
    InitialFormState,
  );
  const router = useRouter();

  useEffect(() => {
    if (!state) return;

    if (state.errors) setErrors(state.errors);

    if (state.message) {
      if (state.success) {
        toast.success(state.message);
        route && router.push(route);
      } else {
        toast.error(state.message);
      }
    }
  }, [state, router, route, toast]);

  const hideError = () => setErrors({});

  return {
    errors,
    formAction,
    isPending,
    hideError,
  };
}
