# TaskBoard — Real-time Collaborative Kanban

## Problem

Small teams using Trello / Asana hit three pain points: limited free-tier features, awkward multi-account management across teams, and a steep ramp when self-hosting because the WebSocket / real-time sync details are hard to learn from scratch. I wanted to build a self-hostable Kanban from zero — and use it as an excuse to practice real-time backend work.

## Solution

Vue 3 frontend + Node.js + Socket.IO backend + PostgreSQL. Card movements broadcast over WebSocket so every connected client sees changes instantly. Boards / cards / comments all use optimistic UI updates with server reconciliation, keeping the experience smooth even when the network jitters.

## Tech Choices

- **Socket.IO over raw WebSocket**: room-based broadcast comes built-in, saving a week of wheel reinvention
- **PostgreSQL over MongoDB**: relations between boards / cards / comments are complex; SQL fits naturally
- **Optimistic update vs. waiting for server confirm**: chose optimistic — UX is snappy, but you have to write reconcile logic (worth it)

## Result

- Internal-team beta for 2 months, ~8 daily actives, zero data-conflict reports
- Board load <300ms, card-move broadcast <80ms (LAN)
- 11 GitHub stars, 3 external forks

## Lessons Learned

- Once WebSocket connection counts spike, Node's single-threaded loop gets tight — next iteration should design worker sharding upfront
- Reconciling optimistic updates is harder than expected — write tests before business logic
- Self-hosting really does save money, but operational cost (security patches, backups) is easy to underestimate
