import { createContext, use, useState } from 'react'

const TabsContext = createContext(null)

function useTabsContext(componentName) {
  const context = use(TabsContext)
  if (!context) {
    throw new Error(`${componentName} must be used inside <Tabs>`)
  }
  return context
}

function TabsList(props) {
  useTabsContext('Tabs.List')
  return <div className="tab-list" {...props} />
}

function TabsTab({ value, ...props }) {
  const { selected, setSelected } = useTabsContext('Tabs.Tab')

  return (
    <button
      type="button"
      className={selected === value ? 'active' : ''}
      onClick={() => setSelected(value)}
      {...props}
    />
  )
}

function TabsPanel({ value, ...props }) {
  const { selected } = useTabsContext('Tabs.Panel')

  return <div hidden={selected !== value} {...props} />
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

  return (
    <TabsContext value={{ selected, setSelected }}>
      <div className="tabs">{children}</div>
    </TabsContext>
  )
}

Tabs.List = TabsList
Tabs.Tab = TabsTab
Tabs.Panel = TabsPanel
