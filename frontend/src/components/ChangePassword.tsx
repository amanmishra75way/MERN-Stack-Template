import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, TextField, Theme, useTheme } from "@mui/material";
import { createStyles } from "@mui/styles";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
import { api, useChangePasswordMutation } from "../services/api";
import { useAppDispatch } from "../store/store";
import PasswordInput from "./PasswordInput";

const validation = yup.object({
  currentPassword: yup.string().nullable(),
  password: yup
    .string()
    .required("Password is required")
    .min(5, "Minimumn 5 chars are required")
    .max(16, "Miximumn 16 chars allowed"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Comfirm password is required"),
});

const useStyle = (theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 400,
      flex: 1,
      mx: "auto",
    },
    input: {
      mt: 2,
    },
    button: {
      my: 2,
    },
    link: {
      color: theme.palette.primary.main,
    },
  });

type FormData = typeof validation.__outputType;

type Props = {
  user: User;
};

export default function ChangePassword(props: Props) {
  const theme = useTheme();
  const style = useStyle(theme);
  const dispatch = useAppDispatch();
  const { provider } = props.user;
  const [changePassword] = useChangePasswordMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>({
    defaultValues: {
      confirmPassword: "",
      password: "",
      currentPassword: "",
    },
    resolver: yupResolver(validation),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await changePassword(data).unwrap();
      dispatch(api.util.invalidateTags(["ME"]));
      reset();
      toast.success("Password changed successfully!");
    } catch (error: any) {
      const validationError = error?.data?.data?.errors?.[0].msg;
      toast.error(
        validationError ?? error?.data?.message ?? "Something went wrong!"
      );
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      maxWidth={400}
      mx="auto"
    >
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        {provider == "manual" && (
          <TextField
            sx={style.input}
            fullWidth
            type="text"
            placeholder="Current password"
            label="Current password"
            {...register("currentPassword")}
            error={Boolean(errors.currentPassword?.message)}
            helperText={errors.currentPassword?.message}
          />
        )}
        <PasswordInput
          sx={style.input}
          fullWidth
          type="password"
          placeholder="New password"
          label="New password"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register("password")}
        />
        <PasswordInput
          sx={style.input}
          fullWidth
          type="password"
          placeholder="Confirm password"
          label="Confirm password"
          error={Boolean(errors.confirmPassword?.message)}
          helperText={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <Button
          type="submit"
          sx={style.button}
          variant="contained"
          fullWidth
          disabled={!isValid}
        >
          Change password
        </Button>
      </Box>
    </Box>
  );
}
