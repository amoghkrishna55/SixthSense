import {bundleResourceIO, fetch} from '@tensorflow/tfjs-react-native';

const modelJson = require('../assets/model/model.json');
const modelWeights = [
  require('../assets/model/group1-shard1of5.bin'),
  require('../assets/model/group1-shard2of5.bin'),
  require('../assets/model/group1-shard3of5.bin'),
  require('../assets/model/group1-shard4of5.bin'),
  require('../assets/model/group1-shard5of5.bin'),
];

// const getModel =

export const modelURI = bundleResourceIO(modelJson, modelWeights);
