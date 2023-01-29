import { Routes } from "@blitzjs/next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation } from "@blitzjs/rpc";
import Layout from "src/core/layouts/Layout";
import createPayment from "src/payments/mutations/createPayment";
import { PaymentForm, FORM_ERROR } from "src/payments/components/PaymentForm";

const NewPaymentPage = () => {
  const router = useRouter();
  const [createPaymentMutation] = useMutation(createPayment);

  return (
    <Layout title={"Create New Payment"}>
      <h1>Create New Payment</h1>

      <PaymentForm
        submitText="Create Payment"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreatePayment}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const payment = await createPaymentMutation(values);
            await router.push(
              Routes.ShowPaymentPage({ paymentId: payment.id })
            );
          } catch (error: any) {
            console.error(error);
            return {
              [FORM_ERROR]: error.toString(),
            };
          }
        }}
      />

      <p>
        <Link href={Routes.PaymentsPage()}>
          <a>Payments</a>
        </Link>
      </p>
    </Layout>
  );
};

NewPaymentPage.authenticate = true;

export default NewPaymentPage;
