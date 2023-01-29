import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const CreateInsurance = z.object({
  hopperId: z.number(),
  year: z.string(),
})

export default resolver.pipe(resolver.zod(CreateInsurance), resolver.authorize(), async (input) => {
  console.log("jsjsj")

  const hopper = await db.insurance.create({ data: { ...input } })

  return hopper
})
