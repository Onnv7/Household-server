import { createActor, setup } from 'xstate';
import { OrderBillEvent, OrderBillStatus, Role } from '../../common/enum';
export const householdMachine = (state: OrderBillStatus) => {
  return setup({
    types: {
      events: {} as { type: OrderBillEvent },
      context: {} as {
        role: Role;
      },
      input: {} as {
        actorRole: Role;
      },
    },
    guards: {
      isAdmin: ({ context, event }) => {
        return context.role === Role.ROLE_ADMIN;
      },
    },

    actions: {
      updateOrderBill: ({ context, event, self, system }, parasm: any) => {},
    },
  }).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QAoAWB7ArrMGA2EAtOgE4RgkCUAdAAoCiAcgCICSjA4gPq2sDCAaQCqtAMQBlIXz716zANoAGALqJQAB3SwAlgBdt6AHZqQAD0QBOAIxXqVgEwB2AKwXHADkf33ANkU+AGhAAT0QAZkdbCwAWd0V7aLCbZ0Uw6OcAXwygtCwcfCJScio6JjZOHn5hMXEACVZaXgqAMQBBVgAZOSVVJBBNHX0jE3MEa1sHFzdPbz9AkPD7ezsw52ifNJ9nRw33LOyQQ3RyeD7c7Fx0AmIyCkoTAb0DYz7RlNtnKwt3K2jFK3iO2cQVCCBsYWoYQSSUUjn8-gSewO53yV0KtxKDBY7G4vEEIgeWiew1eiDWFmon2+v3+gK2IMQS0c1AsEShNkUFk5Vh2WRyGAuBRuxRofAA8gBZWhdAAqckJg2eI0QHOW9kU7ns2ycsUcFmBCwQEUU1F8rmi60S6Ri0T5IBRl2uRTu1DanXlfUeQxeoFGquo6s12scuv1DIQ6pNPmiXlh9isKTS7iRWSAA */
    id: '(household-order)',
    context: ({ input }) => ({
      role: input.actorRole,
    }),
    initial: state,
    states: {
      [OrderBillStatus.CREATED]: {
        on: {
          ACCEPT: {
            target: 'PROCESSING',
            guard: {
              type: 'isAdmin',
            },
            actions: {
              type: 'updateOrderBill',
            },
          },
          ABORT: 'FAILED',
        },
      },

      [OrderBillStatus.PROCESSING]: {
        on: {
          CANCEL: {
            target: 'FAILED',
            guard: 'isAdmin',
          },
          PREPARE: 'PENDING_PICKUP',
        },
      },

      [OrderBillStatus.PENDING_PICKUP]: {
        on: {
          SUCCEED: 'COMPLETED',
          SHIPPING_FAILED: 'FAILED',
        },
      },

      [OrderBillStatus.COMPLETED]: {
        type: 'final',
      },
      [OrderBillStatus.FAILED]: {
        type: 'final',
      },
    },
  });
};
