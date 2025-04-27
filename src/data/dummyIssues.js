// src/data/dummyIssues.js

export const dummyIssues = [
    {
      id: -1,
      number: 101,
      title: 'Fix merge conflict notification bug',
      body: `When two branches conflict, the UI sometimes fails to show the “Resolve conflicts” banner.
  Steps to reproduce:
  1. Create branches feature/A and feature/B off main  
  2. Modify the same file in both, push A, then B  
  3. Go to Pull Requests → feature/B  
  Expected: “Resolve conflicts” banner appears;  
  Actual: no banner displayed.`,
      created_at: '2025-03-30T09:24:00Z',
      user: {
        login: 'charlie',
        avatar_url: 'https://i.pravatar.cc/40?img=5'
      },
      html_url: 'https://github.com/gbabaisaac/MergeFund/issues/101',
      claimers: 4,
      pendingCommits: 3,
      bounty: '250 DEV'
    },
    {
      id: -2,
      number: 102,
      title: 'Optimize repository search performance',
      body: `Currently, searching across large repos can take 5–10s.
  To improve responsiveness we should:
  • Cache indexed filenames  
  • Debounce input by 300ms  
  • Offload search to a Web Worker`,
      created_at: '2025-04-02T14:47:00Z',
      user: {
        login: 'dana',
        avatar_url: 'https://i.pravatar.cc/40?img=12'
      },
      html_url: 'https://github.com/gbabaisaac/MergeFund/issues/102',
      claimers: 2,
      pendingCommits: 1,
      bounty: '150 DEV'
    }
  ]
  