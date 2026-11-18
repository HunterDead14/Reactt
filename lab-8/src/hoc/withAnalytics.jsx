import { track } from '../analytics.js'

/**
 * Компонент вищого порядку (HOC): отримує компонент і повертає новий, який
 * рендерить `Component` з тими самими props, а під час кліку ще й надсилає
 * подію `event` в аналітику (`track` з src/analytics.js).
 *
 * Використання:
 *   const AddToCartButton = withAnalytics(Button, 'add_to_cart')
 *
 *   <AddToCartButton analyticsData={{ productId }} onClick={add}>
 *     Додати в кошик
 *   </AddToCartButton>
 *
 * Вимоги — у тестах tests/withAnalytics.test.jsx.
 */
export function withAnalytics(Component, event) {
  function WithAnalytics({ analyticsData, onClick, ...props }) {
    function handleClick(clickEvent) {
      track(event, analyticsData)
      onClick?.(clickEvent)
    }

    return <Component {...props} onClick={handleClick} />
  }

  WithAnalytics.displayName = `withAnalytics(${Component.displayName ?? Component.name ?? 'Component'})`

  return WithAnalytics
}
