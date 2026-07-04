export interface ModelRequest { agentId: string; prompt: string }
export async function generateMockCompletion(_request: ModelRequest): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 450))
  return 'Mock completion generated locally. No model or external API was contacted.'
}
