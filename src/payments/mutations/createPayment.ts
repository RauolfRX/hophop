import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const CreatePayment = z.object({
  hopperId: z.number(),
  year: z.string(),
  month: z.string(),
  payed: z.boolean(),
})

export default resolver.pipe(resolver.zod(CreatePayment), resolver.authorize(), async (input) => {
  const hopper = await db.payment.create({ data: { ...input, payed: true } })

  return hopper
})
