import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const GetHopper = z.object({
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetHopper), resolver.authorize(), async ({ id }) => {
  const hopper = await db.hopper.findFirst({
    where: { id },
    select: {
      id: true,
      info: true,
      name: true,
      Payment: {
        select: {
          month: true,
          year: true,
        },
      },
      Insurance: {
        select: {
          year: true,
        },
      },
    },
  })

  if (!hopper) throw new NotFoundError()

  return hopper
})
