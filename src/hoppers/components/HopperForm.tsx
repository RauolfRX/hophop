import { Form, FormProps } from "src/core/components/Form"
import { LabeledTextField } from "src/core/components/LabeledTextField"
import { z } from "zod"
export { FORM_ERROR } from "src/core/components/Form"

export function HopperForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <div className="mb-8">
        <LabeledTextField name="name" label="Nombre" placeholder="Nombre" />
      </div>
      <div className="mb-8">
        <LabeledTextField name="info" label="Info" placeholder="Info" />
      </div>
    </Form>
  )
}
