import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import Layout from "src/core/layouts/Layout"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { Routes, BlitzPage } from "@blitzjs/next"
import { useRouter } from "next/router"
import { Button, Center } from "@chakra-ui/react"

const UserInfo = () => {
  const currentUser = useCurrentUser()
  const router = useRouter()

  if (currentUser) {
    router.push("/hoppers")
  }

  return (
    <Link href={Routes.LoginPage()}>
      <a className="button small">
        <strong>Entrar</strong>
      </a>
    </Link>
  )
}

const Home: BlitzPage = () => {
  return (
    <Layout title="Home">
      <Center>
        <Suspense fallback="Loading...">
          <UserInfo />
        </Suspense>
      </Center>
    </Layout>
  )
}

export default Home
