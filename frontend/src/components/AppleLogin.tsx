import { Apple } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { toast } from "react-toastify";
// @ts-ignore
import { IResolveParams, LoginSocialApple } from "reactjs-social-login";
import { useLoginByAppleMutation } from "../services/api";

export default function AppleLogin() {
  const [loginByApple] = useLoginByAppleMutation();

  const handleAppleLogin = async (params: IResolveParams) => {
    try {
      const id_token = params.data?.authorization?.id_token || "";
      if (!id_token) {
        throw new Error("Id token not found.");
      }
      await loginByApple({
        id_token,
      }).unwrap();
    } catch (error: any) {
      toast.error(
        error?.message || error?.data?.message || "Something went wrong"
      );
    }
  };

  const handleAppleLoginError = async (
    params: { [key: string]: any } | string
  ) => {
    if (typeof params === "string") {
    } else if (
      !["popup_closed_by_user", "user_trigger_new_signin_flow"].includes(
        params.err.error
      )
    ) {
      toast.error(params.err.error);
    }
  };

  return (
    <LoginSocialApple
      client_id={import.meta.env.VITE_APPLE_BUNDLE_ID || ""}
      redirect_uri={window.location.href}
      onResolve={handleAppleLogin}
      onReject={handleAppleLoginError}
    >
      <IconButton>
        <Apple sx={{ height: 30, width: 30, fill: "rgba(0, 0, 0, 0.8)" }} />
      </IconButton>
    </LoginSocialApple>
  );
}
