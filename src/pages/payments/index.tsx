import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { usePaginatedQuery } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import Layout from "src/core/layouts/Layout"
import getPayments from "src/payments/queries/getPayments"

const ITEMS_PER_PAGE = 100

export const PaymentsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ payments, hasMore }] = usePaginatedQuery(getPayments, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <ul>
        {payments.map((payment) => (
          <li key={payment.id}>
            <Link href={Routes.ShowPaymentPage({ paymentId: payment.id })}>
              <a>{payment.name}</a>
            </Link>
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  )
}

const PaymentsPage = () => {
  return (
    <Layout>
      <Head>
        <title>Payments</title>
      </Head>

      <div>
        <p>
          <Link href={Routes.NewPaymentPage()}>
            <a>Create Payment</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <PaymentsList />
        </Suspense>
      </div>
    </Layout>
  )
}

export default PaymentsPage
