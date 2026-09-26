# Music Generation (Suno AI Plan)

Plan for bringing generative music into AIRI so a character can compose, play, and react to music — not only speak.

## Why

DreamLog already frames companion-like music selection as part of the long-term vision (mood-aware listening while chatting). AIRI already has pieces that music generation would plug into:

- **Speech providers** (`packages/stage-ui/src/stores/providers.ts`) — same credential / settings pattern can grow a `music` category
- **LLM tools** (`packages/stage-ui/src/tools/`) — character can call `generate_music` / `play_music` like MCP tools
- **Beat sync** (`useBeatSyncStore`, settings module) — motion / lip-sync / dance hooks from audio
- **WebAudio stack** (`packages/audio`) — playback, analysis, ducking against TTS

Suno is the clearest product-quality target for full songs with vocals. It is not yet a drop-in public API.

## Suno API status (as of 2026-09)

| Fact | Detail |
| --- | --- |
| Public self-serve API | **No** documented developer portal, keys, or OpenAPI from Suno |
| Official direction | July 2026: Suno CPO announced exploring a **partner-powered** developer API |
| Access today | Intake form for a curated partner group; no published timeline, pricing, or terms |
| Unofficial wrappers | Session scrapers / third-party “Suno APIs” exist; **do not** ship these in AIRI (ToS, account risk, brittle, legal) |

**Implication:** treat Suno as a first-class *provider target*, but ship the music pipeline behind a provider interface and unlock a real backend first (ElevenLabs Music is the pragmatic default while waiting on Suno partner access).

### Partner pitch angle (if applying)

Suno said they want apps that unlock experiences generative music makes possible for the first time — not thin wrappers. AIRI’s fit:

- AI character **composes and performs** live (stream / Discord / desktop companion)
- Music drives **Live2D / VRM motion** via beat sync
- Mood + conversation context choose genre / lyrics (companion OS idea from DreamLog)
- Optional: user-owned library of character-themed tracks for offline replay

## Goals

1. Character can generate a short track from chat intent (“make a chill lo-fi for studying”).
2. Generated audio plays in-app without fighting TTS (duck / pause / mix policy).
3. Beat sync can drive simple motion from generated (or captured) audio.
4. Provider-swappable: ElevenLabs Music now → Suno when partner API lands → local later.
5. Clear licensing / commercial-use notes in settings (per-provider).

## Non-goals (v1)

- Reverse-engineering Suno’s web session or embedding unofficial scrapers
- Full DAW / multi-track editing UI
- Guaranteed real-time streaming generation (most APIs are job-based, seconds–minutes)
- Replacing TTS with sung vocals as the default speech path

## Architecture

```text
User / LLM intent
        │
        ▼
  music tools (xsai tool)
        │
        ▼
  music module store  ──credentials──►  music provider adapter
        │                                    │
        │                                    ├─ elevenlabs-music
        │                                    ├─ suno (partner, later)
        │                                    └─ openai-compatible / local stub
        ▼
  generation job (prompt, duration, instrumental?, lyrics?)
        │
        ▼
  asset cache (blob / IndexedDB / desktop FS)
        │
        ▼
  playback graph (WebAudio) ──► beat-sync analyser ──► Live2D / VRM hooks
        │
        └─ duck against speech playback queue
```

### Provider model

Extend provider metadata with a new category:

```ts
category: 'chat' | 'embed' | 'speech' | 'transcription' | 'music'
tasks: ['text-to-music', 'music-generation']
```

Shared adapter surface (sketch):

```ts
interface MusicProvider {
  generate(input: {
    prompt: string
    durationMs?: number
    instrumental?: boolean
    lyrics?: string
    style?: string
    seed?: number
  }): Promise<{ jobId: string }>

  getJob(jobId: string): Promise<{
    status: 'queued' | 'running' | 'completed' | 'failed'
    audioUrl?: string
    title?: string
    error?: string
  }>
}
```

Poll or webhook depending on host (web: poll; desktop service: optional push).

### LLM tools

Add tools next to `debug` / `mcp` in `packages/stage-ui/src/tools/`:

| Tool | Purpose |
| --- | --- |
| `music_generate` | Start a generation job from prompt + options |
| `music_status` | Poll job / return playable asset id |
| `music_play` | Play a cached track (with duck policy vs speech) |
| `music_stop` | Stop current music |

Keep tool descriptions short so tool-capable models pick them when the user asks for a song.

### Playback + beat sync

- Reuse `@proj-airi/audio` / AudioContext patterns; do not open a second unmanaged context if avoidable.
- Feed `MediaElementAudioSourceNode` or decoded buffer into beat-sync (today beat-sync mainly starts from screen capture — extend with “from element / buffer”).
- Policy: when speech starts, duck music gain (e.g. −12 dB) or pause; restore after TTS flush.

### Settings UX

Mirror speech providers:

- Settings → Providers → Music (API key, base URL if compatible, model)
- Settings → Modules → Music (default provider, auto-play, ducking, max duration, cache limit)
- Link beat-sync module as “react to generated music”

## Phased delivery

### Phase 0 — Research & partner track

- [ ] Apply to Suno’s developer / partner intake with the AIRI character-performance use case
- [ ] Document licensing constraints per candidate provider
- [ ] Spike: generate one track via ElevenLabs Music API and play it in stage-web

### Phase 1 — Music provider + playback MVP

- [ ] Add `music` provider category + ElevenLabs Music adapter
- [ ] Music module store (credentials, last jobs, cache)
- [ ] Settings pages (provider + module)
- [ ] Manual “Generate” playground (same spirit as speech playground)
- [ ] Playback with TTS ducking

### Phase 2 — Character tools + beat sync

- [ ] `music_*` LLM tools wired through `stores/llm.ts`
- [ ] Extend beat-sync to accept in-app audio sources (not only display capture)
- [ ] Optional simple motion reaction (idle bob / existing Live2D params)

### Phase 3 — Suno provider (when official access exists)

- [ ] Implement Suno adapter against official partner docs
- [ ] Map Suno-specific features (custom lyrics, extend, stems, aligned lyrics) behind optional capabilities flags
- [ ] Prefer aligned lyrics for future lip-sync / sing-along experiments

### Phase 4 — Polish

- [ ] Library UI (history, favorites, export)
- [ ] Discord / stream-friendly output (desktop)
- [ ] Local / open models as offline fallback (research only until quality is usable)

## Provider comparison (practical)

| Provider | Official API | Vocals / songs | Fit for AIRI now |
| --- | --- | --- | --- |
| **Suno** | Partner exploration only | Strong full songs | Target; wait for official access |
| **ElevenLabs Music** | Yes (`POST /v1/music`) | Compose from prompt / plan | Best MVP backend; AIRI already uses ElevenLabs for speech |
| **Stable Audio** | Via Stability / aggregators | Strong instrumental / SFX | Good for BGM without vocals |
| Unofficial Suno wrappers | N/A | Varies | Reject for mainline |

## Risks

- **API availability:** Suno timing unknown — abstract providers early
- **Latency:** generation is not conversationally instant; UI + character dialogue must set expectations (“give me a moment…”)
- **Cost / quotas:** cache aggressively; cap duration in settings
- **Licensing:** surface commercial-use limits; do not imply remix rights users do not have
- **Audio conflict:** music + TTS + hearing/VAD need clear gain rules
- **Legal:** avoid account-cookie automation against Suno ToS

## Suggested first PR scope

Smallest useful merge:

1. Research doc (this file)
2. `MusicProvider` types + ElevenLabs Music client stub
3. Settings credential fields + playground generate → play
4. No LLM tools yet (Phase 2)

## References

- [Suno explores developer API (Music Business Worldwide)](https://www.musicbusinessworldwide.com/suno-explores-developer-api-seeking-apps-that-unlock-experiences-generative-music-makes-possible-for-the-first-time/)
- [ElevenLabs Compose Music API](https://elevenlabs.io/docs/api-reference/music/compose)
- AIRI DreamLog 0x1 — music selection as companion vision
- Existing code anchors: `providers.ts`, `tools/`, `beat-sync.ts`, `packages/audio`
