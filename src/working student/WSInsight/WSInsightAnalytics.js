import React, { useState, useEffect } from "react";
import { Pie, Bar } from 'react-chartjs-2';
import axios from "../../services/axiosInstance";
import { format } from 'date-fns';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import WSNavBar from '../WSHomepage/WSNavBar';
import { Chart, ArcElement, BarElement, Tooltip, CategoryScale, LinearScale, Legend } from 'chart.js';
import './WSInsightAnalytics.css';

Chart.register(ArcElement, Tooltip, BarElement, CategoryScale, LinearScale, ChartDataLabels, Legend);

const WSInsightAnalytics = () => {
  const [currentYear, setCurrentYear] = useState(2024);
  const [isFeedbackVisible, setFeedbackVisible] = useState(false);
  const [userReports, setUserReports] = useState([]);
  const [reportStatusCounts, setReportStatusCounts] = useState({
    pending: 0,
    acknowledged: 0,
    ongoing: 0,
    resolved: 0,
  });
  const [pendingReportsByMonth, setPendingReportsByMonth] = useState([]);

  // Status color mapping constants
  const STATUS_COLORS = {
    PENDING: '#F6C301',      // Yellow
    ACKNOWLEDGED: '#F97304', // Orange
    IN_PROGRESS: '#FF4B5C',  // Red
    RESOLVED: '#FF69B4'      // Pink
  };

  const decrementYear = () => setCurrentYear(prev => prev - 1);
  const incrementYear = () => setCurrentYear(prev => prev + 1);
  const toggleFeedback = () => setFeedbackVisible(prev => !prev);

  // Helper function to format date in "Month Day, Year" format
  const formatFullDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return format(date, 'MMMM d, yyyy');
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    return STATUS_COLORS[status] || '#000';
  };

  // Helper function to format status for display
  const formatStatus = (status) => {
    switch(status) {
      case 'IN_PROGRESS':
        return 'On-going';
      default:
        return status.charAt(0) + status.slice(1).toLowerCase();
    }
  };

  const totalReports = Object.values(reportStatusCounts).reduce((a, b) => a + (b || 0), 0);

  const percentages = {
    pending: totalReports > 0 ? ((reportStatusCounts.pending || 0) / totalReports * 100).toFixed(1) : 0,
    acknowledged: totalReports > 0 ? ((reportStatusCounts.acknowledged || 0) / totalReports * 100).toFixed(1) : 0,
    ongoing: totalReports > 0 ? ((reportStatusCounts.ongoing || 0) / totalReports * 100).toFixed(1) : 0,
    resolved: totalReports > 0 ? ((reportStatusCounts.resolved || 0) / totalReports * 100).toFixed(1) : 0,
  };

  const data = {
    labels: ['Pending', 'Acknowledged', 'On-going', 'Resolved'],
    datasets: [{
      data: [
        reportStatusCounts.pending || 0,
        reportStatusCounts.acknowledged || 0,
        reportStatusCounts.ongoing || 0,
        reportStatusCounts.resolved || 0,
      ],
      backgroundColor: Object.values(STATUS_COLORS),
      hoverBackgroundColor: Object.values(STATUS_COLORS),
    }],
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
          if (ctx.dataIndex === 0 && value > 0) {
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
    datasets: [{
      label: "Pending Reports",
      data: pendingReportsByMonth,
      backgroundColor: STATUS_COLORS.PENDING,
      borderColor: STATUS_COLORS.PENDING,
      borderWidth: 1,
    }],
  };

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
          stepSize: 10,
        },
      },
    },
  };

  // Get the resolved date when a report's status changes to RESOLVED
  const getResolvedDate = (report) => {
    if (report.status === 'RESOLVED') {
      // If the report has a statusUpdatedAt field, use that
      if (report.statusUpdatedAt) {
        return formatFullDate(report.statusUpdatedAt);
      }
      // If there's a specific resolvedAt field, use that
      if (report.resolvedAt) {
        return formatFullDate(report.resolvedAt);
      }
      // If neither exists, use a dash
      return '-';
    }
    return '-';
  };

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("loggedInUser"))?.userId;
    if (!userId) return;

    const fetchUserReports = async () => {
      try {
        // Fetch all reports for the user
        const reportsResponse = await axios.get(`/api/user/reports/user/${userId}`);
        const reports = reportsResponse.data;
        setUserReports(reports);

        // Calculate status counts from the reports
        const counts = {
          pending: 0,
          acknowledged: 0,
          ongoing: 0,
          resolved: 0
        };

        reports.forEach(report => {
          switch(report.status) {
            case 'PENDING':
              counts.pending++;
              break;
            case 'ACKNOWLEDGED':
              counts.acknowledged++;
              break;
            case 'IN_PROGRESS':
              counts.ongoing++;
              break;
            case 'RESOLVED':
              counts.resolved++;
              break;
          }
        });

        setReportStatusCounts(counts);

        // Calculate pending reports by month
        const monthlyData = Array(12).fill(0);
        reports.forEach(report => {
          if (report.status === 'PENDING') {
            const month = new Date(report.submittedAt).getMonth();
            monthlyData[month]++;
          }
        });
        setPendingReportsByMonth(monthlyData);

      } catch (error) {
        console.error("Failed to fetch user reports:", error);
      }
    };

    fetchUserReports();
  }, []);

  return (
    <div className={`WSInsightAnalytics_WSInsightAnalytics ${isFeedbackVisible ? 'expanded' : 'minimized'}`}>
      <WSNavBar />
      <img className="InsightTitle" alt="" src="/WSInsightAnalytics_insight.png" />
      <b className="AnalyticsTitle">My Reports Analytics</b>

      <div className="WSInsightBox" />

      <div className="YearContainer">
        <div className="YearBox" />
        <span className="Year">Year</span>
        <img className="Calendar" alt="" src="/WSInsight_Calendar.png" />
        <img className="arrow_left" alt="" src="/WsInsight_Leftbtn.png" onClick={decrementYear} />
        <span className="_2024">{currentYear}</span>
        <img className="arrow_right" alt="" src="/WsInsight_Rightbtn.png" onClick={incrementYear} />
      </div>

      <div className="BarGraphContainer">
        <div className="BarBox" />
        <span className="MonthlyAccidentEventStats">My Reports Status by Month</span>
        <div className="BarGraph" style={{ height: '340px', width: '90%' }}>
          <Bar data={barData} options={{
            ...barOptions,
            maintainAspectRatio: false,
            responsive: true,
          }} />
        </div>
      </div>

      <div className="PieChartContainer">
        <h3>My Report Distribution by Status</h3>
        <Pie data={data} options={options} />
        <div className="custom-legend">
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: STATUS_COLORS.PENDING }}></span>
            <span>Pending: {reportStatusCounts.pending || 0} ({percentages.pending}%)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: STATUS_COLORS.ACKNOWLEDGED }}></span>
            <span>Acknowledged: {reportStatusCounts.acknowledged || 0} ({percentages.acknowledged}%)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: STATUS_COLORS.IN_PROGRESS }}></span>
            <span>On-going: {reportStatusCounts.ongoing || 0} ({percentages.ongoing}%)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: STATUS_COLORS.RESOLVED }}></span>
            <span>Resolved: {reportStatusCounts.resolved || 0} ({percentages.resolved}%)</span>
          </div>
        </div>
      </div>

      {isFeedbackVisible && (
        <>
          <div className={`FeedbackSection ${isFeedbackVisible ? 'visible' : 'hidden'}`}></div>
          <div className="WSInsightBox2">
            <div className="TableContainer">
              <span className="TOTALREPORTSSUBMITTED">MY TOTAL REPORTS SUBMITTED</span>
              <div className="TotalWrapper">
                <div className="Total1" />
                <span className="TotalNumber1">{userReports.length}</span>
              </div>
              <div className="TableWrapper">
                <table className="FeedbackTable">
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
                    {userReports.map((report, index) => (
                      <tr key={index}>
                        <td>{formatFullDate(report.submittedAt)}</td>
                        <td>{report.location}</td>
                        <td>{report.reportType}</td>
                        <td style={{ color: getStatusColor(report.status) }}>
                          {formatStatus(report.status)}
                        </td>
                        <td>{getResolvedDate(report)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="ReportFeedbackContainer">
        <span className="ReportFeedback">My Report History</span>
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