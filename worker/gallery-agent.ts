import { DurableObject } from 'cloudflare:workers';
import type { Env } from './core-utils';
import type { GalleryItem } from './types';
export class GalleryAgent extends DurableObject<Env> {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
  }
  async addImage(item: GalleryItem): Promise<void> {
    await this.ctx.storage.put(item.id, item);
  }
  async listImages(): Promise<GalleryItem[]> {
    const items = await this.ctx.storage.list<GalleryItem>();
    const galleryItems: GalleryItem[] = [];
    for (const item of items.values()) {
      galleryItems.push(item);
    }
    // Sort by creation date, newest first
    return galleryItems.sort((a, b) => b.createdAt - a.createdAt);
  }
  async deleteImage(id: string): Promise<boolean> {
    return this.ctx.storage.delete(id);
  }
}