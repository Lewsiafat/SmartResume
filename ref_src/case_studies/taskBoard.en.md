# TaskBoard — Real-time Collaboration Kanban

## Problem

Our team kept hitting three pain points while planning projects:

1. Trello's free tier capped us at 10 boards — we burned through that within a quarter
2. Status changes had no live updates — the PM had to constantly refresh to see who touched what
3. We wanted self-hosted data ownership, but most open-source Kanbans were either feature-poor or lacked real-time sync

So I built one from scratch — and used it as an excuse to learn WebSocket broadcasting and multi-user conflict resolution properly.

## Solution

Frontend/backend split with two-way WebSocket comms:

- **Frontend** Vue 3 + Pinia. Each board joins a dedicated Socket.IO room; card actions update optimistically before server confirmation
- **Backend** Node.js + Express + Socket.IO. On receive: write to PostgreSQL → broadcast to others in the room
- **Conflict resolution** server-side timestamps with last-write-wins, plus reconcile events that tell the frontend to adjust local state when needed

Goal: "card drags feel local, but everyone sees a consistent view within 200ms."

## Tech Choices

- **Socket.IO vs raw WebSocket** — picked Socket.IO. Rooms, auto-reconnect, transport fallback all built-in. Saved a week of plumbing
- **PostgreSQL vs MongoDB** — the board/card/comment relationships and ordering logic favored SQL. Schemaless would have hurt later
- **Optimistic updates vs server-confirm** — optimistic. Much better UX, but you have to write the reconcile path. Worth it
- **Monolith vs microservices** — monolith. For <10-person teams the operational overhead of splitting isn't justified

## Result

- Used internally for 4 months — 6 active boards, 5–8 concurrent users on average, card-move latency <100ms
- After open-sourcing: 18 GitHub stars, 5 external forks, 2 contributor PRs
- Self-hosted on a home NAS — operational cost (power + backups) under USD $2/month

## Lessons Learned

- **Real-time is harder than it looks.** Every event needs a "what if it fails" and "what if order is wrong" answer — roughly 2× the work of plain REST
- **Get the schema right early.** Adding columns is easy; splitting tables is painful. v2 had to extract `card_history` out of `cards`, which was a slog
- **Self-hosting has a hidden cost: ongoing operational mindshare.** Software is free, but every security advisory becomes a "do I patch now?" decision. Next time I'd weigh managed options more seriously
- **WebSocket connection limits need planning.** A single Node process struggles past ~200 concurrent connections. Plan for worker sharding or a Redis adapter early
