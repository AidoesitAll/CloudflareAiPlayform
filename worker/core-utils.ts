/**
 * Core utilities for the Cloudflare Agents template
 * STRICTLY DO NOT MODIFY THIS FILE - Hidden from AI to prevent breaking core functionality
 */
import type { AppController } from './app-controller';
import type { ChatAgent } from './agent';
import type { GalleryAgent } from './gallery-agent';
import type { ReportingAgent } from './reporting-agent';
export interface Env {
    CF_AI_BASE_URL: string;
    CF_AI_API_KEY: string;
    SERPAPI_KEY: string;
    OPENROUTER_API_KEY: string;
    IMAGE_GEN_MODEL: string;
    TEXT_MODERATION_MODEL: string;
    CHAT_AGENT: DurableObjectNamespace<ChatAgent>;
    APP_CONTROLLER: DurableObjectNamespace<AppController>;
    GALLERY_AGENT: DurableObjectNamespace<GalleryAgent>;
    GALLERY_IMAGES: R2Bucket;
    REPORTING_AGENT: DurableObjectNamespace<ReportingAgent>;
    AI: Ai;
}
/**
 * Get AppController stub for session management
 * Uses a singleton pattern with fixed ID for consistent routing
 */
export function getAppController(env: Env): DurableObjectStub<AppController> {
  const id = env.APP_CONTROLLER.idFromName("controller");
  return env.APP_CONTROLLER.get(id);
}
/**
 * Get GalleryAgent stub for gallery management
 * Uses a singleton pattern with a fixed ID for a shared gallery.
 * In a multi-user app, you would derive the ID from user authentication details.
 */
export function getGalleryAgent(env: Env): DurableObjectStub<GalleryAgent> {
    const id = env.GALLERY_AGENT.idFromName("shared-gallery");
    return env.GALLERY_AGENT.get(id);
}
/**
 * Get ReportingAgent stub for content reporting.
 * Uses a singleton pattern with a fixed ID.
 */
export function getReportingAgent(env: Env): DurableObjectStub<ReportingAgent> {
    const id = env.REPORTING_AGENT.idFromName("shared-reports");
    return env.REPORTING_AGENT.get(id);
}
/**
 * Register a new chat session with the control plane
 * Called automatically when a new ChatAgent is created
 */
export async function registerSession(env: Env, sessionId: string, title?: string): Promise<void> {
  try {
    const controller = getAppController(env);
    await controller.addSession(sessionId, title);
  } catch (error) {
    console.error('Failed to register session:', error);
    // Don't throw - session should work even if registration fails
  }
}
/**
 * Update session activity timestamp
 * Called when a session receives messages
 */
export async function updateSessionActivity(env: Env, sessionId: string): Promise<void> {
  try {
    const controller = getAppController(env);
    await controller.updateSessionActivity(sessionId);
  } catch (error) {
    console.error('Failed to update session activity:', error);
    // Don't throw - this is non-critical
  }
}
/**
 * Unregister a session from the control plane
 * Called when a session is explicitly deleted
 */
export async function unregisterSession(env: Env, sessionId: string): Promise<boolean> {
  try {
    const controller = getAppController(env);
    return await controller.removeSession(sessionId);
  } catch (error) {
    console.error('Failed to unregister session:', error);
    return false;
  }
}