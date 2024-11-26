import { ArcElement, BarElement, CategoryScale, Chart, LinearScale, Tooltip } from 'chart.js';
import React, { useCallback, useState } from "react";
import { Bar, Pie } from 'react-chartjs-2';
import { useNavigate } from "react-router-dom";
import AdNavBar from "../../components/AdNavBar";
import './WSInsightAnalytics.css';

Chart.register(ArcElement, Tooltip, BarElement, CategoryScale, LinearScale);

const WSInsightAnalytics = () => {
  const navigate = useNavigate();
  const [currentYear, setCurrentYear] = useState(2024);
  const [currentOffice, setCurrentOffice] = useState("SSO - Student Concerns");
  const [isOpen, setIsOpen] = useState(false);
  const [isFeedbackVisible, setFeedbackVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const offices = [
    "SSO - Student Concerns",
    "OPC - Borrowing of Equipment", 
    "CORE - Borrowing Equipment",
    "PACUBAS - Janitorial Services",
    "CIT-U Clinic - Health Services",
    "CIT-U Guidance Center - Mental Health Services",
    "TSG - Account, Wildconnect, Outlook Concerns"
  ];

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
        <div className="dropdown-container">
        <label className="dropdown-label">Office</label>
        <div className="dropdown-header" onClick={() => setIsOpen(!isOpen)}>
          <div className="flex items-center">
            <img className="OfficeIcon" src="/officeUserIcon.png" alt="Office Icon" width="24" height="24"/>
            <span className="ml-2">{currentOffice}</span>
          </div>
          <span className="dropdown-arrow">▼</span>
        </div>
        
        {isOpen && (
          <div className="dropdown-list">
            {offices.map((office) => (
              <div 
                key={office}
                className="dropdown-item" 
                onClick={() => {
                  setCurrentOffice(office);
                  setIsOpen(false);
                }}
              >
                {office}
              </div>
            ))}
          </div>
        )}
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
    <div className="filter-section">
       <div className="filter-row">
         {/* Month Filter */}
         <div className="filter-group">
           <div className="filter-icon">📅</div>
           <select 
             value={selectedMonth}
             onChange={(e) => setSelectedMonth(e.target.value)}
             className="filter-select"
           >
             <option>January</option>
             <option>February</option>
             <option>March</option>
             <option>April</option>
             <option>May</option>
             <option>June</option>
             <option>July</option>
             <option>August</option>
             <option>September</option>
             <option>October</option>
             <option>November</option>
             <option>December</option>
           </select>
         </div>

         {/* Status Filter */}
         <div className="filter-group">
           <div className="filter-icon">✓</div>
           <select
             value={selectedStatus}
             onChange={(e) => setSelectedStatus(e.target.value)}
             className="filter-select"
           >
             <option>Approved</option>
             <option>Denied</option>
           </select>
         </div>

         {/* Download Button */}
         <button className="download-btn">
           ⬇️
         </button>
       </div>
     </div>
          <div className="TableContainer">
            <div className="GroupTable">
              <div className="Table">
                <div className="_1">
                  <span className="SubmissionDate">Name</span>
                </div>
                <div className="_2_1">
                  <span className="DateVerified">Submission Date</span>
                </div>
                <div className="_3">
                  <span className="Status">Status</span>
                </div>
                <div className="_4">
                  <span className="Reason">Date Verified</span>
                </div>
                <div className="_15">
                  <span className="PointsEarned">Category</span>
                </div>
                
                <div className="_6">
                  <span className="_20240116">Richard Molina</span>
                </div>
                <div className="_7">
                  <span className="_20240116_1">2024-01-16</span>
                </div>
                <div className="_8">
                  <span className="Approved_1">Approved</span>
                </div>
                <div className="_9">
                  <span className="_20240116_1">2024-01-16 | 10:05 AM</span>
                </div>
                <div className="_16">
                  <span className="_5_1">Critical Report</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>


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