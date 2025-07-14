import { Google } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { toast } from "react-toastify";
// @ts-ignore
import { IResolveParams, LoginSocialGoogle } from "reactjs-social-login";
import { useLoginByGoogleMutation } from "../services/api";

export default function GoogleLogin() {
  const [loginWithGoogle] = useLoginByGoogleMutation();

  const handleGoogleAuth = async (data: IResolveParams) => {
    await login(data.data.access_token);
  };

  const login = async (access_token: string) => {
    try {
      await loginWithGoogle({
        access_token,
      }).unwrap();
    } catch (error: any) {
      toast.error(
        error?.message || error?.data?.message || "Something went wrong!"
      );
    }
  };

  return (
    <LoginSocialGoogle
      isOnlyGetToken
      redirect_uri={window.location.href}
      client_id={import.meta.env.VITE_GOOGLE_API_KEY}
      scope="profile email"
      onResolve={handleGoogleAuth}
    >
      <IconButton>
        <Google sx={{ height: 30, width: 30, fill: "#4c89ed" }} />
      </IconButton>
    </LoginSocialGoogle>
  );
}
