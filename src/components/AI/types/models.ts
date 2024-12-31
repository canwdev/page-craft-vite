export enum AIProvider {
  OPEN_AI = 'open_ai',
  OPEN_AI_COMPATIBLE = 'open_ai_compatible',
  ANTHROPIC = 'anthropic',
}

export interface IChatModelOption {
  desc?: string
  label?: string
  value: string
  tokens?: number
  vision?: boolean
  functionCall?: boolean
}

export const OpenAIApiErrorCodeMessage: Record<string, string> = {
  400: '[400] Bad Request',
  401: '[401] 提供错误的API密钥 | Incorrect API key provided',
  403: '[403] 服务器拒绝访问，请稍后再试 | Server refused to access, please try again later',
  502: '[502] 错误的网关 |  Bad Gateway',
  503: '[503] 服务器繁忙，请稍后再试 | Server is busy, please try again later',
  504: '[504] 网关超时 | Gateway Time-out',
  500: '[500] 内部错误 | Internal Server Error',
}

export const chatProviderOptions = [
  {
    label: 'OpenAI',
    value: AIProvider.OPEN_AI,
    url: 'https://platform.openai.com/docs/models',
  },
  {
    label: 'OpenAI Compatible',
    value: AIProvider.OPEN_AI_COMPATIBLE,
    url: 'https://aihubmix.com/models',
  },
  {
    label: 'Anthropic',
    value: AIProvider.ANTHROPIC,
    url: 'https://docs.anthropic.com/en/docs/about-claude/models',
  },
]

/**
 * https://docs.anthropic.com/en/docs/about-claude/models
 * https://github.com/lobehub/lobe-chat/blob/main/src/config/modelProviders/anthropic.ts
 */
export const defaultAnthropicModel = 'claude-3-5-haiku-20241022'
export const anthropicChatModelOptions: IChatModelOption[] = [
  {
    desc: 'Claude 3.5 Haiku 是 Anthropic 最快的下一代模型。与 Claude 3 Haiku 相比，Claude 3.5 Haiku 在各项技能上都有所提升，并在许多智力基准测试中超越了上一代最大的模型 Claude 3 Opus。',
    label: 'Claude 3.5 Haiku',
    value: 'claude-3-5-haiku-20241022',
    tokens: 200_000,
    functionCall: true,
  },
  {
    desc: 'Claude 3.5 Sonnet 提供了超越 Opus 的能力和比 Sonnet 更快的速度，同时保持与 Sonnet 相同的价格。Sonnet 特别擅长编程、数据科学、视觉处理、代理任务。',
    label: 'Claude 3.5 Sonnet',
    value: 'claude-3-5-sonnet-20241022',
    tokens: 200_000,
    vision: true,
    functionCall: true,
  },
]

/**
 * https://platform.openai.com/docs/models
 * https://github.com/lobehub/lobe-chat/blob/main/src/config/modelProviders/openai.ts
 */
export const defaultOpenAIModel = 'gpt-4o-mini'
export const openAIChatModelOptions: IChatModelOption[] = [
  {
    desc: 'GPT-4o mini是OpenAI在GPT-4 Omni之后推出的最新模型，支持图文输入并输出文本。作为他们最先进的小型模型，它比其他近期的前沿模型便宜很多，并且比GPT-3.5 Turbo便宜超过60%。它保持了最先进的智能，同时具有显著的性价比。GPT-4o mini在MMLU测试中获得了 82% 的得分，目前在聊天偏好上排名高于 GPT-4。',

    label: 'GPT-4o Mini',
    value: 'gpt-4o-mini',
    tokens: 128_000,
    vision: true,
    functionCall: true,
  },
  {
    desc: 'o1-mini是一款针对编程、数学和科学应用场景而设计的快速、经济高效的推理模型。该模型具有128K上下文和2023年10月的知识截止日期。',
    label: 'OpenAI o1-mini',
    value: 'o1-mini',
    tokens: 128_000,
  },
  {
    desc: 'o1是OpenAI新的推理模型，适用于需要广泛通用知识的复杂任务。该模型具有128K上下文和2023年10月的知识截止日期。',
    label: 'OpenAI o1-preview',
    value: 'o1-preview',
    tokens: 128_000,
  },
  {
    desc: 'ChatGPT-4o 是一款动态模型，实时更新以保持当前最新版本。它结合了强大的语言理解与生成能力，适合于大规模应用场景，包括客户服务、教育和技术支持。',

    label: 'GPT-4o',
    value: 'gpt-4o',
    tokens: 128_000,
    vision: true,
    functionCall: true,
  },
  {
    desc: '最新的 GPT-4 Turbo 模型具备视觉功能。现在，视觉请求可以使用 JSON 模式和函数调用。 GPT-4 Turbo 是一个增强版本，为多模态任务提供成本效益高的支持。它在准确性和效率之间找到平衡，适合需要进行实时交互的应用程序场景。',

    label: 'GPT-4 Turbo',
    value: 'gpt-4-turbo',
    tokens: 128_000,
    vision: true,
    functionCall: true,
  },
  {
    desc: 'GPT 3.5 Turbo，适用于各种文本生成和理解任务',

    label: 'GPT-3.5 Turbo',
    value: 'gpt-3.5-turbo',
    tokens: 16_385,
    functionCall: true,
  },
]

/**
 * AI / LLM 模型图标集 https://lobehub.com/zh/icons
 */
export const compatibleModelOptions: IChatModelOption[] = [
  {label: 'Google - Gemini', value: 'gemini-2.0-flash-exp', vision: true, functionCall: true},
  {label: 'xAI - Grok', value: 'grok-2-1212'},
  {label: 'Meta - LLaMA', value: 'llama-3.3-70b-versatile'},
  {label: '同义千问 Qwen', value: 'qwen2.5-coder-7b-instruct'},
  {label: '智谱清言 ChatGLM', value: 'glm-4-flash'},
  {label: '深度求索 DeepSeek', value: 'deepseek-ai/DeepSeek-V2.5'},
  {label: '月之暗面 Moonshot', value: 'moonshot-v1-8k'},
]

export const getModelOptions = (provider: AIProvider) => {
  switch (provider) {
    case AIProvider.ANTHROPIC:
      return anthropicChatModelOptions
    case AIProvider.OPEN_AI:
      return openAIChatModelOptions
    default:
      return compatibleModelOptions
  }
}

export const modelsCanUseVision: {[key: string]: boolean} = {}
;[...anthropicChatModelOptions, ...openAIChatModelOptions, ...compatibleModelOptions].forEach(
  (item) => {
    if (item.vision) {
      modelsCanUseVision[item.value] = true
    }
  },
)
