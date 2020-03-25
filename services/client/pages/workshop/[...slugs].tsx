import React from "react";
import fetch from "isomorphic-unfetch";
import { NextPage,  } from "next";

import { Redirect } from "lib/redirect";
import { endpoint } from "lib/endpoint";

import Page from "components/Page";
import { getAccessToken } from "lib/accessToken";

interface IProps {
  eggname?: string;
}

const Workshop: NextPage<IProps> = ({ eggname }) => {
  if(!eggname) return <h1>Oops</h1>
  return (
    <Page title="Eggy Workshop">
      <h1>Workshop</h1>
      {eggname}
    </Page>
  );
};

Workshop.getInitialProps = async context => {
  const { query } = context;

  const { slugs } = query;

  // valid url => /workshop/eggname/flavorname/cursorname = 3 slug
  if (!slugs || slugs.length >= 3) {
    Redirect(context, "/basket");
  }
  const eggname = slugs[0];

  // Graphql Query for checking access
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" ,"authorization":`Bearer ${getAccessToken()}`},
    body: JSON.stringify({
      query: `{
        isEggAccessible(eggname: "${eggname}") {
          access
        }
      }`
    })
  }).then(response => response.json());

  const {
    data: {
      isEggAccessible: { access }
    }
  } = response;

  console.log(eggname);
  console.log(access);

  if (!access) {
    Redirect(context, "/basket");
  }

  return { eggname };
};

export default Workshop;
