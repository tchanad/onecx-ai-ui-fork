import { SearchAIKnowledgeVectorDbRequest } from 'src/app/shared/generated'
import { z, ZodTypeAny } from 'zod'

export const AIKnowledgeVectorDbSearchCriteriasSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  vdb: z.string().optional(),
  vdbCollection: z.string().optional(),
  id: z.number().optional(),
  limit: z.number().optional()
} satisfies Partial<Record<keyof SearchAIKnowledgeVectorDbRequest, ZodTypeAny>>)

export type AIKnowledgeVectorDbSearchCriteria = z.infer<typeof AIKnowledgeVectorDbSearchCriteriasSchema>
