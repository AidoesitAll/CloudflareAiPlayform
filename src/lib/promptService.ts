export const enhancePrompt = async (prompt: string): Promise<string> => {
  if (!prompt.trim()) {
    return prompt;
  }
  const response = await fetch('/api/enhance-prompt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to enhance prompt' }));
    throw new Error(errorData.error || 'An unknown error occurred during prompt enhancement.');
  }
  const { enhancedPrompt } = await response.json();
  return enhancedPrompt;
};