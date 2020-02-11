import { mutations } from "./Mutation";
import { cursorQueries } from "./Query/cursor";
import { eggQueries } from "./Query/egg";
import { flavorQueries } from "./Query/flavor";
import { userQueries } from "./Query/user";

import { eggMutations } from "./Mutation/egg";
import { flavrorMutations } from "./Mutation/flavor";
import { authMutations } from "./Mutation/auth";
import { cursorMutations } from "./Mutation/cursor";

export const resolvers = {
  Mutation: {
    ...authMutations,

    ...eggMutations,

    ...flavrorMutations,

    ...cursorMutations
  },
  Query: {
    ...userQueries,

    ...eggQueries,

    ...flavorQueries,

    ...cursorQueries
  }
};
