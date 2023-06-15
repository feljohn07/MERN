import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'

import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend, 
} from "chart.js"

import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const LineGraph = () => {

    const [ purchases, setPurchases ] = useState({})
    const [ orders, setOrders ] = useState({})

    async function getPurchasesData(){
 
      let headersList = {
        "Accept": "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)"
      }
      
      try {

        let response = await axios.get(`${process.env.REACT_APP_URL}dashboard/purchases`, {
          headers: headersList
        })
      
        let purchasesData = []

        let data = response.data
        console.log(data)

        // Generate labels and data values for all months
        for (let month = 1; month <= 12; month++) {
          const monthKey = `2023-${month.toString().padStart(1, '0')}`
          purchasesData.push(data[monthKey] || 0)
        }
      
        setPurchases(purchasesData)

      } catch (error) {
        console.error(error)
      }

            
      try {
        let response = await axios.get(`${process.env.REACT_APP_URL}dashboard/orders`, {
          headers: headersList
        })
      
        let ordersData = []
        let data = response.data
        console.log(data)

        // Generate labels and data values for all months
        for (let month = 1; month <= 12; month++) {
          const monthKey = `2023-${month.toString().padStart(1, '0')}`
          ordersData.push( ( 0 - data[monthKey] ) || 0)
        }
      
        setOrders(ordersData)
      } catch (error) {
        console.error(error)
      }


    }

    const options = {
      scales: {
        y: {
          type: 'linear', // Specify the scale type as 'linear'
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    }

    const data = {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], 
      datasets: [
        {
          label: "Purchases",
          lineTension: 0.3,
          backgroundColor: "rgba(78, 115, 223, 0.05)",
          borderColor: "rgba(78, 115, 223, 1)",
          pointRadius: 3,
          pointBackgroundColor: "rgba(78, 115, 223, 1)",
          pointBorderColor: "rgba(78, 115, 223, 1)",
          pointHoverRadius: 3,
          pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
          pointHoverBorderColor: "rgba(78, 115, 223, 1)",
          pointHitRadius: 10,
          pointBorderWidth: 2,
          data: Object.values(purchases),
        },
        {
          label: "Orders",
          lineTension: 0.3,
          backgroundColor: "rgb(242, 151, 39)",
          borderColor: "rgb(242, 151, 39)",
          pointRadius: 3,
          pointBackgroundColor: "rgb(242, 151, 39)",
          pointBorderColor: "rgb(242, 151, 39)",
          pointHoverRadius: 3,
          pointHoverBackgroundColor: "rgb(242, 151, 39)",
          pointHoverBorderColor: "rgb(242, 151, 39)",
          pointHitRadius: 10,
          pointBorderWidth: 2,
          data: Object.values(orders),
        },
      ],
      options: {
        maintainAspectRatio: false,
        layout: {
            padding: {
                left: 10,
                right: 25,
                top: 25,
                bottom: 0
            }
        },
      },
      scales: {
        xAxes: [{
            time: {
                unit: 'date'
            },
            gridLines: {
                display: false,
                drawBorder: false
            },
            ticks: {
                maxTicksLimit: 7
            }
        }],
        yAxes: [{
            ticks: {
                maxTicksLimit: 5,
                padding: 10,
                // Include a dollar sign in the ticks
            },
            gridLines: {
                color: "rgb(234, 236, 244)",
                zeroLineColor: "rgb(234, 236, 244)",
                drawBorder: false,
                borderDash: [2],
                zeroLineBorderDash: [2]
            }
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
          backgroundColor: "rgb(255,255,255)",
          bodyFontColor: "#858796",
          titleMarginBottom: 10,
          titleFontColor: '#6e707e',
          titleFontSize: 14,
          borderColor: '#dddfeb',
          borderWidth: 1,
          xPadding: 15,
          yPadding: 15,
          displayColors: false,
          intersect: false,
          mode: 'index',
          caretPadding: 10,
          callbacks: {
              label: function (tooltipItem, chart) {
                  var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || ''
                  return datasetLabel + ':' + tooltipItem.yLabel
              }
          }
      }
    
    }
         

    useEffect(() => {
        getPurchasesData()
    }, [])

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Monthly Inventory Movement</h5>
        <Line data={data} options={options} />
      </div>
    </div>
  )
}

export default LineGraph
