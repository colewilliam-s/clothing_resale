// What to call someone who hasn't set a display name yet.
// Same rule as `label` in app/dm.js. dm.js can import this later instead of keeping its own copy.
import { Profile } from './types'

export const label = (p: Profile): string => p.display_name || `${p.university_domain ?? 'user'} (${p.id.slice(0, 6)})`;
