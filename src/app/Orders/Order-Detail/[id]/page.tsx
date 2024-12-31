import OrderDetails from "./OrderDetails";

type paramsType = Promise<{ id: string }>;

export default async function OrderDetailsPage({
    params,
  }: {
    params: paramsType;
  }) {
  // Ensure params are resolved asynchronously
  const { id } = await params;
  return <OrderDetails id={id} />;
}
