import { AIKnowledgeDocumentSearchRequest } from 'src/app/shared/generated'
import { z, ZodTypeAny } from 'zod'

export const aIKnowledgeDocumentSearchCriteriasSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional()
  // ACTION S2: Please define the members for your aIKnowledgeDocumentSearchCriteriasSchema here
} satisfies Partial<Record<keyof AIKnowledgeDocumentSearchRequest, ZodTypeAny>>)

export type AIKnowledgeDocumentSearchCriteria = z.infer<typeof aIKnowledgeDocumentSearchCriteriasSchema>
