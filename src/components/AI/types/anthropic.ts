export enum ClaudeStreamType {
  MESSAGE_START = 'message_start',
  CONTENT_BLOCK_START = 'content_block_start',
  PING = 'ping',
  CONTENT_BLOCK_DELTA = 'content_block_delta',
  CONTENT_BLOCK_STOP = 'content_block_stop',
  MESSAGE_DELTA = 'message_delta',
  MESSAGE_STOP = 'message_stop',
}

export type ClaudeStreamResponse =
  | MessageStartData
  | ContentBlockStartData
  | PingData
  | ContentBlockDeltaData
  | ContentBlockStopData
  | MessageDeltaData
  | MessageStopData

interface MessageStartData {
  type: ClaudeStreamType.MESSAGE_START
  message: {
    id: string
    type: 'message'
    role: 'assistant'
    content: any[] // Adjust type based on expected content structure
    model: string
    stop_reason: string | null
    stop_sequence: string | null
    usage: {
      input_tokens: number
      output_tokens: number
    }
  }
}

interface ContentBlockStartData {
  type: ClaudeStreamType.CONTENT_BLOCK_START
  index: number
  content_block: {
    type: 'text'
    text: string
  }
}

interface PingData {
  type: ClaudeStreamType.PING
}

interface ContentBlockDeltaData {
  type: ClaudeStreamType.CONTENT_BLOCK_DELTA
  index: number
  delta: {
    type: 'text_delta'
    text: string
  }
}

interface ContentBlockStopData {
  type: ClaudeStreamType.CONTENT_BLOCK_STOP
  index: number
}

interface MessageDeltaData {
  type: ClaudeStreamType.MESSAGE_DELTA
  delta: {
    stop_reason: string | null
    stop_sequence: string | null
  }
  usage: {
    output_tokens: number
  }
}

interface MessageStopData {
  type: ClaudeStreamType.MESSAGE_STOP
}

// 非流式响应数据
export interface ClaudeResponseData {
  id: string
  type: string
  role: string
  model: string
  content: {
    type: string
    text?: string
  }[]
  stop_reason: string | null
  stop_sequence: string | null
  usage: {
    input_tokens: number
    output_tokens: number
  }
}
