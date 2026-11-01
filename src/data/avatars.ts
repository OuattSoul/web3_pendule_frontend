// Geometric masks drawn on a 48x48 grid, loosely inspired by West African carved masks.
export interface AvatarDef {
  face: string;
  eyes: string;
  mark: string;
  color: string;
}

export const AVATARS: AvatarDef[] = [
  { face: 'M24 3 41 14 37 39 24 46 11 39 7 14Z', eyes: 'M13 21h8l-2 4h-5ZM35 21h-8l2 4h5Z', mark: 'M24 7v11M21 30h6l-3 7Z', color: '#19D8FF' },
  { face: 'M24 2 38 9 42 26 32 45H16L6 26 10 9Z', eyes: 'M12 22 21 20 20 25 13 26ZM36 22 27 20 28 25 35 26Z', mark: 'M16 11 24 15 32 11M19 34h10M21 38h6', color: '#FF8B38' },
  { face: 'M12 4H36L42 18 36 42 24 46 12 42 6 18Z', eyes: 'M12 19h9v3h-9ZM27 19h9v3h-9Z', mark: 'M24 19v13M18 36h12M12 9h24', color: '#7949FF' },
  { face: 'M24 2 44 22 24 46 4 22Z', eyes: 'M13 21 21 19v5ZM35 21 27 19v5Z', mark: 'M24 8v9M20 31h8M22 35h4', color: '#34E08A' },
  { face: 'M15 3H33L40 11V33L28 46H20L8 33V11Z', eyes: 'M13 20a4 3 0 0 1 8 0ZM27 20a4 3 0 0 1 8 0Z', mark: 'M24 6v8M20 10h8M24 24v8M19 37h10', color: '#F5F7FF' },
  { face: 'M24 2C36 2 42 12 41 24 40 36 32 46 24 46S8 36 7 24C6 12 12 2 24 2Z', eyes: 'M12 20h9l-3 5h-4ZM36 20h-9l3 5h4Z', mark: 'M12 13 18 10M36 13 30 10M21 33q3 3 6 0M24 8v5', color: '#19D8FF' },
  { face: 'M8 8 24 2 40 8 38 30 24 46 10 30Z', eyes: 'M13 18 21 22H13ZM35 18 27 22H35Z', mark: 'M16 30h16M19 34h10M24 7v7', color: '#FF8B38' },
  { face: 'M18 2H30L34 12 42 18 34 34 28 46H20L14 34 6 18 14 12Z', eyes: 'M14 21h7v4h-7ZM27 21h7v4h-7Z', mark: 'M24 8v8M21 31h6v5h-6Z', color: '#7949FF' },
];
