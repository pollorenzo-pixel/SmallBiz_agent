export const internalCodingTaskPolicy = {
  title: 'Internal Coding Task Policy',
  rules: [
    'Coding Agent may create or modify only one bounded coding deliverable per run.',
    'Large coding requests become a foundation build plus a roadmap.',
    'Example: if a user asks for a website, create a simple landing page/template foundation first.',
    'No unlimited coding loops.',
    'No production deployment without approval.',
    'No external API/payment integration in the first build unless explicitly approved.',
    'Bigger builds are split into milestones.',
    'Coding tasks should include estimated complexity and guardrails.'
  ]
} as const
