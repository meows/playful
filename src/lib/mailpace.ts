/* -----------------------------------------------------------------------------
 * Bad abstraction over the MailPace API.
 * -------------------------------------------------------------------------- */

type Mail = {
  from:     string
  to:       string
  subject:  string
  htmlbody: string
}

const MAILPACE_API_URL = "https://app.mailpace.com/api/v1/send"

// —————————————————————————————————————————————————————————————————————————————
// Mailpace API

/**
 * Send email using Mailpace API via fetch (compatible with Cloudflare Workers).
 */
export async function sendEmail(token:string, mail:Mail) {
  const response = await fetch(MAILPACE_API_URL, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "MailPace-Server-Token": token,
    },
    body: JSON.stringify(mail),
  })

  if (!response.ok) {
    const error = await response.text()
    throw Error(`Mailpace API error: ${response.status} - ${error}`)
  }

  return response.json()
}

export default sendEmail
