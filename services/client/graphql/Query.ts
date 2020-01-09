import gql from "graphql-tag";

// Query For fetch Egg by id
const EGG_QUERY = gql`
  query egg($id: ID!) {
    egg(where: { id: $id }) {
      id
      title
    }
  }
`;

//For Fetching all Eggs
const EGGS_QUERY = gql`
  query eggs {
    eggs {
      id
      title
    }
  }
`;

export { EGG_QUERY, EGGS_QUERY };
