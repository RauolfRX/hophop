import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const DeleteHopper = z.object({
  id: z.number(),
});

export default resolver.pipe(
  resolver.zod(DeleteHopper),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const hopper = await db.hopper.deleteMany({ where: { id } });

    return hopper;
  }
);
