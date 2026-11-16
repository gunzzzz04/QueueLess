

\# QueueLess — Smart Queue \& Appointment System



\## DEVOPS INTERNAL ASSIGNMENT



QueueLess is a web-based Smart Queue and Appointment System designed for college administration offices. It helps students book appointments, view queue information, and reduces the inconvenience of standing in long queues.



\## Problem Statement



Students often waste time waiting in queues at college administration counters for services such as document verification, fee-related queries, scholarship assistance, and examination queries.



QueueLess aims to digitize the queue and appointment process.



\## Project Objectives



\- Allow students to book appointments for college administrative services.

\- Display queue token information.

\- Provide an interface for students and administrators.

\- Store application data in a MySQL database.

\- Automate application build and deployment using DevOps tools.



\## Features



\### Student Dashboard

\- View available administrative services.

\- Book appointments by selecting service, date, and time.

\- View queue token information.



\### Admin Dashboard

\- View queue and appointment information.

\- Manage administrative service workflow.



\### Backend

\- REST API using Spring Boot.

\- Database connectivity using Spring Data JPA.

\- MySQL database integration.



\## Technology Stack



| Component | Technology |

|---|---|

| Frontend | React, Vite |

| Backend | Java, Spring Boot |

| Database | MySQL (Aiven Cloud) |

| Build Tool | Maven |

| Version Control | Git |

| Source Code Hosting | GitHub |

| CI/CD | Jenkins |

| Containerization | Docker |

| Web Server | Nginx |



\## Project Architecture



1\. Students interact with the React frontend.

2\. The frontend sends HTTP requests to the Spring Boot REST API.

3\. The backend processes requests and interacts with the MySQL database using Spring Data JPA.

4\. The database stores queue and appointment information.

5\. Jenkins automates source checkout, frontend build, backend build, Docker image creation, and deployment.

6\. Docker containers run the frontend and backend applications.



\## DevOps Implementation



\### Git and GitHub

Git is used for source code version control. GitHub hosts the project repository.



\### Maven

Maven automates the backend build and packaging process.



\### Jenkins

Jenkins executes the CI/CD pipeline with the following stages:



1\. Checkout source code from GitHub.

2\. Build the React frontend.

3\. Build the Spring Boot backend.

4\. Build the frontend Docker image.

5\. Build the backend Docker image.

6\. Deploy the frontend container.

7\. Deploy the backend container.



\### Docker

Docker containerizes the frontend and backend applications for deployment.



\## Application Ports



| Application | Port |

|---|---|

| Frontend | 3000 |

| Backend REST API | 8081 |

| Jenkins | 8082 |



\## Database Configuration



The backend connects to an Aiven MySQL database.



The database password is configured through the `DB\_PASSWORD` environment variable. It is stored as a Jenkins credential and should not be committed to GitHub.



\## Running the Project



\### Frontend

Open the project folder and run:



```bash

npm install

npm run dev

```



\### Backend

Navigate to:



`backend/backend`



Run:



```bash

./mvnw spring-boot:run

```



On Windows:



```cmd

mvnw.cmd spring-boot:run

```



The backend requires the `DB\_PASSWORD` environment variable to connect to MySQL.



\## CI/CD Pipeline



The Jenkins pipeline is defined in the `Jenkinsfile` at the root of the repository.



The pipeline automates building, containerizing, and deploying the QueueLess application.



\## Conclusion



QueueLess demonstrates the practical application of software development and DevOps practices through a web-based college administration queue and appointment system. It integrates Git, GitHub, Maven, Jenkins, Docker, React, Spring Boot, and MySQL.



