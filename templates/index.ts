import { CVTemplateData, TemplateRenderer } from './types';
import { renderClassicTemplate } from './classic';
import { renderSimpleTemplate } from './simple';
import { renderProfessionalTemplate } from './professional';
import { renderExecutiveTemplate } from './executive';
import { renderModernTemplate } from './modern';

export * from './types';

export const templateRenderers: Record<string, TemplateRenderer> = {
  classic: renderClassicTemplate,
  simple: renderSimpleTemplate,
  professional: renderProfessionalTemplate,
  executive: renderExecutiveTemplate,
  modern: renderModernTemplate,
};

export function renderCVTemplate(slug: string, data: CVTemplateData): string {
  const renderer = templateRenderers[slug] || renderClassicTemplate;
  return renderer(data);
}
