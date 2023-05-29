import { useEffect } from "react";
import useLocalStorageState from "../../util/useLocalStorageState";

const Logout = () => {
  const [, setJwt] = useLocalStorageState("", "jwt");
  const [, setCurrentUser] = useLocalStorageState("", "currentUser");
  
  useEffect(() => {
    setJwt(null);
    setCurrentUser(null);
    window.location.href = "/login"
  }, [])
};

export default Logout;
