import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

const RespiratorySymptomsChart = ({ data }) => {
  const chartRef = useRef();

  useEffect(() => {
    if (data) {
      const labels = [
        'Coughing Blood', 
        'Fatigue', 
        'Wheezing', 
        'Smoker', 
        'Passive Smoker', 
        'Chest Pain'
      ];
      const values = [
        data.coughing_blood,
        data.fatigue,
        data.wheezing,
        data.smoker,
        data.passive_smoker,
        data.chest_pain
      ];

      const ctx = chartRef.current.getContext('2d');

      new Chart(ctx, {
        type: 'radar',
        data: {
          labels,
          datasets: [
            {
              label: 'Score',
              data: values,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              pointBackgroundColor: 'rgba(75, 192, 192, 1)',
            },
          ],
        },
        options: {
          scales: {
            r: {
              beginAtZero: true,
              min: 0,
              max: 8,
            },
          },
        },
      });
    }
  }, [data]);

  return (
    <div>
      <h2>Respiratory Symptoms</h2>
      <canvas ref={chartRef} />
    </div>
  );
};

export default RespiratorySymptomsChart;
