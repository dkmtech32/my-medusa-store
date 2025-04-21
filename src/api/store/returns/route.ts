import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { createAndCompleteReturnOrderWorkflow } from "@medusajs/medusa/core-flows";

type ReturnItem = {
  id: string;
  quantity: number;
  reason_id?: string;
  note?: string;
};

type ReturnShipping = {
  option_id: string;
  price?: number;
};

type CreateReturnBody = {
  order_id: string;
  items: ReturnItem[];
  return_shipping?: ReturnShipping;
  note?: string;
  refund_amount?: number;
};

export async function POST(
  req: MedusaRequest<CreateReturnBody>,
  res: MedusaResponse
) {
  try {
    const { order_id, items, return_shipping, note, refund_amount } = req.body;

    const { result } = await createAndCompleteReturnOrderWorkflow(
      req.scope
    ).run({
      input: {
        order_id,
        items,
        return_shipping,
        note,
        refund_amount,
        receive_now: true, // Let admin process the return first
      },
    });

    res.json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
      code: error.code,
    });
  }
}
