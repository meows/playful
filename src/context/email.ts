import MailPace from "@mailpace/mailpace.js"
import env from "~/env/internal"

/**
 * MailPace email client
 */
const client = new MailPace.DomainClient(env.MAILPACE_KEY)
export default client