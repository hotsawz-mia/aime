import React from 'react'
import { render, screen, within } from '@testing-library/react'
import Plan from '../../../pages/plan/[planid].jsx'

// Mock router param
jest.mock('next/router', () => ({
  useRouter: () => ({ query: { planid: '68b70ebbd98beae24581014c' } }),
}))

// -------- Helper: strict text match ignoring extra whitespace ----------
const byNormalizedText = (text) => (_, node) =>
  node?.textContent?.replace(/\s+/g, ' ').trim() === text
// ----------------------------------------------------------------------


// example db entry taken directly from successful form submit to db
// Update the WEEKS array to use the new activity structure
const WEEKS = [
  {
    objectives: ['Learn basic Spanish greetings', 'Learn basic vocabulary words'],
    activities: [
      {
        activity: 'Practice greetings with flashcards for 10 minutes daily',
        completed: false
      },
      {
        activity: 'Learn 5 new vocabulary words daily',
        completed: false
      }
    ],
    tips: [
      'Use language learning apps like Duolingo or Babbel',
      'Listen to Spanish music or podcasts to immerse yourself in the language',
    ],
    weekNumber: 1,
  },
  {
    objectives: ['Practice forming simple sentences', 'Learn common phrases for everyday conversations'],
    activities: [
      {
        activity: 'Practice sentence structure with basic exercises',
        completed: false
      },
      {
        activity: 'Role-play common daily scenarios in Spanish',
        completed: false
      }
    ],
    tips: [
      'Practice speaking out loud to improve pronunciation',
      'Find a language exchange partner to practice conversational Spanish',
    ],
    weekNumber: 2,
  },
  {
    objectives: ['Expand vocabulary related to daily activities', 'Understand basic verb conjugation'],
    activities: [
      {
        activity: 'Learn action verbs and their conjugations',
        completed: false
      },
      {
        activity: 'Practice describing your daily routine in Spanish',
        completed: false
      }
    ],
    tips: [
      'Create flashcards to memorize verb conjugations',
      'Watch Spanish movies with subtitles to improve listening skills',
    ],
    weekNumber: 3,
  },
  {
    activities: [
      {
        activity: 'Role-play asking and answering common questions',
        completed: false
      },
      {
        activity: 'Practice short dialogues with a language partner',
        completed: false
      }
    ],
    tips: [
      'Focus on improving fluency by speaking spontaneously',
      'Record yourself speaking and listen for areas of improvement',
    ],
    weekNumber: 4,
    objectives: ['Learn to ask questions and hold simple conversations', 'Practice speaking in complete sentences'],
  },
  {
    activities: [
      {
        activity: 'Listen to Spanish podcasts or news programs daily',
        completed: false
      },
      {
        activity: 'Practice giving and following directions in Spanish',
        completed: false
      }
    ],
    tips: [
      'Repeat listening exercises to improve comprehension',
      'Use language learning apps with listening exercises',
    ],
    weekNumber: 5,
    objectives: ['Focus on improving listening comprehension', 'Learn to give and follow directions in Spanish'],
  },
  {
    activities: [
      {
        activity: 'Memorize food-related vocabulary',
        completed: false
      },
      {
        activity: 'Practice ordering food in Spanish at a local restaurant',
        completed: false
      }
    ],
    tips: [
      'Practice role-playing restaurant scenarios',
      'Watch cooking videos in Spanish to learn food-related vocabulary',
    ],
    weekNumber: 6,
    objectives: [
      'Expand vocabulary related to food and ordering in restaurants',
      'Learn to express preferences and make requests',
    ],
  },
  {
    activities: [
      {
        activity: 'Create sentences discussing hobbies and interests',
        completed: false
      },
      {
        activity: 'Practice narrating past events in Spanish',
        completed: false
      }
    ],
    tips: [
      'Join Spanish language workshops or clubs to discuss hobbies',
      'Read short stories in Spanish to practice past tense',
    ],
    weekNumber: 7,
    objectives: ['Focus on discussing hobbies and interests', 'Learn to talk about past experiences in Spanish'],
  },
  {
    activities: [
      {
        activity: 'Discuss future plans with a language partner',
        completed: false
      },
      {
        activity: 'Practice expressing opinions on various topics',
        completed: false
      }
    ],
    tips: [
      'Debate current events or topics with a language partner',
      'Use language exchange apps to practice expressing emotions',
    ],
    weekNumber: 8,
    objectives: ['Practice talking about future plans and aspirations', 'Learn to express opinions and feelings in Spanish'],
  },
  {
    activities: [
      {
        activity: 'Read short articles or stories in Spanish',
        completed: false
      },
      {
        activity: 'Write about your daily experiences in Spanish',
        completed: false
      }
    ],
    tips: [
      "Summarize what you've read in Spanish to check comprehension",
      'Join online writing communities to get feedback on your writing',
    ],
    weekNumber: 9,
    objectives: ['Focus on improving reading comprehension', 'Learn to write short paragraphs in Spanish'],
  },
  {
    activities: [
      {
        activity: 'Engage in longer conversations with native Spanish speakers',
        completed: false
      },
      {
        activity: 'Practice speaking on various topics for extended periods',
        completed: false
      }
    ],
    tips: [
      'Attend language exchange events or conversation meetups',
      'Challenge yourself to speak only in Spanish for an entire day',
    ],
    weekNumber: 10,
    objectives: ['Practice having longer conversations in Spanish', 'Improve overall language fluency'],
  },
  {
    activities: [
      {
        activity: 'Review vocabulary, grammar rules, and common phrases',
        completed: false
      },
      {
        activity: 'Work on areas where you feel less confident',
        completed: false
      }
    ],
    tips: ['Take practice quizzes to assess your progress', 'Seek feedback from a language tutor or teacher'],
    weekNumber: 11,
    objectives: ['Review and consolidate previous learning', 'Focus on areas needing improvement'],
  },
  {
    activities: [
      {
        activity: 'Practice role-playing conversations with a focus on common scenarios',
        completed: false
      },
      {
        activity: 'Engage in language exchange sessions with native speakers',
        completed: false
      }
    ],
    tips: [
      'Set specific conversation goals for each practice session',
      'Reflect on your progress and celebrate achievements',
    ],
    weekNumber: 12,
    objectives: ['Prepare for conversational practice with locals', 'Build confidence in speaking Spanish'],
  },
]

const mockResponse = {
  plan: {
    learning_plan: {
      targetDate: '2025-11-19',
      timePerDay: '40',
      startingLevel: 'I speak no Spanish.',
      aim: 'Learn Spanish',
      success: 'To be able to speak Spanish with locals conversationally.',
      weeks: WEEKS,
    },
  },
}

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => mockResponse,
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

const openWeek = async (weekNumber) => {
  // Click the <summary> whose normalized text is `Week X`
  const summary = await screen.findByText(byNormalizedText(`Week ${weekNumber}`))
  // If it’s not already open, click to open
  const details = summary.closest('details')
  if (!details.open) summary.click()
  return details
}

test('renders top-level key/value fields from learning_plan', async () => {
  render(<Plan />)

  // Aim heading
  const aim = await screen.findByRole('heading', { level: 1 })
  expect(aim).toHaveTextContent('Learn Spanish')

  // Label/value paragraphs
  const successLabel = screen.getByText('Success Looks Like:', { selector: 'strong' })
  expect(successLabel.closest('p')).toHaveTextContent(
    'To be able to speak Spanish with locals conversationally.'
  )

  const startingLabel = screen.getByText('Starting Level:', { selector: 'strong' })
  expect(startingLabel.closest('p')).toHaveTextContent('I speak no Spanish.')

  const targetLabel = screen.getByText('Target Date:', { selector: 'strong' })
  expect(targetLabel.closest('p')).toHaveTextContent('2025-11-19')

  const timeLabel = screen.getByText('Time / Day:', { selector: 'strong' })
  expect(timeLabel.closest('p')).toHaveTextContent('40 mins')

  // fetch called with router param
  expect(global.fetch).toHaveBeenCalledWith('/api/getresult?id=68b70ebbd98beae24581014c')
})

test('renders an accordion for every week in the DB', async () => {
  const { container } = render(<Plan />)

  // Wait for Week 1
  await screen.findByText(byNormalizedText('Week 1'))

  // Count details.collapse blocks
  const accordions = container.querySelectorAll('details.collapse')
  expect(accordions.length).toBe(WEEKS.length)

  // Spot check Week 1 and last week titles exist
  expect(screen.getByText(byNormalizedText('Week 1'))).toBeInTheDocument()
  expect(screen.getByText(byNormalizedText(`Week ${WEEKS[WEEKS.length - 1].weekNumber}`))).toBeInTheDocument()
})

test('for every week: renders Objectives, Activities (as checkboxes), and Tips with correct counts', async () => {
  render(<Plan />)

  // Loop every week
  for (const week of WEEKS) {
    const details = await openWeek(week.weekNumber)
    expect(details).toBeTruthy()

    // Objectives (if any)
    if (Array.isArray(week.objectives) && week.objectives.length > 0) {
      const heading = within(details).getByText('Objectives')
      const list = heading.parentElement.querySelector('ul')
      const items = within(list).getAllByRole('listitem')
      expect(items).toHaveLength(week.objectives.length)
      // Check each item text exists
      week.objectives.forEach((text) => {
        expect(within(list).getByText(text)).toBeInTheDocument()
      })
    } else {
      // If no objectives, the heading should not be present
      expect(within(details).queryByText('Objectives')).toBeNull()
    }

    // Activities (checkbox list) - UPDATED for new structure
    if (Array.isArray(week.activities) && week.activities.length > 0) {
      const heading = within(details).getByText('Activities')
      // All checkboxes under this section
      const section = heading.parentElement
      const checkboxes = within(section).getAllByRole('checkbox')
      expect(checkboxes).toHaveLength(week.activities.length)
      // Each activity label text appears - CHECK THE .activity PROPERTY
      week.activities.forEach((activityObj) => {
        expect(within(section).getByText(activityObj.activity)).toBeInTheDocument()
      })
    } else {
      expect(within(details).queryByText('Activities')).toBeNull()
    }

    // Tips
    if (Array.isArray(week.tips) && week.tips.length > 0) {
      const heading = within(details).getByText('Tips')
      const list = heading.parentElement.querySelector('ul')
      const items = within(list).getAllByRole('listitem')
      expect(items).toHaveLength(week.tips.length)
      week.tips.forEach((text) => {
      expect(within(list).getByText(text)).toBeInTheDocument()
      })
    } else {
      expect(within(details).queryByText('Tips')).toBeNull()
    }
  }
})