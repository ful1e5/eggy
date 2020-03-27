// Helper Functions
import isAuth from "../../utils/isAuth";

export const cursorQueries = {
  // ################################################ FOR FETCH SINGLE CURSOR ################################################

  async cursor(parent, args, ctx, info) {
    // Checking user logged in or not if not then throw Error
    isAuth(ctx);

    return ctx.db.query.cursor(
      {
        where: {
          id: args.id
        }
      },
      info
    );
  },

  // ################################################ FOR FETCH CURSORS ################################################

  cursors(parent, args, ctx, info) {
    // Checking user logged in or not if not then throw Error
    isAuth(ctx);
    return ctx.db.query.cursors(
      {
        where: {
          flavor: {
            id: args.flavorId
          }
        }
      },
      info
    );
  }
};
