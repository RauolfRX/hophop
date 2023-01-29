import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const UpdateHopper = z.object({
  id: z.number(),
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateHopper),
  resolver.authorize(),
  async ({ id, ...data }) => {
    const hopper = await db.hopper.update({ where: { id }, data })

    return hopper
  }
)
