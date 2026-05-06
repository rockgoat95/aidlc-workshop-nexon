import { createChannel, createSession, Channel, Session } from 'better-sse';

export type OrderEvent =
  | { type: 'new-order'; data: unknown }
  | { type: 'order-status-changed'; data: { orderId: string; status: string } }
  | { type: 'order-deleted'; data: { orderId: string } }
  | { type: 'table-completed'; data: { tableId: string } };

const orderChannel: Channel = createChannel();

export function getOrderChannel(): Channel {
  return orderChannel;
}

export async function registerSSEClient(req: any, res: any): Promise<Session> {
  const session = await createSession(req, res);
  orderChannel.register(session);
  return session;
}

export function broadcastOrderEvent(event: OrderEvent): void {
  orderChannel.broadcast(JSON.stringify(event), event.type);
}
