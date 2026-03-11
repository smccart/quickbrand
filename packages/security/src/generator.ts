import type { SecurityArtifactType, SecurityInput, SecurityArtifact, SecurityBundle } from './types';
import { SECURITY_ARTIFACT_TYPES } from './types';
import { cspHeaderTemplate } from './templates/csp-header';
import { corsConfigTemplate } from './templates/cors-config';
import { securityHeadersTemplate } from './templates/security-headers';
import { authScaffoldTemplate } from './templates/auth-scaffold';
import { envTemplateTemplate } from './templates/env-template';
import { rateLimitTemplate } from './templates/rate-limit';

type TemplateResult = { content: string; language: SecurityArtifact['language']; filename: string };

const templateMap: Record<SecurityArtifactType, (input: SecurityInput) => TemplateResult> = {
  'csp-header': cspHeaderTemplate,
  'cors-config': corsConfigTemplate,
  'security-headers': securityHeadersTemplate,
  'auth-scaffold': authScaffoldTemplate,
  'env-template': envTemplateTemplate,
  'rate-limit': rateLimitTemplate,
};

function normalizeInput(input: SecurityInput): SecurityInput {
  return {
    ...input,
    framework: input.framework || 'generic',
    appType: input.appType || 'website',
    authStrategy: input.authStrategy || 'jwt',
  };
}

export function generateArtifact(type: SecurityArtifactType, input: SecurityInput): SecurityArtifact {
  const templateFn = templateMap[type];
  if (!templateFn) {
    throw new Error(`Unknown security artifact type: ${type}`);
  }

  const normalized = normalizeInput(input);
  const result = templateFn(normalized);

  return {
    type,
    title: SECURITY_ARTIFACT_TYPES[type].title,
    content: result.content,
    language: result.language,
    filename: result.filename,
    metadata: {
      generatedAt: new Date().toISOString(),
      charCount: result.content.length,
    },
  };
}

export function generateBundle(types: SecurityArtifactType[], input: SecurityInput): SecurityBundle {
  const normalized = normalizeInput(input);
  const artifacts = types.map((type) => generateArtifact(type, normalized));
  return { artifacts, input: normalized };
}
