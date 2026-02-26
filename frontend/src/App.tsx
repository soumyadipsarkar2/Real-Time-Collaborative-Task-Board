import React, { useState, useEffect } from 'react';
import { DndContext, closestCorners, DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

const socketUrl = import.meta.env.VITE_WS_URL || 'http://localhost:5000';
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const MainApp = () => {
  const [board, setBoard] = useState<any>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const s = io(socketUrl);
    setSocket(s);

    s.on('connect', () => {
      console.log('Connected to WebSocket');
      s.emit('join_board', 'default_board_id'); // Using a dummy board logic
    });

    s.on('sync_task_update', (task) => {
      // Logic to update board
      console.log('Task sync received', task);
    });

    return () => {
      s.disconnect();
    };
  }, []);

  const handleDragStart = (event: any) => {
    const { active } = event;
    setActiveId(active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    // Simplistic handling
    if (active.id !== over.id) {
      if (socket) {
        socket.emit('task_updated', {
          boardId: 'default_board_id',
          task: { id: active.id, overId: over.id }
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
          Real-Time Task Board
        </h1>
        <div className="flex gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors">
            Login
          </button>
        </div>
      </header>

      <main className="flex gap-6 overflow-x-auto pb-4 h-[calc(100vh-140px)]">
        <DndContext
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {/* Mock Columns */}
          <div className="flex-shrink-0 w-80 bg-neutral-800 rounded-xl p-4 flex flex-col">
            <h2 className="font-semibold text-lg mb-4 flex items-center justify-between">
              To Do <span className="text-sm bg-neutral-700 px-2 py-1 rounded text-neutral-400">3</span>
            </h2>
            <div className="flex-1 overflow-y-auto space-y-3">
              <div className="bg-neutral-700 p-4 rounded-lg shadow-sm border border-neutral-600 cursor-grab hover:border-blue-500 transition-colors">
                <p className="font-medium text-neutral-200">Set up Docker Compose</p>
              </div>
              <div className="bg-neutral-700 p-4 rounded-lg shadow-sm border border-neutral-600 cursor-grab hover:border-blue-500 transition-colors">
                <p className="font-medium text-neutral-200">Configure WebSockets</p>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 w-80 bg-neutral-800 rounded-xl p-4 flex flex-col">
            <h2 className="font-semibold text-lg mb-4 flex items-center justify-between">
              In Progress <span className="text-sm bg-neutral-700 px-2 py-1 rounded text-neutral-400">1</span>
            </h2>
            <div className="flex-1 overflow-y-auto space-y-3">
              <div className="bg-neutral-700 p-4 rounded-lg shadow-sm border border-neutral-600 cursor-grab hover:border-blue-500 transition-colors">
                <p className="font-medium text-neutral-200">React Drag & Drop UI</p>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 w-80 bg-neutral-800 rounded-xl p-4 flex flex-col">
            <h2 className="font-semibold text-lg mb-4 flex items-center justify-between">
              Done <span className="text-sm bg-neutral-700 px-2 py-1 rounded text-neutral-400">2</span>
            </h2>
            <div className="flex-1 overflow-y-auto space-y-3">
              <div className="bg-neutral-700 p-4 rounded-lg shadow-sm border border-neutral-600 cursor-grab hover:border-blue-500 transition-colors">
                <p className="font-medium text-neutral-200">Initialize Repository</p>
              </div>
              <div className="bg-neutral-700 p-4 rounded-lg shadow-sm border border-neutral-600 cursor-grab hover:border-blue-500 transition-colors">
                <p className="font-medium text-neutral-200">Create Backend APIs</p>
              </div>
            </div>
          </div>

          <DragOverlay dropAnimation={{
            sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } }),
          }}>
            {activeId ? (
              <div className="bg-blue-600 p-4 rounded-lg shadow-2xl scale-105 cursor-grabbing">
                <p className="font-medium text-white">Dragging Item</p>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>
    </div>
  );
};

export default MainApp;
