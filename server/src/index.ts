import 'dotenv/config'
import express    from 'express'
import cors       from 'cors'
import rateLimit  from 'express-rate-limit'
import { router as jobsRouter } from './routes/jobs'
import { cacheStats }           from './cache/jobCache'

const app  = express()
const PORT = parseInt(process.env.PORT ?? '3001', 10)

// ── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
  origin:  process.env.CORS_ORIGIN ?? '*',
  methods: ['GET'],
}))

app.use(express.json())

// ── Global rate limiter: 100 req / 15 min / IP ───────────────────────────────
app.use(rateLimit({
  windowMs:       15 * 60 * 1000,
  max:            100,
  standardHeaders: true,
  legacyHeaders:  false,
  message:        { error: 'Too many requests — slow down.' },
}))

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/jobs', jobsRouter)

app.get('/health', (_req, res) => {
  res.json({
    status:    'ok',
    timestamp: new Date().toISOString(),
    cache:     cacheStats(),
  })
})

app.use((_req, res) => res.status(404).json({ error: 'Not found' }))

// ── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
  ┌─────────────────────────────────────────┐
  │   ApplyAI Job API  •  port ${PORT}          │
  │                                         │
  │   GET /jobs?q=engineer&location=Canada  │
  │   GET /jobs/health                      │
  │   GET /health                           │
  └─────────────────────────────────────────┘
  Sources: Remotive (on) │ Adzuna (${process.env.ADZUNA_APP_ID ? '✓' : '✗ no key'}) │ JSearch (${process.env.JSEARCH_API_KEY ? '✓' : '✗ no key'})
  `)
})
