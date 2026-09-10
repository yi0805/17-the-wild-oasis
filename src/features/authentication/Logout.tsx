import { HiArrowRightOnRectangle } from "react-icons/hi2";

import ButtonIcon from "../../ui/ButtonIcon";
import SpinnerMini from "../../ui/SpinnerMini";
import { useLogout } from "./useLogout";

function Logout() {
  const { logout, isLoading } = useLogout();

  return (
    <ButtonIcon onClick={() => logout()} disabled={isLoading} aria-label="Log out">
      {!isLoading ? (
        <HiArrowRightOnRectangle aria-label="Log out icon" />
      ) : (
        <SpinnerMini aria-label="Logging out" />
      )}
    </ButtonIcon>
  );
}

export default Logout;
