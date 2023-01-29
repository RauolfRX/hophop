import { Suspense, useMemo, useState } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { usePaginatedQuery } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import Layout from "src/core/layouts/Layout"
import getHoppers from "src/hoppers/queries/getHoppers"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table"
import DatePicker, { registerLocale } from "react-datepicker"
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Heading,
  Flex,
  Spacer,
  Box,
} from "@chakra-ui/react"
import { CheckCircleIcon, SmallCloseIcon, CalendarIcon } from "@chakra-ui/icons"
import { months } from "src/hoppers/components/MonthsList"
import es from "date-fns/locale/es"
import Search from "src/hoppers/components/Search"

registerLocale("es", es)

const ITEMS_PER_PAGE = 100
const columnHelper = createColumnHelper<any>()

export const HoppersList = () => {
  const router = useRouter()
  const [sorting, setSorting] = useState<any>([])
  const [currentDate, setCurrentDate] = useState<{
    month: string | undefined
    year: string | undefined
    raw: Date
  }>({ month: "ene", year: "2023", raw: new Date() })
  const page = Number(router.query.page) || 0
  const [{ hoppers, hasMore }] = usePaginatedQuery(getHoppers, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        cell: (info) => info.getValue(),
        header: "Nombre",
        size: 70,
      }),
      columnHelper.accessor("info", {
        cell: (info) => info.getValue(),
        header: "Información",
      }),
      columnHelper.accessor("Payment", {
        cell: (info) => {
          const payment = info.getValue()

          return payment.some(
            (item) => item.month === currentDate.month && item.year === currentDate.year
          ) ? (
            <CheckCircleIcon color="green.600" />
          ) : (
            <SmallCloseIcon boxSize={6} color="red.600" />
          )
        },
        header: "Pago",
        size: 10,
      }),
      columnHelper.accessor("Insurance", {
        cell: (info) => {
          const insurance = info.getValue()

          return insurance.some((item) => item.year === currentDate.year) ? (
            <CheckCircleIcon color="green.600" />
          ) : (
            <SmallCloseIcon boxSize={6} color="red.600" />
          )
        },
        header: "Seguro",
        size: 10,
      }),
    ],
    [currentDate]
  )

  const table = useReactTable({
    data: hoppers,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <div className="mt-8">
        <Flex>
          <Box>
            <Heading as="h1" size="lg" className="mb-6" color="text">
              {months[currentDate.month as string]} {currentDate.year}
            </Heading>
          </Box>
          <Spacer />
          <Box>
            <DatePicker
              selected={currentDate.raw}
              locale="es"
              onChange={(value) => {
                const date = new Date(value).toLocaleString("es", {
                  month: "short",
                  year: "numeric",
                })

                const [month, year] = date.split(" ")

                setCurrentDate({ month, year, raw: new Date(date) })
              }}
              customInput={
                <Button colorScheme="blue">
                  <CalendarIcon />
                  <span className="relative left-1">Seleccionar fecha</span>
                </Button>
              }
              dateFormat="MM/yyyy"
              showMonthYearPicker
              showFullMonthYearPicker
            />
          </Box>
        </Flex>
      </div>
      <Box>
        <Search />
      </Box>
      <TableContainer>
        <div className="mt-0">
          <Table variant="striped" colorScheme="gray">
            <Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </div>
                      )}
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody>
              {table.getRowModel().rows.map((row) => (
                <Tr key={row.id} className="cursor-pointer">
                  {row.getVisibleCells().map((cell) => (
                    <Link href={Routes.ShowHopperPage({ hopperId: row.original.id })}>
                      <Td key={cell.id}>
                        {<a>{flexRender(cell.column.columnDef.cell, cell.getContext())}</a>}
                      </Td>
                    </Link>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </div>
      </TableContainer>

      <Button disabled={page === 0} onClick={goToPreviousPage}>
        {"<<"}
      </Button>
      <Button disabled={!hasMore} onClick={goToNextPage}>
        {">>"}
      </Button>
    </div>
  )
}

const HoppersPage = () => {
  return (
    <Layout title="Hoppers">
      <Head>
        <title>Hoppers</title>
      </Head>

      <Suspense fallback={<div>Loading...</div>}>
        <HoppersList />
      </Suspense>
    </Layout>
  )
}

export default HoppersPage
