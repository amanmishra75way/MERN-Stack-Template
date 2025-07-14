import { Box } from "@mui/material";
import ResetPassword from "../components/ResetPassword";

function Index() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("code");
  const type = params.get("type") as "reset-password" | "invite";

  return (
    <Box>
      <ResetPassword token={token!} type={type!} />
    </Box>
  );
}

export default Index;
