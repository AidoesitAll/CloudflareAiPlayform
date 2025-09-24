import { Hono } from "hono";
import { getAgentByName } from 'agents';
import { ChatAgent } from './agent';
import { API_RESPONSES } from './config';
import { Env, getAppController, getGalleryAgent, getReportingAgent, registerSession, unregisterSession } from "./core-utils";
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import type { GalleryItem } from "./types";
import type { AiTextClassificationOutput, AiTextGenerationOutput } from '@cloudflare/workers-types';
/**
 * DO NOT MODIFY THIS FUNCTION. Only for your reference.
 */
export function coreRoutes(app: Hono<{ Bindings: Env }>) {
    // Use this API for conversations. **DO NOT MODIFY**
    app.all('/api/chat/:sessionId/*', async (c) => {
        try {
        const sessionId = c.req.param('sessionId');
        const agent = await getAgentByName<Env, ChatAgent>(c.env.CHAT_AGENT, sessionId); // Get existing agent or create a new one if it doesn't exist, with sessionId as the name
        const url = new URL(c.req.url);
        url.pathname = url.pathname.replace(`/api/chat/${sessionId}`, '');
        return agent.fetch(new Request(url.toString(), {
            method: c.req.method,
            headers: c.req.header(),
            body: c.req.method === 'GET' || c.req.method === 'DELETE' ? undefined : c.req.raw.body
        }));
        } catch (error) {
        console.error('Agent routing error:', error);
        return c.json({
            success: false,
            error: API_RESPONSES.AGENT_ROUTING_FAILED
        }, { status: 500 });
        }
    });
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {
    // --- IMAGE GENERATION ---
    const generateSchema = z.object({
        prompt: z.string().min(1).max(1000),
        negativePrompt: z.string().max(1000).optional(),
        style: z.string().max(50).optional(),
    });
    app.post('/api/generate', zValidator('json', generateSchema), async (c) => {
        if (!c.env.AI) {
            return c.json({ success: false, error: 'AI binding not configured' }, 500);
        }
        const { prompt, negativePrompt, style } = c.req.valid('json');
        try {
            // Step 1: Moderate the prompt
            const moderationModel = c.env.TEXT_MODERATION_MODEL || '@cf/meta/llama-2-7b-chat-fp16';
            const moderationResponse = await c.env.AI.run(
                moderationModel as any,
                { text: prompt }
            ) as AiTextClassificationOutput;
            const isUnsafe = moderationResponse.some(
                (res) => res.label === 'unsafe' && res.score != null && res.score > 0.5
            );
            if (isUnsafe) {
                return c.json({ success: false, error: 'Prompt was flagged as unsafe. Please try a different prompt.' }, 400);
            }
            // Step 2: Generate the image
            const finalPrompt = `${style || 'whimsical, illustrative style'}, ${prompt}${negativePrompt ? `, negative prompt: ${negativePrompt}` : ''}`;
            const inputs = { prompt: finalPrompt };
            const imageGenModel = c.env.IMAGE_GEN_MODEL || '@cf/lykon/dreamshaper-8-lcm';
            const response = await c.env.AI.run(
                imageGenModel as any,
                inputs
            );
            return new Response(response as BodyInit, {
                headers: { 'Content-Type': 'image/png' },
            });
        } catch (error) {
            console.error('AI image generation failed:', error);
            return c.json({ success: false, error: 'Failed to generate image' }, 500);
        }
    });
    // --- PROMPT ENHANCEMENT ---
    const enhancePromptSchema = z.object({
        prompt: z.string().min(1).max(500),
    });
    app.post('/api/enhance-prompt', zValidator('json', enhancePromptSchema), async (c) => {
        if (!c.env.AI) {
            return c.json({ success: false, error: 'AI binding not configured' }, 500);
        }
        const { prompt } = c.req.valid('json');
        try {
            const systemPrompt = "You are a creative assistant. Enhance the user's prompt for an AI image generator by adding more vivid details, descriptive adjectives, and artistic context. Return only the enhanced prompt as a single string, without any preamble or explanation.";
            const response = await c.env.AI.run(
                '@cf/meta/llama-2-7b-chat-fp16',
                {
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: prompt }
                    ]
                }
            ) as AiTextGenerationOutput;
            return c.json({ success: true, enhancedPrompt: response.response?.trim() || prompt });
        } catch (error) {
            console.error('Prompt enhancement failed:', error);
            return c.json({ success: false, error: 'Failed to enhance prompt' }, 500);
        }
    });
    // --- CONTENT REPORTING ---
    const reportSchema = z.object({
        imageId: z.string(),
        prompt: z.string(),
    });
    app.post('/api/report', zValidator('json', reportSchema), async (c) => {
        if (!c.env.REPORTING_AGENT) {
            return c.json({ success: false, error: 'Reporting service not configured' }, 500);
        }
        const { imageId, prompt } = c.req.valid('json');
        try {
            const reportingAgent = getReportingAgent(c.env);
            await reportingAgent.addReport({ imageId, prompt, timestamp: Date.now() });
            return c.json({ success: true });
        } catch (error) {
            console.error('Failed to file report:', error);
            return c.json({ success: false, error: 'Failed to file report' }, 500);
        }
    });
    // --- GALLERY MANAGEMENT ---
    app.get('/api/gallery', async (c) => {
        if (!c.env.GALLERY_AGENT) {
            return c.json({ success: false, error: 'Gallery agent binding not configured' }, 500);
        }
        const galleryAgent = getGalleryAgent(c.env);
        const images = await galleryAgent.listImages();
        return c.json({ success: true, data: images });
    });
    app.post('/api/gallery', async (c) => {
        if (!c.env.GALLERY_IMAGES || !c.env.GALLERY_AGENT) {
            return c.json({ success: false, error: 'Gallery bindings not configured' }, 500);
        }
        const formData = await c.req.formData();
        const prompt = formData.get('prompt') as string;
        const imageFile = formData.get('image') as File;
        if (!prompt || !imageFile) {
            return c.json({ success: false, error: 'Prompt and image file are required' }, 400);
        }
        const imageId = crypto.randomUUID();
        const imageKey = `${imageId}.png`;
        try {
            await c.env.GALLERY_IMAGES.put(imageKey, await imageFile.arrayBuffer());
            const galleryAgent = getGalleryAgent(c.env);
            const newItem: GalleryItem = {
                id: imageId,
                prompt,
                url: `/api/gallery/images/${imageKey}`,
                createdAt: Date.now(),
            };
            await galleryAgent.addImage(newItem);
            return c.json({ success: true, data: newItem });
        } catch (error) {
            console.error('Failed to save image:', error);
            return c.json({ success: false, error: 'Failed to save image' }, 500);
        }
    });
    app.get('/api/gallery/images/:key', async (c) => {
        if (!c.env.GALLERY_IMAGES) {
            return c.json({ success: false, error: 'Gallery storage binding not configured' }, 500);
        }
        const { key } = c.req.param();
        const object = await c.env.GALLERY_IMAGES.get(key);
        if (object === null) {
            return c.json({ success: false, error: 'Image not found' }, 404);
        }
        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set('etag', object.httpEtag);
        headers.set('Cache-Control', 'public, max-age=31536000, immutable');
        return new Response(object.body, { headers });
    });
    app.delete('/api/gallery/:id', async (c) => {
        if (!c.env.GALLERY_IMAGES || !c.env.GALLERY_AGENT) {
            return c.json({ success: false, error: 'Gallery bindings not configured' }, 500);
        }
        const { id } = c.req.param();
        const imageKey = `${id}.png`;
        try {
            await c.env.GALLERY_IMAGES.delete(imageKey);
            const galleryAgent = getGalleryAgent(c.env);
            const success = await galleryAgent.deleteImage(id);
            if (!success) {
                console.warn(`Metadata for image ID ${id} not found, but R2 deletion was attempted.`);
            }
            return c.json({ success: true });
        } catch (error) {
            console.error(`Failed to delete image ${id}:`, error);
            return c.json({ success: false, error: 'Failed to delete image' }, 500);
        }
    });
}