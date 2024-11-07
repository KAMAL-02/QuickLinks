import { useState, useEffect } from 'react'
import { Plus, Trash2, ExternalLink, Info, Command } from 'lucide-react'

interface Shortcut {
  keyword: string
  url: string
}

export default function App() {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([])
  const [newKeyword, setNewKeyword] = useState('')
  const [newUrl, setNewUrl] = useState('')

  useEffect(() => {
    chrome.storage.sync.get(['shortcuts'], (result) => {
      setShortcuts(result.shortcuts || [])
    })
  }, [])

  const addShortcut = () => {
    if (newKeyword && newUrl) {
      const updatedShortcuts = [...shortcuts, { keyword: newKeyword, url: newUrl }]
      chrome.storage.sync.set({ shortcuts: updatedShortcuts }, () => {
        setShortcuts(updatedShortcuts)
        setNewKeyword('')
        setNewUrl('')
      })
    }
  }

  const removeShortcut = (index: number) => {
    const updatedShortcuts = shortcuts.filter((_, i) => i !== index)
    chrome.storage.sync.set({ shortcuts: updatedShortcuts }, () => {
      setShortcuts(updatedShortcuts)
    })
  }

  return (
    <div className="w-96 p-6 bg-[#0A0A0F] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] min-h-screen">
      <div className="glass-morphism rounded-xl p-6 border border-gray-800">
        <div className="flex items-center justify-center gap-2 mb-6">
        <Command className="w-6 h-6 text-indigo-400" />
        <h1 className="text-3xl font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">QuickLinks</h1>
        </div>

        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-300 flex items-start">
            <Info className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5 text-indigo-400" />
            To use a shortcut, type "go" followed by the keyword in your address bar.
          </p>
        </div>
        <div className="space-y-3 mb-6">
          <input
            type="text"
            placeholder="Keyword"
            value={newKeyword}
            required
            onChange={(e) => setNewKeyword(e.target.value)}
            className="w-full px-4 py-2 rounded-md focus:outline-none bg-gray-900/50 border-gray-700"
          />
          <input
            type="text"
            placeholder="URL"
            value={newUrl}
            required
            onChange={(e) => setNewUrl(e.target.value)}
            className="w-full px-4 py-2 rounded-md focus:outline-none bg-gray-900/50 border-gray-700"
          />
          <button
            onClick={addShortcut}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-md transition duration-200 flex items-center justify-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Shortcut
          </button>
        </div>
        <ul className="space-y-2">
          {shortcuts.map((shortcut, index) => (
            <li key={index} className="bg-indigo-500/10 border border-indigo-500/20 rounded-md overflow-hidden backdrop-blur-sm">
              <div className="p-4 flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <h3 className="text-base font-semibold text-white">{shortcut.keyword}</h3>
                  <a
                    href={shortcut.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-300 flex items-center"
                  >
                    {shortcut.url}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => removeShortcut(index)}
                    className="p-2 bg-red-500 text-white rounded-full transition duration-200 transform hover:scale-110"
                    title="Remove Shortcut"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}