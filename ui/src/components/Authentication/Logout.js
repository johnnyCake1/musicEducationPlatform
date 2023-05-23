import useLocalStorageState from "../../util/useLocalStorageState";

const Logout = () => {
  const [, setJwt] = useLocalStorageState("", "jwt");
  const [, setCurrentUser] = useLocalStorageState("", "currentUser");
  setJwt("");
  setCurrentUser(null);
  return <>{(window.location.href = "/login")}</>;
};

export default Logout;
