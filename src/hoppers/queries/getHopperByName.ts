import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const GetHopperByName = z.object({
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(GetHopperByName),
  resolver.authorize(),
  async ({ name }) => {
    const hopper = await db.hopper.findMany({
      where: {
        name: {
          startsWith: name,
        },
      },
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

    if (!hopper) return []

    return hopper
  }
)
