import { LinkedIn } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { toast } from "react-toastify";
// @ts-ignore
import { IResolveParams, LoginSocialLinkedin } from "reactjs-social-login";
import { useLoginByLinkedInMutation } from "../services/api";

function LinkedInLogin() {
  const [linkedinLogin] = useLoginByLinkedInMutation();

  const handleLinkedinAuth = async (data: IResolveParams) => {
    try {
      await linkedinLogin({ access_token: data.data.access_token }).unwrap();
    } catch (error: any) {
      toast.error(
        error?.message || error?.data?.message || "Something went wrong!"
      );
    }
  };

  return (
    <LoginSocialLinkedin
      isOnlyGetToken
      className="social_auth"
      client_id={import.meta.env.VITE_APP_LINKEDIN_APP_ID}
      client_secret={import.meta.env.VITE_APP_LINKEDIN_APP_SECRET}
      redirect_uri={window.location.href}
      scope="openid email profile"
      onResolve={handleLinkedinAuth}
    >
      <IconButton>
        <LinkedIn sx={{ height: 30, width: 30, fill: "#0a66c2" }} />
      </IconButton>
    </LoginSocialLinkedin>
  );
}

export default LinkedInLogin;
