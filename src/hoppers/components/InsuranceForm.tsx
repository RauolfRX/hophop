import { FormProps } from "src/core/components/Form"
import { z } from "zod"
import { Controller, useForm } from "react-hook-form"
import { ErrorMessage } from "@hookform/error-message"
import DatePicker, { registerLocale } from "react-datepicker"
export { FORM_ERROR } from "src/core/components/Form"
import { Button, Spacer, Box, Flex } from "@chakra-ui/react"
import es from "date-fns/locale/es"

registerLocale("es", es)

export function InsuranceForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  const { control, handleSubmit } = useForm()
  const onError = (errors, e) => console.log(errors, e)

  return (
    <form onSubmit={handleSubmit(props.onSubmit, onError)}>
      <Controller
        control={control}
        name="picker"
        render={({ field }) => {
          return (
            <DatePicker
              selected={field.value}
              onChange={(date) => field.onChange(date)}
              showYearPicker
              dateFormat="yyyy"
              placeholderText="Selecciona año"
              inline
              locale="es"
              calendarStartYear={2023}
            />
          )
        }}
      />
      <Flex>
        <Spacer />
        <Box>
          <Button type="submit" colorScheme="green">
            Guardar
          </Button>
        </Box>
      </Flex>
    </form>
  )
}
