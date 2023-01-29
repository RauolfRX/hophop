import Head from "next/head"
import React, { FC } from "react"
import { BlitzLayout } from "@blitzjs/next"
import {} from "@chakra-ui/react"
import { Routes } from "@blitzjs/next"
import { useRouter } from "next/router"
import { Button, Container, Heading, Box, ButtonGroup, Spacer, Flex } from "@chakra-ui/react"
import { ChevronLeftIcon, AddIcon, Icon } from "@chakra-ui/icons"
import { FaListUl } from "react-icons/fa"

const Layout: BlitzLayout<{ title?: string; children?: React.ReactNode }> = ({
  title,
  children,
}) => {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>{title || "hophop"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxW="6xl" bg="main">
        <div className="pb-4 pt-4 box-content border-b-2 border-blue-500 mb-8">
          <Flex>
            <Box>
              <Button onClick={() => router.back()}>
                <ChevronLeftIcon boxSize={6} /> Volver
              </Button>
            </Box>
            <Spacer />
            <Heading size="md">{title}</Heading>
            <Spacer />
            <ButtonGroup gap="2">
              <Button onClick={() => router.push(Routes.HoppersPage().pathname)}>
                <Icon as={FaListUl} boxSize={3} />{" "}
                <span className="relative left-2">Lista de Hoppers</span>
              </Button>
              {router.pathname !== "/hoppers/new" && (
                <Button onClick={() => router.push(Routes.NewHopperPage().pathname)}>
                  <AddIcon boxSize={3} /> <span className="relative left-2">Añadir Hopper</span>
                </Button>
              )}
            </ButtonGroup>
          </Flex>
        </div>
        {children}
      </Container>
    </>
  )
}

export default Layout
