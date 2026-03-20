import {
  useState,
  useEffect,
  useActionState,
  useCallback,
  startTransition,
} from "react";
import { useRouter } from "next/navigation";
import { ActionType, initialFormState } from "@/types/action";
import { toast } from "sonner";

export function useForm(action: ActionType, route?: string) {
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [state, formAction, isPending] = useActionState(
    action,
    initialFormState,
  );
  const router = useRouter();

  useEffect(() => {
    if (!state) return;

    if (state.errors) {
      startTransition(() => {
        setErrors(state.errors ?? {});
      });
    }

    if (state.message) {
      if (state.success) {
        toast.success(state.message);
        if (route) {
          router.push(route);
          router.refresh();
        } else {
          router.refresh();
        }
      } else {
        toast.error(state.message);
      }
    }
  }, [state, router, route]);

  const clearErrors = useCallback(() => setErrors({}), []);

  return {
    state,
    errors,
    formAction,
    isPending,
    clearErrors,
  };
}
