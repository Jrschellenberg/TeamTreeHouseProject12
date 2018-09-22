### Docker Deploy Documentation

### Getting Started

## Prerequisites
- Make sure Using Ubuntu with a Linux Kernel of at least 3.1
  - To find Kernel version run command ``uname -r`` in linux terminal
- Make sure you install docker The guide I would recommend is [Here](https://www.digitalocean.com/community/tutorials/how-to-run-nginx-in-a-docker-container-on-ubuntu-14-04)
  - Another good resource for docker can be found [Here](https://medium.com/statuscode/dockerising-a-node-js-and-mongodb-app-d22047e2806f)
- Install Docker-compose tutorial can be found [Here](https://www.digitalocean.com/community/tutorials/how-to-install-docker-compose-on-ubuntu-16-04)

## Useful Commands
- ### Init commands
  - Run ``docker network create service-tier``
- ### Services commands
  - ``docker-compose -f docker-services.yml up -d`` Command used to initialize the services containers, This initializes mongo.
  - ``docker stop mongo`` Used to stop mongo container
  - ``docker stop caddy`` Used to stop Caddy container
  - ``docker rm mongo`` Remove Mongo container
- ### Deploy Commands
  - To initialize Services run ``docker-compose -f docker-services.yml up -d``
  - Once Services are active you May run the bash scripts. To run Bash scripts:
    - first ensure they have x mod run ``chmod +x ./deployProduction.sh``
    - run ``chmod +x ./deployStaging.sh``
    - Once execute permission granted you may run them by running ``./deployStaging.sh`` or ``./deployProduction.sh``
