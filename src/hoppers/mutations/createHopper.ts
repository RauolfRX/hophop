import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const CreateHopper = z.object({
  name: z.string(),
  info: z.string(),
})

export default resolver.pipe(resolver.zod(CreateHopper), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const hopper = await db.hopper.create({ data: input })

  return hopper
})
