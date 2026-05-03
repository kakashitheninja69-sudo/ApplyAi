import { Router, Request, Response } from 'express'
import Anthropic from '@anthropic-ai/sdk'

const router = Router()

// Lazy client — only created once when first request arrives
let _client: Anthropic | null = null
function getClient(): Anthropic {
  if (!_client) _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
  return _client
}

router.post('/tailor', async (req: Request, res: Response) => {
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({ error: 'AI service not configured. Add ANTHROPIC_API_KEY to your Render environment variables.' })
  }

  const { resumeData, job, mode } = req.body as {
    resumeData: any
    job:        { title: string; company: string; description: string; tags: string[] }
    mode:       'resume' | 'cover-letter' | 'both'
  }

  if (!resumeData || !job?.title || !mode) {
    return res.status(400).json({ error: 'Missing required fields.' })
  }

  try {
    const client = getClient()
    const result: { tailoredResume?: any; coverLetter?: string } = {}

    // ── Resume tailoring ────────────────────────────────────────────────────
    if (mode === 'resume' || mode === 'both') {
      const msg = await client.messages.create({
        model:      'claude-haiku-4-5-20251001',
        max_tokens: 4096,
        messages: [{
          role:    'user',
          content: `You are an expert ATS resume writer. Tailor the JSON resume below for this job.

STRICT RULES:
- ONLY modify: summary, work[].bullets[], and skills[].name
- Keep ALL other fields EXACTLY as-is (IDs, dates, companies, education, template, accentColor, typography, contact info)
- Bullets must start with strong action verbs and include quantified metrics where plausible
- Weave in job-relevant keywords naturally
- Return ONLY raw JSON — no markdown fences, no explanation, nothing else

JOB:
Title: ${job.title}
Company: ${job.company}
Tags: ${(job.tags ?? []).join(', ')}
Description: ${(job.description ?? '').slice(0, 800)}

RESUME JSON:
${JSON.stringify(resumeData)}`,
        }],
      })

      const raw   = msg.content[0].type === 'text' ? msg.content[0].text.trim() : ''
      const clean = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
      try {
        result.tailoredResume = JSON.parse(clean)
      } catch {
        const match = clean.match(/\{[\s\S]*\}/)
        if (match) result.tailoredResume = JSON.parse(match[0])
        else throw new Error('AI returned malformed JSON for resume.')
      }
    }

    // ── Cover letter ────────────────────────────────────────────────────────
    if (mode === 'cover-letter' || mode === 'both') {
      const contact = resumeData?.contact ?? {}
      const work    = (resumeData?.work    ?? []) as any[]
      const skills  = (resumeData?.skills  ?? []) as any[]

      const msg = await client.messages.create({
        model:      'claude-haiku-4-5-20251001',
        max_tokens: 800,
        messages: [{
          role:    'user',
          content: `Write a compelling, professional cover letter for the following job application. Max 320 words.

JOB:
Title: ${job.title}
Company: ${job.company}
Description: ${(job.description ?? '').slice(0, 600)}

APPLICANT:
Name: ${contact.name || 'Applicant'}
Current Title: ${contact.title || work[0]?.role || 'Professional'}
Most Recent Role: ${work[0]?.role || 'N/A'} at ${work[0]?.company || 'N/A'}
Top Skills: ${skills.slice(0, 6).map((s: any) => s.name).join(', ')}
Summary: ${(resumeData?.summary ?? '').slice(0, 300)}

Write exactly 3 paragraphs:
1. Engaging opening — specific enthusiasm for this company and role (no "I am writing to express")
2. Two concrete achievements from the resume that match the job requirements
3. Confident close with a call to action

Style: direct, professional, zero clichés.`,
        }],
      })

      result.coverLetter = msg.content[0].type === 'text' ? msg.content[0].text.trim() : ''
    }

    res.json(result)
  } catch (err: any) {
    console.error('[AI] tailor error:', err?.message ?? err)
    res.status(500).json({ error: err?.message ?? 'AI generation failed. Please try again.' })
  }
})

export { router as aiRouter }
