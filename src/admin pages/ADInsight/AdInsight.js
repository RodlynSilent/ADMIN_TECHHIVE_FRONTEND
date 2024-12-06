import React, { useState, useEffect } from "react";
import { Pie, Bar } from 'react-chartjs-2';
import axios from "../../services/axiosInstance";
import { format } from 'date-fns';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import AdNavBar from '../../components/AdNavBar';

import { Chart, ArcElement, BarElement, Tooltip, CategoryScale, LinearScale, Legend } from 'chart.js';
import './AdInsight.css';

Chart.register(ArcElement, Tooltip, BarElement, CategoryScale, LinearScale, ChartDataLabels, Legend);

const AdInsight = () => {
  const [currentYear, setCurrentYear] = useState(2024);
  const [isFeedbackVisible, setFeedbackVisible] = useState(false);
  const [fetchedTotalReports, setFetchedTotalReports] = useState(0);
  const [feedbackList, setFeedbackList] = useState([]);
  const [reportStatusCounts, setReportStatusCounts] = useState({
    pending: 0,
    approved: 0,
    denied: 0, // Default values to avoid ReferenceError
  });
  const [pendingReportsByMonth, setPendingReportsByMonth] = useState([]);

  const decrementYear = () => {
    setCurrentYear(prev => prev - 1);
  };

  const incrementYear = () => {
    setCurrentYear(prev => prev + 1);
  };

  const toggleFeedback = () => {
    setFeedbackVisible(prev => !prev);
  };


  const totalReports = 
  (reportStatusCounts.pending || 0) + 
  (reportStatusCounts.acknowledged || 0) + 
  (reportStatusCounts.ongoing || 0) + 
  (reportStatusCounts.resolved || 0);

const percentages = {
  pending: totalReports > 0 ? ((reportStatusCounts.pending || 0) / totalReports * 100).toFixed(1) : 0,
  acknowledged: totalReports > 0 ? ((reportStatusCounts.acknowledged || 0) / totalReports * 100).toFixed(1) : 0,
  ongoing: totalReports > 0 ? ((reportStatusCounts.ongoing || 0) / totalReports * 100).toFixed(1) : 0,
  resolved: totalReports > 0 ? ((reportStatusCounts.resolved || 0) / totalReports * 100).toFixed(1) : 0,
};

const data = {
  labels: ['Pending', 'Acknowledged', 'On-going', 'Resolved'],
  datasets: [
    {
      data: [
        reportStatusCounts.pending || 0,
        reportStatusCounts.acknowledged || 0,
        reportStatusCounts.ongoing || 0,
        reportStatusCounts.resolved || 0,
      ],
      backgroundColor: ['#F6C301', '#F97304', '#FF4B5C', '#FF69B4'],
      hoverBackgroundColor: ['#F6C301', '#F97304', '#FF4B5C', '#FF69B4'],
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: 'center',
    },
    tooltip: {
      enabled: true,
    },
    datalabels: {
      formatter: (value, ctx) => {
        const percentage = totalReports > 0 ? (value / totalReports) * 100 : 0;
        if (ctx.dataIndex === 0 && value > 0) { // Only for pending status
          return `${percentage.toFixed(1)}%`;
        }
        return '';
      },
      color: '#000',
      font: {
        size: 14,
        weight: 'bold',
      },
      align: 'center',
    },
  },
};


const barData = {
  labels: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ],
  datasets: [
    {
      label: "Pending Reports",
      data: pendingReportsByMonth,  // Should be updated correctly
      backgroundColor: "#F6C301",
      borderColor: "#F6C301",
      borderWidth: 1,
    },
  ],
};


// Bar chart options
const barOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: "top",
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: "Months",
      },
    },
    y: {
      title: {
        display: true,
        text: "Number of Pending Reports",
      },
      beginAtZero: true,
      ticks: {
        stepSize: 10, // Adjust step size as needed
      },
    },
  },
};
 
  useEffect(() => {
    const fetchReportStatusCounts = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem("loggedInUser"))?.userId;
        if (!userId) return;
  
        // API call to get the counts of pending, approved, and denied reports
        const response = await axios.get(`/api/user/reports/reportStatusCounts/${userId}`);
        console.log("Report Status Counts Response:", response.data); // Debugging log
        setReportStatusCounts(response.data);
      } catch (error) {
        console.error("Failed to fetch report status counts:", error);
      }
    };
  
    fetchReportStatusCounts();
  }, []);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem("loggedInUser"))?.userId;
        if (!userId) return;
  
        // Fetch total reports
        const totalResponse = await axios.get(`/api/feedback/totalReports/${userId}`);
        console.log("Total Reports Response:", totalResponse.data); // Debugging log
        setFetchedTotalReports(totalResponse.data.totalReports);
  
        // Fetch feedback list
        const feedbackResponse = await axios.get(`/api/feedback/latest/${userId}`);
        console.log("Feedback List Response:", feedbackResponse.data); // Debugging log
        setFeedbackList(feedbackResponse.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
  
    fetchData();
  }, []);

  useEffect(() => {
    const fetchPendingReports = async () => {
      try {
        // Make sure the API endpoint returns the pending reports for each month
        const response = await axios.get("/api/user/reports/pending/monthly");
        console.log("Pending Reports by Month:", response.data);  // Check the response structure
  
        // Initialize an array with 0s for each month
        const monthlyData = Array(12).fill(0);  // Default data for all 12 months
  
        // Populate the array with the actual data from the response
        response.data.forEach((item) => {
          const monthIndex = item.month - 1; // Adjust month to 0-based index
          monthlyData[monthIndex] = item.count; // Set the count for the corresponding month
        });
  
        // Update the state with the monthly data
        setPendingReportsByMonth(monthlyData);
      } catch (error) {
        console.error("Error fetching pending reports by month:", error);
      }
    };
  
    fetchPendingReports();
  }, []); // Runs only once on mount
  
  
  
  
  
  return (
    <div className={`AdInsightAnalytics_AdInsightAnalytics ${isFeedbackVisible ? 'expanded' : 'minimized'}`}>
      <AdNavBar />

      <img className="AdInsightTitle" alt="" src="/WSInsightAnalytics_insight.png" />
      <b className="AdAnalyticsTitle">Analytics</b>

      <div className="AdInsightBox" />

      <div className="AdYearContainer">
        <div className="AdYearBox" />
        <span className='AdYear'>Year</span>
        <img className="AdCalendar" alt="" src="/WSInsight_Calendar.png" />
        <img className="adarrow_left" alt="" src="/WsInsight_Leftbtn.png" onClick={decrementYear} />
        <span className='ad_2024'>{currentYear}</span>
        <img className="adarrow_right" alt="" src="/WsInsight_Rightbtn.png" onClick={incrementYear} />
      </div>

      <div className="AdBarGraphContainer">
  <div className="AdBarBox" />
  <span className='AdMonthlyAccidentEventStats'>Reports Resolved vs. Unresolved by Month
  <br /> </span>
  <div className="AdBarGraph" style={{ height: '340px', width: '100%' }}>
    <Bar data={barData} options={{
              ...barOptions,
              maintainAspectRatio: false, // Make the graph responsive
              responsive: true,
            }} />
  </div>
</div>


      <div className="AdPieChartContainer">
  <h3>Report Distribution by Status</h3>
  <Pie data={data} options={options} />
  <div className="adcustom-legend">
    <div className="adlegend-item">
      <span className="adlegend-color" style={{ backgroundColor: '#F6C301' }}></span>
      <span>Pending: {reportStatusCounts.pending || 0} ({percentages.pending}%)</span>
    </div>
    <div className="adlegend-item">
      <span className="adlegend-color" style={{ backgroundColor: '#F97304' }}></span>
      <span>Acknowledged: {reportStatusCounts.acknowledged || 0} ({percentages.acknowledged}%)</span>
    </div>
    <div className="adlegend-item">
      <span className="adlegend-color" style={{ backgroundColor: '#FF4B5C' }}></span>
      <span>On-going: {reportStatusCounts.ongoing || 0} ({percentages.ongoing}%)</span>
    </div>
    <div className="adlegend-item">
      <span className="adlegend-color" style={{ backgroundColor: '#FF69B4' }}></span>
      <span>Resolved: {reportStatusCounts.resolved || 0} ({percentages.resolved}%)</span>
    </div>
  </div>
</div>




      {isFeedbackVisible && (
        <>
          <div className={`AdFeedbackSection ${isFeedbackVisible ? 'visible' : 'hidden'}`}></div>
          <div className="AdInsightBox2">
  <div className="AdTableContainer">
    <span className="ADTOTALREPORTSSUBMITTED">TOTAL REPORTS SUBMITTED</span>
    <div className="AdTotalWrapper">
      <div className="AdTotal1" />
      <span className="AdTotalNumber1">{fetchedTotalReports}</span>
    </div>
    <div className="AdTableWrapper">
      <table className="AdFeedbackTable">
        <thead>
          <tr>
            <th>Submission Date</th>
            <th>Location</th>
            <th>Report Category</th>
            <th>Status</th>
            <th>Date Resolved</th>
          </tr>
        </thead>
        <tbody>
          {feedbackList.map((feedback, index) => (
            <tr key={index}>
              <td>{format(new Date(feedback.submissionDate), 'yyyy-MM-dd')}</td>
              <td>{feedback.location}</td>
              <td>{feedback.reportCategory}</td>
              <td
                style={{
                  color:
                    feedback.status === 'PENDING'
                      ? '#F6C301'
                      : feedback.status === 'APPROVED'
                      ? '#4CAF50'
                      : feedback.status === 'DENIED'
                      ? '#F44336'
                      : '#000',
                }}
              >
                {feedback.status}
              </td>
              <td>
                {feedback.dateResolved
                  ? format(new Date(feedback.dateResolved), 'yyyy-MM-dd')
                  : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>
        </>
      )}

      <div className='AdReportFeedbackContainer'>
        <span className='AdReportFeedback'>Report Feedback</span>
        <img
          className="AdToggle"
          alt=""
          src={isFeedbackVisible ? "/Toggledown.png" : "/Toggleright.png"}
          onClick={toggleFeedback}
        />
      </div>
    </div>
  );
};

export default AdInsight;
