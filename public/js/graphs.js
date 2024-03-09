
// Sales Graph
document.addEventListener('DOMContentLoaded', function () {
    // Fetch monthly sales data from the API
    fetch('/sales')
      .then(response => response.json())
      .then(data => {
        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
          ];
          data.sort((a, b) => a.month - b.month);

           // Initialize an array to store sales data for each month
           const allMonthsData = Array.from({ length: 12 }, (_, index) => ({
            month: monthNames[index],
            totalSales: 0,
          }));
            // Update the sales data for each month
            data.forEach(entry => {
                const monthIndex = entry.month - 1;
                allMonthsData[monthIndex].totalSales = entry.totalSales;
              });

            // Find the index of the first month with non-zero sales
            const startIndex = allMonthsData.findIndex(entry => entry.totalSales > 0);

            // Extract months and salesData starting from the first month with non-zero sales
            const months = allMonthsData.slice(startIndex).map(entry => entry.month);
            const salesData = data.map(entry => entry.totalSales);
              
            months.unshift('Jan');
            salesData.unshift(0);

        const updatedChartConfig = {
          series: [
            {
              name: 'Income',
              data: salesData,
            },
          ],
          chart: {
            type: 'bar',
            height: 300,
            width: 850,
            toolbar: {
              show: false,
            },
          },
          title: {
            show: '',
          },
          dataLabels: {
            enabled: false,
          },
          colors: ['#FFA52C'],
          plotOptions: {
            bar: {
              columnWidth: '40%',
              borderRadius: 2,
            },
          },
          xaxis: {
            axisTicks: {
              show: false,
            },
            axisBorder: {
              show: false,
            },
            labels: {
              style: {
                colors: '#808080',
                fontSize: '15px',
                fontFamily: 'inherit',
                fontWeight: 400,
              },
            },
            categories: months,
          },
          yaxis: {
            labels: {
              style: {
                colors: '#808080',
                fontSize: '12px',
                fontFamily: 'inherit',
                fontWeight: 400,
              },
            },
          },
          grid: {
            show: true,
            borderColor: '#343434',
            strokeDashArray: 5,
            xaxis: {
              lines: {
                show: true,
              },
            },
            padding: {
              top: 5,
              right: 10,
            },
          },
          fill: {
            opacity: 0.6,
          },
          tooltip: {
            theme: 'dark',
          },
        };
  
        const updatedChart = new ApexCharts(document.querySelector('#bar-chart'), updatedChartConfig);
        updatedChart.render();
      })
      .catch(error => console.error('Error fetching monthly sales:', error));
  });
  



// Users Graph
const colorPrimary = getComputedStyle(document.documentElement)
    .getPropertyValue("--color-primary")
    .trim();

const colorLabel = getComputedStyle(document.documentElement)
    .getPropertyValue("--color-label")
    .trim();

const fontFamily = getComputedStyle(document.documentElement)
    .getPropertyValue("--font-family")
    .trim();

document.addEventListener('DOMContentLoaded', function () {
    fetch('/userSignups')
      .then(response => response.json())
      .then(data => {

        const monthlySignups = data.monthlySignups || [];
        const allMonths = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
          ];

       // Initialize an array to store signup data for each month
      const signupsData = Array.from({ length: 12 }, (_, index) => {
        const monthData = monthlySignups.find(entry => entry._id === index + 1);
        return monthData ? monthData.totalSignups : 0;
      });
  
        const defaultOptions = {
            chart: {
                toolbar: {
                    show: false
                },
                zoom: {
                    enabled: false
                },
                width: '100%',
                height: 180,
                offsetY: 18
            },      
            dataLabels: {
                enabled: false
            }
        
        }
        
        let barOptions = {    
            ...defaultOptions,    
            chart: {
                ...defaultOptions.chart,
                type: "area"
            },        
            tooltip: {
                enabled: true,
                style: {
                    fontFamily: fontFamily
                },
                y: {
                    formatter: value => `${value}`
                }
            },       
            series: [
                {
                    name: 'Signups',
                    data: signupsData,
                }
            ],       
            colors: [colorPrimary],       
            fill: {
                type: "gradient",
                gradient: {
                    type: "vertical",
                    opacityFrom: 1,
                    opacityTo: 0,
                    stops: [0, 100],
                    colorStops: [
                        {
                            offset: 0,
                            opacity: .2,
                            color: "#ffffff"
                        },
                        {
                            offset: 100,
                            opacity: 0,
                            color: "#ffffff"
                        }
                    ]
                }
            },       
            stroke: { colors: [colorPrimary], lineCap: "round" },       
            grid: {
                borderColor: "rgba(0, 0, 0, 0)",
                padding: {
                    top: -20,
                    right: 0,
                    bottom: -8,
                    left: 12
                }
            },      
            markers: {
                strokeColors: colorPrimary
            },       
            yaxis: {
                show: true,
                labels: {
                    style: {
                      colors: '#808080',
                      fontFamily: fontFamily
                    }
                  }
            },        
            xaxis: {       
                labels: {
                    show: true,
                    floating: true,
                    style: {
                      colors: '#808080',
                      fontFamily: fontFamily
                    }
                },
                axisBorder: {
                    show: false
                },       
                crosshairs: {
                    show: false
                },
        
                categories: allMonths
            }  
        };
  
        let chart = new ApexCharts(document.querySelector(".area-chart"), barOptions);
        chart.render();
      })
      .catch(error => console.error('Error fetching monthly signups:', error));
  });
  



// Categories Pie Chart
  document.addEventListener('DOMContentLoaded', function () {
    fetch('/productData')
        .then(response => response.json())
        .then(data => {
            // Update Chart.js data with fetched data
            var pieData = {
                labels: data.categories,
                datasets: [{
                    backgroundColor: [
                      '#FCF55F',
                      '#3B82F6',
                      '#FBBF24',
                      '#10B981',
                      '#A78BFA',
                      '#e41c38'
                      ],
                    data: data.counts
                }]
            };

            var pieOptions = {
                aspectRatio: 1,
                cutout: '50%',
                animation: {
                    animateRotate: true
                }
            };
            // Create the pie chart
            var pieCtx = document.getElementById('myChart').getContext('2d');
            var pieChart = new Chart(pieCtx, {
                type: 'pie',
                data: pieData,
                options: pieOptions
            });
        })
        .catch(error => console.error('Error fetching product data:', error));
});
