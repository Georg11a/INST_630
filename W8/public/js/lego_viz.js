export default function createLegoVisualization(data) {
  // Clean data - remove the last item if it doesn't have total_bricks (incomplete data)
  if (data.length > 0 && !data[data.length - 1].total_bricks) {
    data.pop();
  }
  
  // Sort data by brick count (descending)
  data.sort((a, b) => b.total_bricks - a.total_bricks);
  
  // Take only the top 10 colors to avoid chart clutter
  const topColors = data.slice(0, 10);
  
  // Find the maximum brick count for scaling
  const maxCount = Math.max(...topColors.map(brick => brick.total_bricks));
  
  // Create visualization container
  const container = document.createElement('div');
  container.className = 'chart-container';
  container.style.width = '100%';
  container.style.height = '400px';
  container.style.overflow = 'auto';
  
  // Create title
  const title = document.createElement('h3');
  title.textContent = 'Top 10 Most Common LEGO Brick Colors';
  title.style.textAlign = 'center';
  container.appendChild(title);
  
  // Create chart container
  const chartDiv = document.createElement('div');
  chartDiv.style.display = 'flex';
  chartDiv.style.flexDirection = 'column';
  chartDiv.style.gap = '5px';
  chartDiv.style.height = '100%';
  chartDiv.style.width = '100%';
  
  // Create bar chart for each color
  topColors.forEach(brick => {
    // Create row container for chart
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.width = '100%';
    row.style.gap = '10px';
    
    // Create color label
    const label = document.createElement('div');
    label.style.width = '120px';
    label.style.whiteSpace = 'nowrap';
    label.style.overflow = 'hidden';
    label.style.textOverflow = 'ellipsis';
    label.textContent = brick.color_name;
    label.title = brick.color_name; // Show full name on hover
    
    // Create color sample
    const colorSample = document.createElement('div');
    colorSample.style.width = '20px';
    colorSample.style.height = '20px';
    colorSample.style.backgroundColor = brick.hex_color;
    colorSample.style.border = '1px solid #ccc';
    colorSample.style.borderRadius = '4px';
    
    // Create bar for chart
    const bar = document.createElement('div');
    bar.style.height = '20px';
    bar.style.backgroundColor = brick.hex_color;
    
    // Scale bar width based on maximum value (max 80% of container width)
    const widthPercentage = (brick.total_bricks / maxCount) * 80;
    bar.style.width = `${widthPercentage}%`;
    bar.style.position = 'relative';
    bar.style.borderRadius = '4px';
    bar.style.transition = 'width 0.5s';
    
    // Show count
    const count = document.createElement('div');
    count.textContent = brick.total_bricks.toLocaleString();
    count.style.position = 'absolute';
    count.style.right = '-55px';
    count.style.top = '0';
    count.style.color = '#333';
    count.style.fontSize = '0.8rem';
    bar.appendChild(count);
    
    // Add all elements to row
    row.appendChild(colorSample);
    row.appendChild(label);
    row.appendChild(bar);
    
    // Add row to chart
    chartDiv.appendChild(row);
  });
  
  // Add chart to container
  container.appendChild(chartDiv);
  
  // Add brick visualization
  const bricksContainer = document.createElement('div');
  bricksContainer.className = 'lego-container';
  
  // Create brick elements for each color
  data.forEach((brick, index) => {
    // Create brick element
    const brickDiv = document.createElement('div');
    brickDiv.className = 'lego-block';
    
    // Set background color
    brickDiv.style.backgroundColor = brick.hex_color;
    
    // Set width based on brick count (logarithmic scaling)
    const logScale = Math.log(brick.total_bricks) / Math.log(maxCount);
    const width = 30 + logScale * 70; // Min 30px, max 100px
    brickDiv.style.width = `${width}px`;
    
    // Add animation delay variable
    brickDiv.style.setProperty('--i', index);
    
    // Add hover information
    brickDiv.title = `${brick.color_name}: ${brick.total_bricks.toLocaleString()} bricks`;
    
    // Add click event
    brickDiv.addEventListener('click', () => {
      alert(`${brick.color_name}\nColor code: ${brick.hex_color}\nBrick count: ${brick.total_bricks.toLocaleString()}`);
    });
    
    // Add to container
    bricksContainer.appendChild(brickDiv);
  });
  
  // Add brick visualization to main container
  container.appendChild(document.createElement('hr'));
  container.appendChild(document.createElement('h3')).textContent = 'Color Brick Representation';
  container.appendChild(bricksContainer);
  
  return container;
}