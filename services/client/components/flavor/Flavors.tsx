import Link from "next/link";
import Router from "next/router";
import React from "react";
import useFlavors from "../../hooks/graphql/flavors";
import { Button } from "../styled";
import DeleteFlavor from "./Delete";

// ##### COMPONENT PROPS TYPE #####
interface IFlavorsProps {
  username: string;
  eggname: string;
}

// ##### COMPONENT #####
const Flavors: React.FunctionComponent<IFlavorsProps> = props => {
  // ##### HOOKS #####

  //fetching all Flavours in Egg
  const { data, loading } = useFlavors({ eggname: props.eggname });

  if (loading) return <p>Loading Flavors..........</p>;
  // ##### RENDER #####
  return (
    <div>
      {data.map(flavor => (
        <li key={flavor.id}>
          <Link
            href="/[user]/[egg]/workshop/[flavor]"
            as={`/${props.username}/${props.eggname}/workshop/${flavor.name}`}
          >
            <a>{flavor.name}</a>
          </Link>
          <Button
            type="button"
            onClick={() => {
              Router.push(
                "/[user]/[egg]/workshop/[flavor]/update",
                `/${props.username}/${props.eggname}/workshop/${
                  flavor.name
                }/update`
              );
            }}
          >
            Update
          </Button>
          <DeleteFlavor id={flavor.id} eggname={props.eggname} />
        </li>
      ))}
    </div>
  );
};

export default Flavors;
