import { Tag } from "@chakra-ui/react"

export const months = {
  ene: "Enero",
  feb: "Febrero",
  mar: "Marzo",
  abr: "Abril",
  may: "Mayo",
  jun: "Junio",
  jul: "Julio",
  ago: "Agosto",
  sep: "Septiembre",
  oct: "Octubre",
  nov: "Noviembre",
  dic: "Diciembre",
}

export function MonthsList({ payments }: any) {
  return (
    <div>
      {payments.map((payment) => (
        <Tag className="mr-4 mb-4" size="lg" variant="solid" colorScheme="teal">{`${
          months[payment.month]
        } ${payment.year}`}</Tag>
      ))}
    </div>
  )
}
