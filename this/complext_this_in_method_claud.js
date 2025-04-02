/**
 * A sophisticated utility method that recursively traverses and transforms an object's structure
 * using functional programming patterns, memoization, and configurable traversal strategies.
 *
 * @param {Object} source - The source object to transform
 * @param {Object} options - Configuration options
 * @param {Function} options.transformer - Function to transform primitive values (key, value, path) => newValue
 * @param {Function} options.keyMapper - Function to transform keys (key, value, path) => newKey
 * @param {Function} options.predicate - Predicate to determine if a node should be processed (key, value, path) => boolean
 * @param {boolean} options.preserveArrays - Whether to preserve array structures (default: true)
 * @param {Set} options.circularRefs - Set for tracking circular references (used internally)
 * @param {Map} options.memo - Memoization cache (used internally)
 * @param {Array} options.path - Current path in the object (used internally)
 * @returns {Object} - Transformed deep copy of the original object
 *
 * https://claude.ai/chat/914769d6-a127-47f3-b821-909b5e6cfc9f
 */
function deepTransform(source, options = {}) {
    // Default options with sensible defaults
    const config = {
      transformer: (key, value) => value, // default transformer, meaning it does no transformation. The intent is that if users of this config object wants to change values, they can provide their own transformer function
      keyMapper: (key) => key, // default function that does not modify the keys. User can provide a function that changes the key names.
      predicate: () => true,
      preserveArrays: true,
      circularRefs: new Set(),  //used to track circular references in objects, preventing infinite loops during operations like deep copying or serialization.
      memo: new Map(),  // used for memoization, which is a technique for caching the results of expensive function calls to avoid redundant computations.1
      path: [],
      ...options
    };

    // Handle null/undefined early
    if (source == null) return source;

    // Cache for circular reference detection
    const { circularRefs, memo, path } = config;

    // Check for circular references by checking if the source is an object and if it has already been encountered
    if (typeof source === 'object') {
      if (circularRefs.has(source)) {
        return '[Circular Reference]';
      }

      // Check memo cache for already processed objects (optimization).
      // return cached result if processed
      if (memo.has(source)) {
        return memo.get(source);
      }

      circularRefs.add(source);
    }

    // Process based on type
    const processValue = (value, key, currentPath) => {
      // Skip processing if predicate returns false
      if (!config.predicate(key, value, currentPath)) {
        return value;
      }

      // Handle primitive types directly
      if (value === null || typeof value !== 'object') {
        return config.transformer(key, value, currentPath);
      }

      // Handle Arrays specially if preserveArrays is true
      if (Array.isArray(value) && config.preserveArrays) {
        const result = value.map((item, index) => {
          const itemPath = [...currentPath, index];
          return processValue(item, index, itemPath);
        });
        return result;
      }

      // Handle general objects with recursive traversal
      const result = Array.isArray(value) ? [] : {};

      // Process each property of the object
      Object.entries(value).forEach(([k, v]) => {
        const newKey = config.keyMapper(k, v, [...currentPath, k]);
        const newPath = [...currentPath, k];
        result[newKey] = processValue(v, k, newPath);
      });

      // Memoize the result to handle shared references
      if (typeof source === 'object') {
        memo.set(value, result);
      }

      return result;
    };

    // Start processing with the source object
    const result = processValue(source, '', path);

    // Clean up circular reference tracking
    if (typeof source === 'object') {
      circularRefs.delete(source);
    }

    return result;
  }

  // Example usage:
  // Transform nested data by multiplying all numbers by 2 and converting keys to camelCase
  const data = {
    user_info: {
      first_name: "John",
      last_name: "Doe",
      age: 30,
      contact_details: [
        { phone_type: "home", phone_number: "123-456-7890" },
        { phone_type: "work", phone_number: "098-765-4321" }
      ],
      metrics: {
        login_count: 42,
        last_active: new Date(),
        performance_scores: [95, 87, 91]
      }
    }
  };

  // A key mapper that converts snake_case to camelCase
  const snakeToCamel = (key) => key.replace(/_([a-z])/g, (m, c) => c.toUpperCase());

  // A transformer that doubles numbers and preserves other types
  const doubleNumbers = (key, value) => typeof value === 'number' ? value * 2 : value;

  // Use the utility
  const transformed = deepTransform(data, {
    transformer: doubleNumbers,
    keyMapper: snakeToCamel,
    predicate: (key, value, path) => !path.includes('lastActive') // Skip date objects
  });

  console.log(JSON.stringify(transformed, null, 2));

  /*
  This method demonstrates several advanced JavaScript concepts:

Deep recursive traversal - The function navigates through nested objects and arrays, maintaining path context.
Functional programming patterns - Using higher-order functions (transformer, keyMapper, predicate) to customize behavior.
Circular reference detection - The method handles circular references that would otherwise cause stack overflows.
Memoization - It caches processed objects to maintain shared references and optimize performance.
Configurable behavior - Multiple options allow fine-tuning the transformation process.

The example shows how to use this method to transform a complex nested object by:

Converting all keys from snake_case to camelCase
Doubling all number values
Preserving array structures
Selectively skipping certain paths in the object

This type of utility would be useful in scenarios like:

Normalizing API responses to match frontend conventions
Creating immutable data transformations in state management libraries
Adapting between different data schemas
Processing complex data structures with custom logic
  */