const { performance } = require('perf_hooks');

function base64EncodeConcat(str) {
  const utf8Bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < utf8Bytes.length; i++) {
    binary += String.fromCharCode(utf8Bytes[i]);
  }
  return btoa(binary);
}

function base64EncodeArrayJoin(str) {
  const utf8Bytes = new TextEncoder().encode(str);
  const chars = new Array(utf8Bytes.length);
  for (let i = 0; i < utf8Bytes.length; i++) {
    chars[i] = String.fromCharCode(utf8Bytes[i]);
  }
  let binary = chars.join("");
  return btoa(binary);
}

function base64EncodeChunk(str) {
  const utf8Bytes = new TextEncoder().encode(str);
  let binary = "";
  const chunkSize = 8192;
  for (let i = 0; i < utf8Bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, utf8Bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

const largeStr = "a".repeat(1000000);

function runBench(name, fn) {
  const start = performance.now();
  for(let i=0; i<10; i++) {
    fn(largeStr);
  }
  const end = performance.now();
  console.log(`${name}: ${end - start} ms`);
}

runBench('concat', base64EncodeConcat);
runBench('arrayJoin', base64EncodeArrayJoin);
runBench('chunk', base64EncodeChunk);
