# PeerPrep

## Overview
PeerPrep is an application designed for programmers to find like-minded individuals to practice technical questions with. It mimics a typical technical interview format where you can perform both the role of an interviewer and interviewee, receive feedbacks and voice out your thoughts in realtime using voice or video.

## Team Members
The team consists of the following members:
- [Ong Xing Wei](https://github.com/Moley456)
- [Ee Kar Hee, Nicholas](https://github.com/kheekheekhee)
- [Tan Yi Guan](https://github.com/tenebrius1)
- [Teo Sin Yee](https://github.com/tsinyee)

## Dependencies
### Node.js
This project uses Node.js 16 which could be downloaded from their [official website](https://nodejs.org/en/).

### Docker
Deployment of the local dev environment is achieved using Docker and Docker Compose.

## Contributing to PeerPrep
### Installation
First, clone this repository:
```
git clone https://github.com/CS3219-AY2223S1/cs3219-project-ay2223s1-g15.git
```
Since this project follows a microservice architecture, you can choose to work on any of the services we developed by navigating to `root/<service>` and running `npm install`.

### Docker-compose
To get a locally deployed version of the app running, you can run the command `docker-compose -f docker-compose-dev.yml up --build -d`
