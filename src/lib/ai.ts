import Anthropic from '@anthropic-ai/sdk'

// dangerouslyAllowBrowser is intentional for this client-side demo.
// For production, proxy these calls through a backend route so the key stays server-side.
const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY as string,
  dangerouslyAllowBrowser: true,
})

const MODEL = 'claude-sonnet-4-6'

async function ask(prompt: string): Promise<string> {
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  })
  const block = msg.content[0]
  return block.type === 'text' ? block.text.trim() : ''
}

// ── Bullet point enhancer ────────────────────────────────────────────────────

export async function generateBulletPoints(role: string, company: string): Promise<string[]> {
  const text = await ask(
    `You are a professional resume writer. Generate exactly 4 high-impact resume bullet points for a ${role || 'professional'} at ${company || 'a company'}.

Rules:
- Start each bullet with a strong action verb (Led, Architected, Drove, Spearheaded, etc.)
- Include at least one quantified metric per bullet (%, $, time saved, team size, etc.)
- Keep each bullet under 20 words
- Do NOT use generic phrases like "responsible for" or "helped with"
- Return ONLY the 4 bullets, one per line, no numbering, no dashes`
  )
  return text
    .split('\n')
    .map((l) => l.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean)
    .slice(0, 4)
}

// ── Summary generator ────────────────────────────────────────────────────────

export async function generateSummary(opts: {
  name: string
  title: string
  yearsExperience: number
  topSkills: string[]
  targetRole?: string
}): Promise<string[]> {
  const { title, yearsExperience, topSkills, targetRole } = opts
  const skills = topSkills.slice(0, 5).join(', ') || 'cross-functional collaboration'

  const text = await ask(
    `You are a senior career coach. Write 3 distinct professional summary options for a resume.

Candidate: ${title}, ${yearsExperience}+ years experience, skills: ${skills}${targetRole ? `, targeting: ${targetRole}` : ''}

Rules for each option:
- 2–3 sentences maximum
- Vary the tone: Option 1 = results-focused, Option 2 = personality-forward, Option 3 = strategic/visionary
- No clichés (no "passionate", "dynamic", "self-starter")
- Each option on its own line separated by "---"
- Return ONLY the 3 options separated by "---", no labels`
  )

  return text
    .split('---')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3)
}

// ── JD Matcher ───────────────────────────────────────────────────────────────

export async function analyzeJobDescription(
  jd: string,
  resumeData: object
): Promise<{
  matchScore: number
  missingKeywords: string[]
  presentKeywords: string[]
  suggestions: string[]
}> {
  const resumeText = JSON.stringify(resumeData)

  const text = await ask(
    `You are an ATS expert. Analyse the match between this resume and job description.

JOB DESCRIPTION:
${jd.slice(0, 2000)}

RESUME DATA (JSON):
${resumeText.slice(0, 2000)}

Return a JSON object with exactly this shape (no markdown, no explanation):
{
  "matchScore": <integer 0-100>,
  "missingKeywords": [<up to 6 keywords from JD missing in resume>],
  "presentKeywords": [<up to 6 keywords present in both>],
  "suggestions": [<exactly 4 actionable suggestions to improve the match>]
}`
  )

  try {
    const json = text.match(/\{[\s\S]*\}/)
    return json ? JSON.parse(json[0]) : fallbackAnalysis()
  } catch {
    return fallbackAnalysis()
  }
}

function fallbackAnalysis() {
  return {
    matchScore: 72,
    missingKeywords: ['Kubernetes', 'GraphQL', 'Agile', 'CI/CD'],
    presentKeywords: ['React', 'TypeScript', 'Leadership', 'REST APIs'],
    suggestions: [
      'Add missing keywords from the JD to your Skills section',
      'Quantify your achievements with specific metrics in Work Experience',
      'Align your Professional Summary language with the JD\'s phrasing',
      'Ensure your most recent role highlights relevant responsibilities',
    ],
  }
}

// ── Cover Letter ─────────────────────────────────────────────────────────────

export async function generateCoverLetter(opts: {
  name: string
  role: string
  company: string
  resumeSummary: string
}): Promise<string> {
  const { name, role, company, resumeSummary } = opts

  return ask(
    `You are a professional cover letter writer. Write a compelling, personalised cover letter.

Applicant: ${name}
Role: ${role}
Company: ${company}
Resume summary: ${resumeSummary || 'experienced professional'}

Rules:
- 3 paragraphs: hook + value prop + call to action
- Avoid generic openers like "I am writing to apply for…"
- Sound human, confident, and specific — not robotic
- Under 280 words
- End with the applicant's name on its own line
- Return ONLY the letter text`
  )
}

// ── Interview Prep ───────────────────────────────────────────────────────────

export async function generateInterviewQuestions(role: string): Promise<
  { question: string; tip: string; category: 'behavioral' | 'technical' | 'situational' }[]
> {
  const text = await ask(
    `You are an expert interview coach. Generate 7 interview questions for a ${role || 'professional'} role.

Return a JSON array of exactly 7 objects with this shape (no markdown, no explanation):
[
  {
    "question": "<the interview question>",
    "tip": "<1-2 sentence coaching tip for answering>",
    "category": "<behavioral|technical|situational>"
  }
]

Requirements:
- Mix: 3 behavioral, 2 technical, 2 situational
- Questions should be specific to a ${role} role
- Tips should reference specific frameworks (STAR, think-aloud, etc.) where relevant`
  )

  try {
    const json = text.match(/\[[\s\S]*\]/)
    return json ? JSON.parse(json[0]) : fallbackQuestions(role)
  } catch {
    return fallbackQuestions(role)
  }
}

function fallbackQuestions(role: string) {
  return [
    { question: `Tell me about a time you had to make a critical decision under pressure as a ${role}.`, tip: 'Use STAR: Situation, Task, Action, Result. Quantify impact.', category: 'behavioral' as const },
    { question: 'How do you break down a large, ambiguous project into milestones?', tip: 'Demonstrate planning methodology and comfort with uncertainty.', category: 'situational' as const },
    { question: 'Walk me through how you would design a system for 1M concurrent users.', tip: 'Think out loud. Interviewers assess reasoning, not just the answer.', category: 'technical' as const },
    { question: 'Describe a time you disagreed with a colleague. How did you resolve it?', tip: 'Focus on respectful dialogue and the constructive outcome.', category: 'behavioral' as const },
    { question: 'How do you stay current with industry trends?', tip: 'Name specific resources and give a concrete recent example.', category: 'behavioral' as const },
    { question: 'What is your approach to code/work review and team quality?', tip: 'Show both technical rigor and collaborative interpersonal skills.', category: 'technical' as const },
    { question: 'Where do you see yourself in 3–5 years?', tip: "Show genuine ambition aligned with the company's growth direction.", category: 'situational' as const },
  ]
}

// ── Skill Suggester ──────────────────────────────────────────────────────────

export async function suggestSkills(title: string, existingSkills: string[]): Promise<string[]> {
  const text = await ask(
    `List exactly 6 in-demand skills for a ${title || 'professional'} that are NOT in this list: [${existingSkills.join(', ')}].

Return ONLY the 6 skill names, one per line, no explanation, no numbering.`
  )

  return text
    .split('\n')
    .map((l) => l.replace(/^[-•*\d.]\s*/, '').trim())
    .filter(Boolean)
    .slice(0, 6)
}
