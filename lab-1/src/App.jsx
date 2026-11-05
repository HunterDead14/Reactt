import ProfileCard from './components/ProfileCard.jsx'
import './App.css'

const technologies = ['React', 'TypeScript', 'Node.js']

function App() {
  return (
    <main className="app">
      <ProfileCard
        name="Ільчук Микола"
        group="КН-31"
        technologies={technologies}
      />
    </main>
  )
}

export default App
