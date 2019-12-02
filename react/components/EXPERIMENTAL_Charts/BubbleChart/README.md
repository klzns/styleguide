#### The Bubble Charts shows the data as points like the Scatter Plot. However, unlike a Scatte Plot, each plotted point has a third measure representing the area of its circle. They are effective to compare and show the relationships between the circles, by the use of positioning and proportions. 

```js
const data = [
  { x: 100, y: 200, z: 140 },
  { x: 120, y: 100, z: 270 },
  { x: 170, y: 300, z: 100 },
  { x: 140, y: 250, z: 80 },
  { x: 150, y: 500, z: 300 },
  { x: 110, y: 280, z: 1400 },
];


<BubbleChart
  config={{container: {width: '100%', height: '100%'}}}
  data={data}
  xAxisKey='x'
  yAxisKey='y'
  zAxisKey='z'
/>
```