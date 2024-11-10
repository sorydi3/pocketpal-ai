import {Templates} from 'chat-formatter';
import {applyChatTemplate} from '../chat';
import {ChatMessage, ChatTemplateConfig} from '../types';
import {createModel} from '../../../jest/fixtures/models';

const conversationWSystem: ChatMessage[] = [
  {role: 'system', content: 'System prompt. '},
  {role: 'user', content: 'Hi there!'},
  {role: 'assistant', content: 'Nice to meet you!'},
  {role: 'user', content: 'Can I ask a question?'},
];

describe('Test Danube2 Chat Templates', () => {
  it('Test danube-2 template with geneneration and system prompt', async () => {
    const chatTemplate: ChatTemplateConfig = {
      ...Templates.templates.danube2,
      //isBeginningOfSequence: true,
      //isEndOfSequence: true,
      addGenerationPrompt: true,
      name: 'danube2',
    };
    const model = createModel({chatTemplate: chatTemplate});
    const result = await applyChatTemplate(conversationWSystem, model, null);
    expect(result).toBe(
      'System prompt. </s><|prompt|>Hi there!</s><|answer|>Nice to meet you!</s><|prompt|>Can I ask a question?</s><|answer|>',
    );
  });
});
