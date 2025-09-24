/**
 * Functional reporting service.
 * This sends a request to a backend endpoint to flag content for review.
 *
 * @param imageId - The ID of the image being reported.
 * @param prompt - The prompt associated with the image.
 * @returns A promise that resolves when the report is successfully sent.
 */
export const reportImage = async (imageId: string, prompt: string): Promise<void> => {
  console.log(`Reporting image ${imageId} with prompt: "${prompt}"`);
  const response = await fetch('/api/report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageId, prompt }),
  });
  if (!response.ok) {
    throw new Error('Failed to submit report. Please try again later.');
  }
  // No need to parse JSON body for a simple success response
  return;
};