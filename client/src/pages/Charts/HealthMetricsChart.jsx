import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js';

const HealthMetricsChart = ({ data }) => {
  const chartRef = useRef();

  useEffect(() => {
    if (data) {
      const labels = [
        'Air Pollution',
        'Alcohol Consumption',
        'Dust Exposure',
        'Genetic Risk',
        'Balanced Diet',
        'Obesity',
        'Smoker',
        'Passive Smoker',
        'Chest Pain',
        'Coughing Blood',
        'Fatigue',
        'Weight Loss',
        'Shortness of Breath',
        'Wheezing',
        'Swallow Difficulty',
        'Clubbing Nails',
        'Snore'
      ];

      const values = [
        data.air_pollution,
        data.alcohol_consumption,
        data.dust_exposure,
        data.genetic_risk,
        data.balanced_diet,
        data.obesity,
        data.smoker,
        data.passive_smoker,
        data.chest_pain,
        data.coughing_blood,
        data.fatigue,
        data.weight_loss,
        data.shortness_breath,
        data.wheezing,
        data.swallow_difficulty,
        data.clubbing_nails,
        data.snore
      ];

      const ctx = chartRef.current.getContext('2d');

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Score',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
              data: values,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }, [data]);

  return (
    <div>
      <h2>Health Metrics</h2>
      <canvas ref={chartRef} />
    </div>
  );
};

export default HealthMetricsChart;
