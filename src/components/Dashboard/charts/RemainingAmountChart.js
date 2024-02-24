import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Box } from '@chakra-ui/react';

const RemainingAmountChart = ({ totalAmount, paidAmount, remainingAmount }) => {
  const options = {
    chart: {
      type: 'column',
      backgroundColor: 'transparent', // Set transparent background
    },
    title: {
      text: 'Financial Status',
      style: {
        color: '#333', // Set title color
        fontSize: '18px', // Set title font size
      },
    },
    xAxis: {
      categories: ['Amount'],
      labels: {
        style: {
          color: '#333', // Set x-axis label color
        },
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Amount',
        style: {
          color: '#333', // Set y-axis label color
        },
      },
      labels: {
        style: {
          color: '#333', // Set y-axis label color
        },
      },
    },
    legend: {
      shadow: false,
      itemStyle: {
        color: '#333', // Set legend item color
      },
    },
    tooltip: {
      shared: true,
      backgroundColor: '#fff', // Set tooltip background color
      borderColor: '#ccc', // Set tooltip border color
      style: {
        color: '#333', // Set tooltip text color
      },
    },
    plotOptions: {
      column: {
        grouping: false,
        shadow: false,
        borderWidth: 0,
      },
    },
    series: [
      {
        name: 'Total Amount',
        color: '#63b3ed', // Set color for total amount
        data: [[0, totalAmount]], // Array with one data point: [0, totalAmount]
      },
      {
        name: 'Paid Amount',
        color: '#f6ad55', // Set color for paid amount
        data: [[1, paidAmount]], // Array with one data point: [1, paidAmount]
      },
      {
        name: 'Remaining Amount',
        color: '#ff6b6b', // Set color for remaining amount
        data: [[2, remainingAmount]], // Array with one data point: [2, remainingAmount]
      },
    ],
  };

  return (
    <Box
      bg="white"
      boxShadow="md"
      borderRadius="md"
      p={4}
    >
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
    </Box>
  );
};

export default RemainingAmountChart;
