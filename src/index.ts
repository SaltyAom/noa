import { KingWorld } from 'kingworld'
import { staticPlugin } from '@kingworldjs/static'
import LRUCache from 'lru-cache'

new KingWorld()
    .state(
        'burst',
        new LRUCache<string, number>({
            ttl: 4 * 1000,
            ttlAutopurge: true
        })
    )
    // ? 1.5 req/s
    .onRequest((request, store) => {
        const ip = request.headers.get('x-real-ip')
        if (!ip) return

        const score = store.burst.get(ip) ?? 0
        store.burst.set(ip, score + 1)

        if (score > 6)
            return new Response('bonk', {
                status: 420
            })
    })
    .use(
        staticPlugin({
            prefix: 'id',
            path: 'public/id'
        })
    )
    .get('/', () => 'Noa')
    .listen(3000)

console.log('🦊 KINGWORLD is running at :3000')
