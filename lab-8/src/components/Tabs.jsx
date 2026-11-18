import { createContext, use, useId, useState } from 'react'

const TabsContext = createContext(null)

function useTabsContext(componentName) {
  const context = use(TabsContext)
  if (!context) {
    throw new Error(`${componentName} must be used inside <Tabs>`)
  }
  return context
}

function getIds(baseId, value) {
  const suffix = String(value)
  return {
    tabId: `${baseId}-tab-${suffix}`,
    panelId: `${baseId}-panel-${suffix}`,
  }
}

function TabsList(props) {
  useTabsContext('Tabs.List')
  return <div role="tablist" className="tab-list" {...props} />
}

function TabsTab({ value, ...props }) {
  const { selected, setSelected, baseId } = useTabsContext('Tabs.Tab')
  const { tabId, panelId } = getIds(baseId, value)
  const isSelected = selected === value

  function handleKeyDown(event) {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) {
      return
    }

    event.preventDefault()

    const tabList = event.currentTarget.closest('[role="tablist"]')
    const tabs = Array.from(tabList?.querySelectorAll('[role="tab"]') ?? [])
    const currentIndex = tabs.indexOf(event.currentTarget)
    if (currentIndex === -1) return

    let nextIndex = currentIndex
    if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % tabs.length
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = tabs.length - 1
    }

    const nextTab = tabs[nextIndex]
    nextTab.focus()
    nextTab.click()
  }

  return (
    <button
      type="button"
      role="tab"
      id={tabId}
      aria-selected={isSelected}
      aria-controls={panelId}
      tabIndex={isSelected ? 0 : -1}
      onClick={() => setSelected(value)}
      onKeyDown={handleKeyDown}
      {...props}
    />
  )
}

function TabsPanel({ value, ...props }) {
  const { selected, baseId } = useTabsContext('Tabs.Panel')
  const { tabId, panelId } = getIds(baseId, value)

  return (
    <div
      role="tabpanel"
      id={panelId}
      aria-labelledby={tabId}
      tabIndex={0}
      hidden={selected !== value}
      {...props}
    />
  )
}

/**
 * Вкладки — складений компонент (compound component): `Tabs` і його частини
 * `Tabs.List`, `Tabs.Tab` і `Tabs.Panel`. Вміст кожної частини приходить між
 * її тегами як `children`, а яка вкладка обрана, частини дізнаються з
 * контексту, який створює `Tabs`.
 *
 * Використання:
 *   <Tabs defaultValue="brew">
 *     <Tabs.List aria-label="Про каву">
 *       <Tabs.Tab value="brew">Заварювання</Tabs.Tab>
 *       <Tabs.Tab value="reviews">Відгуки</Tabs.Tab>
 *     </Tabs.List>
 *     <Tabs.Panel value="brew">…</Tabs.Panel>
 *     <Tabs.Panel value="reviews">…</Tabs.Panel>
 *   </Tabs>
 *
 * Вимоги — у тестах tests/Tabs.children.test.jsx і tests/Tabs.a11y.test.jsx.
 */
export default function Tabs({ defaultValue, children }) {
  const [selected, setSelected] = useState(defaultValue)
  const baseId = useId()

  return (
    <TabsContext value={{ selected, setSelected, baseId }}>
      <div className="tabs">{children}</div>
    </TabsContext>
  )
}

Tabs.List = TabsList
Tabs.Tab = TabsTab
Tabs.Panel = TabsPanel
