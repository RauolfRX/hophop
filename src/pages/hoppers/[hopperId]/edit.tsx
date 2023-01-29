import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import Layout from "src/core/layouts/Layout"
import getHopper from "src/hoppers/queries/getHopper"
import updateHopper from "src/hoppers/mutations/updateHopper"
import createPayment from "src/payments/mutations/createPayment"
import { HopperForm, FORM_ERROR } from "src/hoppers/components/HopperForm"
import { PaymentForm } from "src/hoppers/components/PaymentForm"

export const EditHopper = () => {
  const router = useRouter()
  const hopperId = useParam("hopperId", "number")
  const [hopper, { setQueryData }] = useQuery(
    getHopper,
    { id: hopperId },
    {
      staleTime: Infinity,
    }
  )
  const [updateHopperMutation] = useMutation(updateHopper)

  return (
    <>
      <Head>
        <title>Edit Hopper {hopper.id}</title>
      </Head>

      <div>
        <HopperForm
          submitText="Guardar Hopper"
          initialValues={hopper}
          onSubmit={async (values) => {
            try {
              const updated = await updateHopperMutation({
                id: hopper.id,
                ...values,
              })
              await setQueryData(updated)
              await router.push(Routes.ShowHopperPage({ hopperId: updated.id }))
            } catch (error: any) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />
      </div>
    </>
  )
}

const EditHopperPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditHopper />
    </Suspense>
  )
}

EditHopperPage.authenticate = true
EditHopperPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditHopperPage
