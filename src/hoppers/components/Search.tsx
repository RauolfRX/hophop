import { useState } from "react"
import { useQuery } from "@blitzjs/rpc"
import { Routes } from "@blitzjs/next"
import Link from "next/link"
import getHopperByName from "src/hoppers/queries/getHopperByName"
import useDebounce from "src/core/hooks/useDebounce"
import {
  useDisclosure,
  Button,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Input,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react"
import { Icon } from "@chakra-ui/icons"
import { FaUser, FaSearch } from "react-icons/fa"

const Search = () => {
  const [searchTerm, setSearchTerm] = useState<any>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const [hoppers] = useQuery(
    getHopperByName,
    { name: debouncedSearchTerm },
    { enabled: debouncedSearchTerm ? true : false }
  )

  return (
    <>
      <div className="mt-6 mb-6">
        <Button onClick={onOpen}>
          <Icon as={FaSearch} boxSize={3} />
          <span className="relative left-2">Buscar hopper</span>
        </Button>
      </div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Buscar Hooper</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input onChange={(e) => setSearchTerm(e.target.value)} />
            <div className="mt-6 mb-6">
              <List spacing={4}>
                {hoppers?.map((hopper) => (
                  <ListItem key={hopper.id}>
                    <Link href={Routes.ShowHopperPage({ hopperId: hopper.id })}>
                      <div className="cursor-pointer">
                        <ListIcon as={FaUser} />
                        {hopper.name}
                      </div>
                    </Link>
                  </ListItem>
                ))}
              </List>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Search
