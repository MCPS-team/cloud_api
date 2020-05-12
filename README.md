# Description

This repository is part of the project for the module Mobile and Cyber-Physical Systems at University of Pisa.

Here are stored the API of the cloud server invoked by the edge server.

### Software Requirements

* NodeJS (with npm)
* Docker

### Installing & Executing
First install nodejs/npm and docker, running docker and:
* ```cd ~ && mkdir MongoStorage```
* ```docker volume create mongo-storage```
* ```docker run -d -v ~/MongoStorage:/data/db -p 27017-27019:27017-27019 --name mongodb mongo```
* ```git clone https://github.com/MCPS-team/cloud_api.git```
* ```cd cloud_api/ && npm install && npm start```
in the .env file you can edit MongoDB configurations

### Application Endpoints
Frontend APIs:
* ```[GET] /dashboard``` Show the home page with some statistics
* ```[GET] /map``` Show the map of the detected potholes
* ```[GET] /about``` Credits to the authors

Backend APIs:
* ```[POST] /api/upload``` Upload detected potholes data from edge server

## Authors

Here's the wonderful team working hard for this project:
* Matteo Barato
* Davide Barasti
* Luca Roveroni
* Gianmarco Santi

## Version History

* 0.1
    * Initial Release

## License

This project is licensed under the MIT License - see the LICENSE file for details
