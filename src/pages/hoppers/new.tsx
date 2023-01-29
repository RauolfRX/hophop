import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { useRouter } from "next/router"
import { useMutation } from "@blitzjs/rpc"
import Layout from "src/core/layouts/Layout"
import createHopper from "src/hoppers/mutations/createHopper"
import { HopperForm, FORM_ERROR } from "src/hoppers/components/HopperForm"

const NewHopperPage = () => {
  const router = useRouter()
  const [createHopperMutation] = useMutation(createHopper)

  return (
    <Layout title={"Crear nuevo Hopper"}>
      <HopperForm
        className="mt-8"
        submitText="Crear Hopper"
        onSubmit={async (values) => {
          try {
            const hopper = await createHopperMutation(values)
            await router.push(Routes.ShowHopperPage({ hopperId: hopper.id }))
          } catch (error: any) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />
    </Layout>
  )
}

NewHopperPage.authenticate = true

export default NewHopperPage
