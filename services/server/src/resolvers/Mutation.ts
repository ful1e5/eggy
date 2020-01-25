import * as bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { promisify } from "util";
import authoriaztion from "../utils/auth";
import { transport, mailFormate } from "../mail";

const Mutation = {
  async createEgg(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error("You must logged in to do that");
    }
    const egg = await ctx.db.mutation.createEgg(
      {
        data: {
          // Provide relationship between User and Egg
          user: {
            connect: {
              id: ctx.request.userId
            }
          },
          ...args
        }
      },
      info
    );

    return egg;
  },
  updateEgg(parent, args, ctx, info) {
    // first take copy in updates
    const updates = { ...args };
    // remove id from updates
    delete updates.id;
    // run the update Query
    return ctx.db.mutation.updateEgg(
      {
        data: updates,
        where: {
          id: args.id
        }
      },
      info
    );
  },

  async deleteEgg(parent, args, ctx, info) {
    const where = { id: args.id };
    // 1.find egg
    // const egg = await ctx.db.Query.egg({ where }, `{id title}`);
    // 2.check they own the egg ,or  have a permission
    // TODO
    // 3.Delete It
    return ctx.db.mutation.deleteEgg({ where }, info);
  },

  async signup(parent, args, ctx, info) {
    // 1.lowercase their email
    args.email = args.email.toLowerCase();
    // 2.hash their password
    const password = await bcrypt.hash(args.password, 10);
    // 3.create user in database
    let user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ["USER"] }
        }
      },
      info
    );

    // 4.Auth the user
    await authoriaztion(user, ctx);

    // 5.return user

    return user;
  },
  async login(parent, args, ctx, info) {
    // Deconstruct the email and password
    const { email, password } = args;

    // 1.Check is there is user with that email
    const user = await ctx.db.query.user({
      where: {
        email
      }
    });

    if (!user) {
      throw new Error(`No such user found for email ${email}`);
    }

    // 2.Check their password is correct
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error("Invalid Password!");
    }
    // 3.Auth the user
    await authoriaztion(user, ctx);

    // 5.return the user
    return user;
  },
  logout(parent, args, ctx, info) {
    try {
      ctx.response.clearCookie("auth", {
        domain: process.env.DOMAIN,
        path: "/"
      });
      return { message: "Logout Successfully" };
    } catch (error) {
      throw new Error(error);
    }
  },
  async requestReset(parent, args, ctx, info) {
    // 1. Check if this is a real user
    const user = await ctx.db.query.user({
      where: {
        email: args.email
      }
    });

    if (!user) {
      throw new Error(`No such user found for email ${args.email}`);
    }
    // 2. Reset token and expiry on that user
    try {
      const randomBytesPromisified = promisify(randomBytes);
      const resetToken = (await randomBytesPromisified(20)).toString("hex");
      const resetTokenExpiry = (Date.now() + 3600000).toString(); // 1 hour from now

      const res = await ctx.db.mutation.updateUser({
        where: {
          email: args.email
        },
        data: { resetToken, resetTokenExpiry }
      });

      // 3.Email them that reset token
      const mailRes = await transport.sendMail({
        from: "kaiz@eggy.com",
        to: user.email,
        subject: "Your Password Reset Token",
        html: mailFormate(
          `Your Password reset token is here! \n\n <a href="${
            process.env.FRONTEND_URL
          }/login/reset?token=${resetToken}">Click here to reset</a>`
        )
      });
      // 4.Return the message
      return { message: "thanks" };
    } catch (error) {
      throw new Error(error);
    }
  },
  async resetPassword(parent, args, ctx, info) {
    // 1. Check the password match
    if (args.password !== args.confirmPassword) {
      throw new Error("Password don't match");
    }

    // 2. Check if its a rigit token reset
    // 3. Check if its expired
    const resetTokenExpiry = (Date.now() - 3600000).toString(); // reset expiry

    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: resetTokenExpiry
      }
    });

    if (!user) {
      throw new Error("This token is invalid or expired");
    }

    // 4. Hash their new password
    const password = await bcrypt.hash(args.password, 10);

    // 5. save the new password to the user and remove  old sesetToken Fields
    const updatedUser = await ctx.db.mutation.updateUser({
      where: {
        email: user.email
      },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null
      }
    });
    // 6. generate JWT & set the JWT Coockie
    await authoriaztion(updatedUser, ctx);

    // 7. return user
    return updatedUser;
  }
};

export default Mutation;
