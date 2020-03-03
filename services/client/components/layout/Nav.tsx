import React, { useContext } from "react";

// Components
import { Signout } from "../index";
import Link from "./Link";

// custom context
import { AuthContext } from "../../contexts/authContext";

// Contains all routes
import paths from "../../paths";

// ################################################ COMPONENT'S TYPE ####################################

interface IProps {}

// ################################################ COMPONENT ###############################################
const Nav: React.FunctionComponent<IProps> = props => {
  const { userData } = useContext(AuthContext);

  // ################################################ RENDER #####################################################
  return (
    <>
      <br />
      <Link to={paths.home}>Home</Link>
      <br />
      <Link to={paths.basket}>Basket</Link>
      <br />
      {userData ? (
        <>
          <a href={paths.dashboard}>{userData.name}</a>
          <br />
          <Link to={paths.user(userData.username)}>
            {userData.name}'s Public Profile
          </Link>

          <br />
          <Signout />
        </>
      ) : (
        <>
          <Link to={paths.signin}>Signin</Link>
          <br />
          <Link to={paths.signup}>Signup</Link>
        </>
      )}
    </>
  );
};

export default Nav;
