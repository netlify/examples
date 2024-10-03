import { defineAction } from 'astro:actions';
import { type BlobParameterProps } from '@/types';
import { uploadDisabled } from '@/utils';
import { getStore } from '@netlify/blobs';

export const server = {
  submitShape: defineAction({
    handler: async (parameters: BlobParameterProps) => {
      if (uploadDisabled) throw new Error('Sorry, uploads are disabled');

      const blobStore = getStore('shapes');
      const key = parameters.name;
      await blobStore.setJSON(key, parameters);
      return {
        message: `Stored shape "${key}"`,
      };
    },
  }),
};
