import React, { useCallback, useState } from "react";
import AdNavBar from "../../components/AdNavBar";
import { useNavigate } from "react-router-dom";
import { Pie, Bar } from 'react-chartjs-2'; 
import { Chart, ArcElement, BarElement, Tooltip, CategoryScale, LinearScale } from 'chart.js';
import './WSInsightAnalytics.css';

Chart.register(ArcElement, Tooltip, BarElement, CategoryScale, LinearScale);

const WSInsightAnalytics = () => {
  const navigate = useNavigate();
  const [currentYear, setCurrentYear] = useState(2024);
  const [isFeedbackVisible, setFeedbackVisible] = useState(false);

  const onHomeTextClick = useCallback(() => {
    navigate("/adhome");
  }, [navigate]);
  
  const onREPORTSClick = useCallback(() => {
    navigate("/adentry");
  }, [navigate]);
  
  const onLEADERBOARDClick = useCallback(() => {
    navigate("/adleaderboard");
  }, [navigate]);
  
  const onPROFILEClick = useCallback(() => {
    navigate("/adprofile");
  }, [navigate]);
  
  // Add a logout handler if necessary
  const onLOGOUTClick = useCallback(() => {
    navigate("/adlogout");
  }, [navigate]);
  

  const decrementYear = () => {
    setCurrentYear(prev => prev - 1);
  };

  const incrementYear = () => {
    setCurrentYear(prev => prev + 1);
  };

  const toggleFeedback = () => {
    setFeedbackVisible(prev => !prev);
  };
  
   // Data for the donut chart
   const approvedReports = 80; 
   const deniedReports = 20;
   
  const data = {
    labels: ['Approved', 'Denied'],
    datasets: [
      {
        data: [80, 20], // Adjust these values dynamically as needed
        backgroundColor: ['#FEB010', '#8A252C'], // Updated colors
        hoverBackgroundColor: ['#FEB010', '#8A252C'],
      },
    ],
  };
  const options = {
    responsive: true,
    cutout: '80', // This makes it a donut chart
    plugins: {
        legend: {
            display: false, // Disable the legend display
        },
        tooltip: {
            callbacks: {
                label: (tooltipItem) => {
                    const dataset = tooltipItem.dataset.data;
                    const total = dataset.reduce((a, b) => a + b, 0);
                    const currentValue = dataset[tooltipItem.dataIndex];
                    const percentage = ((currentValue / total) * 100).toFixed(0);
                    return `${percentage}%`; // Adjust tooltip text to show only percentage
                },
                // Maintain label colors without the color box
                labelColor: (tooltipItem) => {
                    return {
                        borderColor: 'transparent', // Set border color to transparent
                        backgroundColor: tooltipItem.dataset.backgroundColor[tooltipItem.dataIndex], // Keep original color
                    };
                },
            },
        },
    },
};

// Calculate percentages
  const totalReports = approvedReports + deniedReports;
  const approvedPercentage = ((approvedReports / totalReports) * 100).toFixed(0);
  const deniedPercentage = ((deniedReports / totalReports) * 100).toFixed(0);

// Bar chart data with values within 100 and some months missing data
const barData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Physical Accidents',
      data: [20, 30], // Some months have no data (null)
      backgroundColor: 'rgba(249,65,68,1.00)',
    },
    {
      label: 'Laboratory Accident',
      data: [null, 25, null, null, null, 10], // Some months have no data (null)
      backgroundColor: 'rgba(243,114,44,1.00)',
    },
    {
      label: 'Facility-Related Accident',
      data: [10, null, 60], // Some months have no data (null)
      backgroundColor: 'rgba(248,150,30,1.00)',
    },
    {
      label: 'Environmental Accident',
      data: [null, null, null, 70], // Some months have no data (null)
      backgroundColor: 'rgba(249,132,74,0.78)',
    },
    {
      label: 'Health-Related Accident',
      data: [null, null, null, null, 40], // Some months have no data (null)
      backgroundColor: 'rgba(144,190,109,1.00)',
    },
    {
      label: 'Vehicle Accident',
      data: [null, null, null, null, null, 5], // Some months have no data (null)
      backgroundColor: 'rgba(67,170,139,1.00)',
    },
  ],
};

const barOptions = {
  responsive: true,
  scales: {
    x: { stacked: true },
    y: {
      stacked: true,
      max: 100, // Reduced the max value to align the bar heights properly
      ticks: {
        beginAtZero: true,
        stepSize: 20, // Keep a small step size to better align with the gray line
      },
    },
  },
  plugins: {
    tooltip: {
      enabled: true,
    },
  },
};


  return (
    <div className={`WSInsightAnalytics_WSInsightAnalytics ${isFeedbackVisible ? 'expanded' : 'minimized'}`}>
      <AdNavBar /> 


      <img className="InsightTitle" alt="" src="/WSInsightAnalytics_insight.png" />
      <b className="AnalyticsTitle">Analytics</b>
     
      <div className="WSInsightBox" />

            {/* Year and Office Section */}
            <div className="YearOfficeContainer">
        <div className="YearContainer">
          <span className='Year'>Year</span>
          <img className="Calendar" alt="" src="/WSInsight_Calendar.png"/>
          <img className="arrow_left" alt="" src="/WsInsight_Leftbtn.png" onClick={decrementYear}/>
          <span className='_2024'>{currentYear}</span>
          <img className="arrow_right" alt="" src="/WsInsight_Rightbtn.png" onClick={incrementYear}/>
        </div>
        <div className="OfficeContainer">
        <span className="OfficeLabel">Office</span>
  <div className="OfficeSelection">
    <img className="OfficeIcon" src="/officeUserIcon.png" alt="Office Icon"/>
    <span className="OfficeName">Clinic Office</span>
          </div>
        </div>
      </div>

      <div className="BarGraphContainer" >
        <div className="BarBox"/>
        <span className='MonthlyAccidentEventStats'>Monthly Accident & Event Stats<br/> </span>
        <div className="BarGraph" style={{ height: '280px', width: '83%' }}>
        <Bar 
          data={barData} 
          options={{
            ...barOptions,
            maintainAspectRatio: false, // Make the graph responsive
            responsive: true,
          }} 
        />

          <div className='grayline'/>

          <div className='PAContainer'>
            <span className='PhysicalAccident'>Physical Accident</span>
            <div className='PABox'/>
          </div>

          <div className='EAContainer'>
            <span className='EnvironmentalAccident'>Environmental Accident</span>
            <div className='EABox'/>
          </div>

          <div className='VAContainer'>
            <span className='VehicleAccident'>Vehicle Accident</span>
            <div className='VABox'/>
          </div>

          <div className='LAContainer'>
            <span className='LaboratoryAccident'>Laboratory Accident</span>
            <div className='LABox'/>
          </div>

          <div className='FireRelatedContainer'>
            <span className='FireRelatedAccident'>Fire-Related Accident</span>
            <div className='FireRelatedBox'/>
          </div>

          <div className='EquipmentRelatedContainer'>
            <span className='EquipmentRelatedAccident'>Equipment-Related Accident</span>
            <div className='EquipmentRelatedBox'/>
          </div>

          <div className='FacilityRelatedContainer'>
            <span className='FacilityRelatedAccident'>Facility-Related Accident</span>
            <div className='FacilityRelatedBox'/>
          </div>

          <div className='HRContainer'>
            <span className='HealthRelatedAccident'>Health-Related Accident</span>
            <div className='HRBox'/>
          </div>

          <div className='EventContainer'>
            <span className='Event'>Event</span>
            <div className='EventBox'/>
          </div>
        </div>
      </div>
      
      <div className='PieChartContainer'>
  <div className='PieBackground'/>
  <div className='PieContainer'>
    <div className='PieGroup'>
      <span className='ApprovedDeniedReports'>Approved & Denied Reports</span>
      {/* Render the donut chart here */}
      <Pie data={data} options={options} />
      
      {/* Container for percentages */}
      <div className='PercentageContainer'>
  {/* Display the approved percentage with a transparent background */}
  <span 
    className='ApprovedPercentage' 
    style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', padding: '5px', borderRadius: '5px' }} // Adjust color and styles as needed
  >
    {approvedPercentage}%
  </span>
  {/* Display the denied percentage with a transparent background */}
  <span 
    className='DeniedPercentage' 
    style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', padding: '5px', borderRadius: '5px' }} // Adjust color and styles as needed
  >
    {deniedPercentage}%
  </span>
</div>


      <span className='Approved'>Approved</span>
      <div className='ApprovedBox'/>
      <span className='Denied'>Denied</span>
      <div className='DeniedBox'/>
    </div>
  </div>
</div>


{isFeedbackVisible && (
  <>
    <div className={`ReportListSection ${isFeedbackVisible ? 'visible' : 'hidden'}`}></div>
    <div className="WSInsightBox2" />
    <div className='TableContainer'>
      <div className='GroupTable'>
        <div className='Table'>
          <div className='_1'>
            <span className=''>Name</span>
          </div>
          <div className='_2_1'>
            <span className='DateVerified'>Submission Date</span>
          </div>
          <div className='_3'>
            <span className='Status'>Status</span>
          </div>
          <div className='_4'>
            <span className='Reason'>Date Verified</span>
          </div>
          <div className='_5'>
            <span className='Category'>Category</span>
          </div>
          
          {/* Sample rows with data */}
          <div className='_6'>
            <span className='name'>Richard Molina</span>
          </div>
          <div className='_7'>
            <span className='_20240116'>2024-01-16</span>
          </div>
          <div className='_8'>
            <span className='Approved_1'>Approved</span>
          </div>
          <div className='_9'>
            <span className='_20240116_1'>2024-01-16 | 10:05 AM</span>
          </div>
          <div className='_10'>
            <span className='Category_1'>Critical Report</span>
          </div>

          {/* Repeat rows as needed */}
          <div className='_6'>
            <span className='name'>Richard Molina</span>
          </div>
          <div className='_7'>
            <span className='_20240116'>2024-01-16</span>
          </div>
          <div className='_8'>
            <span className='Approved_1'>Approved</span>
          </div>
          <div className='_9'>
            <span className='_20240116_1'>2024-01-16 | 10:05 AM</span>
          </div>
          <div className='_10'>
            <span className='Category_1'>Critical Report</span>
          </div>
        </div>
      </div>
    </div>
  </>
)}


      <div className='ReportFeedbackContainer'>
        <span className='ReportFeedback'>
          {isFeedbackVisible ? 'Report List' : 'See full list of Reports'}
        </span>
      <img
        className="Toggle"
        alt=""
        src={isFeedbackVisible ? "/Toggledown.png" : "/Toggleright.png"}
        onClick={toggleFeedback}
      />
  </div>

    </div>
  );
};

export default WSInsightAnalytics;