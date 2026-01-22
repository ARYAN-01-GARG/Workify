import type { ToolUIPart } from 'ai';
import AddMemoryTool from './AddMemoryTool';
import SearchMemoryTool from './SearchMemoryTool';
import SearchWebTool from './SearchWebTool';

export interface ToolProps {
  tool: ToolUIPart;
}

export const toolComponents = {
  web_search: SearchWebTool,
  addMemory: AddMemoryTool,
  searchMemories: SearchMemoryTool,
};
