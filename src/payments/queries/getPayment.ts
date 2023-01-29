import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const GetPayment = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetPayment), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const payment = await db.payment.findMany({
    where: { month: "abr" },
    select: {
      hopper: {
        select: {
          name: true,
          info: true,
        },
      },
    },
  })

  if (!payment) throw new NotFoundError()

  return payment
})
