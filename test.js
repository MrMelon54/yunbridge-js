const YunBridge = requre('./index');

(async function() {
  let y = new YunBridge();
  await y.put('test',0xff2b);
  await y.put('hello','world');
  let a1 = await y.get('test');
  let a2 = await y.get('hello');
  console.log(`test: ${a1} -- ${a1==0xff2b}`);
  console.log(`C2-r: ${a2} -- ${a2=='world'}`);
})();
