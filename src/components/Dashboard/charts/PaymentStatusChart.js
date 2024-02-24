import React from 'react';
import { Box } from '@chakra-ui/react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const PaymentStatusChart = ({ userData }) => {
  // Filter users into paid and unpaid categories
  const paidUsers = userData.filter(user => user.payment?.status === 'verified');
  const unpaidUsers = userData.filter(user => !user.payment || user.payment.status !== 'verified');

  // Get the count of paid and unpaid users
  const paidUsersCount = paidUsers.length;
  const unpaidUsersCount = unpaidUsers.length;

  const options = {
    chart: {
      type: 'pie',
      backgroundColor: 'transparent', // Set transparent background
    },
    title: {
      text: 'Payment Status',
      style: {
        color: '#333', // Set title color
        fontSize: '18px', // Set title font size
      },
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.y}</b>',
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.y}',
        },
      },
    },
    series: [{
      name: 'Total',
      colorByPoint: true,
      data: [{
        name: 'Paid',
        y: paidUsersCount,
        color: '#63b3ed', // Set color for paid users
      }, {
        name: 'Unpaid',
        y: unpaidUsersCount,
        color: '#f6ad55', // Set color for unpaid users
      }],
    }],
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

export default PaymentStatusChart;
