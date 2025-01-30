import { AIKnowledgeDocumentSearchRequest, AIKnowledgeDocumentStatusEnum } from 'src/app/shared/generated'
import { z, ZodTypeAny } from 'zod'

export const aIKnowledgeDocumentSearchCriteriasSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  status: z.string().transform((value) => value as AIKnowledgeDocumentStatusEnum).optional()

} satisfies Partial<Record<keyof AIKnowledgeDocumentSearchRequest, ZodTypeAny>>)

export type AIKnowledgeDocumentSearchCriteria = z.infer<typeof aIKnowledgeDocumentSearchCriteriasSchema>
