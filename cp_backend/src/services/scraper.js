import axios from 'axios'
import * as cheerio from 'cheerio'

export async function extractContent(inputType, input) {
  switch (inputType) {
    case 'url':
      return await scrapeUrl(input)
    case 'readme':
      return await fetchGithubReadme(input)
    case 'youtube':
      return await fetchYoutubeTranscript(input)
    case 'text':
      return { title: 'Custom Content', content: input, codeBlocks: [] }
    default:
      throw new Error('Invalid input type')
  }
}

async function scrapeUrl(url) {
  const { data } = await axios.get(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ContentPilot/1.0)' },
    timeout: 10000
  })
  const $ = cheerio.load(data)

  $('nav, footer, header, script, style, .sidebar, .ads, [class*="ad-"], [id*="sidebar"]').remove()

  const codeBlocks = []
  $('pre code').each((_, el) => {
    codeBlocks.push($(el).text().trim())
  })

  const title =
    $('h1').first().text().trim() ||
    $('title').text().trim() ||
    'Untitled'

  const content =
    $('article').text() ||
    $('main').text() ||
    $('[class*="post-content"]').text() ||
    $('[class*="article-body"]').text() ||
    $('body').text()

  return {
    title: title.slice(0, 200),
    content: content.replace(/\s+/g, ' ').trim().slice(0, 8000),
    codeBlocks: codeBlocks.slice(0, 5)
  }
}

async function fetchGithubReadme(url) {
  let rawUrl = url

  if (url.includes('github.com') && !url.includes('raw.githubusercontent.com')) {
    rawUrl = url
      .replace('github.com', 'raw.githubusercontent.com')
      .replace('/blob/', '/')

    // Handle repo root URLs (no /blob/ path) — fetch default README
    if (!rawUrl.includes('raw.githubusercontent.com/')) {
      const match = url.match(/github\.com\/([^/]+\/[^/]+)\/?$/)
      if (match) {
        rawUrl = `https://raw.githubusercontent.com/${match[1]}/HEAD/README.md`
      }
    }
  }

  const { data } = await axios.get(rawUrl, { timeout: 10000 })
  return {
    title: 'README',
    content: data.slice(0, 8000),
    codeBlocks: []
  }
}

async function fetchYoutubeTranscript(url) {
  const videoId = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
  )?.[1]

  if (!videoId) throw new Error('Invalid YouTube URL — could not extract video ID')

  const { YoutubeTranscript } = await import('youtube-transcript')
  const transcript = await YoutubeTranscript.fetchTranscript(videoId)

  const text = transcript
    .map((t) => t.text)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 8000)

  return { title: 'YouTube Video', content: text, codeBlocks: [] }
}
