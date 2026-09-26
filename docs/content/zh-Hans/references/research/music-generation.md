# 音乐生成（Suno AI 计划）

让 AIRI 角色不止会说话，还能作曲、播放，并随音乐做出反应的集成计划。

## 动机

DreamLog 里已经把「按心情选歌」写成长期愿景的一部分。AIRI 现有能力可直接承接：

- **语音 Provider**（`packages/stage-ui/src/stores/providers.ts`）— 可扩展出 `music` 类别
- **LLM Tools**（`packages/stage-ui/src/tools/`）— 角色可调用 `generate_music` / `play_music`
- **Beat sync** — 用音频驱动动作 / 口型相关钩子
- **WebAudio**（`packages/audio`）— 播放、分析、相对 TTS 的闪避（ducking）

Suno 是完整歌曲（含人声）质量最接近产品级的目标，但**尚无面向公众的自助 API**。

## Suno API 现状（截至 2026-09）

| 事实 | 说明 |
| --- | --- |
| 公开自助 API | **无**官方开发者门户 / 密钥 / OpenAPI |
| 官方方向 | 2026-07：CPO 宣布探索 **partner-powered** 开发者 API |
| 当前入口 | 精选合作伙伴意向表；无公开时间表、定价与条款 |
| 非官方包装 | 会话爬取 / 第三方「Suno API」— **不要**合入主线（ToS、账号、脆弱性、法律风险） |

**结论：** 把 Suno 当作一等公民的 *Provider 目标*，但先把管线做成可切换 Provider；在拿到官方合作权限前，用已有官方能力的后端（例如 ElevenLabs Music）落地。

### 若申请 Partner 时的卖点

Suno 明确希望「生成式音乐第一次才可能出现」的体验，而不是薄包装。AIRI 的契合点：

- AI 角色直播 / Discord / 桌面端 **现场作曲并表演**
- 音乐经 beat sync 驱动 **Live2D / VRM**
- 对话与情绪上下文选曲风 / 歌词（DreamLog 的 companion OS 方向）
- 可选：角色主题曲库离线回放

## 目标

1. 角色能从聊天意图生成短曲（「来一首学习用的 chill lo-fi」）
2. 应用内播放，且不与 TTS 抢声道（duck / pause / mix）
3. Beat sync 能吃生成（或捕获）音频
4. Provider 可换：ElevenLabs Music → 日后的官方 Suno → 本地
5. 设置里写清各 Provider 的许可 / 商用注意点

## 非目标（v1）

- 逆向 Suno Web 会话或嵌入非官方爬虫
- 完整 DAW / 多轨编辑 UI
- 保证实时流式生成（多数 API 是任务制，耗时秒～分钟）
- 用歌唱默认替代 TTS

## 架构

```text
用户 / LLM 意图
        │
        ▼
  music tools (xsai tool)
        │
        ▼
  music module store  ──凭证──►  music provider adapter
        │                              │
        │                              ├─ elevenlabs-music
        │                              ├─ suno（合作方，稍后）
        │                              └─ openai-compatible / local stub
        ▼
  生成任务（prompt、时长、是否纯音乐、歌词…）
        │
        ▼
  资源缓存（blob / IndexedDB / 桌面 FS）
        │
        ▼
  播放图（WebAudio）──► beat-sync ──► Live2D / VRM
        │
        └─ 相对 speech 播放队列 ducking
```

### Provider

```ts
category: 'chat' | 'embed' | 'speech' | 'transcription' | 'music'
tasks: ['text-to-music', 'music-generation']
```

适配器草图见英文文档；Web 端轮询，桌面端可后续加推送。

### LLM Tools

| Tool | 作用 |
| --- | --- |
| `music_generate` | 按 prompt 开任务 |
| `music_status` | 查任务 / 可播放资源 |
| `music_play` | 播放缓存曲（含相对语音的 duck 策略） |
| `music_stop` | 停止 |

### 分阶段

0. 调研 + 申请 Suno Partner；用 ElevenLabs Music 做一次可播放的 spike  
1. Music Provider + 播放 MVP（设置、playground、TTS ducking）  
2. 角色 tools + beat-sync 吃应用内音频  
3. 官方 Suno 适配（含 lyrics / extend / stems 等可选能力）  
4. 曲库 UI、推流友好输出、本地开源模型兜底（质量够再做）

## 风险

- Suno 时间表未知 → 尽早抽象 Provider  
- 生成延迟 → UI / 角色话术要管理预期  
- 费用与配额 → 缓存 + 时长上限  
- 许可 → 设置里明示，勿夸大 remix 权利  
- 音乐与 TTS / VAD 增益冲突  
- 法律 → 禁止 Cookie 自动化绕过 ToS  

## 建议的首个实现 PR

1. 本文档  
2. `MusicProvider` 类型 + ElevenLabs Music 客户端 stub  
3. 设置凭证 + playground 生成并播放  
4. 暂不接 LLM tools（放 Phase 2）

## 参考

- [Suno explores developer API (Music Business Worldwide)](https://www.musicbusinessworldwide.com/suno-explores-developer-api-seeking-apps-that-unlock-experiences-generative-music-makes-possible-for-the-first-time/)
- [ElevenLabs Compose Music API](https://elevenlabs.io/docs/api-reference/music/compose)
- AIRI DreamLog 0x1
- 代码锚点：`providers.ts`、`tools/`、`beat-sync.ts`、`packages/audio`
