/**
 * Ред'юсер черги замовлень. Його написав колега; у нього черга працює.
 *
 * Стан нормалізований: кожен об'єкт зберігається один раз, а замовлення
 * посилається на гостя через customerId.
 *
 *   {
 *     orders: {
 *       byId: { o41: { id, number, status, customerId, items }, … },
 *       ids: ['o41', 'o42', …],
 *     },
 *     customers: {
 *       byId: { c1: { id: 'c1', name: 'Оля' }, … },
 *       ids: ['c1', …],
 *     },
 *     nextNumber,
 *   }
 *
 * ids зберігає порядок надходження. Напої лишаються всередині замовлення:
 * вони не повторюються між замовленнями й потрібні лише разом із ним.
 * nextNumber — номер, який дістанеться наступному замовленню. Він живе в
 * стані, а не в змінній модуля: інакше ред'юсер мав би побічний ефект і
 * <StrictMode> у режимі розробки збільшував би його двічі на одну дію.
 *
 * Дії — події на сторінці:
 *   { type: 'order_placed', order: { id, customer: { id, name }, items } }
 *       бариста надіслав нове замовлення з форми. Номер і статус 'new'
 *       дає ред'юсер, кожен напій отримує done: false. id замовлення й
 *       гостя створює обробник події.
 *   { type: 'item_toggled', orderId, itemId }
 *       бариста відмітив напій готовим або зняв позначку
 *   { type: 'order_advanced', orderId }
 *       бариста натиснув «Почати», «Готово» чи «Видати»: замовлення
 *       переходить у наступну колонку
 *   { type: 'order_cancelled', orderId }
 *       бариста натиснув «Скасувати замовлення»
 *   { type: 'customer_renamed', customerId, name }
 *       бариста виправив ім'я гостя в «Деталях»
 *
 * Компоненти й тести читають стан лише через selectColumn і selectOrder
 * унизу файлу.
 */

const nextStatus = { new: 'brewing', brewing: 'ready', ready: 'served' }

/** Початковий стан черги з вкладених замовлень, як їх повертає loadOrders(). */
export function createInitialState(orders) {
  const ordersById = {}
  const orderIds = []
  const customersById = {}
  const customerIds = []

  for (const order of orders) {
    const { customer, ...rest } = order
    ordersById[order.id] = { ...rest, customerId: customer.id }
    orderIds.push(order.id)

    if (!customersById[customer.id]) {
      customersById[customer.id] = { ...customer }
      customerIds.push(customer.id)
    }
  }

  return {
    orders: { byId: ordersById, ids: orderIds },
    customers: { byId: customersById, ids: customerIds },
    nextNumber: Math.max(...orders.map((order) => order.number)) + 1,
  }
}

export function queueReducer(state, action) {
  switch (action.type) {
    case 'order_placed': {
      const { customer, ...orderData } = action.order
      const order = {
        ...orderData,
        customerId: customer.id,
        number: state.nextNumber,
        status: 'new',
        items: action.order.items.map((item) => ({ ...item, done: false })),
      }
      const isNewCustomer = !state.customers.byId[customer.id]

      return {
        ...state,
        orders: {
          byId: { ...state.orders.byId, [order.id]: order },
          ids: [...state.orders.ids, order.id],
        },
        customers: isNewCustomer
          ? {
              byId: { ...state.customers.byId, [customer.id]: { ...customer } },
              ids: [...state.customers.ids, customer.id],
            }
          : state.customers,
        nextNumber: state.nextNumber + 1,
      }
    }
    case 'item_toggled': {
      const order = state.orders.byId[action.orderId]
      if (!order) return state
      const items = order.items.map((item) =>
        item.id === action.itemId ? { ...item, done: !item.done } : item,
      )
      return {
        ...state,
        orders: {
          ...state.orders,
          byId: { ...state.orders.byId, [order.id]: { ...order, items } },
        },
      }
    }
    case 'order_advanced': {
      const order = state.orders.byId[action.orderId]
      if (!order) return state
      return {
        ...state,
        orders: {
          ...state.orders,
          byId: {
            ...state.orders.byId,
            [order.id]: { ...order, status: nextStatus[order.status] },
          },
        },
      }
    }
    case 'order_cancelled': {
      const byId = { ...state.orders.byId }
      delete byId[action.orderId]
      return {
        ...state,
        orders: {
          byId,
          ids: state.orders.ids.filter((id) => id !== action.orderId),
        },
      }
    }
    case 'customer_renamed': {
      const customer = state.customers.byId[action.customerId]
      if (!customer) return state
      return {
        ...state,
        customers: {
          ...state.customers,
          byId: {
            ...state.customers.byId,
            [customer.id]: { ...customer, name: action.name },
          },
        },
      }
    }
    default:
      throw new Error(`Unknown action: ${action.type}`)
  }
}

/**
 * Замовлення однієї колонки (status) у порядку надходження, кожне разом із
 * гостем і напоями.
 */
export function selectColumn(state, status) {
  return state.orders.ids
    .map((id) => selectOrder(state, id))
    .filter((order) => order.status === status)
}

/** Замовлення за id разом із гостем і напоями; undefined, якщо його немає. */
export function selectOrder(state, id) {
  const order = state.orders.byId[id]
  if (!order) return undefined
  return {
    ...order,
    customer: state.customers.byId[order.customerId],
  }
}
