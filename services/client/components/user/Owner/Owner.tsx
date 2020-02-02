import React from "react";
import useUser from "../../../hooks/user";
import PublicPage from "../Public/Public";

// ##### COMPONENT PROPS TYPE #####

interface IOwnerProps {
  children: any;
  username: any;
}

// ##### COMPONENT #####

const Owner: React.FunctionComponent<IOwnerProps> = props => {
  // ##### HOOKS #####

  const { me, error } = useUser();

  // ##### RENDER #####

  if (error) return <p>Error! ${error.message}</p>;

  // user not have permission or user not login so render public page
  if (!me || me.username !== props.username) {
    return <PublicPage username={props.username} />;
  }

  // user is Owner so have permission to perform egg operation
  return props.children;
};

export default Owner;
