import createLegoVisualization from "./lego_viz.js";
import getData from './getData.js';

async function mainThread() {
  // API endpoints
  const legoDataUrl = "/lego";
  const colorCountUrl = "/color";
  const brickCountUrl = "/brick";
  
  // DOM elements
  const loadButton = document.querySelector("#loadLegoData");
  const visualizationTarget = document.querySelector("#data_target");
  const colorCountElement = document.querySelector("#colorCount");
  const brickCountElement = document.querySelector("#brickCount");
  
  // Function to load statistics
  async function loadStats() {
    try {
      // Set loading state
      colorCountElement.innerHTML = '<span style="font-size:1rem;">Loading...</span>';
      brickCountElement.innerHTML = '<span style="font-size:1rem;">Loading...</span>';
      
      // Get total color count
      const colorData = await getData(colorCountUrl);
      
      // Add number increment animation
      animateNumber(0, colorData.count, 1500, value => {
        colorCountElement.textContent = Math.round(value);
      });
      
      // Get total brick count
      const brickData = await getData(brickCountUrl);
      
      // Add number increment animation
      animateNumber(0, brickData.count, 1500, value => {
        brickCountElement.textContent = Math.round(value).toLocaleString();
      });
    } catch (error) {
      console.error("Error loading statistics:", error);
      colorCountElement.textContent = "Failed to load";
      brickCountElement.textContent = "Failed to load";
    }
  }
  
  // Number animation function
  function animateNumber(start, end, duration, callback) {
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
      const elapsedTime = currentTime - startTime;
      
      if (elapsedTime < duration) {
        const progress = elapsedTime / duration;
        // Use easing function for more natural animation
        const easedProgress = 1 - Math.pow(1 - progress, 3); // Ease-out effect
        const currentValue = start + (end - start) * easedProgress;
        
        callback(currentValue);
        requestAnimationFrame(updateNumber);
      } else {
        callback(end);
      }
    }
    
    requestAnimationFrame(updateNumber);
  }
  
  // Load statistics immediately when page loads
  loadStats();
  
  // Load button click event
  loadButton.addEventListener('click', async () => {
    try {
      // Show loading state
      loadButton.disabled = true;
      loadButton.textContent = "Loading data...";
      visualizationTarget.innerHTML = '<div style="text-align:center; padding:2rem;"><div class="color-box" style="font-size:1.5rem;">Loading data...</div></div>';
      
      // Get LEGO data
      const data = await getData(legoDataUrl);
      console.log("Retrieved LEGO data:", data);
      
      // Brief delay to show loading effect
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Clear visualization area
      visualizationTarget.innerHTML = '';
      
      // Create visualization and add to target area
      const visualization = createLegoVisualization(data.lego);
      visualizationTarget.appendChild(visualization);
      
      // Add fade-in effect
      visualization.classList.add('fade-in');
      
      // Refresh statistics
      loadStats();
      
      // Restore button state
      loadButton.disabled = false;
      loadButton.textContent = "Reload Data";
    } catch (error) {
      console.error("Error creating visualization:", error);
      visualizationTarget.innerHTML = '<div class="error-message">Failed to load data. Please try again later.</div>';
      loadButton.disabled = false;
      loadButton.textContent = "Retry";
    }
  });
}

// Execute main thread when page is fully loaded
document.addEventListener("DOMContentLoaded", () => mainThread());