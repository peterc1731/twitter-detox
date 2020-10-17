import * as tf from '@tensorflow/tfjs-node';
import * as toxicity from '@tensorflow-models/toxicity';

// SENTIMENT

const PAD_INDEX = 0; // Index of the padding character.
const OOV_INDEX = 2; // Index fo the OOV character.

function padSequence(
  seq: string[],
  maxLen: number,
  padding = 'pre',
  truncating = 'pre',
  value = PAD_INDEX
) {
  // Perform truncation.
  if (seq.length > maxLen) {
    if (truncating === 'pre') {
      seq.splice(0, seq.length - maxLen);
    } else {
      seq.splice(maxLen, seq.length - maxLen);
    }
  }

  // Perform padding.
  if (seq.length < maxLen) {
    const pad = [];
    for (let i = 0; i < maxLen - seq.length; ++i) {
      pad.push(value);
    }
    if (padding === 'pre') {
      seq = pad.concat(seq);
    } else {
      seq = seq.concat(pad);
    }
  }

  return seq;
}

let model: tf.LayersModel;
let metadata: any;

export async function getSentimentScore(tweet: string) {
  // load model and metadata from remote urls
  if (!model) {
    model = await tf.loadLayersModel(
      'https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/model.json'
    );
  }
  if (!metadata) {
    const metadataReq = await fetch(
      'https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/metadata.json'
    );
    metadata = await metadataReq.json();
  }

  // convert to lower case and remove all punctuations.
  const inputText = tweet
    .trim()
    .toLowerCase()
    .replace(/(\.|,|!)/g, '')
    .split(' ');

  // convert the words to a sequence of word indices.
  const wordIndex = metadata['word_index'];
  const vocabularySize = metadata['vocabulary_size'];
  const indexFrom = metadata['index_from'];
  const sequence = inputText.map((word) => {
    const index = wordIndex[word] + indexFrom;
    return index > vocabularySize ? OOV_INDEX : index;
  });

  // Perform truncation and padding.
  const paddedSequence = padSequence(sequence, metadata.max_len);
  const input = tf.tensor2d([paddedSequence], [1, metadata.max_len]);

  // get score
  const predictOut = model.predict(input) as tf.Tensor<tf.Rank>;
  const data = await predictOut.data();
  const score = data[0];
  predictOut.dispose();
  return score;
}

// TOXICITY

const TOXICITY_THRESHOLD = 0.6;
let tModel: toxicity.ToxicityClassifier;

export async function preLoadToxModel() {
  tModel = await toxicity.load(TOXICITY_THRESHOLD, []);
}

export async function isToxic(tweets: string[]) {
  if (!tModel) {
    await preLoadToxModel();
  }
  const predictions = await tModel.classify(tweets);
  const result = predictions.reduce((acc, val) => {
    if (acc) {
      return true;
    }
    return val.results.reduce((acc2, val2) => {
      if (acc2) {
        return true;
      }
      return val2.match;
    }, false);
  }, false);
  return result;
}
