import { getPromptChanges } from '../getPromptsChanges';
import type { PromptCreate } from '@/services';

describe('getPromptChanges', () => {
  it('should return empty object when no changes', () => {
    const original: PromptCreate = {
      title: 'Test Title',
      description: "Test description",
      prompt: 'Test Prompt',
      resultExample: 'Test Result',
      model: 'Test Model',
    };
    const current = { ...original };

    expect(getPromptChanges(original, current)).toEqual({});
  });

  it('should detect title change', () => {
    const original: PromptCreate = {
      title: 'Old Title',
      description: "Test description",
      prompt: 'Test Prompt',
      resultExample: 'Test Result',
      model: 'Test Model',
    };
    const current: PromptCreate = {
      ...original,
      title: 'New Title'
    };

    expect(getPromptChanges(original, current)).toEqual({ title: 'New Title' });
  });

    it('should detect description change', () => {
    const original: PromptCreate = {
      title: 'Test Title',
      description: "Old description",
      prompt: 'Test Prompt',
      resultExample: 'Test Result',
      model: 'Test Model',
    };
    const current: PromptCreate = {
      ...original,
      description: 'New description'
    };

    expect(getPromptChanges(original, current)).toEqual({ description: 'New description' });
  });


  it('should detect prompt change', () => {
    const original: PromptCreate = {
      title: 'Test Title',
      description: "Test description",
      prompt: 'Old Prompt',
      resultExample: 'Test Result',
      model: 'Test Model',
    };
    const current: PromptCreate = {
      ...original,
      prompt: 'New Prompt'
    };

    expect(getPromptChanges(original, current)).toEqual({ prompt: 'New Prompt' });
  });

  it('should detect resultExample change', () => {
    const original: PromptCreate = {
      title: 'Test Title',
      description: "Test description",
      prompt: 'Test Prompt',
      resultExample: 'Old Result',
      model: 'Test Model',
    };
    const current: PromptCreate = {
      ...original,
      resultExample: 'New Result'
    };

    expect(getPromptChanges(original, current)).toEqual({ resultExample: 'New Result' });
  });

  it('should detect model change', () => {
    const original: PromptCreate = {
      title: 'Test Title',
      description: "Test description",
      prompt: 'Test Prompt',
      resultExample: 'Test Result',
      model: 'Old Model',
    };
    const current: PromptCreate = {
      ...original,
      model: 'New Model'
    };

    expect(getPromptChanges(original, current)).toEqual({ model: 'New Model' });
  });

  it('should detect multiple changes', () => {
    const original: PromptCreate = {
      title: 'Old Title',
      description: "Old description",
      prompt: 'Old Prompt',
      resultExample: 'Old Result',
      model: 'Old Model',
    };
    const current: PromptCreate = {
      title: 'New Title',
      description: "New description",
      prompt: 'New Prompt',
      resultExample: 'New Result',
      model: 'New Model',
    };

    expect(getPromptChanges(original, current)).toEqual({
      title: 'New Title',
      description: "New description",
      prompt: 'New Prompt',
      resultExample: 'New Result',
      model: 'New Model',
    });
  });
});
