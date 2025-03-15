import React, { useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { CodeCell } from './components/CodeCell';
import { PlusCircle, Book, Users, Search, Settings, Moon, Zap } from 'lucide-react';
import type { Cell, Notebook } from './types';

function App() {
  const [notebook, setNotebook] = useState<Notebook>({
    id: '1',
    title: 'Untitled Notebook',
    cells: [],
    lastModified: new Date(),
  });

  const addCell = () => {
    const newCell: Cell = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'code',
      content: '',
    };
    setNotebook(prev => ({
      ...prev,
      cells: [...prev.cells, newCell],
    }));
  };

  const updateCell = (id: string, content: string) => {
    setNotebook(prev => ({
      ...prev,
      cells: prev.cells.map(cell =>
        cell.id === id ? { ...cell, content } : cell
      ),
    }));
  };

  const deleteCell = (id: string) => {
    setNotebook(prev => ({
      ...prev,
      cells: prev.cells.filter(cell => cell.id !== id),
    }));
  };

  const executeCell = async (id: string) => {
    console.log(`Executing cell ${id}`);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-gray-800 sticky top-0 z-50 backdrop-blur-lg bg-black/50">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Book className="h-8 w-8 text-white" />
                <span className="ml-2 text-xl font-bold gradient-text">
                  DataCanvas
                </span>
              </div>
              <div className="hidden md:flex md:items-center md:space-x-1 ml-8">
                <a href="#" className="px-3 py-2 text-sm font-medium text-white rounded-md bg-white/10">
                  Notebooks
                </a>
                <a href="#" className="px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-white/5">
                  Visualizations
                </a>
                <a href="#" className="px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-white/5">
                  Datasets
                </a>
                <a href="#" className="px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-white/5">
                  Changelog
                </a>
                <div className="px-2 py-1 text-xs font-medium bg-white/10 rounded ml-2">New</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="hidden md:block">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search notebooks..."
                    className="block w-full pl-10 pr-3 py-2 bg-white/5 border border-gray-800 rounded-lg text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <button className="p-2 text-gray-400 hover:text-gray-300 rounded-lg hover:bg-white/5">
                <Moon className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-300 rounded-lg hover:bg-white/5">
                <Users className="h-5 w-5" />
              </button>
              <button className="ml-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-4 py-12">
        <div className="text-center mb-16 relative">
          <div className="radial-background absolute inset-0 -z-10"></div>
          <h1 className="text-5xl font-bold mb-6 gradient-text">
            Data Science Notebooks,<br />
            Reimagined for Teams.
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
            Create professional data analysis in seconds using AI-powered technology.
            Turn your data into insights that drive decisions, reduce analysis time by 90%,
            and scale your data science efforts.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={addCell}
              className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <PlusCircle className="h-5 w-5" />
              New Notebook
            </button>
          </div>
          <div className="mt-6 text-sm text-gray-500">
            Trusted by 300+ Data Teams Worldwide
          </div>
        </div>

        <div className="space-y-6">
          <Virtuoso
            style={{ height: 'calc(100vh - 240px)' }}
            totalCount={notebook.cells.length}
            itemContent={index => {
              const cell = notebook.cells[index];
              return (
                <CodeCell
                  key={cell.id}
                  content={cell.content}
                  onChange={(content) => updateCell(cell.id, content)}
                  onDelete={() => deleteCell(cell.id)}
                  onExecute={() => executeCell(cell.id)}
                />
              );
            }}
          />
        </div>
      </main>
    </div>
  );
}

export default App;