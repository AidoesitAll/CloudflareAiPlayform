// Live image generation service
export const generateImage = async (
  prompt: string,
  negativePrompt?: string,
  style?: string
): Promise<string> => {
  console.log(`Requesting image for prompt: "${prompt}"`);
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt, negativePrompt, style }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'An unknown error occurred' }));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  const imageBlob = await response.blob();
  const objectURL = URL.createObjectURL(imageBlob);
  return objectURL;
};