import OpenAI from 'openai'
import { getVoicePrompt } from './voiceProfiles.js'

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function generateAllOutputs(extractedContent, voiceProfile, customVoicePrompt) {
  const voicePrompt = getVoicePrompt(voiceProfile, customVoicePrompt)

  const contentStr = [
    `Title: ${extractedContent.title}`,
    `Content: ${extractedContent.content}`,
    extractedContent.codeBlocks.length > 0
      ? `Code snippets:\n${extractedContent.codeBlocks.join('\n---\n')}`
      : ''
  ]
    .filter(Boolean)
    .join('\n\n')

  const [twitterThread, linkedinPost, newsletter, shortHook] = await Promise.all([
    generateTwitterThread(contentStr, voicePrompt),
    generateLinkedIn(contentStr, voicePrompt),
    generateNewsletter(contentStr, voicePrompt),
    generateShortHook(contentStr, voicePrompt)
  ])

  return { twitterThread, linkedinPost, newsletter, shortHook }
}

async function generateTwitterThread(content, voicePrompt) {
  const res = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content:
          voicePrompt +
          `\n\nFormat rules for Twitter thread:
- Number tweets as 1/, 2/, 3/ etc
- Max 280 characters per tweet
- 8-12 tweets total
- First tweet is the hook — make it scroll-stopping
- Last tweet is the key takeaway or CTA
- Each tweet stands alone if retweeted
- Separate tweets with a blank line`
      },
      {
        role: 'user',
        content: `Create a Twitter thread from this content:\n${content}`
      }
    ],
    max_tokens: 1200,
    temperature: 0.7
  })
  return res.choices[0].message.content.trim()
}

async function generateLinkedIn(content, voicePrompt) {
  const res = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content:
          voicePrompt +
          `\n\nFormat rules for LinkedIn post:
- 150-250 words
- No headers or bullet points
- Short paragraphs (2-3 lines max)
- End with one question or CTA
- Conversational but professional`
      },
      {
        role: 'user',
        content: `Create a LinkedIn post from this content:\n${content}`
      }
    ],
    max_tokens: 500,
    temperature: 0.7
  })
  return res.choices[0].message.content.trim()
}

async function generateNewsletter(content, voicePrompt) {
  const res = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content:
          voicePrompt +
          `\n\nFormat rules for newsletter snippet:
- 80-120 words
- One paragraph
- Plain language
- Cover: what it is + why it matters
- Written for someone scanning their inbox`
      },
      {
        role: 'user',
        content: `Create a newsletter snippet from this content:\n${content}`
      }
    ],
    max_tokens: 250,
    temperature: 0.7
  })
  return res.choices[0].message.content.trim()
}

async function generateShortHook(content, voicePrompt) {
  const res = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content:
          voicePrompt +
          `\n\nFormat rules for short hook:
- Single sentence, max 140 characters
- Must stop someone mid-scroll
- No hashtags
- No emojis unless the voice profile naturally uses them
- Output only the sentence — nothing else`
      },
      {
        role: 'user',
        content: `Create one punchy hook sentence from this content:\n${content}`
      }
    ],
    max_tokens: 80,
    temperature: 0.8
  })
  return res.choices[0].message.content.trim()
}
