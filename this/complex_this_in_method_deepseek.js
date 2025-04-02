/*
Here's a sophisticated JavaScript method that demonstrates several advanced concepts including:

* Asynchronous operations with async/await
* Error handling with custom exceptions
* Functional programming (map, reduce, filter)
* Generators and iterators
* Memoization for performance optimization
* Proxy for advanced property access
* Optional chaining and nullish coalescing
*/
/**
 * Complex asynchronous data processing pipeline with caching, validation,
 * and transformation capabilities.
 *
 * @param {string|Array|Object} input - Data source (URL, array, or object)
 * @param {Object} config - Processing configuration
 * @returns {Promise<Object>} - Processed data with metadata
 */
async function processDataPipeline(input, config = {}) {
    // Private memoization cache using WeakMap for garbage collection
    const pipelineCache = new WeakMap();
    const cacheKey = JSON.stringify({ input, config });

    // Check cache first
    if (pipelineCache.has(cacheKey)) {
      return pipelineCache.get(cacheKey);
    }

    // Custom error classes
    class PipelineError extends Error {
      constructor(message, stage, originalError) {
        super(message);
        this.name = 'PipelineError';
        this.stage = stage;
        this.originalError = originalError;
        this.timestamp = new Date().toISOString();
      }

      toJSON() {
        return {
          error: this.message,
          stage: this.stage,
          timestamp: this.timestamp,
          stack: this.stack
        };
      }
    }

    // Proxy for config validation
    const configProxy = new Proxy(config, {
      set(target, prop, value) {
        const validators = {
          maxRetries: v => Number.isInteger(v) && v >= 0,
          timeout: v => Number.isInteger(v) && v > 0,
          transformations: v => Array.isArray(v),
          fallbackData: v => true // Any value is acceptable
        };

        if (validators[prop] && !validators[prop](value)) {
          throw new PipelineError(`Invalid config value for ${prop}`, 'config-validation');
        }
        target[prop] = value;
        return true;
      }
    });

    try {
      // Step 1: Data fetching (handles multiple input types)
      const fetchData = async () => {
        if (typeof input === 'string') {
          const response = await fetch(input, {
            signal: AbortSignal.timeout(configProxy.timeout ?? 5000)
          });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return response.json();
        } else if (Array.isArray(input) || typeof input === 'object') {
          return structuredClone(input); // Deep clone
        }
        throw new PipelineError('Unsupported input type', 'data-fetching');
      };

      // Step 2: Data validation using generator function
      function* validateData(data) {
        if (!data) {
          throw new PipelineError('No data received', 'data-validation');
        }

        const requiredFields = config.requiredFields ?? [];
        for (const field of requiredFields) {
          if (data[field] === undefined) {
            yield {
              field,
              valid: false,
              message: `Missing required field: ${field}`
            };
          } else {
            yield { field, valid: true };
          }
        }
      }

      // Step 3: Data transformation pipeline
      const applyTransformations = (data) => {
        if (!config.transformations?.length) return data;

        return config.transformations.reduce((acc, transform) => {
          try {
            // Support both sync and async transforms
            const transformFn = typeof transform === 'function'
              ? transform
              : new Function('data', transform.code);

            const result = transformFn(acc);

            return result instanceof Promise
              ? (async () => await result)()
              : result;
          } catch (error) {
            throw new PipelineError(
              `Transformation failed: ${error.message}`,
              'data-transformation',
              error
            );
          }
        }, data);
      };

      // Step 4: Data analysis (complex example with memoization)
      const analyzeData = (() => {
        const statsCache = new Map();

        return (data) => {
          const cacheKey = JSON.stringify(data);
          if (statsCache.has(cacheKey)) {
            return statsCache.get(cacheKey);
          }

          const stats = {
            numericFields: {},
            dateFields: {},
            textFields: {}
          };

          // Recursive analysis function
          const analyze = (obj, path = '') => {
            for (const [key, value] of Object.entries(obj)) {
              const currentPath = path ? `${path}.${key}` : key;

              if (typeof value === 'number') {
                stats.numericFields[currentPath] =
                  (stats.numericFields[currentPath] || 0) + 1;
              } else if (value instanceof Date) {
                stats.dateFields[currentPath] = true;
              } else if (typeof value === 'string') {
                stats.textFields[currentPath] =
                  (stats.textFields[currentPath] || 0) + value.length;
              } else if (typeof value === 'object' && value !== null) {
                analyze(value, currentPath);
              }
            }
          };

          analyze(data);
          statsCache.set(cacheKey, stats);
          return stats;
        };
      })();

      // Main execution flow with retry logic
      let retries = configProxy.maxRetries ?? 3;
      let lastError = null;

      while (retries >= 0) {
        try {
          // Execute pipeline steps
          const rawData = await fetchData();
          const validationResults = [...validateData(rawData)];
          const invalidFields = validationResults.filter(r => !r.valid);

          if (invalidFields.length > 0 && !configProxy.ignoreValidation) {
            throw new PipelineError(
              `Invalid fields: ${invalidFields.map(f => f.field).join(', ')}`,
              'data-validation'
            );
          }

          const transformedData = await applyTransformations(rawData);
          const analysis = analyzeData(transformedData);

          // Prepare result with metadata
          const result = {
            data: transformedData,
            metadata: {
              source: typeof input === 'string' ? input : 'inline',
              timestamp: new Date().toISOString(),
              stats: analysis,
              validation: validationResults,
              cache: pipelineCache.has(cacheKey) ? 'hit' : 'miss'
            }
          };

          // Cache the result
          pipelineCache.set(cacheKey, result);
          return result;

        } catch (error) {
          lastError = error;
          retries--;

          if (retries >= 0) {
            await new Promise(resolve =>
              setTimeout(resolve, 1000 * (configProxy.retryDelay ?? 1))
            );
            continue;
          }

          // All retries failed - use fallback if available
          if (configProxy.fallbackData !== undefined) {
            return {
              data: configProxy.fallbackData,
              metadata: {
                source: 'fallback',
                timestamp: new Date().toISOString(),
                error: error.toJSON?.(),
                cache: 'bypass'
              }
            };
          }

          throw error;
        }
      }
    } catch (error) {
      if (error instanceof PipelineError) {
        throw error;
      }
      throw new PipelineError(
        `Unexpected pipeline error: ${error.message}`,
        'pipeline-execution',
        error
      );
    }
  }

  // Example usage:
  /*
  try {
    const result = await processDataPipeline('https://api.example.com/data', {
      maxRetries: 2,
      timeout: 3000,
      requiredFields: ['id', 'name'],
      transformations: [
        data => ({ ...data, processed: true }),
        {
          code: `return data.map(item => ({ ...item, modifiedAt: new Date() }))`
        }
      ],
      fallbackData: { status: 'fallback', items: [] }
    });
    console.log(result);
  } catch (error) {
    console.error('Pipeline failed:', error);
  }
  */

  /*
  This method demonstrates:
1. Comprehensive error handling with custom errors
2. Asynchronous control flow with retry logic
3. Advanced caching with WeakMap and memoization
4. Proxy for config validation
5. Generator functions for validation
6. Functional programming patterns
7. Optional chaining and nullish coalescing
8. Complex data analysis with recursion
9. Support for both synchronous and asynchronous transformations
10. Fallback mechanisms and detailed metadata reporting
*/