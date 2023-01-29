import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetPaymentsInput
  extends Pick<Prisma.PaymentFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetPaymentsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: payments,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.payment.count({ where }),
      query: (paginateArgs) =>
        db.payment.findMany({
          ...paginateArgs,
          orderBy,
          where: { month: "ago" },
          include: {
            hopper: true,
          },
        }),
    })

    return {
      payments,
      nextPage,
      hasMore,
      count,
    }
  }
)
