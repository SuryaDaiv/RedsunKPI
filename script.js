// URLs for the APIs
const rahulAPI = "https://script.google.com/macros/s/AKfycbyxlGiPQ_poDwEtwyZrcF34hCHcpl1AoMQugiLbB_Iz20t4KIr2NqFKFQnaVkhX7juKmg/exec";
const rajeshAPI = "https://script.google.com/macros/s/AKfycbzWxU8LfjEqp43KjoKXL78zNJ8v8_gN8dp0umI46kBhpd8e2uSHYCo-fP3kAczf-GYk/exec";
const venkatAPI = "https://script.google.com/macros/s/AKfycbxEQLEHLXS32SR0LX78hu8TRge1AMSn3HVo5KLBNoh4f-XIoNWHZx0-Qt10EM3tqeZQAw/exec";
const shivaAPI = "https://script.google.com/macros/s/AKfycbyaO5uhxwyyO699mpic6q3WfB6S431aOIiRZRIYP0Ow-SQVQhz64mKJitLIo9ELRzSi/exec";

async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data.data; // Assuming the structure is { data: [...]}
}

function formatDate(dateString) {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('T')[0].split('-');
    return `${month}/${day}/${year}`;
}

// Function to sort the table
function sortTable(columnIndex) {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("data-table");
    switching = true;
    // Run loop until no switching is needed
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[columnIndex];
            y = rows[i + 1].getElementsByTagName("TD")[columnIndex];
            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}

// New function to get the start of the week
function getStartOfWeek(d) {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
    return new Date(date.setDate(diff));
}

// New function to get the start of the month
function getStartOfMonth(d) {
    const date = new Date(d);
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

// Initialize submission counts
let rahulCounts = { overall: 0, month: 0, week: 0, today: 0 };
let rajeshCounts = { overall: 0, month: 0, week: 0, today: 0 };
let venkatCounts = { overall: 0, month: 0, week: 0, today: 0 };
let shivaCounts = { overall: 0, month: 0, week: 0, today: 0 };

// Initialize more detailed submission counts including interview outcomes
let rahulInterviews = { overall: { yes: 0, approved: 0, rejected: 0 }, month: { yes: 0, approved: 0, rejected: 0 }, week: { yes: 0, approved: 0, rejected: 0 }, today: { yes: 0, approved: 0, rejected: 0 } };
let rajeshInterviews = { overall: { yes: 0, approved: 0, rejected: 0 }, month: { yes: 0, approved: 0, rejected: 0 }, week: { yes: 0, approved: 0, rejected: 0 }, today: { yes: 0, approved: 0, rejected: 0 } };
let venkatInterviews = { overall: { yes: 0, approved: 0, rejected: 0 }, month: { yes: 0, approved: 0, rejected: 0 }, week: { yes: 0, approved: 0, rejected: 0 }, today: { yes: 0, approved: 0, rejected: 0 } };
let shivaInterviews = { overall: { yes: 0, approved: 0, rejected: 0 }, month: { yes: 0, approved: 0, rejected: 0 }, week: { yes: 0, approved: 0, rejected: 0 }, today: { yes: 0, approved: 0, rejected: 0 } };


// Updated function to populate the table and calculate submission counts
async function populateTable() {
    const today = new Date();
    const startOfWeek = getStartOfWeek(today);
    const startOfMonth = getStartOfMonth(today);

    const rahulData = await fetchData(rahulAPI);
    const rajeshData = await fetchData(rajeshAPI);
    const venkatData = await fetchData(venkatAPI);
    const shivaData = await fetchData(shivaAPI);

    // Modify the dataset loop to also count interviews based on their outcomes
    [rahulData, rajeshData, venkatData, shivaData].forEach((dataset, index) => {
        // Determine the correct counts object based on the current dataset
        let interviews;
        if (index === 0) {
            interviews = rahulInterviews;
        } else if (index === 1) {
            interviews = rajeshInterviews;
        } else if (index === 2) {
            interviews = venkatInterviews;
        } else {
            interviews = shivaInterviews;
        }

        dataset.forEach(submission => {
            const submissionDate = new Date(submission.Date);
            const outcome = submission.Interview1.toLowerCase(); // Normalize the outcome to lowercase
            if (['yes', 'approved', 'rejected'].includes(outcome)) {
                interviews.overall[outcome]++;
                if (submissionDate >= startOfMonth) interviews.month[outcome]++;
                if (submissionDate >= startOfWeek) interviews.week[outcome]++;
                if (submissionDate.toDateString() === today.toDateString()) interviews.today[outcome]++;
            }
        });
    });

    // Loop through each dataset and calculate counts
    [rahulData, rajeshData, venkatData, shivaData].forEach((dataset, index) => {
        let counts;
        if (index === 0) {
            counts = rahulCounts;
        } else if (index === 1) {
            counts = rajeshCounts;
        } else if (index === 2){
            counts = venkatCounts;  // This handles Venkat's data
        }else{
            counts = shivaCounts;
        }

        dataset.forEach(submission => {
            const submissionDate = new Date(submission.Date);
            counts.overall++;
            if (submissionDate >= startOfMonth) counts.month++;
            if (submissionDate >= startOfWeek) counts.week++;
            if (submissionDate.toDateString() === today.toDateString()) counts.today++;
        });
    });

    // Populate table as before
    const combinedData = [...rahulData, ...rajeshData, ...venkatData, ...shivaData];
    const tableBody = document.getElementById("data-table").getElementsByTagName('tbody')[0];
    // Table population logic remains the same
    combinedData.forEach(submission => {
        let row = tableBody.insertRow();
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        let cell4 = row.insertCell(3);
        let cell5 = row.insertCell(4);
        let cell6 = row.insertCell(5);
        let cell7 = row.insertCell(6);
        let cell8 = row.insertCell(7);
        // Populate cells with data, for example:
        cell1.innerHTML = submission.Date; // TODO: 2024-04-04T04:00:00.000Z date should show as 2024-04-04
        cell2.innerHTML = submission.MarketingPerson;
        cell3.innerHTML = submission.CandidateName;
        cell4.innerHTML = submission.VendorCompany;
        cell5.innerHTML = submission.Client;
        cell6.innerHTML = submission.Status;
        cell7.innerHTML = submission.Interview1;
        cell8.innerHTML = submission.Interview2;
        // Add more cells as needed
    });
}

// Initialize charts and table on page load
window.onload = function() {
    populateTable();
    // Initialize your charts here, calling a function like initCharts()
    initSubmissionChart()
};

// Add your chart initialization functions here, similar to the sample provided previously
// Example function to initialize a chart
function initChart(chartId, chartType, chartData, chartOptions) {
    var ctx = document.getElementById(chartId).getContext('2d');
    return new Chart(ctx, {
        type: chartType,
        data: chartData,
        options: chartOptions
    });
}

// Updated function to initialize the submission chart
function initSubmissionChart() {
    const chartData = {
        labels: ['Overall', 'This Month', 'This Week', 'Today'],
        datasets: [
            {
                label: 'Rahul',
                data: [rahulCounts.overall, rahulCounts.month, rahulCounts.week, rahulCounts.today],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            },
            {
                label: 'Rajesh',
                data: [rajeshCounts.overall, rajeshCounts.month, rajeshCounts.week, rajeshCounts.today],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            },
            {
                label: 'Venkat',
                data: [venkatCounts.overall, venkatCounts.month, venkatCounts.week, venkatCounts.today],
                backgroundColor: 'rgba(44, 102, 235, 0.2)',
                borderColor: 'rgba(44, 102, 235, 1)',
                borderWidth: 1
            },
            {
                label: 'Shiva',
                data: [shivaCounts.overall, shivaCounts.month, shivaCounts.week, shivaCounts.today],
                backgroundColor: 'rgba(34, 112, 215, 0.2)',
                borderColor: 'rgba(34, 112, 215, 1)',
                borderWidth: 1
            }
        ]
    };

    const chartOptions = {
        scales: {
            y: { beginAtZero: true }
        }
    };

    initChart('submissionChart', 'bar', chartData, chartOptions);
}

function initInterviewChart() {
    const chartData = {
        labels: ['Overall', 'This Month', 'This Week', 'Today'],
        datasets: [
            // One dataset per outcome per marketing person
            // This is an example for Rahul's "Yes" outcomes
            {
                label: 'Rahul - Yes',
                data: [
                    rahulInterviews.overall.yes, 
                    rahulInterviews.month.yes, 
                    rahulInterviews.week.yes, 
                    rahulInterviews.today.yes
                ],
                backgroundColor: 'rgba(255, 99, 132, 0.6)'
            },
            // Additional datasets for other outcomes and other marketing persons
            // Repeat this structure for "Approved" and "Rejected" outcomes for each person
        ]
    };

    const chartOptions = {
        scales: {
            y: { beginAtZero: true }
        }
    };

    initChart('interviewChart', 'bar', chartData, chartOptions);
}


//TODO : create, insert and display chart to see how many submissions each candidate got per month, week, day, 

// TODO: currently one chart is showing full width, i want the exisitn gchart and 2 new ccharts we create to be shown side by side in same line

// Make sure to call initSubmissionChart inside or after populateTable so the counts are ready
window.onload = async function() {
    await populateTable();
    initSubmissionChart();
    initInterviewChart();
};