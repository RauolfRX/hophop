import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation, invalidateQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import Layout from "src/core/layouts/Layout"
import getHopper from "src/hoppers/queries/getHopper"
import deleteHopper from "src/hoppers/mutations/deleteHopper"
import {
  Grid,
  GridItem,
  Button,
  Flex,
  Spacer,
  Box,
  Heading,
  Popover,
  PopoverTrigger,
  PopoverArrow,
  PopoverHeader,
  Tag,
  Portal,
  PopoverBody,
  useDisclosure,
  PopoverContent,
  Center,
  Divider,
} from "@chakra-ui/react"
import { PaymentForm } from "src/hoppers/components/PaymentForm"
import { InsuranceForm } from "src/hoppers/components/InsuranceForm"
import createPayment from "src/payments/mutations/createPayment"
import createInsurance from "src/insurances/mutations/createInsurance"
import { MonthsList } from "src/hoppers/components/MonthsList"

export const Hopper = () => {
  const { onOpen, onClose, isOpen } = useDisclosure()
  const router = useRouter()
  const hopperId = useParam("hopperId", "number")
  const [deleteHopperMutation] = useMutation(deleteHopper)
  const [hopper] = useQuery(getHopper, { id: hopperId })
  const [createPaymentMutation] = useMutation(createPayment)
  const [createInsuranceMutation] = useMutation(createInsurance)

  return (
    <Layout title={hopper.name}>
      <Head>
        <title>Hopper {hopper.name}</title>
      </Head>

      <Grid templateRows="repeat(1, 1fr)" templateColumns="repeat(5, 1fr)" gap={4} height={150}>
        <GridItem colSpan={1} bg="papayawhip" />
        <GridItem>
          <div className="mb-4">
            <span className="font-bold">Nombre</span>
            <span className="block">{hopper.name}</span>
          </div>
          <div className="mb-4">
            <span className="font-bold">Info</span>
            <span className="block">{hopper.info}</span>
          </div>
        </GridItem>
      </Grid>
      <Center height="30px"></Center>
      <Box>
        <Link href={Routes.EditHopperPage({ hopperId: hopper.id })}>
          <Button>Editar</Button>
        </Link>
        <Button
          type="button"
          colorScheme={"red"}
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteHopperMutation({ id: hopper.id })
              await router.push(Routes.HoppersPage())
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Eliminar
        </Button>
      </Box>

      <Box>
        <Center height="70px"></Center>
        <Heading size="lg">Seguro</Heading>
        <Center height="50px">
          <Divider orientation="horizontal" />
        </Center>
        <div>
          {hopper.Insurance.map((insurance) => (
            <Tag className="mr-4 mb-4" size="lg" variant="solid" colorScheme="blue">
              {insurance.year}
            </Tag>
          ))}
        </div>
        <Popover placement="right">
          <PopoverTrigger>
            <Button>Añadir pago seguro</Button>
          </PopoverTrigger>
          <Portal>
            <PopoverContent>
              <PopoverContent>
                <PopoverArrow />
                <InsuranceForm
                  submitText="Update Hopper"
                  onSubmit={async (values) => {
                    const year = new Date(values.picker).toLocaleString("es", {
                      year: "numeric",
                    })

                    try {
                      await createInsuranceMutation({
                        hopperId: hopper.id,
                        year: year || "",
                      })

                      invalidateQuery(getHopper)
                      onClose()
                      await router.push(Routes.ShowHopperPage({ hopperId: hopper.id }))
                    } catch (error: any) {
                      console.error(error)
                      return {
                        error: error.toString(),
                      }
                    }
                  }}
                />
              </PopoverContent>
            </PopoverContent>
          </Portal>
        </Popover>
      </Box>

      <Box>
        <Center height="70px"></Center>
        <Heading size="lg">Pagos</Heading>
        <Center height="50px">
          <Divider orientation="horizontal" />
        </Center>
        <MonthsList payments={hopper.Payment} />
        <Center height="30px"></Center>
        <Popover
          offset={[102, 12]}
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          placement="right"
        >
          <PopoverTrigger>
            <Button>Añadir pago mensual</Button>
          </PopoverTrigger>
          <Portal>
            <PopoverContent>
              <PopoverArrow />
              <PopoverBody>
                <PaymentForm
                  submitText="Update Hopper"
                  onSubmit={async (values) => {
                    const date = new Date(values.picker).toLocaleString("es", {
                      month: "short",
                      year: "numeric",
                    })

                    const [month, year] = date.split(" ")

                    try {
                      await createPaymentMutation({
                        hopperId: hopper.id,
                        month: month || "",
                        year: year || "",
                        payed: true,
                      })

                      invalidateQuery(getHopper)
                      onClose()
                      await router.push(Routes.ShowHopperPage({ hopperId: hopper.id }))
                    } catch (error: any) {
                      console.error(error)
                      return {
                        error: error.toString(),
                      }
                    }
                  }}
                />
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </Popover>
      </Box>
    </Layout>
  )
}

const ShowHopperPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Hopper />
    </Suspense>
  )
}

ShowHopperPage.authenticate = true

export default ShowHopperPage
