export const users = [
  {
    id: 1,
    firstName: 'Zack',
    lastName: 'Morris',
    nameDisplay: 'Zack Morris',
    email: 'zack@gmail.com',
    role: 'Sales Rep',
    created_at: '2018-04-24T03:01:44.687Z'
  },
  {
    id: 2,
    firstName: 'Jerry',
    lastName: 'Smith',
    nameDisplay: 'Jerry Smith',
    email: 'jerry@nakedapps.com',
    role: 'Admin',
    created_at: '2018-04-21T03:01:44.687Z'
  },
  {
    id: 3,
    firstName: 'Myra',
    lastName: 'Ford',
    nameDisplay: 'Myra Ford',
    email: 'myra@nakeddev.com',
    role: 'Admin',
    created_at: '2018-04-30T03:01:44.687Z'
  },
]

export const user = users[0]

export const addresses = [
  {
    id: 1,
    line1: '451 Wilshire Blvd',
    line2: 'Santa Monica, CA 90025',
  },
  {
    id: 2,
    line1: '123 Main Street',
    line2: 'Los Angeles, CA 90042',
  },
  {
    id: 3,
    line1: '842 Rose Ave',
    line2: 'Venice, CA 90066',
  },
]

export const physicians = [
  {
    id: 1,
    nameDisplay: 'Dr. Ina Lyons',
    specialty: 'Internal Medicine',
    group: 'Dorothyview',
    address: addresses[0],
  },
  {
    id: 2,
    nameDisplay: 'Caroline Adkins',
    specialty: 'General Surgery',
    group: 'Russelland',
    address: addresses[1],
  },
  {
    id: 3,
    nameDisplay: 'Brandon Watkins',
    specialty: 'Emergency Medicine',
    group: 'New Urban',
    address: addresses[2],
  },
]

export const reps = [
  {
    id: 1,
    nameDisplay: 'Bruce Wayne',
  },
  {
    id: 2,
    nameDisplay: 'Jon Snow',
  },
  {
    id: 3,
    nameDisplay: 'Tracy Jordan',
  },
  {
    id: 4,
    nameDisplay: 'Arya Stark',
  },
  {
    id: 5,
    nameDisplay: 'Matt Murdock',
  },
  {
    id: 6,
    nameDisplay: 'Clark Kent',
  },
]

export const notes = [
  {
    id: 1,
    text: 'Here is an example of text',
    created_at: "2018-04-18T05:55:36.141Z",
    author: reps[1],
  },
  {
    id: 2,
    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    created_at: "2018-04-18T05:55:36.141Z",
    author: reps[0],
  },
  {
    id: 3,
    text: 'No street parking on thursdays',
    created_at: "2018-04-18T05:55:36.141Z",
    author: reps[0],
  },
]

export const visits = [
  {
    id: 1,
    time: "2018-04-18T05:55:36.141Z",
    rep: reps[0],
    physician: physicians[0],
    address: physicians[0].address,
    notes: [],
  },
  {
    id: 2,
    time: "2018-04-19T05:55:36.141Z",
    rep: reps[2],
    physician: physicians[1],
    address: physicians[1].address,
    notes: [
      notes[0],
    ],
  },
  {
    id: 3,
    time: "2018-04-19T04:55:36.141Z",
    rep: reps[2],
    physician: physicians[2],
    address: physicians[2].address,
    notes: [
      notes[0],
    ],
  },
  {
    id: 4,
    time: "2018-04-20T05:55:36.141Z",
    rep: reps[2],
    physician: physicians[2],
    address: physicians[2].address,
    notes: [
      notes[0],
      notes[1],
    ],
  },
  {
    id: 5,
    time: "2018-04-20T05:55:36.141Z",
    rep: reps[1],
    physician: physicians[1],
    address: physicians[1].address,
    notes: [
      notes[0],
      notes[1],
    ],
  },
  {
    id: 6,
    time: "2018-03-10T05:55:36.141Z",
    rep: reps[0],
    physician: physicians[0],
    address: physicians[0].address,
    notes: [
      notes[0],
      notes[1],
    ],
  },
  {
    id: 7,
    time: "2018-05-28T05:55:36.141Z",
    rep: reps[1],
    physician: physicians[1],
    address: physicians[1].address,
    notes: [
      notes[0],
      notes[1],
    ],
  },
  {
    id: 8,
    time: "2018-05-02T05:55:36.141Z",
    rep: reps[3],
    physician: physicians[2],
    address: physicians[2].address,
    notes: [
      notes[0],
      notes[1],
    ],
  },
]
