These Zod schemas and enums can be used for a variety of use cases:

- Populating UI elements in the front-end like dropdowns
- Validating and parsing API inputs
- Validating and parsing API responses.

## On Validating and Parsing Responses

When it comes to validating and parsing API responses, it might be better to keep the response schemas more flexible. For example, we don't necessarily need to validate that the `ClinicalFocus` field in the response strictly matches the list of predefined enums. Instead, we could simply check that it's an array of strings. However, validating and parsing `ClinicalFocus` on the input side of the API is more crucial, as we want to ensure that what we send to the API is valid and supported.

We can decide on a field-by-field basis how strictly we want to define schemas and types for API inputs and responses.

### Example

**API input schema:**

```
const ApiInputSchema = z.object({
  clinicalFocus: z
    .array(z.enum(['Option 1', 'Option 2']))
    .optional(),
});
```

**API output schema:**

```
const ApiResponseSchema = z.object({
  clinicalFocus: z.array(z.string()).optional(),
});
```
