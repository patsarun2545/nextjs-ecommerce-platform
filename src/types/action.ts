export interface InitialFormState {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

export const initialFormState: Readonly<InitialFormState> = {
  success: false,
  message: "",
};

export type ActionType = (
  _prevState: InitialFormState,
  formData: FormData,
) => Promise<InitialFormState>;