const fs = require('fs');
import('node-fetch').then((fetch) => { // Use dynamic import
  const { OpenAI, toFile } = require('openai');

  const openai = new OpenAI({
    apiKey: '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'
  });

  async function fineTuneModel() {
    // If you have access to Node fs, we recommend using fs.createReadStream():
    await openai.files.create({ file: fs.createReadStream('llmTrain.jsonl'), purpose: 'fine-tune' });
  }

  console.log(fineTuneModel()); // Call the async function to start fine-tuning
});
