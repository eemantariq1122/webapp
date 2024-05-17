// Initialize a Chart.js chart
const ctx = document.getElementById('voltageChart').getContext('2d');
const voltageChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [], // No need for initial labels if the x-axis is dynamic
    datasets: [{
      label: 'Voltage',
      data: [],
      backgroundColor: 'rgba(0, 0, 0, 0.2)', // Black background
      borderColor: 'rgba(255, 255, 255, 1)', // White line color
      borderWidth: 1,
      fill: false
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        type: 'category', // Use 'category' type for dynamic labels
        labels: [], // No need for initial labels if the x-axis is dynamic
        scaleLabel: {
          display: true,
          labelString: 'Time',
          fontColor: 'white'
        },
        ticks: {
          fontColor: 'white'
        },
        gridLines: {
          color: 'rgba(255, 255, 255, 0.1)' // Color of grid lines
        }
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Millivolts',
          fontColor: 'white'
        },
        ticks: {
          beginAtZero: true,
          fontColor: 'white'
        },
        gridLines: {
          color: 'rgba(255, 255, 255, 0.1)' // Color of grid lines
        }
      }]
    }
  }
});

// Function to update the chart based on received data
function updateChart(data) {
  try {
    // Extract relevant values for plotting (assuming 'Voltage' is the key)
    const voltage = data.Voltage;

    // Update the chart with the new data point
    const maxDataPoints = 20; // Maximum number of data points to display
    if (voltageChart.data.labels.length >= maxDataPoints) {
      // Remove the oldest data point
      voltageChart.data.labels.shift();
      voltageChart.data.datasets[0].data.shift();
    }

    voltageChart.data.labels.push('');
    voltageChart.data.datasets[0].data.push(voltage);
    voltageChart.update();

    // Update the latest voltage value
    document.getElementById('latestVoltage').innerText = 'Latest Voltage: ' + voltage;
  } catch (error) {
    console.error('Error updating chart:', error);
  }
}

// Create a WebSocket connection to the backend
const socket = new WebSocket('ws://localhost:8080');

// Listen for messages from the backend
socket.onmessage = function(event) {
  const data = JSON.parse(event.data);
  console.log('Received data:', data);
  updateChart(data);
};