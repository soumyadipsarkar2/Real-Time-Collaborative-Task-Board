import { Server } from 'socket.io';

export function setupSocket(io: Server) {
    io.on('connection', (socket) => {
        console.log('User connected via WebSocket:', socket.id);

        // Join a board room
        socket.on('join_board', (boardId: string) => {
            socket.join(`board_${boardId}`);
            console.log(`Socket ${socket.id} joined board_${boardId}`);
        });

        // Leave a board room
        socket.on('leave_board', (boardId: string) => {
            socket.leave(`board_${boardId}`);
        });

        // Broadcast task movement or update
        socket.on('task_updated', (data: { boardId: string, task: any }) => {
            // Using volatile or base emit for real-time reactivity
            socket.to(`board_${data.boardId}`).emit('sync_task_update', data.task);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
}
