import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import { Server } from 'socket.io';

let pubClient: ReturnType<typeof createClient>;
let subClient: ReturnType<typeof createClient>;

export async function setupRedis(io: Server) {
    const url = process.env.REDIS_URL || 'redis://localhost:6379';

    pubClient = createClient({ url });
    subClient = pubClient.duplicate();

    pubClient.on('error', (err) => console.log('Redis Pub Client Error', err));
    subClient.on('error', (err) => console.log('Redis Sub Client Error', err));

    await Promise.all([pubClient.connect(), subClient.connect()]);

    io.adapter(createAdapter(pubClient, subClient));
    console.log('Redis adapter integrated with Socket.IO via pub/sub for multi-instance sync');
}

export function getRedisClient() {
    return pubClient;
}
