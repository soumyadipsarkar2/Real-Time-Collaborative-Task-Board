import { Express } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from './index';
import { authenticate, generateToken, AuthRequest, requireAdmin } from './auth';

export function setupRoutes(app: Express) {
    // Auth
    app.post('/api/register', async (req, res) => {
        try {
            const { username, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await prisma.user.create({
                data: { username, password: hashedPassword }
            });
            res.json({ token: generateToken(user) });
        } catch (e) {
            res.status(400).json({ error: 'Registration failed' });
        }
    });

    app.post('/api/login', async (req, res) => {
        const { username, password } = req.body;
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        res.json({ token: generateToken(user), user: { id: user.id, username: user.username, role: user.role } });
    });

    // Boards
    app.get('/api/boards', authenticate, async (req, res) => {
        const boards = await prisma.board.findMany({
            include: {
                columns: {
                    include: { tasks: { orderBy: { order: 'asc' } } },
                    orderBy: { order: 'asc' }
                }
            }
        });
        res.json(boards);
    });

    app.post('/api/boards', authenticate, requireAdmin, async (req, res) => {
        const { title } = req.body;
        const board = await prisma.board.create({ data: { title } });
        res.json(board);
    });

    // Tasks (with conflict resolution simulation using version)
    app.put('/api/tasks/:id/move', authenticate, async (req: AuthRequest, res: any) => {
        const { id } = req.params;
        const { columnId, order, version } = req.body;

        try {
            // Optimistic concurrency control check
            const task = await prisma.task.findUnique({ where: { id } });
            if (!task) return res.status(404).json({ error: 'Task not found' });
            if (task.version !== version) {
                return res.status(409).json({ error: 'Conflict: Task was modified by another user. Please refresh.' });
            }

            const updated = await prisma.task.update({
                where: { id },
                data: {
                    columnId,
                    order,
                    version: task.version + 1
                }
            });

            res.json(updated);
        } catch (e) {
            res.status(500).json({ error: 'Failed to update task' });
        }
    });

    // Basic CRUD for columns/tasks (abbreviated for blueprint)
    app.post('/api/columns', authenticate, requireAdmin, async (req, res) => {
        const column = await prisma.column.create({ data: req.body });
        res.json(column);
    });

    app.post('/api/tasks', authenticate, async (req, res) => {
        const { title, description, columnId, order } = req.body;
        const task = await prisma.task.create({
            data: { title, description, columnId, order }
        });
        res.json(task);
    });
}
