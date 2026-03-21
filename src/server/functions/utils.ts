/**
 * Recursively converts Firestore Timestamp objects to numbers (milliseconds)
 * to ensure they can be serialized by TanStack Start / Seroval.
 */
export function sanitizeData(obj: any): any {
  // 1. Handle primitives
  if (obj === null || obj === undefined) return obj
  if (typeof obj !== 'object') return obj

  // 2. Aggressively detect Firestore Timestamps or Dates
  // We check for methods first, then for raw properties seen in logs (_seconds, seconds)
  try {
    if (typeof obj.toMillis === 'function') return obj.toMillis()
    if (typeof obj.toDate === 'function') return obj.toDate().getTime()
    if (obj instanceof Date) return obj.getTime()
    
    // Check for raw properties as seen in some serializations
    const seconds = obj._seconds ?? obj.seconds
    const nanos = obj._nanoseconds ?? obj.nanoseconds
    if (typeof seconds === 'number' && typeof nanos === 'number') {
      return seconds * 1000 + Math.floor(nanos / 1000000)
    }
  } catch (e) {
    // Fallback if property access fails
  }

  // 3. Handle Arrays
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeData(item))
  }

  // 4. Handle Objects (Recursively)
  const newObj: any = {}
  let hasProperties = false
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      newObj[key] = sanitizeData(obj[key])
      hasProperties = true
    }
  }
  
  // If it's an object with no serializable properties but was an object, 
  // return as is or return empty object.
  return hasProperties ? newObj : obj
}
