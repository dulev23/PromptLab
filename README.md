# PromptLab

PromptLab is a full-stack application for creating, managing, and collaborating on AI prompts. It is designed to help individuals and teams organize prompts, track changes across versions, and evaluate their effectiveness in a structured way.

The project consists of a Spring Boot backend, a React (Vite) frontend, and a H2 database (at the moment, for future updates it is planned to use MongoDb). Currently working on orchestrating using Docker.

## Overview

The main idea behind PromptLab is to provide a simple but structured environment for prompt engineering. Users can create workspaces, add prompts, update and version them over time, and collaborate with others.

Core areas of the system include:

* workspace organization
* prompt creation and versioning
* prompt evaluation
* collaboration between users

## Tech Stack

Backend:

* Java 17
* Spring Boot
* MongoDB
* Maven

Frontend:

* React
* Vite
* Axios
* React Router

Project Structure
PromptLab/
│
├── backend/
│   ├── config/
│   ├── dto/
│   ├── model/
│   ├── repository/
│   ├── service/
│   ├── web/
│   └── resources/
│
├── frontend/
│   ├── api/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│
└── README.md
Getting Started
Requirements

Make sure you have the following installed:

* Java 17 or higher
* Node.js 18 or higher
* *MongoDb*
* Maven
* Docker (optional, for containerized setup)

#### Running the project locally
#### Backend

From the backend folder:

*mvn clean install*
*mvn spring-boot:run*

The backend runs on:

http://localhost:8080

#### Frontend

From the frontend folder:

*npm install*
*npm run dev*

The frontend runs on:

http://localhost:5173

#### Database

H2 Database Console

If enabled in your Spring Boot config, the H2 console is available at:

http://localhost:8080/h2-console

MongoDB should be running locally (later on):

mongodb://localhost:27017

*Running with Docker (later on)*

To run the entire project:

docker-compose up --build

This starts:

backend service
frontend service
MongoDB

### Notes

The backend follows a standard layered architecture:
controller, service, repository, and model separation.

DTOs are used for request/response separation.

The frontend communicates with the backend through REST APIs.