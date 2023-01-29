import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetHoppersInput
  extends Pick<Prisma.HopperFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetHoppersInput) => {
    const {
      items: hoppers,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.hopper.count({ where }),
      query: async (paginateArgs) =>
        await db.hopper.findMany({
          ...paginateArgs,
          where,
          orderBy,
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
        }),
    })

    return {
      hoppers,
      nextPage,
      hasMore,
      count,
    }
  }
)
