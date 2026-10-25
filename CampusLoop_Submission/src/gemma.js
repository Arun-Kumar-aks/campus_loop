import { GoogleGenAI } from '@google/genai'

/**
 * Knowledge base and smart responses for offline / demo mode
 * when an API key is not configured or network is unavailable.
 */
function getOfflineResponse(prompt) {
  const p = prompt.toLowerCase()

  if (p.includes('book') || p.includes('textbook') || p.includes('semester') || p.includes('syllabus') || p.includes('donate') || p.includes('exchange')) {
    return `📚 **Gemma's Guide to Saving on Textbooks with BookLoop:**

1. **Verify the Edition First:** Check with your professor or course syllabus whether the previous edition works. In subjects like Mathematics and Engineering, 80-90% of core concepts remain identical across consecutive editions.
2. **Utilize BookLoop Exchanges:** Check our **BookLoop** catalog to swap last semester's books with peers. You can filter by subject (Computer Science, Electronics, Math, etc.) and choose between free donations or direct exchanges.
3. **Inspect Book Condition:** Always check notes on annotations and binding condition before meeting up on campus.
4. **Safe Handoff:** Meet in high-traffic campus zones like the library entrance or campus cafeteria to exchange books safely.`
  }

  if (p.includes('roommate') || p.includes('flatmate') || p.includes('lifestyle') || p.includes('chores') || p.includes('conflict') || p.includes('habit')) {
    return `👥 **Gemma's Tips for Choosing & Living with Great Flatmates:**

1. **Ask Key Routine Questions Early:**
   - Sleep schedules (early bird vs. night owl)
   - Study environment needs (quiet vs. ambient music)
   - Guest & party policies on weekdays vs. weekends
   - Cleaning standards and chore rotation frequency
2. **Review Compatibility Scores:** In the **FlatMate** section, review profiles that share your dietary preferences, hygiene habits, and schedule compatibility.
3. **Establish a Clear Chore Split:** Agree on a simple rotation chart for kitchen cleaning, trash disposal, and bathroom maintenance within the first week.
4. **Communication First:** Address small friction points (like dishes left overnight) promptly and gently before they turn into major house tension.`
  }

  if (p.includes('rent') || p.includes('deposit') || p.includes('scam') || p.includes('broker') || p.includes('agreement') || p.includes('lease') || p.includes('owner') || p.includes('room')) {
    return `🏠 **Gemma's Essential Student Renting & Safety Checklist:**

1. **Never Send Advance Deposits Before Physical Inspection:** A legitimate owner or student will never demand a deposit before you or a trusted friend physically inspect the room.
2. **Know Standard Market Deposits:** For shared student accommodation, security deposits typically range from 1 to 2 months' rent. Be wary of listings demanding excessive upfront payments.
3. **Inspect the Space in Person:** Check water pressure, mobile network strength inside the room, Wi-Fi connectivity, electrical points near your study desk, and ventilation.
4. **Get Everything in Writing:** Ensure maintenance charges, electricity bills (metered vs. flat), and deposit refund terms are clearly documented in the rental agreement.`
  }

  return `✨ **Gemma Student Assistant:**

I'm here to help you navigate campus life, housing, and coursework materials! Here are areas I can assist you with:

- 🏠 **Renting & Housing:** Budgeting rent, lease terms, avoiding deposit traps, and finding safe student flats.
- 👥 **Roommates & Flatmates:** Assessing lifestyle compatibility, chore agreements, and communication tips.
- 📚 **Textbooks & BookLoop:** Finding affordable course books, syllabus edition checks, and exchanging books with peers.

Try asking:
- *"What should I check before paying a rental deposit?"*
- *"How can I ask my roommate to keep noise down during exam week?"*
- *"Are older edition textbooks usually okay for engineering courses?"*`
}

/**
 * Asks Gemma a question.
 * Uses @google/genai if an API key is available,
 * or gracefully provides smart campus-focused advice offline.
 *
 * @param {string} prompt - The student's question
 * @returns {Promise<string>} - Gemma's response
 */
export async function askGemma(prompt) {
  if (!prompt || !prompt.trim()) {
    throw new Error('Please enter a question for Gemma.')
  }

  const apiKey =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) ||
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GOOGLE_API_KEY) ||
    (typeof window !== 'undefined' && window.localStorage?.getItem('gemini_api_key')) ||
    ''

  if (!apiKey) {
    // Return structured offline campus assistant response
    // Add artificial realistic typing delay for smooth UX
    await new Promise((resolve) => setTimeout(resolve, 600))
    return getOfflineResponse(prompt)
  }

  try {
    const ai = new GoogleGenAI({ apiKey })

    // Gemma 4 requirement for hackathon
    const systemInstruction =
      'You are Gemma, an empathetic, practical AI student assistant for the CampusLoop platform. ' +
      'CampusLoop helps university students find affordable shared housing, match with compatible flatmates, ' +
      'and share or exchange academic textbooks (BookLoop). ' +
      'Provide concise, actionable, friendly, and structured advice for students. ' +
      'Focus on safety, student budget constraints, and positive peer living.'

    const response = await ai.models.generateContent({
      model: 'gemma-4-26b-a4b-it',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    })

    if (response && response.text) {
      return response.text
    }

    return getOfflineResponse(prompt)
  } catch (error) {
    console.warn('Live Gemma API request encountered an error, using fallback response:', error)
    return getOfflineResponse(prompt)
  }
}
